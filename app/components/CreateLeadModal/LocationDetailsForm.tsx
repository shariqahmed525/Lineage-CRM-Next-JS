import {
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Box,
} from '@chakra-ui/react';
import React from 'react';

import Minimap from '../Minimap';

interface LocationDetailsFormProps {
  formData: {
    street_address: string;
    city: string;
    state_code: string;
    zip: string;
    county: string;
  };
  handleInputChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  lat?: string;
  lng?: string;
}

const LocationDetailsForm: React.FC<LocationDetailsFormProps> = ({ formData, handleInputChange, lat, lng }) => (
  <SimpleGrid columns={1} spacing={4}>
    <FormControl>
      <FormLabel htmlFor="street_address">Street Address</FormLabel>
      <Input
        id="street_address"
        value={formData.street_address}
        onChange={handleInputChange('street_address')}
      />
    </FormControl>
    <SimpleGrid columns={4} spacing={4}>
      <FormControl gridColumn="span 2">
        <FormLabel htmlFor="city">City</FormLabel>
        <Input
          id="city"
          value={formData.city}
          onChange={handleInputChange('city')}
        />
      </FormControl>
      <FormControl gridColumn="span 1">
        <FormLabel htmlFor="state_code">State Code</FormLabel>
        <Input
          id="state_code"
          value={formData.state_code}
          onChange={handleInputChange('state_code')}
        />
      </FormControl>
      <FormControl gridColumn="span 1">
        <FormLabel htmlFor="zip">Zip</FormLabel>
        <Input
          id="zip"
          value={formData.zip}
          onChange={handleInputChange('zip')}
        />
      </FormControl>
      <FormControl gridColumn="span 4">
        <FormLabel htmlFor="county">County</FormLabel>
        <Input
          id="county"
          value={formData.county}
          onChange={handleInputChange('county')}
        />
      </FormControl>
    </SimpleGrid>
    {lat && lng && (
      <Box width="100%" minWidth="200px">
        <Minimap coordinates={[{ lat: parseFloat(lat), lng: parseFloat(lng) }]} />
      </Box>
    )}
  </SimpleGrid>
);

export default LocationDetailsForm;