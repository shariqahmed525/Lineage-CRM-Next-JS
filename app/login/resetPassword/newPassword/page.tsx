'use client';

import {
  Box, Button, FormControl, FormLabel, Input, useToast, VStack, Text, Center, Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/utils/supabase/client';

const NewPassword = () => {
  'use client';

  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const access_token = router.query?.code;
    console.log('Cregg', access_token);

    if (!access_token) {
      toast({
        title: 'Error',
        description: 'Access token is missing.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: 'Error updating password',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Password updated successfully',
        description: 'You can now log in with your new password.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      router.push('/login');
    }
  };

  return (
    <Center h="100vh" p={4} bg="gray.100">
      <VStack
        spacing={4}
        w="full"
        maxW="md"
        p={8}
        bg="white"
        boxShadow="0px 0px 40px 0px rgba(0, 0, 0, 0.13)"
        borderRadius="16px"
        align="stretch"
        as="form"
        onSubmit={handleSubmit}
      >
        <Text fontSize="2xl" fontWeight="bold" alignSelf="center">
          New Password
        </Text>
        <Divider orientation="horizontal" my="2" />
        <FormControl id="password" mb="4">
          <FormLabel>New Password</FormLabel>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your new password..."
            borderRadius="8px"
            border="1px solid"
            borderColor="#EAEAEA"
            p="2"
            required
          />
        </FormControl>
        <Button
          borderRadius="8px"
          bg="#008D3F"
          color="white"
          width="full"
          p="2.5"
          justifyContent="center"
          alignItems="center"
          type="submit"
        >
          Update Password
        </Button>
      </VStack>
    </Center>
  );
};

export default NewPassword;
