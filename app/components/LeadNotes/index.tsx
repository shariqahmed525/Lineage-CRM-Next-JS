import {
  VStack, Box, Textarea, Button, useToast, Flex, Card, CardBody, CardHeader, Heading,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Tables } from '../../../types/types';
// Adjust the import path as necessary

interface LeadNotesProps {
  lead: Tables<'leads'>; // Use the 'leads' table type for the lead prop
  onNewNote: () => void;
}

const LeadNotes: React.FC<LeadNotesProps> = ({ lead, onNewNote }) => {
  const [note, setNote] = useState('');
  const toast = useToast();

  const addNote = async () => {
    try {
      const response = await fetch('/api/createNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: lead.id, // Assuming 'id' is a valid field on the 'leads' table
          note: note,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      setNote(''); // Clear the textarea on success
      onNewNote(); // Call the onNewNote function when a note is successfully created
      toast({
        title: 'Note added.',
        description: "We've added your note.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error.',
        description: "We couldn't add your note.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" h="20%" position="sticky" bottom={0} bg="white" zIndex="sticky" borderTop="1px" borderColor="#EAEAEA">
      <Textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Type a note..."
        resize="none"
        flexGrow={1}
        p={4}
        border="none"
      />
      <Button
        onClick={addNote}
        colorScheme="blue"
        w="full"
        mt={4}
      >
        Send
      </Button>
    </Flex>
  );
};

export default LeadNotes;
