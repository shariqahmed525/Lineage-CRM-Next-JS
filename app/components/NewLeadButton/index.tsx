import {
  Button, useDisclosure, Tooltip, IconButton,
} from '@chakra-ui/react';
import React from 'react';
import { FaUser } from 'react-icons/fa'; // Importing FaUser icon

import CreateLeadModal from '../CreateLeadModal';
// Importing the CreateLeadModal

interface NewLeadButtonProps {
  isIconButton?: boolean;
  label?: string | null;
  [x: string]: any;
}

const NewLeadButton: React.FC<NewLeadButtonProps> = ({ isIconButton = false, label, ...styleProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonLabel = label === undefined ? 'New Lead' : label; // Adjusted default label

  return (
    <>
      <Tooltip label={buttonLabel} hasArrow placement="bottom" closeOnClick>
        {isIconButton ? (
          <IconButton
            aria-label={buttonLabel}
            icon={<FaUser />}
            colorScheme="blue"
            onClick={onOpen}
            {...styleProps}
          />
        ) : (
          <Button
            width="100%"
            colorScheme="blue" // Adjusted color scheme
            onClick={onOpen}
            leftIcon={<FaUser />}
            {...styleProps}
          >
            {buttonLabel || 'New Lead'}
          </Button>
        )}
      </Tooltip>
      <CreateLeadModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default NewLeadButton;
