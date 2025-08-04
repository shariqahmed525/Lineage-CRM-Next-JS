import React from 'react';
import {
  Box, Text, Flex, FormControl, FormLabel, Input, Select, Divider, Switch,
} from '@chakra-ui/react';


interface ReplacedBusinessProps {
  formData: any;
  planCoverageTypes: any;
  carriers: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ReplacedBusiness: React.FC<ReplacedBusinessProps> = ({
  formData,
  planCoverageTypes,
  carriers,
  handleInputChange,
}) => (
  <Box border="1px solid" borderColor="gray.200" width="100%" p={4} borderRadius={4}>
    <Text mb={4} fontSize="lg" fontWeight="bold">Replaced Business</Text>
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="replaced_policy_number">
        <FormLabel>Replaced policy #</FormLabel>
        <Input name="replaced_policy_number" value={formData.replaced_policy_number} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="replaced_face_amount">
        <FormLabel>Replaced Face Amount ($)</FormLabel>
        <Input name="replaced_face_amount" value={formData.replaced_face_amount} onChange={handleInputChange} />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="replaced_coverage_type">
        <FormLabel>Replaced Coverage Type</FormLabel>
        <Select name="replaced_coverage_type" value={formData.replaced_coverage_type} onChange={handleInputChange}>
          {planCoverageTypes?.map(type => (
            <option key={type.id} value={type.id}>{type.coverage_type_value}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="replaced_carrier_1">
        <FormLabel>Replaced Carrier Name</FormLabel>
        <Select name="replaced_carrier_1" value={formData.replaced_carrier_1} onChange={handleInputChange}>
          <option value="">Select Carrier</option>
          {carriers?.map(carrier => (
            <option key={carrier.carrier_id} value={carrier.carrier_id}>{carrier.carrier_name}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="replaced_premium_amount">
        <FormLabel>Replaced Premium Amount ($)</FormLabel>
        <Input name="replaced_premium_amount" value={formData.replaced_premium_amount} onChange={handleInputChange} />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="effective_first_draft_date">
        <FormLabel>Effective First Draft Date</FormLabel>
        <Input type="date" name="effective_first_draft_date" value={formData.effective_first_draft_date} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="age_on_replacement_date">
        <FormLabel>Age on Replacement Date</FormLabel>
        <Input type="date" name="age_on_replacement_date" value={formData.age_on_replacement_date} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="has_bank_draft_been_stopped" display="flex" alignItems="center">
        <FormLabel htmlFor="has_bank_draft_been_stopped" mb="0">Has Bank Draft Been Stopped?</FormLabel>
        <Switch id="has_bank_draft_been_stopped" name="has_bank_draft_been_stopped" isChecked={formData.has_bank_draft_been_stopped} onChange={handleInputChange} />
      </FormControl>
    </Flex>
  </Box>
);

export default ReplacedBusiness;
