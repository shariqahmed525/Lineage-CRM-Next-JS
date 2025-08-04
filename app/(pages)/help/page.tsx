'use client';

import {
  Stack, Box, Text, Button, Input, Textarea, FormControl, Divider,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

import { createClient } from '../../../utils/supabase/client'; // Adjust the path as necessary


const Help = () => (
  <Box>
    <Stack direction={['column', 'column', 'column', 'row']} width="full" p={4}>
      <Stack
        justify="space-between"
        align="flex-start"
        spacing={4}
        width="full"
      >
        <Stack
          p={['0', '4']}
          direction={['column', 'column']}
          justify="space-between"
          align="left"
          spacing={4}
          width="full"
        >
          <Text as="h1" fontSize="2xl" fontWeight="bold" maxWidth="390px">
            Get help with questions, comments or concerns
          </Text>
          <Text
            maxWidth="410px"
            fontSize="md"
          >
            We'll be notified instantly. You can expect a response from a member of our team within the next 24 hours!
          </Text>
        </Stack>
      </Stack>

      <Stack
        width="full"
        justify="flex-start"
        align="flex-start"
        spacing={4}
      >
        <FormControl>
          <Stack
            mt={4}
            p={4}
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            direction="column"
            justify="flex-start"
            align="flex-start"
            spacing={4}
            overflow="hidden"
          >
            <Text as="h2" fontSize="xl" fontWeight="bold" mb={2}>
              Submit Feedback
            </Text>
            <Textarea placeholder="Enter your question or comment here" />
            <Input placeholder="Enter your email" />
            <Input placeholder="Enter your phone number" />
            <Button colorScheme="green" size="lg" type="submit" alignSelf="flex-end" width={['full', '225px']}>
              Send
            </Button>
          </Stack>
        </FormControl>
      </Stack>
    </Stack>
  </Box>
);

export default Help;
