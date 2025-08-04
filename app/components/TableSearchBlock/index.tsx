import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaFilter, FaUpload } from "react-icons/fa";

import { useLeads } from "@/app/contexts/LeadsContext";

import CreateLeadModal from "../CreateLeadModal";
import ErrorBoundary from "../ErrorBoundary";
import LeadsFilterDrawer from "../LeadsFilterDrawer";
import LeadsSearch from "../LeadsSearch";
import NewLeadButton from "../NewLeadButton";
import NewPolicyButton from "../NewPolicyButton";
import UploadLeadsModal from "../UploadLeadsModal";

import { Lead } from "@/types/databaseTypes";

interface TableSearchBlockProps {
  setLeads: (leads: Lead[]) => void;
  leads: Lead[];
  selectedLead: Lead | null;
  pageType: "leads" | "policies";
  savedFilterName?: string | null; // Make it optional
}

const TableSearchBlock: React.FC<TableSearchBlockProps> = ({
  setLeads,
  leads,
  selectedLead,
  pageType,
  savedFilterName,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();
  const {
    isOpen: isFilterDrawerOpen,
    onOpen: onFilterDrawerOpen,
    onClose: onFilterDrawerClose,
  } = useDisclosure();
  const [leadsSearching, setLeadsSearching] = useState(false);
  const { areFiltersApplied } = useLeads();

  return (
    <ErrorBoundary>
      <Flex
        id="table-search-block"
        width="100%"
        height="100%"
        bg="white"
        justifyContent="flex-start"
        alignItems="center"
        px={4}
        pb={2}
        borderBottom="1px"
        borderColor="#EAEAEA"
      >
        <Box id="leads-search-input" flex="1" height="100%">
          <LeadsSearch setIsLoading={setLeadsSearching} />
        </Box>
        <Box
          id="actions-block"
          flexShrink={0}
          height="100%"
          alignItems="center"
        >
          <Flex justifyContent="flex-end" alignItems="center" width="auto">
            <IconButton
              icon={<FaFilter />}
              variant="outline"
              aria-label="Filter leads"
              onClick={onFilterDrawerOpen}
              ml={2}
              borderColor={areFiltersApplied ? "blue.400" : "gray"}
              color={areFiltersApplied ? "blue.400" : "black"}
              bg={areFiltersApplied ? "purple.100" : "gray.100"}
              _hover={{ bg: "blue.100" }}
            />
            {areFiltersApplied && savedFilterName && (
              <Text mx={2} color="gray.600" fontWeight="bold">
                {savedFilterName}
              </Text>
            )}
            <Menu>
              <MenuButton as={Button} bg="#008D3F" color="#FFFFFF" ml={2}>
                Add
                <Box display={["none", "none", "inline-block"]}>
                  <ChevronDownIcon />
                </Box>
              </MenuButton>
              <MenuList zIndex={9999}>
                <MenuItem as="div">
                  {/* <MenuItem as="menu"> */}
                  {pageType === "leads"
                    ? (
                      <NewLeadButton
                        label="Lead"
                        colorScheme="gray"
                        variant="ghost"
                        width="100%"
                        justifyContent="flex-start"
                      />
                    )
                    : (
                      <NewPolicyButton
                        label="Policy"
                        colorScheme="gray"
                        variant="ghost"
                        width="100%"
                        justifyContent="flex-start"
                      />
                    )}
                </MenuItem>
                <MenuItem as="div">
                  <Button
                    leftIcon={<FaUpload />}
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Upload leads"
                    onClick={onUploadModalOpen}
                    justifyContent="flex-start"
                    width="100%"
                  >
                    CSV Upload
                  </Button>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Flex>
      <CreateLeadModal isOpen={isOpen} onClose={onClose} size="xl" />
      <UploadLeadsModal
        isOpen={isUploadModalOpen}
        onClose={onUploadModalClose}
      />
      <LeadsFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={onFilterDrawerClose}
      />
    </ErrorBoundary>
  );
};

TableSearchBlock.defaultProps = {
  savedFilterName: "",
};

export default TableSearchBlock;
