// app/components/SettingsComponents/MyProfile.tsx

import { Box, Text, Stack, Avatar, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

export default function MyProfile() {
  // Avatar upload and crop logic goes here

  return (
    <Box outline="solid #E0E0E0" p={8} borderRadius="8px">
      <Text fontSize="l" fontWeight="bold" mb="4">
        Profile Information
      </Text>
      <Stack align="center" spacing="4">
        <Avatar size="xl" name="User Name" src="avatar_url" />
        <Button>Upload New Avatar</Button>
      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input placeholder="First Name" />
      </FormControl>
      <FormControl>
        <FormLabel>Last Name</FormLabel>
        <Input placeholder="Last Name" />
      </FormControl>
      <FormControl>
        <FormLabel>Phone Number</FormLabel>
        <Input placeholder="Phone Number" />
      </FormControl>
      <FormControl>
        <FormLabel>Email Address</FormLabel>
        <Input placeholder="Email Address" />
      </FormControl>
      </Stack>
    </Box>
  );
};
