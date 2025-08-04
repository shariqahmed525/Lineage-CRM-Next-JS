import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Stack,
  Checkbox,
  CheckboxGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  List,
  ListItem,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';
import { Tables } from '@/types/types';

import StateSelect from './states';


interface LeadsFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Filter {
  id: string;
  name: string;
  filters: string;
  leadStatus?: string[];
  leadType?: string[];
  state?: string[];
  fromDate?: string;
  toDate?: string;
  dateReceived?: string;
  county?: string[];
  city?: string[];
  zip?: string[];
}

const LeadsFilterDrawer: React.FC<LeadsFilterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    setAreFiltersApplied,
    savedFilterName,
    setSavedFilterName, // Added to use the new state handler
  } = useLeads();

  const { leadStatuses, leadSources } = useData();
  const toast = useToast();

  const [filterName, setFilterName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(filters.leadStatus ?? []);
  const [selectedSource, setSelectedSource] = useState<string[]>(filters.leadType ?? []);
  const [selectedState, setSelectedState] = useState<string[]>(filters.state ?? []);
  const [fromDate, setFromDate] = useState<string | null>(filters.fromDate ?? null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [dateReceived, setDateReceived] = useState<string | null>(filters.dateReceived);
  const [county, setCounty] = useState<string | null>(filters.county);
  const [city, setCity] = useState<string | null>(filters.city);
  const [zip, setZip] = useState<string | null>(filters.zip);
  // const [savedFilterName, setSavedFilterName] = useState<string | null>(null);

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [savedFilters, setSavedFilters] = useState<Filter[]>([]);

  const fetchSavedFilters = async () => {
    const response = await fetch('/api/getSavedFilters');
    if (!response.ok) {
      console.error('Failed to fetch saved filters');
      return;
    }
    const data = await response.json();
    const formattedData = data.map((filter: Filter) => ({
      ...filter,
      filters: JSON.stringify(filter.filters),
    }));
    setSavedFilters(formattedData);
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchSavedFilters();
    }
  }, [isModalOpen]);

  const handleLoadFilter = (filter: Filter) => {
    const parsedFilter = JSON.parse(filter.filters);
    setSelectedStatus(parsedFilter.leadStatus || []);
    setSelectedSource(parsedFilter.leadType || []);
    setSelectedState(parsedFilter.state || []);
    setFromDate(parsedFilter.fromDate || null);
    setToDate(parsedFilter.toDate || null);
    setDateReceived(parsedFilter.dateReceived || null);
    setCounty(parsedFilter.county || []);
    setCity(parsedFilter.city || []);
    setZip(parsedFilter.zip || []);
    setSavedFilterName(filter.name);
    onModalClose();
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(filters.leadStatus);
      setSelectedSource(filters.leadType);
      setSelectedState(filters.state || []);
      setFromDate(filters.fromDate);
      setToDate(filters.toDate);
      setDateReceived(filters.dateReceived);
      setCounty(filters.county);
      setCity(filters.city);
      setZip(filters.zip);
    }
  }, [isOpen, filters]);

  const handleStatusChange = (values: string[]) => {
    setSelectedStatus(values);
  };

  const handleSourceChange = (values: string[]) => {
    setSelectedSource(values);
  };

  const handleStateChange = (selectedOptions: string[]) => {
    setSelectedState(selectedOptions);
  };

  const getSelectedStatusColor = () => {
    const status = leadStatuses?.find(status => status.status_id === selectedStatus);
    return status ? status.badge_color_hexcode : 'transparent';
  };

  const handleApplyFilters = async () => {
    await setFilters({
      ...filters,
      leadStatus: selectedStatus,
      leadType: selectedSource,
      fromDate: fromDate,
      toDate: toDate,
      state: selectedState,
      county: county,
      city: city,
      zip: zip,
    });
    applyFilters();
    setAreFiltersApplied(true);
    onClose();
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters(prevFilters => ({ ...prevFilters, state: [] }));
    setAreFiltersApplied(false);
    onClose();
  };

  useEffect(() => {
    if (Object.values(filters).some(value => value !== null)) {
      applyFilters();
      onClose();
    }
  }, [filters]);

  const handleCountyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.includes(',')) {
      const counties = value.split(',').map(item => item.trim());
      setCounty(counties);
    } else {
      setCounty([value]);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.includes(',')) {
      const cities = value.split(',').map(item => item.trim());
      setCity(cities);
    } else {
      setCity([value]);
    }
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.includes(',')) {
      const zips = value.split(',').map(item => item.trim());
      setZip(zips);
    } else {
      setZip([value]);
    }
  };

  const handleSaveFilter = async () => {
    if (!filterName) {
      toast({
        title: 'Error',
        description: 'Please enter a filter name.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const requestBody = {
      name: filterName,
      ...(selectedStatus.length && { leadStatus: selectedStatus }),
      ...(selectedSource.length && { leadType: selectedSource }),
      ...(selectedState.length && { state: selectedState }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      ...(dateReceived && { dateReceived }),
      ...(county.length && { county }),
      ...(city.length && { city }),
      ...(zip.length && { zip }),
    };

    const response = await fetch('/api/saveFilter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      toast({
        title: 'Success',
        description: 'New Filter Configuration Saved!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSavedFilterName(filterName);
      setFilterName('');
    } else {
      const errorData = await response.json();
      toast({
        title: 'Error',
        description: errorData.error || 'Error Saving New Filter Configuration, Please Check Name and Values.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        overflowY="auto"
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter Leads</DrawerHeader>
          <DrawerBody>
            {savedFilterName && (
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {savedFilterName}
              </Text>
            )}
            <FormControl id="filter-name" my={2}>
              <FormLabel>Filter Name</FormLabel>
              <Flex>
                <Input
                  placeholder="New Leads Filter"
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                />
                <Button ml={2} colorScheme="teal" onClick={handleSaveFilter}>
                  Save New Filter
                </Button>
              </Flex>
            </FormControl>
            <FormControl id="lead-status">
              <FormLabel>Lead Status</FormLabel>
              <CheckboxGroup
                colorScheme="green"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <Stack
                  direction="column"
                  wrap="wrap"
                  maxHeight="22vh"
                  overflowY="auto"
                  border="1px solid lightgrey"
                  borderRadius="md"
                  p={2}
                >
                  {leadStatuses?.map(status => (
                    <Checkbox
                      key={status.status_id}
                      value={status.status_id}
                      width="50%"
                    >
                      {status.status_name}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
            <FormControl id="lead-source" my={2}>
              <FormLabel>Lead Source</FormLabel>
              <CheckboxGroup
                colorScheme="blue"
                value={selectedSource}
                onChange={handleSourceChange}
              >
                <Stack
                  direction="row"
                  wrap="wrap"
                  maxHeight="22vh"
                  overflowY="auto"
                  border="1px solid lightgrey"
                  borderRadius="md"
                  p={2}
                >
                  {leadSources?.map(source => (
                    <Checkbox key={source.id} value={source.id}>
                      {source.name}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>
            <Stack direction={['column', 'column', 'row']} spacing="4">
              <FormControl id="date-received-from" flex="1">
                <FormLabel>From</FormLabel>
                <Input
                  type="date"
                  value={fromDate || ''}
                  onChange={e => setFromDate(e.target.value)}
                />
              </FormControl>
              <FormControl id="date-received-to" flex="1">
                <FormLabel>To</FormLabel>
                <Input
                  type="date"
                  value={toDate || ''}
                  onChange={e => setToDate(e.target.value)}
                />
              </FormControl>
            </Stack>
            <StateSelect onChange={handleStateChange} value={selectedState} />
            <FormControl id="county" mt={2}>
              <FormLabel>County</FormLabel>
              <Input
                placeholder="Enter county"
                value={county || ''}
                onChange={handleCountyChange}
              />
            </FormControl>
            <FormControl id="city" mt={2}>
              <FormLabel>City</FormLabel>
              <Input
                placeholder="Enter city"
                value={city || ''}
                onChange={handleCityChange}
              />
            </FormControl>
            <FormControl id="zip" mt={2}>
              <FormLabel>ZIP Code</FormLabel>
              <Input
                placeholder="Enter ZIP code"
                value={zip || ''}
                onChange={handleZipChange}
              />
            </FormControl>
            <Flex justifyContent="space-between" mt={4}>
              <Button colorScheme="red" onClick={handleClearFilters}>
                Clear
              </Button>
              <Button colorScheme="blue" onClick={handleApplyFilters}>
                Apply
              </Button>
              <Button colorScheme="teal" onClick={onModalOpen}>
                Saved Filters
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Saved Filters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {savedFilters.map(filter => (
                <ListItem key={filter.id}>
                  <Button onClick={() => handleLoadFilter(filter)}>
                    {filter.name}
                  </Button>
                </ListItem>
              ))}
            </List>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeadsFilterDrawer;
