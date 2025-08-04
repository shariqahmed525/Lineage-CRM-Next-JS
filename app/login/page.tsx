"use client";

import {
  Box,
  Button,
  Center,
  Divider,
  FormLabel,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { createClient } from "../../utils/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsLoading(true);

        const response = await fetch("/api/saveSessionData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user.id,
            session_data: session,
            user_data: session.user,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          console.error("Error saving session data:", data.error);
        }
        // Navigate to the next page regardless of the response status
        router.push("/leads");
      }
      setIsLoading(false);
    };

    checkSession();
  }, [router, supabase]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      return router.push("/leads");
    }

    if (error) {
      setIsLoading(false);
      return toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
          scopes:
            "https://www.googleapis.com/auth/calendar.readonly, https://www.googleapis.com/auth/calendar.events",
        },
      },
    });

    if (error) {
      toast({
        title: "OAuth login error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <VStack
      spacing={4}
      m={4}
      p={8}
      bg="white"
      boxShadow="none"
      borderRadius="0px"
      overflow="hidden"
    >
      <Box display={{ md: "none", base: "flex" }} alignSelf="center" mb={4}>
        <Link href="/" passHref>
          <Image
            src="/lineage-crm-stacked-dark.png"
            alt="Lineage Logo"
            width={50}
            height={50}
          />
        </Link>
      </Box>

      <Text fontSize="2xl" fontWeight="bold" alignSelf="center">
        Log in
      </Text>
      <Text alignSelf="center" fontSize="sm" color="gray.600">
        New user?{" "}
        <Link href="/login/createAccount" color="#008D3F" ml="1">
          Create an Account
        </Link>
      </Text>

      <Divider orientation="horizontal" my="2" />

      <Button
        isLoading={isLoading}
        onClick={handleGoogleSignIn}
        borderRadius="8px"
        border="1px solid"
        borderColor="#EAEAEA"
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

      <Box as="form" onSubmit={handleSignIn} w="full">
        <FormLabel>Email</FormLabel>
        <Input
          marginBottom="5"
          type="email"
          placeholder="Enter your email..."
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormLabel>Password</FormLabel>
        <Input
          marginBottom="5"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          bg="#008D3F"
          color="white"
          width="full"
          p="2.5"
          isLoading={isLoading}
        >
          Log In
        </Button>
      </Box>

      <Link
        href="/reset-password"
        alignSelf="center"
        fontSize="sm"
        color="gray.600"
      >
        Forgot your password?{" "}
        <Text as="span" color="#008D3F" ml="1">
          Reset Password
        </Text>
      </Link>

      <Text
        fontSize="xs"
        color="gray.600"
        alignSelf="center"
        mt={4}
        textAlign="center"
      >
        <i>
          By logging in you agree to the Lineage CRM
          <Link href="/terms" color="blue.500" ml="1">
            terms of service{" "}
          </Link>
          and
          <Link href="/privacy" color="blue.500" ml="1">
            privacy policy
          </Link>
          .
        </i>
      </Text>
    </VStack>
  );
};

export default Login;
