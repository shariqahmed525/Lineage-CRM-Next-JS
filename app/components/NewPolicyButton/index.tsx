import {
  Button, useDisclosure, Box, IconButton, Tooltip, Select,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';

import { useLeads } from '@/app/contexts/LeadsContext';
import { NewBusinessProvider } from '@/app/contexts/NewBusinessContext';

import NewBusinessModal from '../NewBusinessModal';


interface NewPolicyButtonProps {
  isIconButton?: boolean;
  label?: string | null;
  [x: string]: any;
}

const NewPolicyButton: React.FC<NewPolicyButtonProps> = ({ isIconButton = false, label, ...styleProps }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { leads, getLeadById } = useLeads();
  const [selectedLead, setSelectedLead] = useState('');
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    if (selectedLead) {
      const lead = getLeadById(selectedLead);
      setPersons(lead?.persons || []);
    }
  }, [selectedLead]);

  const buttonLabel = label === undefined ? 'Add Policy' : label;

  return (
    <>
      <Tooltip label={buttonLabel} hasArrow placement="bottom">
        {isIconButton ? (
          <IconButton
            aria-label={buttonLabel}
            icon={<FaClipboardList />}
            onClick={onOpen}
            colorScheme="green"
            {...styleProps}
          />
        ) : (
          <Button
            colorScheme="green"
            onClick={onOpen}
            leftIcon={<FaClipboardList />}
            aria-label={buttonLabel}
            {...styleProps}
          >
            {buttonLabel || 'New Policy'}
          </Button>
        )}
      </Tooltip>

      <NewBusinessProvider>
        <NewBusinessModal isOpen={isOpen} onClose={onClose}>
          <Select placeholder="Select Lead" onChange={e => setSelectedLead(e.target.value)}>
            {leads.map(lead => (
              <option key={lead.id} value={lead.id}>{lead.name}</option>
            ))}
          </Select>
          <Select placeholder="Select Person">
            {persons.map(person => (
              <option key={person.id} value={person.id}>{person.name}</option>
            ))}
          </Select>
        </NewBusinessModal>
      </NewBusinessProvider>
    </>
  );
};

export default NewPolicyButton;

