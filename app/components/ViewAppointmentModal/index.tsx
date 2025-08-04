import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Grid,
  GridItem,
  Text,
  Tooltip,
  Box,
  Heading,
  HStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';

import { useLeads } from '@/app/contexts/LeadsContext';


interface ViewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentDetails?: {
    title: string;
    start_date: string;
    end_date: string;
    note: string;
    lead_id: string;
    google_event_id?: string;
  };
}

const ViewAppointmentModal: React.FC<ViewAppointmentModalProps> = ({ isOpen, onClose, appointmentDetails }) => {
  const {
    title, start_date, end_date, note, lead_id, google_event_id,
  } = appointmentDetails || {};

  const { getLeadById } = useLeads();

  const formatDate = (isoString: string) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(isoString));
  const formatTime = (isoString: string) => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(isoString));

  const formattedStartDate = start_date ? formatDate(start_date) : 'N/A';
  const formattedStartTime = start_date ? formatTime(start_date) : 'N/A';
  const formattedEndDate = end_date ? formatDate(end_date) : 'N/A';
  const formattedEndTime = end_date ? formatTime(end_date) : 'N/A';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" isTruncated>{title || ''}</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Text fontWeight="bold">Start Date:</Text>
              <Text>{formattedStartDate}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold">Start Time:</Text>
              <Text>{formattedStartTime}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold">End Date:</Text>
              <Text>{formattedEndDate}</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="bold">End Time:</Text>
              <Text>{formattedEndTime}</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold">Note:</Text>
              <Text>{note || 'N/A'}</Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text fontWeight="bold">Lead:</Text>
              <Text>
                {getLeadById(lead_id)?.persons?.[0]?.first_name || ''}
                {' '}
                {getLeadById(lead_id)?.persons?.[0]?.last_name || ''}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <HStack width="100%" justifyContent="space-between" alignItems="center">
            {google_event_id && (
              <Tooltip label="Synced with Google" hasArrow placement="top-start" shouldWrapChildren>
                <Box as={FaGoogle} size="15px" _hover={{ opacity: 0.8, cursor: 'pointer' }} />
              </Tooltip>
            )}
            <Button colorScheme="blue" onClick={onClose}>Close</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewAppointmentModal;
