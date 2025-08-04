import {
  Box,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CirclePicker } from 'react-color';


interface CreateLeadStatusPopoverProps {
  onCreated: Function;
  isOpen: boolean;
  onClose: () => void;
}

const CreateLeadStatusPopover: React.FC<CreateLeadStatusPopoverProps> = ({ isOpen, onClose, onCreated }) => {
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
    } else {
      // Call the onCreated function with the new status
      onCreated({ status_name: statusName, badge_color_hexcode: color }).then(() => {
        // Close the popover
        onClose();
      }).catch((error: any) => {
        // If there's an error, do not close the popover
        toast({
          title: 'An error occurred.',
          description: 'Unable to create lead status.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    }
  };
  return (
    <PopoverContent>
      <PopoverCloseButton />
      <PopoverHeader>Create New Status</PopoverHeader>
      <PopoverArrow />
      <PopoverBody>
        <FormControl>
          <FormLabel>Status Name</FormLabel>
          <Input
            value={statusName}
            onChange={e => setStatusName(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Badge Color</FormLabel>
          <CirclePicker
            colors={colors}
            color={color}
            onChange={updatedColor => setColor(updatedColor.hex)}
          />
        </FormControl>
        <Button colorScheme="green" mt={4} w="full" onClick={handleSubmit}>
          Save
        </Button>
      </PopoverBody>
    </PopoverContent>
  );
};

export default CreateLeadStatusPopover;

