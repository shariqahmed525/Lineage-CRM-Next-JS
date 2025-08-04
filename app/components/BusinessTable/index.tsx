import {
  EditIcon, AddIcon, ChevronDownIcon, TriangleUpIcon,
} from '@chakra-ui/icons'; // Import icons from Chakra UI icons
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, LinkBox, LinkOverlay, useDisclosure, Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; // Correct import statement for useRouter
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from react

import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';
import { NewBusinessProvider } from '@/app/contexts/NewBusinessContext';

import ErrorBoundary from '../ErrorBoundary';
import LeadDetailDrawer from '../LeadDetailDrawer'; // Import the LeadDetailDrawer component
import NewBusinessModal from '../NewBusinessModal'; // Import the NewBusiness modal component


interface BusinessTableProps {
  businessItems: any[];
  businessStatuses: any[];
  setBusinessItems: () => void;
}

// Define the BusinessTable component
const BusinessTable = ({ businessItems, businessStatuses, setBusinessItems }: BusinessTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDetailDrawerOpen, onOpen: onDetailDrawerOpen, onClose: onDetailDrawerClose } = useDisclosure();
  const { selectedLead, setSelectedLead } = useLeads();

  // Function to handle row click
  const handleRowClick = async (event: React.MouseEvent<HTMLTableRowElement>, lead: any) => {
    try {
      event.stopPropagation();
      if (selectedLead?.id !== lead.id) {
        await setSelectedLead(lead); // Update the selected lead only if it's different

        // Write selected lead id to the URL
        const url = new URL(window.location);
        url.searchParams.set('leadId', lead?.id);
        window.history.pushState({}, '', url);
      }
      if (!isDetailDrawerOpen) {
        onDetailDrawerOpen(); // Open the drawer only if it's not already open
      }
    } catch (error) {
      console.error('Error handling row click:', error);
      // Handle the error appropriately, e.g., set an error state, show a toast, etc.
    }
  };

  const {
    getPersonById,
    getApplicationStatusById,
    getCarrierById,
    getCarrierPlanById,
  } = useData();

  const { getLeadById } = useLeads();

  // Render the table with business items
  return (
    <ErrorBoundary>
      <Box id="business-table-container" width="full" paddingLeft={5} overflowX="scroll" height="calc(100vh - 100px)" overflowY="auto">
        <LeadDetailDrawer isOpen={isDetailDrawerOpen} onClose={onDetailDrawerClose} lead={selectedLead} />
        <Table size="sm" variant="simple">
          <Thead position="sticky" top="0" zIndex="sticky" bg="white">
            <Tr>
              <Th>Person</Th>
              <Th>Carrier</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(businessItems) && businessItems.length > 0 ? (
              businessItems.map((item) => {
                const carrier = getCarrierById(item?.carrier_1);
                const plan = getCarrierPlanById(item?.carrier_plan_1);
                const status = getApplicationStatusById(item?.status);
                const person = getPersonById(item?.person_id);
                const leadId = person?.leads_persons?.[0]?.lead_id;
                const lead = getLeadById(leadId);

                return (
                  <LinkBox height="75px" minHeight="75px" as={Tr} key={item?.id} _hover={{ bg: 'blue.100', cursor: 'pointer' }}>
                    <Td py={1}>
                      <Text>
                        {person?.first_name}
                        {' '}
                        {person?.last_name}
                      </Text>
                    </Td>
                    <Td py={1}>
                      <Text>{carrier?.carrier_name}</Text>
                    </Td>
                    <Td py={1}>
                      <Text>{plan?.plan_name}</Text>
                    </Td>
                    <Td py={1}>
                      <Text>{status?.status_value}</Text>
                    </Td>
                    <LinkOverlay href="#" onClick={(event: any) => handleRowClick(event, lead)} />
                  </LinkBox>
                );
              })
            ) : (
              <Tr>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </ErrorBoundary>
  );
};

export default BusinessTable;
