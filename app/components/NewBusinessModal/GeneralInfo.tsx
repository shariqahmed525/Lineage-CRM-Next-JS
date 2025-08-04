import React from 'react';
import {
  Box, Text, Flex, FormControl, FormLabel, HStack, Select, Switch, Popover, PopoverTrigger,
} from '@chakra-ui/react';
import ExplanationTooltip from '../ExplanationTooltip';
import LeadAutoComplete from '../LeadAutoComplete';
import AddPersonPopover from './AddPersonPopover';


interface GeneralInfoProps {
  leadSelect: string;
  formData: any;
  autofillForms: boolean;
  isPopoverOpen: boolean;
  personOptions: any;
  handleLeadSelect: (selectedLeadId: string) => void;
  handlePersonSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAutofillToggle: () => void;
  setPopoverOpen: (isOpen: boolean) => void;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
  leadSelect,
  formData,
  autofillForms,
  isPopoverOpen,
  personOptions,
  handleLeadSelect,
  handlePersonSelectChange,
  handleInputChange,
  handleAutofillToggle,
  setPopoverOpen,
}) => (
  <Box border="1px solid" borderColor="gray.200" width="100%" p={4} borderRadius={4}>
    <Text mb={4} align="left" fontSize="lg" fontWeight="bold">
      General Info
    </Text>
    <Flex direction={{ base: 'column', md: 'column' }} gap={4} mb={4}>
      <FormControl id="leadSelect">
        <FormLabel>Is this policy for an existing lead?</FormLabel>
        <HStack>
          <ExplanationTooltip message="You can associate the policy with a current lead or create a new one" />
          <LeadAutoComplete onSelect={handleLeadSelect} selectedLeadId={leadSelect} />
        </HStack>
      </FormControl>
      <FormControl id="personSelect">
        <FormLabel>Who is the policy for?</FormLabel>
        <HStack>
          <ExplanationTooltip message="Select the person this policy is for. If a lead is selected, choose from the people associated with the lead" />
          <Popover isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)}>
            <PopoverTrigger>
              <Select name="personSelect" value={formData.personSelect} onChange={handlePersonSelectChange}>
                <option value="">Select Person for the Policy</option>
                <option value="add_new_person">+ Create Person for the Policy</option>
                {personOptions}
              </Select>
            </PopoverTrigger>
            <AddPersonPopover onClose={() => setPopoverOpen(false)} />
          </Popover>
        </HStack>
      </FormControl>
      <FormControl id="replacing_existing_coverage">
        <FormLabel>Replacing Existing Coverage?</FormLabel>
        <Select name="replacing_existing_coverage" value={formData.replacing_existing_coverage || 'false'} onChange={handleInputChange}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>
      </FormControl>
      <FormControl id="autofillForms" display="flex" alignItems="center">
        <FormLabel htmlFor="autofillForms" mb="0">Autofill Forms</FormLabel>
        <Switch id="autofillForms" isChecked={autofillForms} onChange={handleAutofillToggle} />
      </FormControl>
    </Flex>
  </Box>
);

export default GeneralInfo;
