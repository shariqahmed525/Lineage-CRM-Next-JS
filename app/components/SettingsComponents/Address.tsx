// app/components/SettingsComponents/Address.tsx

import { Box, Text, Stack, FormControl, FormLabel, Input } from '@chakra-ui/react';

export default function Address() {
  return (
    <Box outline="solid #E0E0E0" p={8} borderRadius="8px" mb="4">
      <Text fontSize="l" fontWeight="bold" mb="4">
        Address Information
      </Text>
      <Stack align="center" spacing="4">
      <FormControl>
        <FormLabel>Address Line 1</FormLabel>
        <Input placeholder="Address Line 1" />
      </FormControl>
      <FormControl>
        <FormLabel>Address Line 2</FormLabel>
        <Input placeholder="Address Line 2" />
      </FormControl>
      <FormControl>
        <FormLabel>Country</FormLabel>
        <Input placeholder="Country" />
      </FormControl>
      <FormControl>
        <FormLabel>City</FormLabel>
        <Input placeholder="City" />
      </FormControl>
      <FormControl>
        <FormLabel>ZIP Code</FormLabel>
        <Input placeholder="ZIP Code" />
      </FormControl>
      </Stack>
    </Box>
  );
};
