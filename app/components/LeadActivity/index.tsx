import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import groupBy from "lodash/groupBy";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useData } from "@/app/contexts/DataFetchContext";
import { useLeads } from "@/app/contexts/LeadsContext";

import ChangeLeadStatusActivity from "./ChangeLeadStatusActivity";
import CreateNoteActivity from "./CreateNoteActivity";
import { Tables } from "../../../types/types";
import ExplanationTooltip from "../ExplanationTooltip"; // Assuming this component exists

interface LeadActivityProps {
  leadId: string;
  drawerIsOpen: boolean;
}

const LeadActivity: React.FC<LeadActivityProps> = ({
  drawerIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const {
    leadStatuses,
  } = useData();
  const { selectedLead, selectedLeadActivities, fetchSelectedLeadActivities } =
    useLeads();
  const toast = useToast();

  const [note, setNote] = useState("");
  const [noteTemplates, setNoteTemplates] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (drawerIsOpen) {
      setLoading(true);
      fetchSelectedLeadActivities().finally(() => {
        setLoading(false);
        setInitialLoadComplete(true);
      });
      fetchNoteTemplates();
    }
  }, [drawerIsOpen, fetchSelectedLeadActivities]);

  const fetchNoteTemplates = useCallback(async () => {
    try {
      const response = await fetch("/api/getNoteTemplates");
      if (!response.ok) {
        throw new Error("Failed to fetch note templates");
      }
      const data = await response.json();
      setNoteTemplates(data.map((template: { note: string }) => template.note));
    } catch (error) {
      console.error("Error fetching note templates:", error);
    }
  }, []);

  const addNote = useCallback(async () => {
    if (note.trim() === "") return;
    try {
      const response = await fetch("/api/createNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: selectedLead?.id,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      // const noteData = await response.json();

      // Create activity linked to the note
      // const activityResponse = await fetch("/api/createActivity", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     leadId: selectedLead?.id,
      //     actionType: "Create Note",
      //     activityMetadata: { note_id: noteData.note_id },
      //   }),
      // });

      // if (!activityResponse.ok) {
      //   throw new Error("Failed to create activity");
      // }

      // setNote("");
      fetchSelectedLeadActivities();
      toast({
        title: "New Activity Noted!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Failed to Create Activity",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [note, selectedLead?.id, fetchSelectedLeadActivities, toast]);

  const storeNoteAsTemplate = useCallback(async () => {
    if (note.trim() === "") return;
    try {
      const response = await fetch("/api/createNoteTemplate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedLead?.id, note }),
      });
      if (!response.ok) {
        throw new Error("Failed to store note as template");
      }
      toast({
        title: "Success",
        description: "Note Successfully Saved as Template!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Note template stored successfully");
      fetchNoteTemplates(); // Fetch the updated templates
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to Save Note for Template.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error storing note as template:", error);
    }
  }, [note, selectedLead?.id, toast, fetchNoteTemplates]);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      const response = await fetch(`/api/deleteNote?noteId=${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete note");
      }
      fetchSelectedLeadActivities();
      toast({
        title: "Success",
        description: "Note deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to delete note",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error deleting note:", error);
    }
  }, [fetchSelectedLeadActivities, toast]);

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      const response = await fetch(
        `/api/deleteActivity/?activityId=${activityId}&leadId=${selectedLead?.id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }
      fetchSelectedLeadActivities();
      toast({
        title: "Success",
        description: "Activity deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to delete activity",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error deleting activity:", error);
    }
  }, [fetchSelectedLeadActivities, toast, selectedLead?.id]);

  const handleDeleteClick = (noteId: string) => {
    setActivityToDelete(noteId);
    onOpen();
  };

  const confirmDelete = async () => {
    if (activityToDelete) {
      await deleteActivity(activityToDelete);
      onClose();
    }
  };

  const renderActivityComponent = useCallback(
    (activity: Tables<"activity">, index: number) => {
      let ActivityComponent;
      switch (activity.action_type) {
        case "Create Note":
          ActivityComponent = CreateNoteActivity;
          break;
        case "Change Lead Status":
          ActivityComponent = ChangeLeadStatusActivity;
          break;
        default:
          return null;
      }

      return (
        <Box
          key={activity.activity_id}
          position="relative"
          _hover={{ ".menu-button": { display: "block" } }}
        >
          <HStack zIndex={999}>
            <ActivityComponent
              activity={activity}
              leadStatuses={leadStatuses}
              ref={(el) => {
                if (el && el instanceof HTMLDivElement) {
                  circleRefs.current[index] = el;
                }
              }}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<EllipsisVerticalIcon />}
                variant="ghost"
                size="sm"
                color="gray"
                className="menu-button"
                display="none"
              />
              <MenuList>
                <MenuItem
                  icon={<DeleteIcon />}
                  onClick={() =>
                    handleDeleteClick(activity.activity_metadata.note_id)}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Box>
      );
    },
    [leadStatuses, deleteActivity],
  );

  const renderQuickNote = () => (
    <Box position="relative">
      <CreateNoteActivity
        activity={{
          action_type: "Create Note",
          activity_metadata: { note: selectedLead?.quick_note },
          action_date: new Date().toISOString(),
        }}
      />
    </Box>
  );

  const groupedActivities = useMemo(
    () =>
      groupBy(
        selectedLeadActivities,
        (activity) => format(new Date(activity.action_date), "yyyy-MM-dd"),
      ),
    [selectedLeadActivities],
  );

  const renderActivitiesByDate = () =>
    Object.entries(groupedActivities)?.map((
      [date, activitiesForDate],
      dateIndex,
    ) => (
      <VStack
        key={date}
        spacing={4}
        align="stretch"
        position="relative"
        w="full"
      >
        <Text>{format(new Date(date), "MMM dd, yyyy")}</Text>
        {activitiesForDate?.map((activity, index) => (
          <Box
            key={activity.activity_id}
            position="relative"
            sx={{
              _before: index !== 0
                ? {
                  content: '""',
                  position: "absolute",
                  top: "-20px",
                  left: "20px",
                  transform: "translateX(-50%)",
                  width: "2px",
                  height: "calc(100% + 20px)",
                  bgColor: "gray.200",
                  zIndex: "0",
                }
                : {},
            }}
          >
            {renderActivityComponent(activity, index)}
          </Box>
        ))}
      </VStack>
    ));

  const predefinedNotes = [
    "Quicknotes to Capture",
    "Left a Message",
    "Didn't Answer",
  ];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNote(event.target.value);
    event.target.selectedIndex = 0; // Reset the dropdown to the default state
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <>
      <Card h="100%" border="1px" borderColor="#EAEAEA" overflow="auto">
        <CardHeader>
          <Heading p={0} margin={0} size="sm">
            Lead Activity
          </Heading>
        </CardHeader>
        <CardBody paddingTop={0} h="100%">
          {loading && !initialLoadComplete
            ? ( // Conditionally render "Loading..."
              <Text>Loading...</Text>
            )
            : (
              <VStack height="100%" spacing={8} align="stretch" w="full">
                {selectedLead?.quick_note && renderQuickNote()}
                {renderActivitiesByDate()}
              </VStack>
            )}
          <Divider my={4} />
          <Flex
            direction="column"
            h="20%"
            position="sticky"
            bottom={0}
            bg="white"
            zIndex="sticky"
          >
            <Stack flex={2}>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type a note..."
                resize="none"
                flexGrow={1}
                p={4}
                border="1px"
              />
              <HStack spacing={2} align="stretch" w="full">
                <Select
                  size="md"
                  placeholder="Select a note template"
                  onChange={handleSelectChange}
                  mb={2}
                >
                  {predefinedNotes.concat(noteTemplates).map((
                    noteOption,
                    index,
                  ) => (
                    <option key={index} value={noteOption}>
                      {noteOption}
                    </option>
                  ))}
                </Select>
                <ButtonGroup isAttached variant="outline" colorScheme="green">
                  <Button onClick={addNote}>Submit</Button>
                  <Tooltip
                    label="Store Note as Template"
                    aria-label="Store Note as Template"
                    isOpen={tooltipOpen}
                    placement="top"
                  >
                    <IconButton
                      aria-label="Store Template"
                      icon={<AddIcon />}
                      onClick={storeNoteAsTemplate}
                      onMouseEnter={() => setTooltipOpen(true)}
                      onMouseLeave={() => setTooltipOpen(false)}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
            </Stack>
          </Flex>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this?
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={2}>Cancel</Button>
            <Button colorScheme="red" onClick={confirmDelete}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default React.memo(LeadActivity);
