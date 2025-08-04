import { CheckIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaApple, FaGoogle, FaMapMarkerAlt } from "react-icons/fa";

import { useLeads } from "@/app/contexts/LeadsContext";
import { createClient } from "@/utils/supabase/client";

import Minimap from "../Minimap"; // Import Minimap component

const AddressCard = ({ lead }) => {
  const street = lead?.leads_locations?.[0]?.locations?.street_address || "";
  const city = lead?.leads_locations?.[0]?.locations?.city || "";
  const state = lead?.leads_locations?.[0]?.locations?.state_code || "";
  const zip = lead?.leads_locations?.[0]?.locations?.zip || "";
  const county = lead?.leads_locations?.[0]?.locations?.county || "";
  const locationId = lead?.leads_locations?.[0]?.locations?.location_id || "";
  const lat = lead?.leads_locations?.[0]?.locations?.lat;
  const lng = lead?.leads_locations?.[0]?.locations?.lng;
  const addressQuery = encodeURIComponent(
    `${street}, ${city}, ${state} ${zip}`
  );

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${addressQuery}`;
  const appleMapsUrl = `http://maps.apple.com/?daddr=${addressQuery}&dirflg=d`;

  // Determine the appropriate term for the county
  const countyTerm = state?.toLowerCase() === 'la' || state?.toLowerCase() === 'louisiana' ? 'Parish' : 'County';

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    street,
    city,
    state,
    zip,
    county, // Add county to the editable address state
  });
  const [originalAddress, setOriginalAddress] = useState({
    street,
    city,
    state,
    zip,
    county, // Add county to the original address state
  });
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedLead, refreshLeads } = useLeads();

  useEffect(() => {
    setEditedAddress({ street, city, state, zip, county });
    setOriginalAddress({ street, city, state, zip, county });
  }, [street, city, state, zip, county]);

  const toggleEditMode = async () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      // Save changes
      if (JSON.stringify(originalAddress) !== JSON.stringify(editedAddress)) {
        try {
          const response = await fetch('/api/updateLocation', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location_id: locationId,
              street_address: editedAddress.street,
              city: editedAddress.city,
              state_code: editedAddress.state,
              zip: editedAddress.zip,
              county: editedAddress.county, // Include county in the request body
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to update address');
          }

          toast({ title: "Address updated successfully", status: "success" });
          setOriginalAddress(editedAddress);
          refreshLeads(); // Refresh leads in the context
        } catch (error) {
          toast({ title: error.message, status: "error" });
        }
      }
    }
  };

  const handleInputChange = (e, field) => {
    setEditedAddress({ ...editedAddress, [field]: e.target.value });
  };

  const handleMapLinkClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    router.push(`/map?leadId=${lead?.id}`);
    setSelectedLead(lead);
  };

  return (
    <Card border="1px" borderColor="#EAEAEA">
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading p={0} margin={0} size="sm">Address</Heading>
          <IconButton
            aria-label="Edit address"
            icon={isEditMode ? <CheckIcon /> : <EditIcon />}
            onClick={toggleEditMode}
            size="sm"
          />
        </Flex>
      </CardHeader>
      <CardBody paddingTop={0}>
        {isEditMode ? (
          <Box>
            <Input
              value={editedAddress.street}
              onChange={(e) => handleInputChange(e, "street")}
              placeholder="Street"
              mb={2}
            />
            <Input
              value={editedAddress.city}
              onChange={(e) => handleInputChange(e, "city")}
              placeholder="City"
              mb={2}
            />
            <Input
              value={editedAddress.state}
              onChange={(e) => handleInputChange(e, "state")}
              placeholder="State"
              mb={2}
            />
            <Input
              value={editedAddress.zip}
              onChange={(e) => handleInputChange(e, "zip")}
              placeholder="ZIP"
              mb={2}
            />
            <Input
              value={editedAddress.county} // Add county input field
              onChange={(e) => handleInputChange(e, "county")}
              placeholder="County"
              mb={2}
            />
          </Box>
        ) : (
          <Text textAlign="center" mb={4}>
            {editedAddress.street}
            <br />
            {editedAddress.city}, {editedAddress.state} {editedAddress.zip}
            <br />
            {editedAddress.county && <i>{editedAddress.county} {countyTerm}</i>} {/* Conditionally display county */}
          </Text>
        )}
        {pathname !== '/map' && lat && lng && (
          <Box width="100%" height="200px" mb={4}>
            <Minimap coordinates={[{ lat, lng }]} />
          </Box>
        )}
        <Flex justifyContent="center" alignItems="center">
          <Tooltip label="Open route in Google Maps" hasArrow>
            <Link href={googleMapsUrl} isExternal>
              <IconButton
                aria-label="Open route in Google Maps"
                icon={<FaGoogle />}
                size="lg"
                variant="ghost"
                mx={2}
              />
            </Link>
          </Tooltip>
          <Tooltip label="Open route in Apple Maps" hasArrow>
            <Link href={appleMapsUrl} isExternal>
              <IconButton
                aria-label="Open route in Apple Maps"
                icon={<FaApple />}
                size="lg"
                variant="ghost"
                mx={2}
              />
            </Link>
          </Tooltip>
          {pathname !== '/map' && (
            <Tooltip label="View on Lineage Map" hasArrow>
              <IconButton
                aria-label="View on Lineage Map"
                icon={<FaMapMarkerAlt />}
                size="lg"
                variant="ghost"
                mx={2}
                onClick={handleMapLinkClick}
              />
            </Tooltip>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AddressCard;