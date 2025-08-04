// Importing the Next.js and Chakra UI heroes
import { Button } from '@chakra-ui/react';
import Image from 'next/image';

// Our component, shinier than Mr. Burns' head under the Springfield sun
const GoogleCalendarSyncButton = () => (
  <Button
    rightIcon={<Image src='/google-calendar-logo.svg' alt="Google Calendar Logo" width={24} height={24} />}
    backgroundColor="#FFF" // A clean white background
    color="black" // Text color for the button
    borderRadius="8px" // A modestly rounded border
    border="1px solid #EAEAEA" // A solid border with a light grey color
    padding="10px 20px" // Padding for optimal spacing
    display="inline-flex" // Display as an inline-flex element
    justifyContent="center" // Center the contents
    alignItems="center" // Align items vertically
    gap="8px" // A gap between the icon and text
    _hover={{ backgroundColor: "#F8F8F8" }} // A slight change on hover for feedback
    _active={{ backgroundColor: "#EAEAEA" }} // A different shade when active
  >
    Sync with
  </Button>
);

export default GoogleCalendarSyncButton;