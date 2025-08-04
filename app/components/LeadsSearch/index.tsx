import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import {
  InputGroup, InputLeftElement, Input, Button, InputRightElement, Box,
} from '@chakra-ui/react';
import React, {
  useCallback,
} from 'react';

import { useLeads } from '@/app/contexts/LeadsContext';


const LeadsSearch = () => {
  const {
    searchLeads, searchTerm, setSearchTerm,
  } = useLeads();

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm === '') {
      searchLeads('');
    }
  }, [searchLeads, setSearchTerm]);

  const handleSearchSubmit = useCallback(async () => {
    await searchLeads(searchTerm);
  }, [searchLeads, searchTerm]);

  const handleSearchClear = useCallback(async () => {
    setSearchTerm('');
    await searchLeads('');
  }, [searchLeads, setSearchTerm]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  }, [handleSearchSubmit]);

  return (
    <Box width="100%" position="sticky" zIndex="sticky" bg="white">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search leads"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          pr="4.5rem" // Adjust padding to accommodate buttons
        />
        <InputRightElement>
          <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" marginRight="1rem">
            {searchTerm ? (
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleSearchClear}
                bgColor="transparent"
              >
                <CloseIcon />
              </Button>
            ) : (
              <Box h="1.75rem" width="1.75rem" /> // Placeholder to maintain alignment
            )}
            <Button h="1.75rem" size="sm" onClick={handleSearchSubmit}>
              Go
            </Button>
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default LeadsSearch;
