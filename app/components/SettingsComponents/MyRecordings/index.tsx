import {
  Stack,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState, useEffect } from 'react';

import ErrorBoundary from '../../ErrorBoundary';
import LeadMapLinkButton from '../../LeadMapLinkButton';


const MyRecordingsComponent = () => {
  const [recordings, setRecordings] = useState([]);

  const fetchRecordings = async () => {
    try {
      const response = await fetch('/api/twilio/getAllRecordings');
      const data = await response.json();
      if (response.ok) {
        setRecordings(data);
      } else {
        throw new Error(data.error || 'Failed to fetch recordings.');
      }
    } catch (error) {
      console.error('Fetch Failed:', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  // Transform the recording object to match the expected format for LeadMapLinkButton
  const transformRecordingForLeadMap = recording => ({
    ...recording,
    lead: {
      ...recording?.lead,
      leads_locations: [{
        locations: recording?.location,
      }],
    },
  });

  return (
    <ErrorBoundary>
      <Box
        width="full"
        paddingLeft="16px"
        paddingRight="16px"
        paddingBottom="16px"
        paddingTop="0"
        border="1px solid #E0E0E0"
        borderRadius="8px"
        mb="4"
        height="100%"
        overflow="auto"
        sx={{
          overflowY: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        }}
      >
        <Stack
          paddingTop="16px"
          direction="row"
          justify="space-between"
          align="center"
          mb="4"
          position="sticky"
          bg="white"
          top="0"
          height="auto"
          width="100%"
        >
          <Box height="100%" position="sticky" top="0">
            <Text fontWeight="bold" fontSize="16px">My Call Recordings</Text>
          </Box>
        </Stack>
        <Box
          width="100%"
          overflowX="auto"
          overflowY="auto"
          height="100%"
          paddingBottom="20px"
          sx={{
            overflowY: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            '-ms-overflow-style': 'none', /* IE and Edge */
            'scrollbar-width': 'none', /* Firefox */
          }}
        >
          <Table variant="simple">
            <Thead position="sticky" top="0" width="100%" bg="white" zIndex={999}>
              <Tr>
                <Th textAlign="center">Date</Th>
                <Th textAlign="center">Lead</Th>
                <Th textAlign="center">From</Th>
                <Th textAlign="center">To</Th>
                <Th textAlign="center">Duration</Th>
                <Th textAlign="center">Recording</Th>
                <Th textAlign="center">Map</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recordings?.map((recording) => {
                const transformedRecording = transformRecordingForLeadMap(recording);
                return (
                  <Tr key={recording?.sid}>
                    <Td>{formatDate(recording?.dateCreated)}</Td>
                    <Td>
                      <Tooltip label="View lead details" fontSize="md">
                        <Link as={NextLink} href={`/leads?leadId=${recording?.lead?.id}`} style={{ color: '#008D3F' }}>
                          {recording?.person?.first_name}
                          {' '}
                          {recording?.person?.last_name}
                        </Link>
                      </Tooltip>
                    </Td>
                    <Td>{recording?.call?.fromFormatted}</Td>
                    <Td>{recording?.call?.toFormatted}</Td>
                    <Td>{formatDuration(recording?.duration)}</Td>
                    <Td>
                      <Box width="250px" height="50px">
                        <audio controls style={{ width: '100%', height: '100%' }} src={recording?.mediaUrl}>
                          Your browser does not support the audio element to properly play recordings. Please use the latest version of Google Chrome
                        </audio>
                      </Box>
                    </Td>
                    <Td>
                      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <LeadMapLinkButton width="100px" height="100px" lead={{ ...transformedRecording?.lead }} />
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default MyRecordingsComponent;

