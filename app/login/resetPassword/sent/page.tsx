import { VStack, Text, Center } from '@chakra-ui/react';


`use client`;


export default function ResetPasswordSent() {
  'use client';

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
          Email Sent
        </Text>
        <Text mt="4" p="4" bg="green.500" color="white" textAlign="center">
          If an account with that email exists, we&apos;ve sent a reset link to it. Check your inbox!
        </Text>
      </VStack>
    </Center>
  );
}
