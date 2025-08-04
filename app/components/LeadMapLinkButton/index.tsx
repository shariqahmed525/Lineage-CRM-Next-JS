import { IconButton, Tooltip, Image } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useData } from '@/app/contexts/DataFetchContext';
import { useLeads } from '@/app/contexts/LeadsContext';


interface LeadMapLinkButtonProps {
  lead: any; // Adjust the type according to your lead type definition
  width?: string;
  height?: string;
}

const LeadMapLinkButton: React.FC<LeadMapLinkButtonProps> = ({ lead, width = '75px', height = '75px' }) => {
  const { setSelectedLead } = useLeads();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('Paul Allen was here');

    router.push(`/map?leadId=${lead?.id}`);
    setSelectedLead(lead);
  };

  return (
    <Tooltip
      _hover={{ cursor: 'pointer', color: '#008D3F' }}
      label={`${lead?.leads_locations?.[0]?.locations?.street_address}, ${lead?.leads_locations?.[0]?.locations?.city}, ${lead?.leads_locations?.[0]?.locations?.state_code} ${lead?.leads_locations?.[0]?.locations?.zip}`}
      aria-label="Tooltip content"
      placement="bottom"
      hasArrow
    >
      <IconButton
        width={width}
        height={height}
        textAlign="center"
        padding="0"
        icon={<Image src="/icons/map-icon.svg" alt="Map" width={width} height={height} />}
        aria-label="Show map"
        onClick={handleClick}
        onMouseEnter={e => e.stopPropagation()} // Stop mouse enter propagation
        position="relative"
        zIndex="99"
        variant="ghost"
        _hover={{ bg: 'transparent', border: 'lightgray', cursor: 'pointer' }}
        _active={{ bg: 'transparent', border: 'none' }}
      />
    </Tooltip>
  );
};

export default LeadMapLinkButton;
