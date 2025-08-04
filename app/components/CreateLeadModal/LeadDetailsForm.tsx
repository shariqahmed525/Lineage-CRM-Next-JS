import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';


interface LeadDetailsFormProps {
  formData: {
    lead_type: string;
    date_received: string;
    quick_note: string;
    attachment: string;
    url_link: string;
  };
  handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const LeadDetailsForm: React.FC<LeadDetailsFormProps> = ({ formData, handleInputChange }) => (
  <SimpleGrid columns={2} spacing={4}>
    <FormControl>
      <FormLabel htmlFor="lead_type">Lead Type</FormLabel>
      <Input
        id="lead_type"
        value={formData.lead_type}
        onChange={handleInputChange('lead_type')}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="date_received">Date Received</FormLabel>
      <Input
        id="date_received"
        type="date"
        value={formData.date_received}
        onChange={handleInputChange('date_received')}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="quick_note">Quick Note</FormLabel>
      <Textarea
        id="quick_note"
        value={formData.quick_note}
        onChange={handleInputChange('quick_note')}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="attachment">Attachment</FormLabel>
      <Input
        id="attachment"
        value={formData.attachment}
        onChange={handleInputChange('attachment')}
      />
    </FormControl>
    <FormControl>
      <FormLabel htmlFor="url_link">URL Link</FormLabel>
      <Input
        id="url_link"
        value={formData.url_link}
        onChange={handleInputChange('url_link')}
      />
    </FormControl>
  </SimpleGrid>
);

export default LeadDetailsForm;
