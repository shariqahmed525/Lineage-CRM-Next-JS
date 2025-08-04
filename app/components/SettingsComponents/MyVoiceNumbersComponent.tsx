import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Stack,
  Box,
  Text,
  Button,
  useDisclosure,
  useToast,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import PurchasePhoneNumberModal from './PurchasePhoneNumberModal';
import ErrorBoundary from '../ErrorBoundary';


const MyVoiceNumbersComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [deletingPhoneNumberSid, setDeletingPhoneNumberSid] = useState(null);
  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch('/api/twilio/listPhoneNumbers');
      const data = await response.json();
      if (response.ok) {
        setPhoneNumbers(data);
      } else {
        throw new Error(data.error || 'Failed to fetch phone numbers.');
      }
    } catch (error) {
      console.error('Fetch Failed:', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const deletePhoneNumber = async (phoneNumberSid) => {
    setDeletingPhoneNumberSid(phoneNumberSid);
    try {
      const response = await fetch('/api/twilio/deletePhoneNumber', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumberSid }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Delete Successful',
          description: 'Phone number deleted successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchPhoneNumbers();
      } else {
        throw new Error(data.error || 'Failed to delete phone number.');
      }
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeletingPhoneNumberSid(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const requestBody = {
      inLocality: city,
      inRegion: state,
      inPostalCode: zipCode,
      areaCode: areaCode,
    };

    try {
      const response = await fetch('/api/twilio/searchPhoneNumbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (response.ok) {
        setAvailableNumbers(data);
        toast({
          title: 'Search Successful',
          description: 'Phone numbers retrieved successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error || 'An error occurred while searching for phone numbers.');
      }
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setSearched(true);
    setIsLoading(false);
  };

  return (
    <ErrorBoundary>
      <Box
        width="full"
        padding="16px"
        border="1px solid #E0E0E0"
        borderRadius="8px"
        mb="4"
        height="100%"
      >
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          mb="4"
        >
          <Box>
            <Text fontWeight="bold" fontSize="16px">My Phone Numbers</Text>
            <Text fontSize="14px">Select an unlimited number of custom outbound caller IDs.</Text>
          </Box>
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={onOpen}>Add</Button>
        </Stack>
        <List spacing={3}>
          {phoneNumbers?.map(phoneNumber => (
            <ListItem key={phoneNumber?.sid} display="flex" justifyContent="space-between" alignItems="center">
              <Text>{phoneNumber?.friendlyName}</Text>
              <Tooltip hasArrow label="Delete" placement="top">
                <IconButton
                  bg="#C31818"
                  color="white"
                  size="sm"
                  aria-label="Delete phone number"
                  icon={<DeleteIcon />}
                  onClick={() => deletePhoneNumber(phoneNumber?.sid)}
                  isLoading={deletingPhoneNumberSid === phoneNumber?.sid}
                  isDisabled={deletingPhoneNumberSid !== null && deletingPhoneNumberSid !== phoneNumber?.sid}
                />
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <PurchasePhoneNumberModal
          isOpen={isOpen}
          onClose={onClose}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          zipCode={zipCode}
          setZipCode={setZipCode}
          areaCode={areaCode}
          setAreaCode={setAreaCode}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          availableNumbers={availableNumbers}
          searched={searched}
          setSearched={setSearched}
          fetchPhoneNumbers={fetchPhoneNumbers} // New prop added
          setAvailableNumbers={setAvailableNumbers}
        />
      </Box>
    </ErrorBoundary>
  );
};

export default MyVoiceNumbersComponent;
