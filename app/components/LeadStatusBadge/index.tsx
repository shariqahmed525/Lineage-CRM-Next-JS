// app/components/LeadStatusBadge/index.tsx
import {
  Select, Portal, Container, useToast, Button, Popover, PopoverTrigger, Tooltip, PortalManager,
} from '@chakra-ui/react';
import React from 'react';
import {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';


import CreateLeadStatusPopover from './CreateLeadStatusPopover';

import { LeadStatus } from '@/types/databaseTypes';



const LeadStatusBadge = ({
  leadId, currentStatusId, leadStatuses, onStatusUpdated, setLeadStatuses,
}: { leadId: string, currentStatusId: string | null, leadStatuses: LeadStatus[], onStatusUpdated: (leadId: string, newStatusId: string) => void, setLeadStatuses: (leadStatuses: LeadStatus[]) => void }) => {
  const ref = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(currentStatusId);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setSelectedStatus(currentStatusId);
  }, [currentStatusId]);

  const updateLeadStatus = useCallback((leadId: string, newStatusId: string) => {
    fetch('/api/editLead', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: leadId, lead_status_id: newStatusId }),
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: 'An error occurred.',
            description: 'Unable to update lead status.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Lead status updated.',
            description: 'The lead status has been successfully updated.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          onStatusUpdated(leadId, newStatusId);
        }
      })
      .catch((error) => {
        console.error('Error updating lead status:', error);
        toast({
          title: 'An error occurred.',
          description: `${error.toString()}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [toast, onStatusUpdated]);

  const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    event.nativeEvent.stopImmediatePropagation(); // Use stopImmediatePropagation to ensure no other handlers are called

    const newStatusId = event.target.value;
    if (newStatusId === 'add_new') {
      setPopoverOpen(true);
    } else {
      setSelectedStatus(newStatusId);
      updateLeadStatus(leadId, newStatusId);
    }
  }, [leadId, updateLeadStatus]);

  const handleCreateStatus = useCallback(async (newStatus) => {
    fetch('/api/createLeadStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatus),
    })
      .then(response => response.json())
      .then((data) => {
        toast({
          title: 'Lead status created.',
          description: "We've created the lead status for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        const newStatusId = data[0]?.status_id || null;
        setLeadStatuses(prevStatuses => [...prevStatuses, data[0]]);
        onStatusUpdated(leadId, newStatusId);
        setSelectedStatus(newStatusId);
        setPopoverOpen(false);
        if (newStatusId) {
          updateLeadStatus(leadId, newStatusId);
        }
      })
      .catch((error) => {
        console.error('Error creating lead status:', error);
        toast({
          title: 'An error occurred.',
          description: 'Unable to create lead status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [toast, setLeadStatuses, onStatusUpdated, updateLeadStatus]);

  return (
    <PortalManager zIndex={1500}>
      <Popover
        isOpen={isPopoverOpen}
        onClose={() => setPopoverOpen(false)}
        placement="bottom-end"
        computePositionOnMount
      >
        <PopoverTrigger>
          <Tooltip label="Change lead status" hasArrow placement="right">
            <Select
              zIndex={2}
              placeholder="Select status"
              value={selectedStatus || ''}
              onChange={handleStatusChange}
              onMouseEnter={e => e.stopPropagation()} // Stop mouse enter propagation
              bg={
                selectedStatus
                  ? leadStatuses.find(status => status.status_id === selectedStatus)?.badge_color_hexcode
                  : 'gray.200'
              }
              color="black"
              size="sm" // set the size to small
              fontSize="sm" // set the font size to small
              sx={{
                cursor: 'pointer', // This line changes the cursor to a pointer on hover
                '&:hover': {
                  opacity: 0.8, // Optional: change the opacity on hover for a visual feedback
                },
              }}
            >
              {leadStatuses?.map(status => (
                <option
                  key={status.status_id}
                  value={status.status_id}
                  style={{ backgroundColor: status.badge_color_hexcode }}
                >
                  {status.status_name}
                </option>
              ))}
              <option value="add_new">+ Add new status</option>
            </Select>
          </Tooltip>
        </PopoverTrigger>

        <Portal>
          <CreateLeadStatusPopover
            isOpen={isPopoverOpen}
            onClose={() => setPopoverOpen(false)}
            onCreated={handleCreateStatus}
          />
        </Portal>
      </Popover>
    </PortalManager>
  );
};

export default LeadStatusBadge;
