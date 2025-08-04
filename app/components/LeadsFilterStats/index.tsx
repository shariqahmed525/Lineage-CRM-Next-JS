import { Box, VStack } from "@chakra-ui/react";
import React from "react";

import LeadRollupCard from "@/app/components/LeadRollupCard";
import { useLeads } from "@/app/contexts/LeadsContext";

const LeadsFilterStats: React.FC = () => {
    const { filteredLeads } = useLeads();

    const statusCounts = filteredLeads.reduce((acc, lead) => {
        acc[lead.lead_status_id] = (acc[lead.lead_status_id] || 0) + 1;
        return acc;
    }, {});

    const sourceCounts = filteredLeads.reduce((acc, lead) => {
        acc[lead.lead_source_id] = (acc[lead.lead_source_id] || 0) + 1;
        return acc;
    }, {});

    const statusCountsArray = Object.entries(statusCounts).map((
        [label, count],
    ) => ({ label, count }));
    const sourceCountsArray = Object.entries(sourceCounts).map((
        [label, count],
    ) => ({ label, count }));

    return (
        <Box
            minHeight="90vh"
            position="relative"
            display="flex"
            justifyContent="center"
        >
            <VStack spacing={4} width="full">
                <LeadRollupCard
                    title="Status Counts"
                    counts={statusCountsArray}
                />
                <LeadRollupCard
                    title="Source Counts"
                    counts={sourceCountsArray}
                />
            </VStack>
        </Box>
    );
};

export default LeadsFilterStats;
