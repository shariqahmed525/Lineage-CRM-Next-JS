import { Box, Text, Stack, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';

const CompanyInfo = () => {
  const [agencyName, setAgencyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  return (
    <Box outline="solid #E0E0E0" p={8} borderRadius="8px" mb="4">
      <Text fontSize="l" fontWeight="bold" mb="4">
        Company Information
      </Text>
      <Stack align="center" spacing="4">
        <FormControl>
          <FormLabel>Agency/IMO Name</FormLabel>
          <Input placeholder="Agency/IMO Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Contact Info</FormLabel>
          <Input placeholder="Contact Info" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default CompanyInfo;
