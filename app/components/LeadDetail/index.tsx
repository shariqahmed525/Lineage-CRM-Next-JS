import {
  PhoneIcon, CalendarIcon, AttachmentIcon, ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  Heading, VStack, HStack, Stack, Text, IconButton, Box, Card, CardBody, CardHeader, Tooltip, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

import AddressCard from '@/app/components/AddressCard';
import Attachments from '@/app/components/Attachments';
import CallCard from '@/app/components/CallCard';
import LeadPersonTabs from '@/app/components/LeadPersonTabs';
import LeadStatusBadge from '@/app/components/LeadStatusBadge';
import NewAppointmentButton from '@/app/components/NewAppointmentButton';
import NewPolicyButton from '@/app/components/NewPolicyButton';
import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';
import { createClient } from '@/utils/supabase/client';

import { Tables } from '@/types/types';


interface LeadDetailProps {
  lead: Tables<'leads'> | null;
  updateRefreshActivities?: () => void | undefined;
}

const LeadDetail: React.FC<LeadDetailProps> = ({
  lead, updateRefreshActivities,
}) => {
  const { isOpen: isCallCardOpen, onOpen: onCallCardOpen, onClose: onCallCardClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteCardOpen, onClose: onDeleteCardClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const { leadStatuses, setLeadStatuses } = useData();
  const toast = useToast();
  const router = useRouter();
  const { refreshLeads } = useLeads(); // Add this line

  if (!lead) {
    console.log('No lead selected, drawer will not render.');
    return null;
  }

  const formatPhoneNumber = (phoneNumber: string) => phoneNumber.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');

  const primaryPerson = lead?.persons?.[0];

  const toNumbers = [
    { phoneNumber: primaryPerson?.phone1 || '', friendlyName: formatPhoneNumber(primaryPerson?.phone1 || '') },
    { phoneNumber: primaryPerson?.phone2 || '', friendlyName: formatPhoneNumber(primaryPerson?.phone2 || '') },
  ];

  const leadName = `${primaryPerson?.first_name} ${primaryPerson?.last_name}`;

  const handleDeleteLead = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.from('leads').delete().eq('id', lead.id);
      if (error) throw error;
      toast({
        title: 'Lead deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      await refreshLeads(); // Add this line to refresh leads
      router.push('/leads');
    } catch (error) {
      toast({
        title: 'Error deleting lead.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onDeleteCardClose();
    }
  };

  return (
    <>
      <VStack id="lead-detail" maxHeight="100%" height="100%" align="stretch" width="100%" overflow="hidden">
        <Card border="1px" borderColor="#EAEAEA">
          <CardHeader>
            <Heading p={0} margin={0} size="sm">Quick Action</Heading>
          </CardHeader>
          <CardBody paddingTop={0}>
            <VStack width="100%">
              <LeadStatusBadge
                leadId={lead.id}
                currentStatusId={lead.lead_status_id}
                leadStatuses={leadStatuses}
                onStatusUpdated={updateRefreshActivities}
                setLeadStatuses={setLeadStatuses}
              />
              <HStack width="90%" justifyContent="space-between" marginTop={4}>
                <Tooltip label="Start Call" hasArrow>
                  <IconButton onClick={onCallCardOpen} aria-label="Call" icon={<PhoneIcon />} colorScheme="blue" />
                </Tooltip>
                <NewAppointmentButton isIconButton />
                <NewPolicyButton isIconButton />
                <Tooltip label="Delete Lead" hasArrow>
                  <IconButton onClick={onDeleteCardOpen} aria-label="Delete" icon={<FaTrash />} colorScheme="red" />
                </Tooltip>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
        <AddressCard lead={lead} />
        <Card border="1px" borderColor="#EAEAEA">
          <CardHeader><Heading p={0} margin={0} size="sm">People</Heading></CardHeader>
          <CardBody
            bg="white"
            paddingTop={0}
            h="100%"
            overflowY="auto"
            sx={{
              overflowY: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              '-ms-overflow-style': 'none', /* IE and Edge */
              'scrollbar-width': 'none', /* Firefox */
            }}
          >
            <LeadPersonTabs />
          </CardBody>
        </Card>
        <Card border="1px" borderColor="#EAEAEA" overflowY="auto" paddingBottom="100px">
          <CardHeader>
            <Heading p={0} margin={0} size="sm">Lead Details</Heading>
          </CardHeader>
          <CardBody paddingTop={0}>
            <VStack align="stretch" spacing={1}>
              <HStack justifyContent="space-between">
                <Text fontWeight="semibold">Source:</Text>
                <Text>{lead?.lead_source || ''}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="semibold">Date Received:</Text>
                <Text>
                  {lead.date_received ? new Date(lead.date_received).toLocaleDateString('en-US') : '01/01/2024'}
                </Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="semibold">County:</Text>
                <Text>{lead?.county || ''}</Text>
              </HStack>
              <Attachments leadId={lead?.id} />
            </VStack>
          </CardBody>
        </Card>
        <Box />
      </VStack>
      {isCallCardOpen && <CallCard leadName={leadName} isOpen={isCallCardOpen} onClose={onCallCardClose} />}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteCardClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this lead? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteCardClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleDeleteLead} isLoading={isDeleting}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadDetail;
