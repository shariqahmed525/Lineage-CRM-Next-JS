// app/components/LeadStatusSettings/CreateLeadStatusModal.tsx
import {
  Input, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CirclePicker } from 'react-color';


const CreateLeadStatusModal = ({ isOpen, onClose, onCreate }) => {
  const [statusName, setStatusName] = useState('');
  const [color, setColor] = useState('#000000'); // default color
  const toast = useToast();

  const colors = ['#c2e3c1', '#b5dbc9', '#7fc7b6', '#b6dcdc', '#acc3c3', '#729aac', '#ebc2bf', '#e6848f', '#c05965'];

  const handleSubmit = () => {
    if (!statusName || !color) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all the fields before submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    // Call the onCreate function with the new status
    onCreate({ status_name: statusName, badge_color_hexcode: color });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Status Name</FormLabel>
            <Input value={statusName} onChange={e => setStatusName(e.target.value)} />
          </FormControl>
          <FormControl mt={4} mb={4}>
            <FormLabel>Badge Color</FormLabel>
            <CirclePicker width="auto" colors={colors} color={color} onChange={updatedColor => setColor(updatedColor.hex)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateLeadStatusModal;
