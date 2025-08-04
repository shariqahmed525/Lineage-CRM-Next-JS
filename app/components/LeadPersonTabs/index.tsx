import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useLeads } from "@/app/contexts/LeadsContext";

import { calculateAge } from "../../../utils/functions";
import AddPersonButton from "../AddPersonButton";

const LeadPersonTabs = () => {
  const { selectedLead } = useLeads();
  const [persons, setPersons] = useState(selectedLead?.persons || []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPerson, setEditedPerson] = useState({});
  const [originalPerson, setOriginalPerson] = useState({});
  const toast = useToast();

  // Update the persons array in component state when the selectedLead changes in the context
  useEffect(() => {
    console.log("selectedLead", selectedLead);
    if (selectedLead?.persons) {
      const personsWithAge = selectedLead.persons.map((person) => ({
        ...person,
        age: calculateAge(person.dob),
      }));
      setPersons(personsWithAge);
    } else {
      setPersons([]);
    }
  }, [selectedLead]);

  const toggleEditMode = (person) => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedPerson(person);
      setOriginalPerson(person);
    } else {
      saveChanges();
    }
  };

  const saveChanges = async () => {
    if (JSON.stringify(originalPerson) !== JSON.stringify(editedPerson)) {
      try {
        const response = await fetch("/api/updatePerson", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedPerson),
        });
        if (!response.ok) throw new Error("Failed to update person");
        toast({ title: "Person updated successfully", status: "success" });
        setIsEditMode(false);
        setPersons(
          persons?.map(
            (p) => (p.person_id === editedPerson.person_id ? editedPerson : p),
          ),
        );
        window.location.reload(); // Trigger a page refresh
      } catch (error) {
        toast({
          title: "Error updating person",
          description: error.message,
          status: "error",
        });
      }
    }
  };

  const handleInputChange = (e, field) => {
    setEditedPerson({ ...editedPerson, [field]: e.target.value });
  };

  // Define the active and inactive tab styles
  const activeTabStyle = {
    color: "#0C2115",
    borderColor: "#008D3F",
    borderWidth: "1px",
  };

  const inactiveTabStyle = {
    color: "#A0A0A0",
  };

  return (
    <Tabs variant="soft-rounded" colorScheme="green">
      <TabList
        pb={2}
        borderBottom="1px"
        borderColor="#E0E0E0"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "white",
        }}
        width="100%"
      >
        {Array.isArray(persons) && persons.map((person, index) => (
          <Tab
            key={index}
            _selected={activeTabStyle}
            _hover={inactiveTabStyle}
          >
            {person.first_name} {person.last_name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {Array.isArray(persons) &&
          persons.map((person, index) => (
            <TabPanel key={index}>
              <HStack justify="space-between">
                <Text fontSize="xl" fontWeight="bold">
                  {isEditMode
                    ? (
                      <>
                        <Input
                          value={editedPerson.first_name}
                          onChange={(e) => handleInputChange(e, "first_name")}
                          placeholder="First Name"
                        />
                        <Input
                          value={editedPerson.last_name}
                          onChange={(e) => handleInputChange(e, "last_name")}
                          placeholder="Last Name"
                        />
                      </>
                    )
                    : (
                      `${person.first_name} ${person.last_name}`
                    )}
                </Text>
                <IconButton
                  aria-label="Edit person"
                  icon={isEditMode ? <CheckIcon /> : <EditIcon />}
                  onClick={() => toggleEditMode(person)}
                  size="sm"
                  m={2}
                />
              </HStack>
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                }}
                gap={6}
                m={0}
              >
                <Box>
                  <Tooltip label="Primary contact number">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Phone 1
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.phone1}
                        onChange={(e) => handleInputChange(e, "phone1")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.phone1 || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Secondary contact number">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Phone 2
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.phone2}
                        onChange={(e) => handleInputChange(e, "phone2")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.phone2 || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Email address">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Email
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.email_address}
                        onChange={(e) => handleInputChange(e, "email_address")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.email_address || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Date of birth">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Date of Birth
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.dob}
                        type="date"
                        onChange={(e) => handleInputChange(e, "dob")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.dob || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Current age">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Age
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.age}
                        onChange={(e) => handleInputChange(e, "age")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.age || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Middle initial">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Middle Initial
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.middle_initial}
                        onChange={(e) => handleInputChange(e, "middle_initial")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.middle_initial || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Gender">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Gender
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.gender}
                        onChange={(e) => handleInputChange(e, "gender")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.gender || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Tobacco use status">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Tobacco Use
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.tobacco_use}
                        onChange={(e) => handleInputChange(e, "tobacco_use")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.tobacco_use || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Spouse's name">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Spouse Name
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.spouse_name}
                        onChange={(e) => handleInputChange(e, "spouse_name")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.spouse_name || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Spouse's age">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Spouse Age
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.spouse_age}
                        onChange={(e) => handleInputChange(e, "spouse_age")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.spouse_age || "N/A"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Called primary phone number">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Called Phone 1
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.called_phone1 ? "Yes" : "No"}
                        onChange={(e) => handleInputChange(e, "called_phone1")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.called_phone1 ? "Yes" : "No"}
                      </Text>
                    )}
                </Box>
                <Box>
                  <Tooltip label="Called secondary phone number">
                    <Text
                      textAlign="left"
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      Called Phone 2
                    </Text>
                  </Tooltip>
                  {isEditMode
                    ? (
                      <Input
                        value={editedPerson.called_phone2 ? "Yes" : "No"}
                        onChange={(e) => handleInputChange(e, "called_phone2")}
                      />
                    )
                    : (
                      <Text
                        textAlign="left"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {person.called_phone2 ? "Yes" : "No"}
                      </Text>
                    )}
                </Box>
              </Grid>
            </TabPanel>
          ))}
      </TabPanels>
    </Tabs>
  );
};

export default LeadPersonTabs;
