import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface PolicyholderDetailsProps {
  formData: any;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const PolicyholderDetails: React.FC<PolicyholderDetailsProps> = ({
  formData,
  handleInputChange,
}) => (
  <Box
    border="1px solid"
    borderColor="gray.200"
    width="100%"
    p={4}
    borderRadius={4}
  >
    <Text mb={4} fontSize="lg" fontWeight="bold">Policyholder Details</Text>
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <FormControl id="first_name">
        <FormLabel>First Name</FormLabel>
        <Input
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="middle_initial">
        <FormLabel>Middle Initial</FormLabel>
        <Input
          name="middle_initial"
          value={formData.middle_initial}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="last_name">
        <FormLabel>Last Name</FormLabel>
        <Input
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
        />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <FormControl id="gender">
        <FormLabel>Gender</FormLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </FormControl>
      <FormControl id="tobacco_use">
        <FormLabel>Tobacco Use</FormLabel>
        <Select
          name="tobacco_use"
          value={formData.tobacco_use || "Unknown"}
          onChange={handleInputChange}
        >
          <option value="Smoker">Smoker</option>
          <option value="Non Smoker">Non Smoker</option>
          <option value="Cigar Only">Cigar Only</option>
          <option value="Chewer/Dipper">Chewer/Dipper</option>
          <option value="E-Cig Only">E-Cig Only</option>
          <option value="Unknown">Unknown</option>
        </Select>
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <FormControl id="street_address">
        <FormLabel>Street Address</FormLabel>
        <Input
          name="street_address"
          value={formData.street_address}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="street_address2">
        <FormLabel>Street Address 2</FormLabel>
        <Input
          name="street_address2"
          value={formData.street_address2}
          onChange={handleInputChange}
        />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <FormControl id="city">
        <FormLabel>City</FormLabel>
        <Input name="city" value={formData.city} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="state_code">
        <FormLabel>State Code</FormLabel>
        <Input
          name="state_code"
          value={formData.state_code}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="zip">
        <FormLabel>Zip Code</FormLabel>
        <Input name="zip" value={formData.zip} onChange={handleInputChange} />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: "column", md: "row" }} gap={4}>
      <FormControl id="county_id">
        <FormLabel>County</FormLabel>
        <Input
          name="county_id"
          value={formData.county_id}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="phone1">
        <FormLabel>Phone</FormLabel>
        <Input
          name="phone1"
          value={formData.phone1}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="dob">
        <FormLabel>Date of Birth</FormLabel>
        <Input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
        />
      </FormControl>
    </Flex>
  </Box>
);

export default PolicyholderDetails;