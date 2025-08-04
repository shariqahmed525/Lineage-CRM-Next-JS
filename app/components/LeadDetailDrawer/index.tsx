// app/components/LeadDetailDrawer/index.tsx
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";

import { useData } from "@/app/contexts/DataFetchContext";
import { useLeads } from "@/app/contexts/LeadsContext";

import ErrorBoundary from "../ErrorBoundary"; // Adjust the import path as necessary
import LeadActivity from "../LeadActivity"; // Import the new LeadActivity component
import LeadDetail from "../LeadDetail"; // Import the new LeadDetail component
import LeadPoliciesCard from "../LeadPoliciesCard";

interface LeadDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = (
  { isOpen, onClose },
) => {
  const {
    fetchSelectedLeadActivities,
    selectedLead,
    incrementSelectedLead,
    decrementSelectedLead,
  } = useLeads();

  const handleDecrement = useCallback(() => {
    decrementSelectedLead();
    fetchSelectedLeadActivities();
  }, [decrementSelectedLead, fetchSelectedLeadActivities]);

  const handleIncrement = useCallback(() => {
    incrementSelectedLead();
    fetchSelectedLeadActivities();
  }, [incrementSelectedLead, fetchSelectedLeadActivities]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={handleClose} size="full">
      <DrawerContent>
        <DrawerHeader width="100%">
          <Flex
            position="relative"
            justifyContent="space-between"
            alignItems="center"
            width="full"
          >
            <Stack
              direction={{ base: "row", md: "row" }}
              justifyContent="flex-start"
              alignItems="center"
              width="full"
              spacing={2}
            >
              <HStack spacing={2}>
                <IconButton
                  aria-label="Previous lead"
                  icon={<ChevronLeftIcon boxSize="24px" color="#B0B0B0" />}
                  variant="outline"
                  borderColor="#EAEAEA"
                  onClick={handleDecrement}
                />
                <IconButton
                  aria-label="Next lead"
                  icon={<ChevronRightIcon boxSize="24px" color="#B0B0B0" />}
                  variant="outline"
                  borderColor="#EAEAEA"
                  onClick={handleIncrement}
                />
              </HStack>
              <Box flex="1" minWidth="0" display="flex" alignItems="flex-start">
                <Text
                  textAlign="left"
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  fontWeight="bold"
                  noOfLines={1}
                  isTruncated
                >
                  {selectedLead?.persons?.[0]?.first_name || ""}{" "}
                  {selectedLead?.persons?.[0]?.last_name || ""}
                </Text>
              </Box>
            </Stack>
            <IconButton
              aria-label="Close drawer"
              icon={<CloseIcon />}
              onClick={handleClose}
              position="absolute"
              right="0"
            />
          </Flex>
        </DrawerHeader>
        <DrawerBody height="full" overflowY="auto">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={4}
            paddingTop="25px"
          >
            <Box flex={1} overflow="hidden">
              <LeadDetail
                lead={selectedLead}
                updateRefreshActivities={() => {}}
              />
            </Box>
            <Stack
              direction="column"
              pb="0.5rem"
              align="stretch"
              flex={1}
              overflow="hidden"
              height="100%"
            >
              <Box flex={1} overflowY="auto">
                <LeadPoliciesCard />
              </Box>
              <Box flex={1}>
                {selectedLead && (
                  <LeadActivity
                    key={selectedLead?.id}
                    leadId={selectedLead?.id}
                    drawerIsOpen={isOpen}
                  />
                )}
              </Box>
            </Stack>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const LeadDetailDrawerWithErrorBoundary: React.FC<LeadDetailDrawerProps> = (
  props,
) => (
  <ErrorBoundary>
    <LeadDetailDrawer {...props} />
  </ErrorBoundary>
);

export default React.memo(LeadDetailDrawerWithErrorBoundary);
