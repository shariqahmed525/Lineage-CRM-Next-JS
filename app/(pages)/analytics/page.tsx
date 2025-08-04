'use client';


import { EditIcon, AddIcon } from '@chakra-ui/icons';
import {
  Switch, Box, Text, SimpleGrid, Tabs, TabList, Tab, TabPanels, TabPanel, Grid, GridItem, Button, Stack, Table, Thead, Tbody, Tr, Th, Td, Select 
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie'; // Corrected import for ResponsivePie
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // Import useRouter, usePathname, and useSearchParams
import React, {
    useEffect, useState, useCallback, useMemo,
  } from 'react';

// Import the data viz components directly



const Analytics = () => {

    const [timePeriod, setTimePeriod] = useState('week');
    const [leadData, setLeadData] = useState([
        { period: 'Jan 2 - Jan 8', newLeads: 20, callingHours: 10, callsMade: 20, callsPerLead: 1.00, appointmentsSet: 11, appointmentsCompleted: 6, showPercentage: '54.55%' },
        { period: 'Jan 9 - Jan 15', newLeads: 7, callingHours: 7, callsMade: 30, callsPerLead: 1.00, appointmentsSet: 6, appointmentsCompleted: 6, showPercentage: '100.00%' },
        { period: 'Jan 16 - Jan 22', newLeads: 52, callingHours: 22, callsMade: 35, callsPerLead: 1.00, appointmentsSet: 21, appointmentsCompleted: 10, showPercentage: '47.62%' },
        { period: 'Jan 23 - Jan 29', newLeads: 13, callingHours: 15, callsMade: 14, callsPerLead: 1.00, appointmentsSet: 21, appointmentsCompleted: 11, showPercentage: '52.38%' },
        { period: 'Jan 30 - Feb 5', newLeads: 27, callingHours: 20, callsMade: 34, callsPerLead: 1.26, appointmentsSet: 22, appointmentsCompleted: 11, showPercentage: '50.00%' },
    ]);
    
    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
        // Update leadData based on the selected time period (week, month, year)
        // This is a placeholder for actual data fetching logic
    };

    // Fake data for the charts
    const netAPData = [
        { category: '2021', value: 50000 },
        { category: '2022', value: 60000 },
        { category: '2023', value: 70000 }
    ];

    const netCommissionData = [
        { category: '2021', value: 12000 },
        { category: '2022', value: 15000 },
        { category: '2023', value: 18000 }
    ];

    const onPaceData = [
        { category: 'Q1', value: 20000 },
        { category: 'Q2', value: 25000 },
        { category: 'Q3', value: 30000 },
        { category: 'Q4', value: 35000 }
    ];

    const avgCommissionRateData = [
        { category: '2021', value: 5 },
        { category: '2022', value: 5.5 },
        { category: '2023', value: 6 }
    ];

    const avgMonthlyPremiumData = [
        { category: 'Jan', value: 1000 },
        { category: 'Feb', value: 1100 },
        { category: 'Mar', value: 1200 }
    ];

    const replacedData = [
        { id: 'Replaced', value: 400, label: 'Replaced' },
        { id: 'Not Replaced', value: 600, label: 'Not Replaced' }
    ];

    return (
        <Stack height="100%" width="full" scrollBehavior="smooth" overflow="scroll">
            <Box borderWidth="1px" borderRadius="lg" p={4} m={4} boxShadow="md" height="auto">
                <Text fontSize="xl" mb={4}>Lead Statistics</Text>
                <Select value={timePeriod} onChange={handleTimePeriodChange} mb={4}>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </Select>
                <Box overflowX="auto">
                    <Table variant="simple" width="100%">
                        <Thead>
                            <Tr>
                                <Th width="20%"><Text fontSize={['xs', 'sm', 'sm']}>Time period</Text></Th> {/* Increased width of Time Period column */}
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>New Leads</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Calling Hours</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Calls Made</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Calls per Lead</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Phone Appointments Set</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Phone Appointments Completed</Text></Th>
                                <Th><Text fontSize={['xs', 'sm', 'sm']}>Show %</Text></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {leadData.map((data, index) => (
                                <Tr key={index}>
                                    <Td width="20%"><Text fontSize={['xs', 'sm', 'md']}>{data.period}</Text></Td> {/* Increased width of Time Period column */}
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.newLeads}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.callingHours}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.callsMade}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.callsPerLead}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.appointmentsSet}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.appointmentsCompleted}</Text></Td>
                                    <Td><Text fontSize={['xs', 'sm', 'md']}>{data.showPercentage}</Text></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Box>
            <Box p={4} height="100%">
                <SimpleGrid columns={{ sm: 1, md: 3, lg: 3 }} spacing={4}>
                <Box borderWidth="1px" borderRadius="lg" p={4} m={4} boxShadow="md" height="400px">
                <Text fontSize="xl" mb={4}>Set Your Goals</Text>
                <Stack spacing={4}>
                    {/* Input for Annual Premium Goal */}
                    <Box>
                        <Text fontSize="md" mb={2}>Annual Premium Goal (in dollars)</Text>
                        <input type="number" placeholder="Enter annual premium goal" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </Box>
                    {/* Input for Monthly Goal */}
                    <Box>
                        <Text fontSize="md" mb={2}>Monthly Goal (in dollars)</Text>
                        <input type="number" placeholder="Enter monthly goal" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </Box>
                    {/* Calculated field for Weekly Goal */}
                    <Box>
                        <Text fontSize="md" mb={2}>Weekly Goal (calculated based on 50 weeks/year)</Text>
                        <input type="number" placeholder="Weekly goal will be calculated" readOnly style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} />
                    </Box>
                </Stack>
            </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Annual Premium</Text>
                        <ResponsiveBar
                            data={netAPData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Net AP After Lost Business</Text>
                        <ResponsiveBar
                            data={netAPData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Net Commission - After Lost Business</Text>
                        <ResponsiveBar
                            data={netCommissionData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>On Pace</Text>
                        <ResponsiveBar
                            data={onPaceData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Average Commission Rate</Text>
                        <ResponsiveBar
                            data={avgCommissionRateData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Average Monthly Premium</Text>
                        <ResponsiveBar
                            data={avgMonthlyPremiumData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            keys={['value']}
                            indexBy="category"
                            padding={0.3}
                            colors="green"
                            enableLabel={false}
                        />
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" height="450px">
                        <Text fontSize="xl" mb={4}>Replaced vs. Not Replaced</Text>
                        <ResponsivePie
                            data={replacedData}
                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            colors={{ scheme: 'nivo' }}
                            borderWidth={1}
                            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        />
                    </Box>
                </SimpleGrid>
            </Box>
        </Stack>
    );
};

export default Analytics;
