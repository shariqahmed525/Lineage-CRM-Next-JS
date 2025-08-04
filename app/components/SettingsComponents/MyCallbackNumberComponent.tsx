import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Stack, Box, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, useToast, List, ListItem, IconButton, Tooltip,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { useData } from '@/app/contexts/DataFetchContext';


const MyCallbackNumberComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [callbackNumber, setCallbackNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { callbackPhoneNumbers, refetchData, setCallbackPhoneNumbers } = useData();

  const toast = useToast();

  useEffect(() => {
    if (Array.isArray(callbackPhoneNumbers) && callbackPhoneNumbers.length > 0) {
      setCallbackNumber(callbackPhoneNumbers[0]?.phone_number);
    }
  }, [callbackPhoneNumbers]); // Depend on callbackPhoneNumbers to re-run this effect


  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/twilio/updateCallbackNumber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callbackNumber }),
      });

      if (!response.ok) throw new Error('Failed to update callback number');
      toast({
        title: 'Success',
        description: 'Callback number updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await refetchData('getCallbackPhoneNumbers');
      handleClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update callback number',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => console.log('Edit pressed!');
  const handleDeleteClick = () => console.log('Delete pressed!');

  return (
    <>
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
          <Box width="75%">
            <Text fontWeight="bold" fontSize="16px">My Callback Number</Text>
            <Text fontSize="14px">All incoming calls will be routed to this number.</Text>
          </Box>
          <Button leftIcon={<EditIcon />} colorScheme="blue" onClick={handleOpen} display={{ base: 'none', md: 'inline-flex' }}>Edit</Button>
          <IconButton aria-label="Edit" icon={<EditIcon />} colorScheme="blue" onClick={handleOpen} display={{ base: 'inline-flex', md: 'none' }} />
        </Stack>
        <List spacing={3}>
          {Array.isArray(callbackPhoneNumbers) && callbackPhoneNumbers?.map(number => (
            <ListItem key={number?.phone_number} display="flex" justifyContent="space-between" alignItems="center">
              <Text>{number?.phone_number}</Text>
              <Box>
                <Tooltip hasArrow label="Edit" placement="top">
                  <IconButton
                    bg="blue.500"
                    color="white"
                    size="sm"
                    aria-label="Edit phone number"
                    icon={<EditIcon />}
                    onClick={handleEditClick}
                    mr="2"
                    display="none"
                  />
                </Tooltip>
                <Tooltip hasArrow label="Delete" placement="top">
                  <IconButton
                    bg="red.500"
                    color="white"
                    size="sm"
                    aria-label="Delete phone number"
                    icon={<DeleteIcon />}
                    onClick={handleDeleteClick}
                    display="none"
                  />
                </Tooltip>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Callback Number</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Callback Number</FormLabel>
              <Input placeholder="Enter callback number" value={callbackNumber} onChange={e => setCallbackNumber(e.target.value)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isSaving}>
              Save
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyCallbackNumberComponent;
