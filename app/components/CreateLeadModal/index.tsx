import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, useToast, Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import LeadDetailsForm from './LeadDetailsForm';
import LocationDetailsForm from './LocationDetailsForm';
import PersonDetailsForm from './PersonDetailsForm';
import { useLeads } from '../../contexts/LeadsContext';


const CreateLeadModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { setFilteredLeads, refreshLeads } = useLeads(); // Destructure refreshLeads from context

  // Initialize form state
  const [formData, setFormData] = useState({
    leadDetails: {
      lead_type: null,
      date_received: null,
      quick_note: null,
      attachment: null,
      url_link: null,
    },
    personDetails: {
      first_name: null,
      last_name: null,
      phone1: null,
      phone2: null,
      email_address: null,
      age: null,
      spouse_name: null,
      spouse_age: null,
    },
    locationDetails: {
      street_address: '',
      city: '',
      state_code: '',
      zip: null,
      location_result_type: null,
      county: null, // Added county field
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Add this line to initialize the loading state

  const handleInputChange = (section, field) => (event) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      [section]: {
        ...prevFormData[section],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const { street_address, city, state_code, zip } = formData.locationDetails;
    if (street_address && city && state_code && zip) {
      fetch('/api/geocodeAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ street_address, city, state_code, zip }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.lat && data.lng) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              locationDetails: {
                ...prevFormData.locationDetails,
                lat: data.lat,
                lng: data.lng,
              },
            }));
          }
        })
        .catch((error) => console.error('Error fetching geocode:', error));
    }
  }, [formData.locationDetails.street_address, formData.locationDetails.city, formData.locationDetails.state_code, formData.locationDetails.zip]);

  const handleSubmit = async (event) => {
    console.log('Destabilzation', formData);
    event.preventDefault();
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetch('/api/createLead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create lead');

      const newLead = await response.json();
      setFilteredLeads(prevLeads => [...prevLeads, newLead]);
      await refreshLeads(); // Refresh leads after successful creation
      toast({
        title: 'Lead created.',
        description: "We've added your new lead.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'There was an error creating the lead.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent padding={10}>
        <ModalHeader>
          Create a new lead
          <Text fontWeight="light" fontSize="md" mt={2} mb={4}>
            Just the first and last name required to start. You can always add or edit more details later. Click on each section title to expand or collapse it for more options.
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Accordion allowToggle defaultIndex={[0]}>
              {/* Person Details Section */}
              <AccordionItem border="none" padding="0">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" borderBottom="1px solid" borderColor="gray.200" pb={2} fontSize="lg" fontWeight="bold">
                      Person Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <PersonDetailsForm
                    formData={formData.personDetails}
                    handleInputChange={field => handleInputChange('personDetails', field)}
                  />
                </AccordionPanel>
              </AccordionItem>

              {/* Lead Details Section */}
              <AccordionItem border="none">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" borderBottom="1px solid" borderColor="gray.200" pb={2} fontSize="lg" fontWeight="bold">
                      Lead Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <LeadDetailsForm
                    formData={formData.leadDetails}
                    handleInputChange={field => handleInputChange('leadDetails', field)}
                  />
                </AccordionPanel>
              </AccordionItem>

              {/* Address Details Section */}
              <AccordionItem border="none">
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" borderBottom="1px solid" borderColor="gray.200" pb={2} fontSize="lg" fontWeight="bold">
                      Address Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <LocationDetailsForm
                    formData={formData.locationDetails}
                    handleInputChange={field => handleInputChange('locationDetails', field)}
                    lat={formData.locationDetails.lat}
                    lng={formData.locationDetails.lng}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="green" isLoading={isSubmitting}>Submit</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateLeadModal;