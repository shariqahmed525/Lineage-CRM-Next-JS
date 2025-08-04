// LeadsItemCard Component
import {
  Box, VStack, Text, useBoolean, Divider,
} from '@chakra-ui/react'; // Check import statement syntax
import React, { useEffect, useRef } from 'react';
// Correct any syntax issues here

interface LeadsItemCardProps {
  lead: any;
  isSelected: boolean;
  onSelect: () => void;
}

const LeadsItemCard: React.FC<LeadsItemCardProps> = ({ lead, isSelected, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useBoolean();

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Changed from 'nearest' to 'center'
        inline: 'nearest',
      });
    }
  }, [isSelected]); // Ensure closing parenthesis and correct punctuation

  return (
    <Box
      ref={cardRef}
      onMouseEnter={setIsHovered.on}
      onMouseLeave={setIsHovered.off}
      p={4}
      mb={6}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden" // Prevents any content from overflowing
      shadow="md"
      bg="white"
      onClick={onSelect}
      _hover={{ shadow: 'xl', cursor: 'target' }}
      transition="shadow 0.2s"
      width="100%" // Ensures the card takes full width of the container
      borderColor={isSelected ? 'green.500' : 'transparent'} // Conditional border color
    >
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="bold" fontSize="lg" isTruncated>
          {lead?.persons?.[0]?.first_name || 'Unknown'}
          {' '}
          {lead?.persons?.[0]?.last_name || ''}
        </Text>
        <Divider />
        <Text fontSize="sm" isTruncated>
          {lead?.leads_locations?.[0]?.locations?.street_address || 'No address provided'}
        </Text>
        <Text fontSize="sm" isTruncated>
          {lead?.leads_locations?.[0]?.locations?.city || ''}
          ,
          {lead?.leads_locations?.[0]?.locations?.state_code || ''}
          {' '}
          {lead?.leads_locations?.[0]?.locations?.zip_code || ''}
        </Text>
        <Text fontSize="sm" fontWeight="bold">
          Phone:
          {' '}
          <Text as="span" fontWeight="normal" isTruncated>{lead?.persons?.[0]?.phone1 || 'N/A'}</Text>
        </Text>
        <Text fontSize="sm" fontWeight="bold">
          Email:
          {' '}
          <Text as="span" fontWeight="normal" isTruncated>{lead?.persons?.[0]?.email_address || 'N/A'}</Text>
        </Text>
      </VStack>
    </Box>
  );
};

export default LeadsItemCard;
