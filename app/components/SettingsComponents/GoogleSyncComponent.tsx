'use client';

import { EditIcon, AddIcon } from '@chakra-ui/icons';
import {
    Switch, Box, Text, Tabs, TabList, Tab, useColorModeValue, TabPanels, TabPanel, Grid, GridItem, FormControl, FormLabel, Input, Avatar, Button, Stack, Icon, Flex, Circle,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState, lazy, Suspense } from 'react';
import { MdOutlineGifBox } from 'react-icons/md';

import LeadStatusSettings from '../LeadStatusSettings';

// Lazy load the components
const MyProfile = lazy(() => import('./MyProfile'));
const Address = lazy(() => import('./Address'));
const CompanyInfo = lazy(() => import('./CompanyInfo'));
const GoogleSyncComponent = lazy(() => import('./GoogleSyncComponent'));
const LeadSourceComponent = lazy(() => import('./LeadSourceComponent'));
const CallerAccessComponent = lazy(() => import('./CallerAccessComponent'));
const NavioComponent = lazy(() => import('./NavioComponent'));
const NavioComponent2 = lazy(() => import('./NavioComponent2'));
const MyVoiceNumbersComponent = lazy(() => import('./MyVoiceNumbersComponent'));
const MyCallbackNumberComponent = lazy(() => import('./MyCallbackNumberComponent'));

export default function Settings() {
    const tabNames = ['General', 'Navio', 'Google Sync', 'Billing', 'Tags', 'Lead Status', 'Lead Source', 'Caller Access'];

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
        <Stack width="full" p={8}>
            <Box>
                <Tabs isFitted variant="unstyled">
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
                    <TabPanels>
                        <TabPanel id="General">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={8}>
                                    <GridItem>
                                        <MyProfile />
                                    </GridItem>
                                    <GridItem>
                                        <Address />
                                        <CompanyInfo />
                                    </GridItem>
                                </Grid>
                            </Suspense>
                        </TabPanel>
                        <TabPanel id="Navio">
                            <Suspense fallback={<div>Loading...</div>}>
                                <NavioComponent />
                                <NavioComponent2 />
                                <MyVoiceNumbersComponent />
                                <MyCallbackNumberComponent />
                            </Suspense>
                        </TabPanel>
                        <TabPanel id="Google Sync">
                            <Suspense fallback={<div>Loading...</div>}>
                                <GoogleSyncComponent
                                    header="Log in with Google"
                                    detailText="Sign into Linage with 1-click"
                                    isSignedIn={false}
                                />
                                <GoogleSyncComponent
                                    header="Connect to Google Calendar"
                                    detailText="To get started, allow access to your Google Calendar account. Then automatically return to this page"
                                    isSignedIn={false}
                                />
                            </Suspense>
                        </TabPanel>
                        <TabPanel id="Billing">
                            {/* Content for Billing Settings */}
                        </TabPanel>
                        <TabPanel id="Tags">
                            {/* Content for Tags Settings */}
                        </TabPanel>
                        <TabPanel id="Lead Status">
                            <Suspense fallback={<div>Loading...</div>}>
                                <LeadStatusSettings />
                            </Suspense>
                        </TabPanel>
                        <TabPanel id="Caller Access">
                            <Suspense fallback={<div>Loading...</div>}>
                                <CallerAccessComponent />
                            </Suspense>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Stack>
    );
}
