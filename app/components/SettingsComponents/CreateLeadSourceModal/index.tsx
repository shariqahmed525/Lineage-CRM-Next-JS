// app/components/SettingsComponents/CreateLeadSourceModal/index.tsx
import {
  Input, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

import IconSelector from '../../IconSelector';

import { Tables } from '@/types/types';

interface CreateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newSource: Tables<'lead_sources'>) => void;
  icons: Record<string, any>;
}

const CreateLeadSourceModal: React.FC<CreateLeadSourceModalProps> = ({
  isOpen, onClose, onCreate, icons,
}) => {
  const [sourceName, setSourceName] = useState('');
  const [icon, setIcon] = useState('');
  const toast = useToast();

  const handleSubmit = () => {
    if (!sourceName || !icon) {
      toast({
        title: 'Missing fields',
        description: 'Please fill all the fields before submitting.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    onCreate({ name: sourceName, icon: icon });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Lead Source</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Source Name</FormLabel>
            <Input value={sourceName} onChange={e => setSourceName(e.target.value)} />
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

export default CreateLeadSourceModal;