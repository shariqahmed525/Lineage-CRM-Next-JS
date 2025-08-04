import {
  Box, useToast, IconButton, Select, Switch, FormControl, FormLabel, HStack, VStack, Text, Flex, Tooltip, CloseButton, Stack,
  useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button,
} from '@chakra-ui/react';
import { Device } from '@twilio/voice-sdk';
import React, {
  useState, useEffect, useRef, useContext, useCallback,
} from 'react';
import Draggable from 'react-draggable';
import {
  FaPhone, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneVolume,
} from 'react-icons/fa';

import { useData } from '@/app/contexts/DataFetchContext'; // Import useData hook
import { useLeads } from '@/app/contexts/LeadsContext';

import CallEventListeners from './CallEventListeners';


interface CallCardProps {
  leadName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CallCard: React.FC<CallCardProps> = ({
  leadName, isOpen, onClose,
}) => {
  const [call, setCall] = useState(null);
  const [fromPhoneNumber, setFromPhoneNumber] = useState('');
  const [toPhoneNumber, setToPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [bounds, setBounds] = useState({
    top: 0, left: 0, right: 0, bottom: 0,
  });
  const [callDuration, setCallDuration] = useState(0); // Timer in seconds

  const callCardRef = useRef(null); // Ensure this ref is attached to the CallCard component
  const toast = useToast();
  const { phoneNumbers } = useData();
  const { selectedLead } = useLeads();
  const cancelRef = useRef(); // Ref for the cancel button in AlertDialog
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();

  // Initialize callStatus state
  const [callStatus, setCallStatus] = useState({
    accept: false,
    audio: false,
    cancel: false,
    disconnect: false,
    error: false,
    mute: false,
    reconnected: false,
    reconnecting: false,
    reject: false,
    ringing: false,
    inProgress: false,
    dialing: false, // Added dialing state
  });

  // Define the toPhoneNumbers state variable
  const [toPhoneNumbers, setToPhoneNumbers] = useState([]);

  useEffect(() => {
    let newToPhoneNumbers = [];
    if (selectedLead?.persons) {
      newToPhoneNumbers = selectedLead.persons.reduce((acc, person) => {
        if (person.phone1) {
          acc.push({ phoneNumber: person.phone1, friendlyName: `${person.first_name} ${person.last_name} - ${person.phone1}` });
        }
        if (person.phone2) {
          acc.push({ phoneNumber: person.phone2, friendlyName: `${person.first_name} ${person.last_name} - ${person.phone2}` });
        }
        return acc;
      }, []);
    }

    setToPhoneNumbers(newToPhoneNumbers);
    // Set the first toNumber as the default if available
    if (newToPhoneNumbers.length > 0) {
      setToPhoneNumber(newToPhoneNumbers[0]?.phoneNumber);
    }
  }, [selectedLead]); // Depend on selectedLead to re-run this effect

  useEffect(() => {
    // Check if phoneNumbers is not empty and update fromPhoneNumber with the first phoneNumber
    if (phoneNumbers.length > 0) {
      setFromPhoneNumber(phoneNumbers[0].phoneNumber);
    }
  }, [phoneNumbers]); // Depend on phoneNumbers to re-run this effect

  const updateBounds = () => {
    if (callCardRef.current) {
      const callCardRect = callCardRef?.current?.getBoundingClientRect();
      setBounds({
        left: 0, // Allow dragging to the start of the main content area
        top: 0, // Allow dragging to the start of the main content area
        right: window.innerWidth - callCardRect.width,
        bottom: window.innerHeight - callCardRect.height,
      });
    }
  };

  useEffect(() => {
    updateBounds();
    // Re-calculate bounds on window resize
    window.addEventListener('resize', updateBounds);

    // Cleanup listener to prevent memory leaks
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // If the CallCard component size could change, consider adding a ResizeObserver to handle that
  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateBounds);
    if (callCardRef.current) {
      resizeObserver.observe(callCardRef.current);
    }

    return () => {
      if (callCardRef.current) {
        resizeObserver.unobserve(callCardRef.current);
      }
    };
  }, []);

  // This useEffect hook listens for changes to the `isOpen` prop.
  // If `isOpen` becomes false, it triggers the `handleClose` function to clean up or reset any state before the component is closed.
  useEffect(() => {
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen, handleClose]); // Include handleClose in the dependency array

  useEffect(() => {
    let intervalId;
    if (callStatus.dialing || callStatus.inProgress) {
      intervalId = setInterval(() => {
        setCallDuration(prevDuration => prevDuration + 1);
      }, 1000); // Update every second
    } else if (!(callStatus.dialing || callStatus.inProgress) && call) {
      clearInterval(intervalId);
      setCallDuration(0); // Reset the timer
    }
    return () => clearInterval(intervalId);
  }, [callStatus.dialing, callStatus.inProgress, call]);

  const fetchTokenAndMakeCall = async () => {
    try {
      console.log('Dialing Call Started...');
      setCallStatus(prev => ({ ...prev, dialing: true }));
      const response = await fetch('/api/twilio/generateToken');
      const data = await response.json();
      const newDevice = new Device(data.token, { logLevel: 'debug' });

      if (newDevice) {
        const newCall = await newDevice.connect({ params: { toCaller: toPhoneNumber, fromCaller: fromPhoneNumber, recordCall: isRecording.toString() } });
        setCall(newCall);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleHangup = () => {
    call?.disconnect();
    setCall(null);
    setIsMuted(false); // Reset mute state when call is disconnected
  };

  function handleClose() {
    if (call && callStatus.inProgress) {
      onAlertOpen();
    } else {
      onClose(); // Trigger onClose prop function
    }
  }

  const toggleMute = () => {
    if (call) {
      call.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <Draggable bounds={bounds}>
      <Box
        ref={callCardRef} // Attach the ref to the Box component
        borderRadius="lg"
        position="fixed" // Changed from relative to fixed
        width="25vw"
        zIndex={2147483647} // Set to maximum to ensure it's always on top
        top={0} // Adjusted top and left values
        left="15%" // Match sidebar width on desktop and tablet
        style={{ touchAction: 'none', backdropFilter: 'blur(5px)' }} // Prevents panning on touch devices
        display={isOpen ? 'block' : 'none'} // Control visibility based on isOpen prop
        sx={{
          cursor: 'grab', // Change cursor to indicate draggable
          '&:hover': {
            cursor: 'grab', // Change cursor on hover to indicate draggable
          },
          '& button': {
            cursor: 'pointer', // Ensure buttons have the correct cursor
          },
          '&:active': {
            cursor: 'grabbing', // Change cursor to grabbing when dragging
          },
        }}
      >
        <Box
          bg="#FFFFFF"
          opacity="0.9"
          boxShadow="md"
          borderRadius="lg"
          borderWidth="2px"
          borderColor="green.500"
          position="absolute"
          width="100%"
          height="100%"
          style={{ backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)' }} // Increase blur to 30px for better readability prevention
        />
        <VStack
          bg="transparent"
          spacing={4}
          p={4}
          position="relative" // Ensure this Box is positioned relative to its parent
          zIndex={2} // Set zIndex higher than the background Box
          paddingLeft="2rem" // Added padding to the left
        >
          <CloseButton color="black" position="absolute" right="8px" top="8px" onClick={handleClose} />
          <CallEventListeners call={call} callStatus={callStatus} setCallStatus={setCallStatus} />
          <Text fontSize="lg" fontWeight="bold" color="black" alignSelf="flex">{leadName}</Text>
          {' '}
          {/* Align the lead name to the left side */}
          <Stack spacing={4}>
            <FormControl id="from-phone-number">
              <FormLabel color="black">From</FormLabel>
              <Select placeholder="Select a number" value={fromPhoneNumber} onChange={e => setFromPhoneNumber(e.target.value)}>
                {phoneNumbers?.map(phone => (
                  <option key={phone.phoneNumber} value={phone.phoneNumber}>{phone.friendlyName}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="to-phone-number">
              <FormLabel color="black">To</FormLabel>
              <Select placeholder="Select a number" value={toPhoneNumber} onChange={e => setToPhoneNumber(e.target.value)}>
                {toPhoneNumbers?.map(phone => (
                  <option key={phone.phoneNumber} value={phone.phoneNumber}>{phone.friendlyName}</option>
                ))}
              </Select>
            </FormControl>
            <HStack justifyContent="center" alignItems="center">
              <FormLabel htmlFor="record-call" mb="0" color="black">
                Record call
              </FormLabel>
              <Switch id="record-call" isChecked={isRecording} onChange={() => setIsRecording(!isRecording)} size="md" colorScheme="green" />
            </HStack>
          </Stack>
          <Flex justifyContent="space-around" mt={4} width="50%">
            <IconButton
              aria-label="Call"
              icon={<FaPhone />}
              colorScheme="green"
              isRound
              size="lg"
              onClick={fetchTokenAndMakeCall}
              isDisabled={callStatus.dialing || callStatus.inProgress}
              display={callStatus.dialing || callStatus.inProgress ? 'none' : 'inline-flex'}
              _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
            />
            <IconButton
              aria-label="Hang Up"
              icon={<FaPhoneSlash />}
              colorScheme="red"
              isRound
              size="lg"
              onClick={handleHangup}
              display={callStatus.dialing || callStatus.inProgress ? 'inline-flex' : 'none'}
            />
            <Tooltip label={isMuted ? 'Unmute' : 'Mute'} hasArrow>
              <IconButton
                aria-label={isMuted ? 'Unmute Call' : 'Mute Call'}
                icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                colorScheme={isMuted ? 'orange' : 'yellow'}
                isRound
                size="lg"
                onClick={toggleMute}
                display={callStatus.dialing || callStatus.inProgress ? 'inline-flex' : 'none'}
              />
            </Tooltip>
          </Flex>
          {(callStatus.dialing || callStatus.inProgress) && (
            <Text fontSize="xl" fontWeight="medium" textAlign="center" color="white" mt={4}>
              {String(Math.floor(callDuration / 60)).padStart(2, '0')}
              :
              {String(callDuration % 60).padStart(2, '0')}
            </Text>
          )}
        </VStack>
        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                End Call
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to end the call?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={() => { handleHangup(); onAlertClose(); }} ml={3}>
                  End Call
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Draggable>
  );
};

export default CallCard;

