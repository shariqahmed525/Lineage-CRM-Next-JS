'use client';

import { EditIcon, AddIcon } from '@chakra-ui/icons';
import {
  Switch, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, GridItem, Button, Stack,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Import useRouter, usePathname, and useSearchParams
import React, {
  useEffect, useState, useCallback, useMemo,
} from 'react';

// Import the components directly
import LeadStatusSettings from '../../components/LeadStatusSettings';
import Address from '../../components/SettingsComponents/Address';
import CallerAccessComponent from '../../components/SettingsComponents/CallerAccessComponent';
import CompanyInfo from '../../components/SettingsComponents/CompanyInfo';
import DeveloperSettings from '../../components/SettingsComponents/DeveloperSettings';
import LeadSourceComponent from '../../components/SettingsComponents/LeadSourceComponent';
import MyProfile from '../../components/SettingsComponents/MyProfile';
import NavioComponent from '../../components/SettingsComponents/NavioComponent';


const Settings = () => {
  const tabNames = useMemo(() => {
    const baseTabs = ['General', 'Calling', 'Lead Status', 'Lead Sources'];
    const env = process.env.NEXT_PUBLIC_NODE_ENV;
    if (env === 'local' || env === 'staging') {
      return [...baseTabs, 'Developer'];
    }
    return baseTabs;
  }, []);

  const searchParams = useSearchParams(); // Correctly use useSearchParams
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);

    return params.toString();
  },
  [searchParams]);

  useEffect(() => {
    const tabParam = searchParams.get('tab'); // Correctly use .get() on searchParams
    const foundTabIndex = tabNames.findIndex(name => name.toLowerCase() === tabParam?.toLowerCase());
    if (foundTabIndex !== -1) {
      setTabIndex(foundTabIndex);
    }
  }, [searchParams, tabNames]);

  const handleTabsChange = (index) => {
    setTabIndex(index);
    const tabName = tabNames[index].toLowerCase();
    router.push(`${pathname}?${createQueryString('tab', tabName)}`);
  };

  const activeTabStyle = {
    color: '#0C2115',
    borderColor: '#008D3F',
    borderBottom: '2px',
    borderBottomColor: '#008D3F',
  };

  const inactiveTabStyle = {
    color: '#A0A0A0',
  };

  return (
    <Stack height="100vh" width="full">
      <Box height="100%">
        <Tabs index={tabIndex} onChange={handleTabsChange} isFitted variant="unstyled" height="100%">
          <TabList borderBottom="1px" borderColor="#E0E0E0">
            {tabNames?.map((tab, index) => (
              <Tab
                key={index}
                _selected={activeTabStyle}
                _focus={{ boxShadow: 'none' }}
                sx={inactiveTabStyle}
                _hover={{ color: '#0C2115' }}
              >
                {tab}
              </Tab>
            ))}
          </TabList>
          <TabPanels height="100%">
            <TabPanel height="100%" overflowY="auto">
              <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} p={4} height="100%" overflowY="auto">
                <Box flexBasis={{ base: '100%', md: '50%' }} pr={{ md: 4 }} mb={8}>
                  <MyProfile />
                </Box>
                <Box flexBasis={{ base: '100%', md: '50%' }}>
                  <Stack spacing={4} mb="250px">
                    <Address />
                    <CompanyInfo />
                  </Stack>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel height="100%" overflowY="auto">
              <NavioComponent />
            </TabPanel>
            <TabPanel height="100%" overflowY="auto">
              <LeadStatusSettings />
            </TabPanel>
            <TabPanel height="100%" overflowY="auto">
              <LeadSourceComponent />
            </TabPanel>
            {tabNames.includes('Developer') && (
              <TabPanel height="100%" overflowY="auto">
                <DeveloperSettings />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Stack>
  );
};

export default Settings;
