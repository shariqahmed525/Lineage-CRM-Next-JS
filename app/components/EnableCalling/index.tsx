import { Button, Text, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

type EnableCallingProps = {
  onEnable: () => void;
};

const EnableCalling: React.FC<EnableCallingProps> = ({ onEnable }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableCalling = async () => {
    setIsLoading(true);
    try {
      // Call the API endpoint to create a subaccount
      const subaccountResponse = await fetch('/api/twilio/createSubaccount', { method: 'POST' });

      if (subaccountResponse.status !== 201) {
        throw new Error('Failed to create subaccount');
      }

      // Call the API endpoint to create a TwiML application for the subaccount
      const twimlAppResponse = await fetch('/api/twilio/createTwimlApplicationForSubaccount', { method: 'POST' });

      if (twimlAppResponse.status !== 200) {
        throw new Error('Failed to create TwiML application');
      }

      // Call the API endpoint to create an API key for the subaccount
      const apiKeyResponse = await fetch('/api/twilio/createApiKeyForSubaccount', { method: 'POST' });

      if (!apiKeyResponse.ok) {
        throw new Error('Failed to create API key for subaccount');
      }

      // Display success toast
      toast({
        title: "Calling enabled.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Call the onEnable function
      await onEnable();
    } catch (error) {
      // Display error toast
      toast({
        title: "We were unable to enable calling on your account.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <VStack spacing={4} align="center" m={4}>
      <Text fontSize="lg" fontWeight="semibold">
        To use the calling feature, you need to enable it.
      </Text>
      <Button colorScheme="green" onClick={handleEnableCalling} isLoading={isLoading} disabled={isLoading}>
        Enable Calling
      </Button>
    </VStack>
  );
};

export default EnableCalling;
