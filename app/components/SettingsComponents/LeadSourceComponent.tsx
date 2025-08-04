import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, useToast, Icon,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import {
  FaEnvelope, FaGlobe, FaPhone, FaFacebook, FaTwitter,
  FaLinkedin, FaInstagram, FaYoutube, FaNewspaper, FaTv,
  FaBullhorn, FaBuilding, FaHospital, FaUniversity, FaChurch,
  FaPlane, FaCar, FaChartPie,
} from 'react-icons/fa';

import CreateLeadSourceModal from './CreateLeadSourceModal';
import EditLeadSourceModal from './EditLeadSourceModal';
import ConfirmActionDialog from '../ConfirmActionDialog';

import { Tables } from '@/types/types';

const ICONS = {
  envelope: FaEnvelope,
  globe: FaGlobe,
  phone: FaPhone,
  facebook: FaFacebook,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  youtube: FaYoutube,
  newspaper: FaNewspaper,
  television: FaTv,
  megaphone: FaBullhorn,
  building: FaBuilding,
  hospital: FaHospital,
  university: FaUniversity,
  church: FaChurch,
  airplane: FaPlane,
  car: FaCar,
  chart: FaChartPie,
};

// Define a type for the keys of the ICONS object
type IconName = keyof typeof ICONS;

const LeadSourceComponent = () => {
  const [leadSources, setLeadSources] = useState<Tables<'lead_sources'>[]>([]);
  const [editingSource, setEditingSource] = useState<Tables<'lead_sources'> | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletingSourceId, setDeletingSourceId] = useState<string | null>(null);
  const toast = useToast();

  const fetchLeadSources = async () => {
    try {
      const response = await fetch('/api/getAllLeadSources');
      const data = await response.json();
      setLeadSources(data);
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    }
  };

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const createLeadSource = async (newSource: Tables<'lead_sources'>) => {
    try {
      const response = await fetch('/api/createLeadSource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSource),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setLeadSources(prevLeadSources => [...prevLeadSources, data]);
      toast({
        title: 'Lead source created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to create lead source.',
        description: error.toString(),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateLeadSource = async (sourceToUpdate: Tables<'lead_sources'>) => {
    try {
      const response = await fetch('/api/updateLeadSource', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sourceToUpdate),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setLeadSources(prevLeadSources => prevLeadSources.map(source => source.id === data.id ? data : source));
      toast({
        title: 'Lead source updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to update lead source.',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteLeadSource = async () => {
    if (deletingSourceId) {
      try {
        const response = await fetch('/api/deleteLeadSource', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: deletingSourceId }),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        await response.json();
        setLeadSources(leadSources?.filter(source => source.id !== deletingSourceId));
        toast({
          title: 'Lead source deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Failed to delete lead source.',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <Button leftIcon={<AddIcon />} colorScheme="green" variant="solid" mb={4} onClick={() => setCreateModalOpen(true)}>
        Create New Source
      </Button>
      <Box position="sticky" top="0" zIndex="sticky" bg="white">
        <Table variant="simple">
          <Thead position="sticky" top="0" zIndex="sticky" bg="white">
            <Tr>
              <Th textAlign="left">Source</Th>
              <Th textAlign="center">Icon</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leadSources?.map((source) => {
              const iconName = source.icon as IconName;
              const IconComponent = ICONS[iconName];

              return (
                <Tr key={source.id}>
                  <Td textAlign="left">{source.name}</Td>
                  <Td textAlign="center">
                    <Icon as={IconComponent} boxSize={6} />
                  </Td>
                  <Td>
                    <Flex justifyContent="center" alignItems="center" gap="4">
                      {!source.is_default && <IconButton size="sm" icon={<EditIcon />} onClick={() => { setEditingSource(source); setEditModalOpen(true); }} aria-label="Edit source" />}
                      {!source.is_default && <IconButton size="sm" icon={<DeleteIcon />} colorScheme="red" aria-label="Delete source" onClick={() => { setDeletingSourceId(source.id); setConfirmDialogOpen(true); }} />}
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <ConfirmActionDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onConfirm={deleteLeadSource}
          title="Delete Lead Source"
          message="Deleting this lead source will cause all leads currently attached to it to become unassigned. If this is not your intention, consider editing the lead source instead. Are you sure you want to proceed?"
          confirmButtonText="Delete"
        />
      </Box>
      <CreateLeadSourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={createLeadSource}
        icons={ICONS}
      />
      {editingSource && (
        <EditLeadSourceModal
          source={editingSource}
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={updateLeadSource}
          icons={ICONS}
        />
      )}
    </Box>
  );
};

export default LeadSourceComponent;