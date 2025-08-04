import { AddIcon, EditIcon } from '@chakra-ui/icons';
import {
  Stack, Box, Text, Button, Flex,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import MyCallbackNumberComponent from './MyCallbackNumberComponent';
import MyRecordingsComponent from './MyRecordings';
import MyVoiceNumbersComponent from './MyVoiceNumbersComponent';
import NavioComponent2 from './NavioComponent2';
import EnableCalling from '../EnableCalling';


const NavioComponent = () => {
  const [navioOptions, setNavioOptions] = useState(['Option 1', 'Option 2']);
  const [twilioData, setTwilioData] = useState(null);
  const [isCallingEnabled, setIsCallingEnabled] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/twilio/getTwilioSubaccount');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTwilioData(data);
      if (data?.code === 'calling_disabled') {
        setIsCallingEnabled(false);
      } else {
        setIsCallingEnabled(true);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isCallingEnabled) {
    return <EnableCalling onEnable={fetchData} />;
  }

  return (
    <Stack width="full" height="100%" maxWidth="100%" paddingBottom="50px">
      <Box height="30%">
        <MyCallbackNumberComponent />
      </Box>
      <Box height="30%">
        <MyVoiceNumbersComponent />
      </Box>
      <Box height="40%">
        <MyRecordingsComponent />
      </Box>
    </Stack>
  );
};

export default NavioComponent;
