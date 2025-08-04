import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const RowTitle = ({ title }) => (
  <Td
    width="150px"
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    py={3}
    bg="gray.100"
    position="sticky"
    left={0}
    zIndex={1}
  >
    <Tooltip label={title} aria-label={title}>
      <span>{title}</span>
    </Tooltip>
  </Td>
);

const DuplicatesList = ({ duplicates, headerMapping }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const toast = useToast();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortField(e.target.value);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredDuplicates = duplicates.filter((duplicate) =>
    Object.values(duplicate.duplicate_info)
      .some((value) => value?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedDuplicates = filteredDuplicates.sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a.duplicate_info[sortField];
    const bValue = b.duplicate_info[sortField];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleButtonClick = (action, duplicate) => {
    toast({
      title: `${action} action triggered`,
      description: `You have chosen to ${action.toLowerCase()} the lead.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Get the keys from headerMapping
  const allKeys = Object.keys(headerMapping);

  const getFieldName = (field) => field.split(".")[0].replace(/_/g, " ");

  return (
    <>
      <Box
        mb={4}
        pb={1}
        width="full"
        bg="white"
        position="sticky"
        top={0}
        zIndex={2}
      >
        <Input
          placeholder="Search duplicates..."
          value={searchTerm}
          onChange={handleSearchChange}
          mb={4}
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.500"
        />
        <Select
          placeholder="Sort by"
          onChange={handleSortChange}
          mb={2}
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.500"
        >
          {allKeys.map((field, idx) => (
            <option key={idx} value={field}>
              {getFieldName(field)}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        {sortedDuplicates.map((duplicate, index) => (
          <Card
            key={index}
            mb={4}
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.400"
            width="full"
          >
            <CardBody>
              <TableContainer>
                <Table
                  variant="simple"
                  size="md"
                  style={{ tableLayout: "fixed", width: "full" }}
                >
                  <Thead>
                    <Tr>
                      <RowTitle title="" />
                      {allKeys.map((field, idx) => (
                        <Th
                          key={idx}
                          width="150px"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          bg="gray.200"
                          color="gray.500"
                        >
                          <Tooltip
                            label={headerMapping[field]}
                            aria-label={headerMapping[field]}
                          >
                            <span>{getFieldName(field)}</span>
                          </Tooltip>
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <RowTitle title="Current" />
                      {allKeys.map((field, idx) => {
                        const attemptedValue =
                          duplicate.attempted_lead_info[headerMapping[field]];
                        const duplicateValue = duplicate.duplicate_info[field];
                        const isMatch = attemptedValue === duplicateValue;
                        const isPresent = attemptedValue && duplicateValue;
                        return (
                          <Td
                            key={idx}
                            width="150px"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            py={3}
                            bg={isMatch ? "green.200" : "red.200"}
                          >
                            <Tooltip
                              label={headerMapping[field]}
                              aria-label={headerMapping[field]}
                            >
                              <span>
                                {isPresent ? attemptedValue : duplicateValue}
                              </span>
                            </Tooltip>
                          </Td>
                        );
                      })}
                    </Tr>
                    <Tr>
                      <RowTitle title="From File" />
                      {allKeys.map((field, idx) => {
                        const attemptedValue =
                          duplicate.attempted_lead_info[headerMapping[field]];
                        const duplicateValue = duplicate.duplicate_info[field];
                        const isMatch = attemptedValue === duplicateValue;
                        const isPresent = attemptedValue && duplicateValue;
                        return (
                          <Td
                            key={idx}
                            width="150px"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            py={3}
                            bg={isMatch ? "green.200" : "red.200"}
                          >
                            <Tooltip
                              label={duplicateValue || headerMapping[field]}
                              aria-label={duplicateValue ||
                                headerMapping[field]}
                            >
                              <span>
                                {isMatch
                                  ? duplicateValue
                                  : attemptedValue || duplicateValue}
                              </span>
                            </Tooltip>
                          </Td>
                        );
                      })}
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Box mt={4} textAlign="center">
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleButtonClick("Upsert", duplicate)}
                  mr={2}
                >
                  <Tooltip
                    label="Lead data will be replaced"
                    aria-label="Lead data will be replaced"
                  >
                    Update From File
                  </Tooltip>
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleButtonClick("Keep", duplicate)}
                >
                  <Tooltip
                    label="Lead data will be kept the same"
                    aria-label="Lead data will be kept the same"
                  >
                    Keep Current
                  </Tooltip>
                </Button>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default DuplicatesList;
