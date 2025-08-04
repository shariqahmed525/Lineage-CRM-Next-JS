import React from 'react';
import {
  Box, Text, Flex, FormControl, FormLabel, Input, Select, Divider,
} from '@chakra-ui/react';


interface PolicyDetailsProps {
  formData: any;
  carriers: any;
  carrierPlans: any;
  planCoverageTypes: any;
  statusOptions: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PolicyDetails: React.FC<PolicyDetailsProps> = ({
  formData,
  carriers,
  carrierPlans,
  planCoverageTypes,
  statusOptions,
  handleInputChange,
}) => (
  <Box border="1px solid" borderColor="gray.200" width="100%" p={4} borderRadius={4}>
    <Text mb={4} align="left" fontSize="lg" fontWeight="bold">Policy Details</Text>
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="policy_number">
        <FormLabel>Policy number</FormLabel>
        <Input name="policy_number" value={formData.policy_number} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="status">
        <FormLabel>Policy Status</FormLabel>
        <Select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="">Select Status</option>
          {statusOptions}
        </Select>
      </FormControl>
      <FormControl id="application_date">
        <FormLabel>Application Date</FormLabel>
        <Input type="date" name="application_date" value={formData.application_date} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="dob">
        <FormLabel>Date of Birth</FormLabel>
        <Input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <Box flex={1}>
        <FormControl id="carrier_1">
          <FormLabel>Who is the carrier for this policy?</FormLabel>
          <Select name="carrier_1" value={formData.carrier_1} onChange={handleInputChange}>
            <option value="">Select Carrier</option>
            {carriers?.map(carrier => (
              <option key={carrier.carrier_id} value={carrier.carrier_id}>{carrier.carrier_name}</option>
            ))}
          </Select>
        </FormControl>
        {formData.carrier_1 && (
          <FormControl id="carrier_plan_1" mt={4}>
            <FormLabel>
              Which
              {carriers?.find(carrier => carrier.carrier_id === formData.carrier_1)?.carrier_name}
              {' '}
              plan is this policy for?
            </FormLabel>
            <Select name="carrier_plan_1" value={formData.carrier_plan_1} onChange={handleInputChange}>
              <option value="">Select Plan</option>
              {carrierPlans?.filter(plan => plan.carrier_id === formData.carrier_1)?.map(plan => (
                <option key={plan.plan_id} value={plan.plan_id}>{plan.plan_name}</option>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </Flex>
    <Divider m={4} />
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="face_amount">
        <FormLabel>Face Amount ($)</FormLabel>
        <Input type="number" name="face_amount" value={formData.face_amount} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="monthly_premium">
        <FormLabel>Monthly Premium ($)</FormLabel>
        <Input type="number" name="monthly_premium" value={formData.monthly_premium} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="coverage_type">
        <FormLabel>Coverage Type</FormLabel>
        <Select name="coverage_type" value={formData.coverage_type} onChange={handleInputChange}>
          {planCoverageTypes?.map(type => (
            <option key={type?.id} value={type?.id}>{type?.coverage_type_value}</option>
          ))}
        </Select>
      </FormControl>
    </Flex>
  </Box>
);

export default PolicyDetails;
