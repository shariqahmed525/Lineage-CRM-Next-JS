// MapPage Component

'use client';

import {
  Box, useDisclosure, HStack, IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import React, {
  useState, useCallback, useEffect
} from 'react';
import { FaFilter } from 'react-icons/fa';

import ErrorBoundary from '@/app/components/ErrorBoundary';
import LeadsFilterDrawer from '@/app/components/LeadsFilterDrawer';
import LeadsSearch from '@/app/components/LeadsSearch';
import { useLeads } from '@/app/contexts/LeadsContext';

import LeadMap from '../../components/LeadMap';
import SelectedLeadDetailsCard from '../../components/SelectedLeadDetailsCard';


const MapPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    filteredLeads, setFilteredLeads, selectedLead, setSelectedLead, applyFilters, searchLeads,
  } = useLeads();
  const router = useRouter(); // Initialize useRouter

  const [isLeadsListLoading, setIsLeadsListLoading] = useState(false);

  const handleSearch = useCallback(async (searchTerm) => {
    setIsLeadsListLoading(true);
    await searchLeads(searchTerm);
    setIsLeadsListLoading(false);
  }, [searchLeads]);

  useEffect(() => {
    console.log('router.query:', router.query); // Add this line to debug
    if (router.query) {
      const { persons } = router.query;
      if (persons) {
        const personIds = persons.split(',');
        const filtered = filteredLeads.filter(lead => personIds.includes(lead?.persons?.[0]?.person_id));
        setFilteredLeads(filtered);
      }
    }
  }, [router.query, filteredLeads, setFilteredLeads]);

  return (
    <ErrorBoundary>
      <Box
        id="map-page"
        position="relative"
        width="100%"
        height="100%"
        minHeight="100%"
        minWidth="100%"
        maxWidth="100%"
        overflow="hidden"
      >
        <Box
          id="leads-search"
          position="relative"
          height="72px"
          width="100%"
          zIndex="10"
          alignItems="center"
          p={4}
          borderBottom="1px"
          borderColor="#EAEAEA"
        >
          <HStack>
            <LeadsSearch
              onChange={e => handleSearch(e.target.value)}
              disabled={isLeadsListLoading}
              setIsLoading={setIsLeadsListLoading}
            />
            <IconButton icon={<FaFilter />} variant="outline" aria-label="Filter leads" onClick={onOpen} />
          </HStack>
        </Box>
        <HStack
          height={{ base: '80%', md: '80%', lg: '100%' }}
        >
          { selectedLead
      && (
        <Box
          width={{ base: '80%', md: '30%', lg: '30%' }}
          height="100%"
          bg="white"
          overflowY="auto"
          overflowX="hidden"
        >
          <SelectedLeadDetailsCard
            lead={selectedLead}
            onClose={() => {
              setSelectedLead(null);
            }}
          />
        </Box>
      )}
          <Box
            id="leads-map-container"
            width={{ base: selectedLead ? '20%' : '100%', md: selectedLead ? '70%' : '100%' }}
            maxWidth="100%"
            height="100%"
            minHeight="100%"
            overflowY="hidden"
            overflowX="hidden"
          >
            <LeadMap />
          </Box>

        </HStack>

        <LeadsFilterDrawer isOpen={isOpen} onClose={onClose} />
      </Box>
    </ErrorBoundary>
  );
};

export default MapPage;
