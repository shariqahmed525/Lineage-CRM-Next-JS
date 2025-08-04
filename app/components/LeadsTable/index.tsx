import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

import { useData } from "@/app/contexts/DataFetchContext";
import { useLeads } from "@/app/contexts/LeadsContext";
import { COLUMNS, STATES } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";

import LeadRow from "./LeadRow";

interface Person {
  last_name: string;
  // Add other fields as necessary
}

interface Location {
  city: string;
  state_code: string;
  county: string; // Updated to reflect the new county field
}

interface LeadsLocation {
  locations: Location;
}

interface Lead {
  id: string;
  persons: Person[];
  lead_status_id: string;
  lead_source_id: string;
  date_received: string;
  created_at: string;
  record_day: string; // Added record_day property
  location: {
    city: string;
    state_name: string;
    county: string; // Updated to reflect the new county field
    location_id: string;
  };
  leads_locations?: LeadsLocation[]; // Added this line
}

interface LeadsTableProps {
  isRunningMigrations: boolean;
  filteredLeads: Lead[];
  onRowClick: (lead: Lead) => void;
}

const StickyListContext = createContext<any>(null);
StickyListContext.displayName = "StickyListContext";

interface InnerElementProps {
  children: ReactNode;
  [key: string]: any;
}

const ItemWrapper = ({ data, index, style }) => {
  const {
    ItemRenderer,
    stickyIndices,
    leads,
    onRowClick,
    selectedLeads,
    handleSelect,
  } = data;
  console.log(`Rendering item at index ${index}:`, leads[index]);
  if (stickyIndices && stickyIndices.includes(index)) {
    return null;
  }

  const lead = leads[index];
  const isSelected = selectedLeads.includes(lead.id);

  return (
    <ItemRenderer
      lead={lead}
      style={style}
      onRowClick={onRowClick}
      isSelected={isSelected}
      handleSelect={handleSelect}
    />
  );
};

const innerElementType = forwardRef<HTMLDivElement, InnerElementProps>(
  ({ children, ...rest }, ref) => (
    <StickyListContext.Consumer>
      {({ stickyIndices, handleSort, sortConfig }) => (
        <div ref={ref} {...rest}>
          <Flex
            zIndex={4}
            borderBottom="1px solid #EAEAEA"
            minWidth="1040px"
            bg="white"
            position="sticky"
            top={0}
            pb={2}
          >
            <Heading
              flex={1}
              minWidth={COLUMNS.person}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("persons")}
              pb={1}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              People
              {sortConfig.key === "persons" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.status}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("lead_status_id")}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              Status
              {sortConfig.key === "lead_status_id" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.source}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("lead_source_id")}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              Source
              {sortConfig.key === "lead_source_id" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.city}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("city")}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              City
              {sortConfig.key === "city" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.state}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("state_code")}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              State
              {sortConfig.key === "state_code" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.county}
              textAlign="center"
              size="sm"
              onClick={() => handleSort('county')}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              County
              {sortConfig.key === 'county' && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.date}
              textAlign="center"
              size="sm"
              onClick={() => handleSort("date_received")}
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              Date
              {sortConfig.key === "date_received" && sortConfig.direction && (
                <Icon
                  as={sortConfig.direction === "asc"
                    ? ChevronUpIcon
                    : ChevronDownIcon}
                  pb={1}
                  ml={2}
                  color="gray.400"
                  boxSize={6}
                />
              )}
            </Heading>
            <Heading
              flex={1}
              minWidth={COLUMNS.actions}
              textAlign="center"
              size="sm"
              sx={{
                cursor: "pointer",
                _hover: {
                  bg: "lightblue",
                  borderRadius: "4px",
                },
              }}
            >
              Map
            </Heading>
          </Flex>
          {children}
        </div>
      )}
    </StickyListContext.Consumer>
  ),
);

const ItemRenderer = ({
  lead,
  style,
  onRowClick,
  isSelected,
  handleSelect,
}) => (
  <LeadRow
    lead={lead}
    style={style}
    onRowClick={onRowClick}
    isSelected={isSelected}
    handleSelect={handleSelect}
  />
);

