import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';

import AddPersonModal from '../AddPersonModal';

interface AddPersonButtonProps {
  lead_id: string;
}

const AddPersonButton: React.FC<AddPersonButtonProps> = ({ lead_id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Add new person" hasArrow>
        <IconButton
          aria-label="Add new person"
          icon={<AddIcon />}
          onClick={onOpen}
          _focus={{ boxShadow: 'none' }}
          _hover={{ color: '#0C2115', bg: '#E0E0E0' }}
          color="#008D3F"
          bg="transparent"
        />
      </Tooltip>
      <AddPersonModal isOpen={isOpen} onClose={onClose} lead_id={lead_id} />
    </>
  );
};

export default AddPersonButton;