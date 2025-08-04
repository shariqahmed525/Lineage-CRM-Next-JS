// app/components/LeadStatusSettings/EditLeadStatusModal.tsx
import { Input, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { CirclePicker } from 'react-color';

import { LeadStatus } from '@/types/databaseTypes';

const EditLeadStatusModal = ({ status, isOpen, onClose, onUpdate }) => {
  const [statusName, setStatusName] = useState('');
  const [color, setColor] = useState('#000000'); // default color
  const toast = useToast();

  const colors = ["#c2e3c1","#b5dbc9","#7fc7b6","#b6dcdc","#acc3c3","#729aac","#ebc2bf","#e6848f","#c05965"]; // array of colors with clearer contrast

  useEffect(() => {
    if (status) {
      setStatusName(status.status_name);
      setColor(status.badge_color_hexcode);
    }
  }, [status]);

  const handleSubmit = () => {
    if (!statusName || !color) {
      toast({
        title: "Missing fields",
        description: "Please fill all the fields before submitting.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const updatedStatus = { status_id: status.status_id, status_name: statusName, badge_color_hexcode: color };
    onUpdate(updatedStatus);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Status Name</FormLabel>
            <Input value={statusName} onChange={(e) => setStatusName(e.target.value)} />
          </FormControl>
          <FormControl mt={4} mb={4}>
            <FormLabel>Badge Color</FormLabel>
            <CirclePicker width="auto" colors={colors} color={color} onChange={(updatedColor) => setColor(updatedColor.hex)} />
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

export default EditLeadStatusModal;