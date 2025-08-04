import { EditIcon } from '@chakra-ui/icons';
import {
    Box, Tabs, TabList, Tab, useColorModeValue, TabPanels, TabPanel,

    Table, Thead, Tbody, Tr, Th, Td, IconButton, Tooltip,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import BusinessTable from '../BusinessTable';


{ /* Import necessary components and hooks */ }

// Your Tab component... with more color than a Springfield sunset!
const BusinessTabs = () => {
    // Define the active and inactive tab styles
    const activeTabStyle = {
        color: '#0C2115',
        borderColor: '#008D3F',
        borderBottom: '2px',
        borderBottomColor: '#008D3F',
    };

    const inactiveTabStyle = {
        color: '#A0A0A0',
    };

    // Let's add some Springfield spirit to these tabs
    return (
        <Box bg="white" p={4} boxShadow="md">
            <Tabs isFitted variant="unstyled">
                <TabList borderBottom="1px" borderColor="#E0E0E0">
                    {['My Business', '', '', '']?.map((tab, index) => (
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
                {/* Tab content panels */}
                <TabPanels>
                    <TabPanel>
                        {/* Render the BusinessTable component */}
                        <BusinessTable />
                    </TabPanel>
                    <TabPanel>
                        {/* Content for My Annual Goals */}
                    </TabPanel>
                    <TabPanel>
                        {/* Content for My Counties */}
                    </TabPanel>
                    <TabPanel>
                        {/* Content for Analytics */}
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default BusinessTabs;
