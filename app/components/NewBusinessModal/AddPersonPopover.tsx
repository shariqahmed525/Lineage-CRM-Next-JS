import { useState } from 'react';
import {
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';


const AddPersonPopover = ({ onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone1: '',
    phone2: '',
  });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/createPerson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Person added successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        onClose();
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
    }
  };

  return (
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Create New Person</PopoverHeader>
      <PopoverBody>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Last Name</FormLabel>
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email Address</FormLabel>
          <Input
            name="email_address"
            value={formData.email_address}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Primary Phone</FormLabel>
          <Input
            name="phone1"
            value={formData.phone1}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Secondary Phone</FormLabel>
          <Input
            name="phone2"
            value={formData.phone2}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button colorScheme="green" mt={4} w="full" onClick={handleSubmit}>
          Save
        </Button>
      </PopoverBody>
    </PopoverContent>
  );
};

export default AddPersonPopover;
