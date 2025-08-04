import React from 'react';
import {
  Box, Text, Flex, FormControl, FormLabel, Input, Select, Divider,
} from '@chakra-ui/react';


interface BillingInformationProps {
  formData: any;
  planPaymentDays: any;
  planPaymentModes: any;
  planPaymentMethods: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BillingInformation: React.FC<BillingInformationProps> = ({
  formData,
  planPaymentDays,
  planPaymentModes,
  planPaymentMethods,
  handleInputChange,
}) => (
  <Box border="1px solid" borderColor="gray.200" width="100%" p={4} borderRadius={4}>
    <Text mb={4} fontSize="lg" fontWeight="bold">Billing Information</Text>
    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="payment_day">
        <FormLabel>Payment Day</FormLabel>
        <Select name="payment_day" value={formData.payment_day} onChange={handleInputChange}>
          <option value="">Select</option>
          {planPaymentDays?.map(day => (
            <option key={day?.id} value={day?.id}>{day?.day_value}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="effective_first_draft_date">
        <FormLabel>Effective First Draft Date</FormLabel>
        <Input type="date" name="effective_first_draft_date" value={formData.effective_first_draft_date} onChange={handleInputChange} />
      </FormControl>
      <FormControl id="age_on_effective_date">
        <FormLabel>Age on Effective Date</FormLabel>
        <Input type="number" name="age_on_effective_date" value={formData.age_on_effective_date} onChange={handleInputChange} readOnly />
      </FormControl>
    </Flex>
    <Divider m={4} />
    <Flex mb={4} direction={{ base: 'column', md: 'row' }} gap={4}>
      <FormControl id="payment_mode">
        <FormLabel>Payment Mode</FormLabel>
        <Select name="payment_mode" value={formData.payment_mode} onChange={handleInputChange}>
          {planPaymentModes?.map(mode => (
            <option key={mode?.id} value={mode?.id}>{mode?.mode_value}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="payment_method">
        <FormLabel>Payment Method</FormLabel>
        <Select name="payment_method" value={formData.payment_method} onChange={handleInputChange}>
          {planPaymentMethods?.map(method => (
            <option key={method?.id} value={method?.id}>{method?.method_value}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="cancel_or_cash_in_date">
        <FormLabel>Cancel or Cash In Date</FormLabel>
        <Input type="date" name="cancel_or_cash_in_date" value={formData.cancel_or_cash_in_date} onChange={handleInputChange} />
      </FormControl>
    </Flex>
  </Box>
);

export default BillingInformation;
