import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { useData } from '../../contexts/DataFetchContext';
import { useLeads } from '../../contexts/LeadsContext';


interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone1: '',
    phone2: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { refetchData } = useData();
  const { selectedLead, refetchLeads } = useLeads();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/createPerson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lead_id: selectedLead?.id }),
      });

      if (response.ok) {
        toast({
          title: 'Person added successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        onClose(); // Close the modal
        await refetchData('getPersons'); // Refetch persons after adding a new person
        await refetchLeads(); // Refetch persons after adding a new person
      } else {
        const errorData = await response.json();
        toast({
          title: 'Failed to add person',
          description: errorData.error,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to add person',
        description: 'An unexpected error occurred.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Person</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Form fields for person details */}
          <FormControl id="first_name" isRequired>
            <FormLabel>First Name</FormLabel>
            <Input name="first_name" value={formData.first_name} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="last_name" isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input name="last_name" value={formData.last_name} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="email_address">
            <FormLabel>Email Address</FormLabel>
            <Input name="email_address" value={formData.email_address} onChange={handleInputChange} type="email" />
          </FormControl>
          <FormControl id="phone1">
            <FormLabel>Primary Phone</FormLabel>
            <Input name="phone1" value={formData.phone1} onChange={handleInputChange} />
          </FormControl>
          <FormControl id="phone2">
            <FormLabel>Secondary Phone</FormLabel>
            <Input name="phone2" value={formData.phone2} onChange={handleInputChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmit} isLoading={isSubmitting}>
            Add Person
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPersonModal;