const LeadsTable: React.FC<LeadsTableProps> = ({
  isRunningMigrations,
  filteredLeads,
  onRowClick,
}) => {
  const { isLoading, locations, getLeadById, counties } = useData();
  const { sortConfig, setSortConfig, refreshLeads } = useLeads(); // Use filteredLeads and sortConfig from context
  const router = useRouter(); // Initialize useRouter

  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key) {
        if (sortConfig.direction === "asc") {
          direction = "desc";
        } else if (sortConfig.direction === "desc") {
          direction = "";
        }
      } else {
        direction = "asc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig.key, sortConfig.direction, setSortConfig],
  ); // Added setSortConfig to the dependency array

  const sortedLeads = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction || !locations) {
      return filteredLeads;
    }
    const sorted = [...filteredLeads].sort((a, b) => {
      const { key } = sortConfig;
      const direction = sortConfig.direction === "asc" ? 1 : -1;

      if (key === "lead_status_id") {
        const aStatus = a.lead_status_id || "";
        const bStatus = b.lead_status_id || "";
        return aStatus.localeCompare(bStatus) * direction;
      }
      if (key === "city") {
        const aCity = a.leads_locations?.[0]?.locations?.city || "";
        const bCity = b.leads_locations?.[0]?.locations?.city || "";
        return aCity.localeCompare(bCity) * direction;
      }
      if (key === "state_code") {
        const aState = a.leads_locations?.[0]?.locations?.state_code || "";
        const bState = b.leads_locations?.[0]?.locations?.state_code || "";
        return aState.localeCompare(bState) * direction;
      }
      if (key === 'county') {
        const aCounty = a.leads_locations?.[0]?.locations?.county || '';
        const bCounty = b.leads_locations?.[0]?.locations?.county || '';
        return aCounty.localeCompare(bCounty) * direction;
      }
      if (key === "persons") {
        const aLastName = a.persons[0]?.last_name || "";
        const bLastName = b.persons[0]?.last_name || "";
        return aLastName.localeCompare(bLastName) * direction;
      }
      if (key === "date_received") {
        const dateA = new Date(a.record_day).getTime();
        const dateB = new Date(b.record_day).getTime();
        return (dateA - dateB) * direction;
      }
      return 0;
    });
    return sorted;
  }, [filteredLeads, sortConfig, locations, counties]);

  const contextValue = useMemo(
    () => ({
      stickyIndices: [0],
      handleSort,
      sortConfig,
    }),
    [handleSort, sortConfig],
  );

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [leadSources, setLeadSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newStateCode, setNewStateCode] = useState("");
  const [newCounty, setNewCounty] = useState(""); // Added newCounty state
  const [newDate, setNewDate] = useState(""); // Added newDate state
  const [isActionsAccordionOpen, setIsActionsAccordionOpen] = useState(false); // New state for Actions accordion
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false); // New state for "select all" checkbox

  const handleSelect = useCallback(
    (leadId: string) => {
      const newSelectedLeads = [...selectedLeads];
      const index = newSelectedLeads.indexOf(leadId);
      if (index === -1) {
        newSelectedLeads.push(leadId);
      } else {
        newSelectedLeads.splice(index, 1);
      }
      setSelectedLeads(newSelectedLeads);
      setIsActionsAccordionOpen(newSelectedLeads.length > 0); // Show/hide Actions accordion
    },
    [selectedLeads],
  );

  const handleSelectAll = useCallback(() => {
    if (isSelectAllChecked) {
      setSelectedLeads([]);
      setIsActionsAccordionOpen(false); // Close Actions accordion
    } else {
      const allLeadIds = filteredLeads.map((lead) => lead.id);
      setSelectedLeads(allLeadIds);
      setIsActionsAccordionOpen(true); // Show Actions accordion
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  }, [filteredLeads, isSelectAllChecked]);

  const handleBulkEdit = useCallback(() => {
    setIsBulkEditOpen(true);
  }, []);

  const toast = useToast(); // Initialize the toast

  const handleDeleteSelected = useCallback(async () => {
    const supabase = createClient(); // Initialize Supabase client
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .in("id", selectedLeads);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Lead successfully deleted!",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
        position: "top",
        bg: "yellow.400", // Set the background color to yellow
      });

      // Refresh the leads list
      await refreshLeads();

      // Optionally, clear the selected leads
      setSelectedLeads([]);
    } catch (error) {
      toast({
        title: "Error Deleting Lead, Lead Not Removed",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "subtle",
        position: "top",
        bg: "red.400", // Set the background color to red
      });
    } finally {
      setIsDeletePopoverOpen(false); // Close the popover
      setIsActionsAccordionOpen(false); // Close Actions accordion
    }
  }, [selectedLeads, toast, refreshLeads]);

  useEffect(() => {
    // Fetch statuses from the API
    const fetchStatuses = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("lead_statuses").select("*");
      if (error) {
        toast({
          title: "Error fetching statuses",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setStatuses(data);
      }
    };
    fetchStatuses();
  }, [toast]);

  useEffect(() => {
    // Fetch lead sources from the API
    const fetchLeadSources = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("lead_sources").select("*");
      if (error) {
        toast({
          title: "Error fetching lead sources",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setLeadSources(data);
      }
    };
    fetchLeadSources();
  }, [toast]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handleCityChange = (event) => {
    setNewCity(event.target.value);
  };

  const handleCountyChange = (event) => {
    setNewCounty(event.target.value);
  };

  const handleConfirmEdits = async () => {
    const supabase = createClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser(); // Retrieve the user

      const updates = {
        lead_status_id: selectedStatus,
        lead_source_id: selectedSource,
        record_day: newDate, // Add newDate to the updates
      };

      const { error: leadError } = await supabase
        .from("leads")
        .update(updates)
        .in("id", selectedLeads);

      if (leadError) {
        throw new Error(leadError.message);
      }

      if (newCity || newStateCode || newCounty) {
        // Fetch location_ids for the selected leads
        const { data: leadLocations, error: leadLocationsError } =
          await supabase
            .from("leads_locations")
            .select("location_id")
            .in("lead_id", selectedLeads);

        if (leadLocationsError) {
          throw new Error(leadLocationsError.message);
        }

        const locationIds = leadLocations.map(
          (leadLocation) => leadLocation.location_id,
        );

        const { data: countiesData, error: countiesError } = await supabase
          .from("counties")
          .select("*")
          .eq("county_name", newCounty);

        if (countiesError) throw new Error(countiesError.message);

        if (countiesData.length === 0) {
          toast({
            title:
              "County not found, please check name and spelling (i.e. Nez Perce)",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
            bg: "yellow.400",
          });
          return; // Stop the form submission if county is not found
        }
        const county = countiesData[0];
        const locationUpdates = locationIds.map((locationId) => ({
          location_id: locationId,
          user_id: user?.id, // Use the retrieved user_id
          ...(newCity && { city: newCity }),
          ...(newStateCode && { state_code: county.state_name }), // Use state_name from county data
          county_id: county.county_id, // Add county_id to the updates
        }));

        const { error: locationError } = await supabase
          .from("locations")
          .upsert(locationUpdates);

        if (locationError) {
          throw new Error(locationError.message);
        }
      }

      toast({
        title: "Leads successfully updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      await refreshLeads();
      setSelectedLeads([]);
      setIsBulkEditOpen(false);
      setIsActionsAccordionOpen(false); // Close Actions accordion
    } catch (error) {
      toast({
        title: "Error updating leads",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewLeadLocations = () => {
    const selectedPersons = selectedLeads
      .map((leadId) => {
        const lead = filteredLeads.find((lead) => lead.id === leadId);
        return lead?.persons?.[0]?.person_id;
      })
      .filter(Boolean);

    router.push(`/map?persons=${selectedPersons.join(",")}`);
  };

  if (isLoading) {
    return (
      <Flex
        id="leads-table-container"
        width="full"
        height="calc(100vh - 100px)"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner color="green.500" size="xl" />
        <Text mt={4} mx={4}>
          Hang tight, we are gathering your leads.
        </Text>
      </Flex>
    );
  }

  if (isRunningMigrations) {
    return (
      <Flex
        id="leads-table-container"
        width="full"
        height="calc(100vh - 100px)"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner color="green.500" size="xl" />
        <Text mt={4} mx={4}>
          Please wait while we migrate your leads. This may take a few minutes.
        </Text>
      </Flex>
    );
  }

  return (
    <Box width="full" height="full" overflowX="scroll" position="relative">
      {isActionsAccordionOpen && (
        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Actions
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="row" justifyContent="space-between">
                <Popover>
                  <PopoverTrigger>
                    <Button
                      colorScheme="blue"
                      onClick={() => setIsBulkEditOpen(true)}
                    >
                      Bulk Edit
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverCloseButton />
                    <PopoverHeader>Bulk Edit Leads</PopoverHeader>
                    <PopoverBody>
                      <Button
                        colorScheme="blue"
                        onClick={() => setIsBulkEditOpen(true)}
                      >
                        Open Bulk Edit Modal
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>

                <Popover
                  isOpen={isDeletePopoverOpen}
                  onClose={() => setIsDeletePopoverOpen(false)}
                >
                  <PopoverTrigger>
                    <Button
                      colorScheme="red"
                      onClick={() => setIsDeletePopoverOpen(true)}
                    >
                      Delete Selected
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>Confirm Deletion</PopoverHeader>
                    <PopoverCloseButton />
                    <PopoverBody>
                      Are you sure you want to delete the selected leads?
                    </PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-end">
                      <Button
                        variant="outline"
                        mr={3}
                        onClick={() => setIsDeletePopoverOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button colorScheme="red" onClick={handleDeleteSelected}>
                        Delete
                      </Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>

                <Button colorScheme="teal" onClick={handleViewLeadLocations}>
                  View Lead Locations
                </Button>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
      <Tooltip
        _hover={{ cursor: "pointer" }}
        label="Select All"
        aria-label="Select all tooltip"
        placement="start"
      >
        <Box position="relative" top={5} zIndex={999}>
          <Checkbox
            isChecked={isSelectAllChecked}
            onChange={handleSelectAll}
            ml={4}
            size="lg"
          />
        </Box>
      </Tooltip>
      <AutoSizer>
        {({ height, width }) => (
          <StickyListContext.Provider value={contextValue}>
            {sortedLeads?.length > 0
              ? (
                <List
                  height={height}
                  itemCount={sortedLeads?.length}
                  itemSize={75}
                  width={width}
                  innerElementType={innerElementType}
                  itemData={{
                    ItemRenderer, // Use the moved ItemRenderer here
                    stickyIndices: [],
                    leads: sortedLeads,
                    onRowClick, // Pass onRowClick as part of itemData
                    selectedLeads,
                    handleSelect,
                  }}
                >
                  {ItemWrapper}
                </List>
              )
              : null}
          </StickyListContext.Provider>
        )}
      </AutoSizer>
      {selectedLeads.length > 0 && (
        <Modal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bulk Edit Leads</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel fontSize="sm">Edit Status</FormLabel>
              <Select
                bg={statuses.find((status) =>
                  status.status_id === selectedStatus
                )
                  ?.badge_color_hexcode || "white"}
                placeholder="Select status..."
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.status_name}
                  </option>
                ))}
              </Select>
              <FormLabel fontSize="sm" mt={4}>
                Edit Source
              </FormLabel>
              <Select
                placeholder="Select source..."
                value={selectedSource}
                onChange={handleSourceChange}
              >
                {leadSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </Select>
              <FormLabel fontSize="sm" mt={4}>
                Edit City
              </FormLabel>
              <Input
                placeholder="Enter city name..."
                value={newCity}
                onChange={handleCityChange}
              />
              <FormLabel fontSize="sm" mt={4}>
                Edit State
              </FormLabel>
              <Select
                placeholder="Select state..."
                value={newStateCode}
                onChange={(e) => setNewStateCode(e.target.value)}
              >
                {STATES.map((state, index) => (
                  <option key={index} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </Select>
              <FormLabel fontSize="sm" mt={4}>
                Edit County
              </FormLabel>
              <Input
                placeholder="Enter county name..."
                value={newCounty}
                onChange={handleCountyChange}
              />
              <FormLabel fontSize="sm" mt={4}>
                Edit Date Recorded
              </FormLabel>
              <Input
                placeholder={new Date().toISOString().split("T")[0]}
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={() => setIsBulkEditOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmEdits}>
                Confirm Edits
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default React.memo(LeadsTable);
