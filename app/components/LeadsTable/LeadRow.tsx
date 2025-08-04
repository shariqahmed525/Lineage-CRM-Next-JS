import { Box, Checkbox, Container, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

import { useData } from "@/app/contexts/DataFetchContext";

import { COLUMNS } from "../../../utils/constants";
import LeadMapLinkButton from "../LeadMapLinkButton";
import LeadSourceIcon from "../LeadSourceIcon";
import LeadStatusBadge from "../LeadStatusBadge";

interface LeadRowProps {
  lead: any;
  style: any;
  onRowClick: (lead: any) => void;
  isSelected: boolean;
  handleSelect: (leadId: string) => void;
}

const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  style,
  onRowClick,
  isSelected,
  handleSelect,
}) => {
  const { leadStatuses, setLeadStatuses, counties, leadSources } = useData();
  const router = useRouter();

  const handleRowClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation(); // Stop event from propagating to parent elements
      onRowClick(lead); // Call the onRowClick prop with the lead data
      router.push(`/leads?leadId=${lead?.id}`, { shallow: true });
      // Correctly update the query string with the leadId
      // onRowClick(lead);
      // router.push(`/leads?leadId=${lead?.id}`);
    },
    [lead, onRowClick, router],
  );

  const handleStatusUpdated = useCallback(
    (leadId: string, newStatusId: string) => {
      setLeadStatuses((prevStatuses: any[]) =>
        prevStatuses.map((status: any) =>
          status.lead_id === leadId
            ? { ...status, lead_status_id: newStatusId }
            : status
        )
      );
    },
    [setLeadStatuses],
  );

  return (
    <Box>
      <Box style={style} alignContent="end">
        <Checkbox
          isChecked={isSelected}
          onChange={(event) => {
            handleSelect(lead.id);
          }}
          _hover={{ bg: "blue.100", cursor: "pointer" }}
          size="lg"
          ml={4}
          zIndex={2}
        />
      </Box>
      <Flex
        my={6}
        style={{ ...style, borderBottom: "1px solid #E2E8F0" }}
        onClick={handleRowClick}
        _hover={{ bg: "lightgreen", cursor: "pointer" }}
        py={2}
        minWidth="1040px"
        zIndex={1}
        alignItems="center"
        bg={isSelected ? "green" : "white"}
        color={isSelected ? "slate" : "black"}
        borderLeft={isSelected ? "4px solid blue" : "none"}
      >
        <Box
          flex={1}
          minWidth={COLUMNS.person}
          textAlign="center"
          mr={1}
          onClick={handleRowClick}
        >
          {lead?.persons?.map((person: any, index: number) => (
            <Text
              key={`person-${person?.id || index}`}
              display="block"
              onClick={handleRowClick}
            >
              {`${person?.first_name} ${person?.last_name}`}
            </Text>
          ))}
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.status}
          textAlign="center"
          mx={1}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          <LeadStatusBadge
            leadId={lead?.id}
            currentStatusId={lead?.lead_status_id}
            leadStatuses={leadStatuses}
            onStatusUpdated={handleStatusUpdated}
            setLeadStatuses={setLeadStatuses}
          />
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.source}
          textAlign="center"
          px={1}
          onClick={handleRowClick}
        >
          <LeadSourceIcon
            leadSourceId={lead?.lead_source_id}
            leadSources={leadSources}
          />
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.city}
          textAlign="center"
          px={1}
          onClick={handleRowClick}
        >
          {lead?.leads_locations?.[0]?.locations?.city}
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.state}
          textAlign="center"
          px={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleRowClick}
        >
          {lead?.leads_locations?.[0]?.locations?.state_code}
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.county}
          textAlign="center"
          px={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleRowClick}
        >
          {lead?.leads_locations?.[0]?.locations?.county}
        </Box>
        <Box
          flex={1}
          minWidth={COLUMNS.date}
          textAlign="center"
          px={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleRowClick}
        >
          {new Date(lead?.record_day).toLocaleDateString()}
        </Box>
        <Box
          minWidth={COLUMNS.actions}
          flex={1}
          px={1}
          textAlign="center"
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          <LeadMapLinkButton lead={lead} width="100px" height="75px" />
        </Box>
      </Flex>
    </Box>
  );
};

export default LeadRow;

