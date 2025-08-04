'use client';

import {
  Box, FormControl, FormLabel, Input, Button, VStack, Text, Center, Divider, useToast,
} from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation'; // Updated import statement for useRouter
import { useState } from 'react';


export default function ResetPassword() {
  'use client';

  const [email, setEmail] = useState('');
  const toast = useToast();
  const router = useRouter(); // Use useRouter hook for navigation if needed
  const supabase = createClientComponentClient();

  const handleResetPassword = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const getURL = () => {
      let url = process?.env?.NEXT_PUBLIC_SITE_URL // Set for production
        ?? process?.env?.NEXT_PUBLIC_VERCEL_URL // Automatically set by vercel for one off branch deployments
        ?? 'http://localhost:3000/'; // Set for local dev
      url = url.includes('http') ? url : `https://${url}`;
      url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
      return url;
    };

    console.log('Harper', `${getURL()}login/resetPassword/newPassword`);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}login/resetPassword/newPassword`,
    });

    if (error) {
      console.error('Whoops! Something went wrong:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    // Show toast notification
    toast({
      title: 'Email Sent',
      description: "If an account with that email exists, we've sent a reset link to it. Check your inbox!",
      status: 'success',
      duration: null,
      isClosable: true,
      position: 'bottom',
    });
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
      >
        <Text fontSize="2xl" fontWeight="bold" alignSelf="center">
          Reset Password
        </Text>
        <Divider orientation="horizontal" my="2" />
        <Box as="form" onSubmit={handleResetPassword} w="full">
          <FormControl id="email" mb="4">
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email..."
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
            Send Reset Email
          </Button>
        </Box>
      </VStack>
    </Center>
  );
}
