import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Grid,
  GridItem,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useClipboard,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Papa from "papaparse";
import { useState } from "react";

import { useLeads } from "@/app/contexts/LeadsContext"; // Add this import

import DuplicatesList from "./DuplicatesList"; // Import the DuplicatesList component
import FileUpload from "./FileUpload";

const databaseFields = [
  "person.first_name",
  "person.last_name",
  "person.email_address",
  "person.phone1",
  "person.phone2",
  "person.spouse_name",
  "location.street_address",
  "location.city",
  "location.state_code",
  "location.zip",
  "lead.date_received",
  "lead.lead_type",
  "lead.quick_note",
];

export default function UploadLeadsModal({ isOpen, onClose }) {
  const { hasCopied, onCopy } = useClipboard("Sample CSV link");
  const [stage, setStage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [file, setFile] = useState(null);
  const [headerMapping, setHeaderMapping] = useState({});
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { refreshLeads } = useLeads(); // Add this line

  const handleFileParsed = (parsedHeaders, filePath) => {
    setHeaders(parsedHeaders);
    setFile(filePath); // Store the file path for later use
    setStage(1); // Move to the next stage where user can map headers
  };

  const handleMappingChange = (header, value) => {
    setHeaderMapping((prev) => ({ ...prev, [header]: value }));
  };

  const processLeads = async () => {
    setIsLoading(true);
    // Convert headerMapping object to array format expected by the API
    const headerMappingArray = Object.entries(headerMapping).map(
      ([header, databaseColumn]) => ({
        header,
        databaseColumn,
      }),
    );

    // Log the headerMappingArray to see the values
    console.log("Header Mapping Array:", headerMappingArray);

    try {
      const response = await fetch("/api/processLeads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: file, // Use the file path
          headerMapping: headerMappingArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process leads");
      }

      const result = await response.json();
      setResults({
        ...result,
        leadsProcessed: result.duplicates.length + result.leadsAdded.length +
          result.leadsSkipped.length,
        duplicatesFound: result.duplicates.length || 0,
        leadsAdded: result.leadsAdded.length || 0,
        leadsSkipped: result.leadsSkipped.length || 0,
      });
      setStage(3);
    } catch (error) {
      toast({
        title: "Error processing leads",
        description:
          "There was an issue processing your leads. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error processing leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      await refreshLeads();
    } catch (error) {
      toast({
        title: "Error refreshing leads",
        description:
          "There was an issue refreshing your leads. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const handleKeepOriginal = (duplicate) => {
    // Implement the logic to keep the original data
  };

  const handleUpdateNewValues = (duplicate) => {
    // Implement the logic to upsert the new data
  };

  const handleKeepAll = () => {
    // Implement the logic to keep all original data
    results.duplicates.forEach((duplicate) => handleKeepOriginal(duplicate));
  };

  const handleRemoveAll = () => {
    // Implement the logic to remove all duplicates
    results.duplicates.forEach((duplicate) => handleUpdateNewValues(duplicate));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent maxHeight="80vh">
        {stage === 3 && results?.duplicatesFound > 0
          ? (
            <Text fontSize="xl" textAlign="left" m={4} color="black">
              Duplicate Leads Found: {results?.duplicatesFound || 0}
            </Text>
          )
          : (
            <ModalHeader>
              Import leads -
              {stage === 0
                ? " Upload CSV"
                : stage === 1
                ? " Map Headers"
                : " Results"}
            </ModalHeader>
          )}
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          <VStack spacing={4}>
            {stage === 0 && <FileUpload onFileParsed={handleFileParsed} />}
            {stage === 1 && (
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                {headers.map((header) => (
                  <GridItem key={header}>
                    <Text fontWeight="bold" textAlign="center">
                      {header}
                    </Text>
                    <Select
                      value={headerMapping[header] || ""}
                      onChange={(e) =>
                        handleMappingChange(header, e.target.value)}
                    >
                      <option value="">Select a field</option>
                      {databaseFields.map((field) => (
                        <option
                          key={field}
                          value={field}
                          disabled={Object.values(headerMapping).includes(
                            field,
                          )}
                        >
                          {field}
                        </option>
                      ))}
                    </Select>
                  </GridItem>
                ))}
              </Grid>
            )}
            {stage === 2 && <Text>Processing leads...</Text>}
            {stage === 3 && (
              <Box overflowY="auto" maxHeight="60vh" width="100%">
                <DuplicatesList
                  duplicates={results.duplicates}
                  headerMapping={headerMapping}
                />
              </Box>
            )}
            <Text fontSize="sm">
              Download a{" "}
              <Link color="blue.500" href="#" onClick={onCopy}>
                {hasCopied ? "Copied" : "sample CSV"}
              </Link>
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} hidden={stage === 3}>
            Cancel
          </Button>
          {stage === 1 && (
            <Button
              colorScheme="green"
              onClick={processLeads}
              isLoading={isLoading}
            >
              Process Leads
            </Button>
          )}
          {stage === 2 && (
            <Button
              colorScheme="green"
              onClick={() => setStage(3)}
            >
              View Results
            </Button>
          )}
          {stage === 3 && (
            <>
              <Button colorScheme="green" onClick={handleFinish}>Finish</Button>
              <Button colorScheme="blue" onClick={handleKeepAll} ml={3}>
                Keep All Current
              </Button>
              <Button colorScheme="purple" onClick={handleRemoveAll} ml={3}>
                Update All From File
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
