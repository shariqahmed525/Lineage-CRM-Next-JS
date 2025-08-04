'use client';

import {
  Box, VStack,
} from '@chakra-ui/react';
import React from 'react';

import BusinessTable from '@/app/components/BusinessTable';
import TableSearchBlock from '@/app/components/TableSearchBlock';
import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';


const Policies = () => {
  'use client';

  const {
    businessItems, businessStatuses, setBusinessItems,
  } = useData();

  const { selectedLead, filteredLeads, setFilteredLeads } = useLeads();

  return (
    <VStack spacing={4} position="absolute" align="stretch" height="100%" width="100%" scrollMarginTop="10%" paddingTop="40px">
      <Box width="100%" height="10%" top="0">
        <TableSearchBlock leads={filteredLeads} setLeads={setFilteredLeads} selectedLead={selectedLead} pageType="policies" />
      </Box>
      <Box width="100%" height="90%" top="0" bg="white" overflowY="auto" overflowX="scroll">
        <BusinessTable businessItems={businessItems} businessStatuses={businessStatuses} setBusinessItems={setBusinessItems} />
      </Box>
    </VStack>
  );
};

export default Policies;
