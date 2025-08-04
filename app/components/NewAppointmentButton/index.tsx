import { CalendarIcon } from '@chakra-ui/icons';
import {
  Button, useDisclosure, Tooltip, IconButton,
} from '@chakra-ui/react';
import React from 'react';

import AddAppointmentModal from '../AddAppointmentModal';


interface NewAppointmentButtonProps {
  isIconButton?: boolean;
  label?: string | null; // Added label prop with optional string or null type
  [x: string]: any; // Allows for any other prop, enabling Cha kra UI style props to be passed
}

const NewAppointmentButton: React.FC<NewAppointmentButtonProps> = ({ isIconButton = false, label, ...styleProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // You can further customize this to dynamically set the default time if needed
  const defaultStartTime = '10:00';

  const buttonLabel = label === undefined ? 'Schedule Appointment' : label; // Default label handling

  return (
    <>
      <Tooltip label={buttonLabel} hasArrow placement="bottom" closeOnClick>
        {isIconButton ? (
          <IconButton
            aria-label={buttonLabel}
            icon={<CalendarIcon />}
            colorScheme="gray"
            onClick={onOpen}
            {...styleProps}
          />
        ) : (
          <Button
            width="100%"
            colorScheme="green"
            onClick={onOpen}
            leftIcon={<CalendarIcon />}
            {...styleProps}
          >
            New
          </Button>
        )}
      </Tooltip>
      <AddAppointmentModal isOpen={isOpen} onClose={onClose} initialStartTime={defaultStartTime} />
    </>
  );
};

export default NewAppointmentButton;
