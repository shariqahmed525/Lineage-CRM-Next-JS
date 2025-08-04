// app/components/SettingsComponents/EditLeadSourceModal/index.tsx
import { Input, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import IconSelector from '../../IconSelector'; // Import the IconSelector component

import { Tables } from '@/types/types';


interface EditLeadSourceModalProps {
  source: Tables<'lead_sources'>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSource: Tables<'lead_sources'>) => void;
  icons: Record<string, any>; // Add icons prop
}

const EditLeadSourceModal: React.FC<EditLeadSourceModalProps> = ({ source, isOpen, onClose, onUpdate, icons }) => {
  const [sourceName, setSourceName] = useState('');
  const [icon, setIcon] = useState(source.icon);
  const toast = useToast();

  useEffect(() => {
    if (source) {
      setSourceName(source.name);
      setIcon(source.icon);
    }
  }, [source]);

  const handleSubmit = () => {
    if (!sourceName || !icon) {
      toast({
        title: "Missing fields",
        description: "Please fill all the fields before submitting.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const updatedSource = { ...source, name: sourceName, icon: icon };
    onUpdate(updatedSource);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Source</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Source Name</FormLabel>
            <Input value={sourceName} onChange={(e) => setSourceName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Icon</FormLabel>
            <IconSelector icons={icons} selectedIcon={icon} onIconSelect={setIcon} />
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

export default EditLeadSourceModal;