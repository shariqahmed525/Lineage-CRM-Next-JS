"use client";

import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import React, { useCallback, useEffect, useMemo, useState } from "react";

import LeadDetailDrawer from "@/app/components/LeadDetailDrawer";
import LeadsFilterStats from "@/app/components/LeadsFilterStats";
import LeadsTable from "@/app/components/LeadsTable";
import TableSearchBlock from "@/app/components/TableSearchBlock";
import { useLeads } from "@/app/contexts/LeadsContext";

import { useSatMigration } from "../hooks/useSatMigration";

const Leads = () => {
  const {
    filteredLeads,
    selectedLead,
    setFilteredLeads,
    setSelectedLead,
    getLeadById,
    savedFilterName,
  } = useLeads();
  const router = useRouter();

  const searchParams = useSearchParams();
  const isSatUser = useMemo(
    () => searchParams.get("is_from_sat"),
    [searchParams],
  );

  const [googleAppointments, setGoogleAppointments] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRunningMigrations, setIsRunningMigrations] = useState(false);

  // Access the leadId query parameter
  const leadIdFromQuery = searchParams.get("leadId"); // Use get method to access specific query parameter

  // run migration
  const { mutateAsync } = useSatMigration();

  useEffect(() => {
    if (isSatUser) {
      async function runMigration() {
        setIsRunningMigrations(true);
        await mutateAsync();
        setIsRunningMigrations(false);
        router.replace("/leads");
      }
      runMigration();
    }
  }, [isSatUser]);

  useEffect(() => {
    // Use getLeadById from LeadsContext to find the lead by ID
    if (leadIdFromQuery) {
      const lead = getLeadById(leadIdFromQuery);
      setSelectedLead(lead || null);
      setIsDrawerOpen(!!lead);
    } else {
      setSelectedLead(null);
      setIsDrawerOpen(false);
    }
  }, [leadIdFromQuery, getLeadById, setSelectedLead]);

  useEffect(() => {
    const fetchGoogleAppointments = async () => {
      try {
        const response = await fetch("/api/getGoogleAppointments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Google appointments");
        }
        const data = await response.json();
        setGoogleAppointments(data);
      } catch (error) {
        console.error("Error fetching Google appointments:", error);
      }
    };

    fetchGoogleAppointments();
  }, []);

  const handleRowClick = (lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLead(null);
  };

  return (
    <VStack
      spacing={0}
      position="absolute"
      align="stretch"
      height="full"
      width="full"
      scrollMarginTop="10%"
      pt={2}
    >
      <Box width="full">
        <TableSearchBlock
          leads={filteredLeads}
          setLeads={setFilteredLeads}
          selectedLead={selectedLead}
          pageType="leads"
          savedFilterName={savedFilterName}
        />
      </Box>
      <HStack
        minWidth="full"
        height="90%"
        bg="white"
        mt={2}
        w="full"
        overflowX="scroll"
      >
        <LeadsTable
          filteredLeads={filteredLeads}
          onRowClick={handleRowClick}
          isRunningMigrations={isRunningMigrations}
        />
        <Divider orientation="vertical" />
        <Box overflowX="auto" minWidth="20vw" mx={2} mt={4}>
          <LeadsFilterStats />
        </Box>
      </HStack>
      <LeadDetailDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </VStack>
  );
};

export default Leads;
