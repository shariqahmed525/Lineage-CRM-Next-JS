import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  FormControl,
  FormLabel,
  Box,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useCallback } from 'react';

const databaseFields = {
  leads: ['lead_type', 'date_received'],
  persons: ['first_name', 'last_name', 'phone'],
  locations: ['street_address', 'city', 'state_code']
};

interface MapHeadersProps {
  headers: string[];
  onSave: (mapping: Record<string, string>) => void;
  onClose: () => void;
}

export default function MapHeaders({ headers = [], onSave, onClose }: MapHeadersProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(true);  // State to control modal visibility

  const handleSelectChange = useCallback((header: string, value: string) => {
    setMapping(prev => ({ ...prev, [header]: value }));
  }, []);

  const saveMapping = useCallback(async () => {
    try {
      const response = await axios.post('/api/processLeads', {
        headers: headers,
        mapping: mapping
      });
      console.log('Mapping saved:', response.data);
      onSave(mapping);
      handleClose();  // Use handleClose to manage closing
    } catch (error) {
      console.error('Failed to save mapping:', error);
    }
  }, [headers, mapping, onSave, onClose]);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);  // Set modal visibility to false
    onClose();  // Call the onClose prop function
  }, [onClose]);

  if (!headers || !Array.isArray(headers)) {
    console.error('Invalid headers prop passed to MapHeaders component. Expected an array.');
    return null; // or return a placeholder/error component
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Map CSV Headers to Database Fields</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {headers.map((header, index) => (
              <Box key={index}>
                <FormControl>
                  <FormLabel htmlFor={`header-select-${index}`}>{header}</FormLabel>
                  <Select id={`header-select-${index}`} placeholder='Select field' onChange={(e) => handleSelectChange(header, e.target.value)}>
                    {Object.entries(databaseFields).map(([category, fields]) => (
                      <optgroup label={category} key={category}>
                        {fields.map(field => (
                          <option value={`${category}.${field}`} key={field}>{field}</option>
                        ))}
                      </optgroup>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={saveMapping}>Save Mapping</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

