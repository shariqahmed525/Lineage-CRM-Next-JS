import React, { useState } from 'react';
import {
  Box, Button, Text, useToast, Stack,
} from '@chakra-ui/react';


const DeveloperSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seedUserData', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      toast({
        title: 'Success',
        description: 'User data seeded successfully. Please refresh the page to see the changes.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to seed user data: ${JSON.stringify(error)}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>Developer Settings</Text>
      <Stack spacing={4}>
        <Box>
          <Text fontSize="lg">Seed User Data</Text>
          <Text fontSize="sm" color="gray.500">
            This action will seed your account with predefined data. Please note that this will overwrite any existing data in your account.
          </Text>
          <Text fontSize="sm" color="gray.500">
            Make sure to review the changes after seeding the data. This action is irreversible.
          </Text>
        </Box>
        <Button
          colorScheme="teal"
          onClick={handleSeedData}
          isLoading={isLoading}
          loadingText="Seeding Data"
        >
          Seed User Data
        </Button>
      </Stack>
    </Box>
  );
};

export default DeveloperSettings;
