'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  VStack,
  Text,
  Center,
  Divider,
  useToast,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { createClient } from '@/utils/supabase/client';

interface Props {
  searchParams: { message: string };
  satMigrationCheck: () => Promise<{ is_from_sat: boolean }>;
}

const Content = ({ searchParams, satMigrationCheck }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  const signUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    toast.closeAll();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return toast({
          title: 'Sign up failed',
          description: error.message,
          status: 'error',
          duration: null,
          isClosable: true,
        });
      }

      const { is_from_sat } = await satMigrationCheck();

      return router.push(
        is_from_sat ? `/leads?is_from_sat=${is_from_sat}` : '/leads'
      );
    } catch (e) {
      const error = e as Error;
      toast({
        title: 'Navigation error',
        description: error.message,
        status: 'error',
        duration: null,
        isClosable: true,
      });
    }
  };

  const handleGoogleSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    console.log('Google sign-up response:', data, error);
    if (data) {
      await router.push('/leads');
    }
  };

  return (
    <Center
      h="100vh"
      w="100vw"
      p={4}
      bg="gray.100"
      position="fixed"
      top="0"
      left="0"
      overflow="hidden"
    >
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
          Sign Up
        </Text>

        <Button
          onClick={handleGoogleSignUp}
          borderRadius="8px"
          border="1px solid"
          borderColor="#EAEAEA"
          justifyContent="center"
          alignItems="center"
          py="2"
          gap="2"
          w="full"
        >
          <Image
            src="/google-logo.svg"
            alt="Google Logo"
            width={20}
            height={20}
          />
          Continue with Google
        </Button>

        <Divider orientation="horizontal" my="2" />

        <Box as="form" onSubmit={signUp} w="full">
          <FormControl id="email" mb="4">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email..."
              borderRadius="8px"
              border="1px solid"
              name="email"
              borderColor="#EAEAEA"
              p="2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" mb="4">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              borderRadius="8px"
              border="1px solid"
              borderColor="#EAEAEA"
              name="password"
              p="2"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            Sign Up
          </Button>
        </Box>

        <Link href="/login" alignSelf="center" fontSize="sm" color="gray.600">
          Already have an account?
          <Text as="span" color="#008D3F" ml="1">
            Log In
          </Text>
        </Link>

        {searchParams?.message && (
          <Text mt="4" p="4" bg="red.500" color="white" textAlign="center">
            {searchParams.message}
          </Text>
        )}
      </VStack>
    </Center>
  );
};

export default Content;