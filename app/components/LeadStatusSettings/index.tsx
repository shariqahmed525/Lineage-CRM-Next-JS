import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, useToast, Center,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { LeadStatus } from '@/types/databaseTypes.ts';

import CreateLeadStatusModal from './CreateLeadStatusModal';
import EditLeadStatusModal from './EditLeadStatusModal';
import ConfirmActionDialog from '../ConfirmActionDialog';


const LeadStatusSettings = () => {
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [editingStatus, setEditingStatus] = useState<LeadStatus | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletingStatusId, setDeletingStatusId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/getLeadStatuses')
      .then(response => response.json())
      .then((data) => {
        setLeadStatuses(data);
      })
      .catch((error) => {
        console.error('Error fetching lead statuses:', error);
      });
  }, []);

  const updateLeadStatus = (updatedStatus: LeadStatus) => {
    fetch('/api/editLeadStatus', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStatus),
    })
      .then(response => response.json())
      .then(() => {
        toast({
          title: 'Lead status updated.',
          description: "We've updated the lead status for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetch('/api/getLeadStatuses')
          .then(response => response.json())
          .then((updatedLeadStatuses) => {
            setLeadStatuses(updatedLeadStatuses);
          })
          .catch((error) => {
            console.error('Error fetching lead statuses:', error);
          });
        setEditModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating lead status:', error);
        toast({
          title: 'An error occurred.',
          description: 'Unable to update lead status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const deleteLeadStatus = () => {
    if (deletingStatusId === null) return;

    fetch('/api/deleteLeadStatus', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status_id: deletingStatusId }),
    })
      .then(response => response.json())
      .then(() => {
        toast({
          title: 'Lead status deleted.',
          description: "We've deleted the lead status for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setLeadStatuses(leadStatuses?.filter(status => status.status_id !== deletingStatusId));
        setDeletingStatusId(null);
        setConfirmDialogOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting lead status:', error);
        toast({
          title: 'An error occurred.',
          description: 'Unable to delete lead status.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const createLeadStatus = (newStatus: LeadStatus) => {
    fetch('/api/createLeadStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatus),
    })
      .then(response => response.json())
      .then(() => {
        toast({
          title: 'Lead status created.',
          description: "We've created the lead status for you.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetch('/api/getLeadStatuses')
          .then(response => response.json())
          .then((updatedLeadStatuses) => {
            setLeadStatuses(updatedLeadStatuses);
          })
          .catch((error) => {
            console.error('Error fetching lead statuses:', error);
          });
        setCreateModalOpen(false);
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
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="flex-start">
        <Button leftIcon={<AddIcon />} colorScheme="green" variant="solid" mb={8} onClick={() => setCreateModalOpen(true)}>
          Create New Status
        </Button>
      </Box>
      <CreateLeadStatusModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={createLeadStatus} />
      <EditLeadStatusModal status={editingStatus} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onUpdate={updateLeadStatus} />
      <Box height="calc(100vh - 250px)" overflowY="auto">
        <Table variant="simple">
          <Thead position="sticky" top="0" zIndex="sticky" bg="white">
            <Tr>
              <Th textAlign="left">Status</Th>
              <Th textAlign="center">Color</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leadStatuses?.map(status => (
              <Tr key={status.status_id}>
                <Td textAlign="left">{status.status_name}</Td>
                <Td>
                  <Center>
                    <Box width="24px" height="24px" backgroundColor={status.badge_color_hexcode} />
                  </Center>
                </Td>
                <Td>
                  <Flex justifyContent="center" alignItems="center" gap="4">
                    <IconButton size="sm" icon={<EditIcon />} onClick={() => { setEditingStatus(status); setEditModalOpen(true); }} aria-label="Edit status" />
                    <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" aria-label="Delete status" onClick={() => { setDeletingStatusId(status.status_id); setConfirmDialogOpen(true); }} />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <ConfirmActionDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={deleteLeadStatus}
        title="Delete Lead Status"
        message="Deleting this lead status will cause all leads currently attached to it to become unassigned. If this is not your intention, consider editing the lead status instead. Are you sure you want to proceed?"
        confirmButtonText="Delete"
      />
    </Box>
  );
};

export default LeadStatusSettings;
