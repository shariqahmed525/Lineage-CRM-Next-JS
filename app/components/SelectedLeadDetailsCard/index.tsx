import {
  Card, IconButton, Stack, Tabs, TabList, TabPanels, Tab, TabPanel, Tooltip, Heading, Text, CardHeader, CardBody, Box,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

import { useData } from '@/app/contexts/DataFetchContext';
import { useNavSizeContext } from '@/app/contexts/NavSizeContext'; // Import the context

import LeadActivity from '../LeadActivity';
import LeadDetail from '../LeadDetail';


interface SelectedLeadDetailsCardProps {
  lead: any;
  onClose: () => void;
}


const SelectedLeadDetailsCard: React.FC<SelectedLeadDetailsCardProps> = ({ lead, onClose }) => {
  const { leadStatuses, setLeadStatuses, refetchData } = useData();
  const { navSize } = useNavSizeContext(); // Use the context
  const [refreshActivities, setRefreshActivities] = useState(false);
  const [buttonRightOffset, setButtonRightOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const updateRefreshActivities = () => {
    setRefreshActivities(prev => !prev);
  };

  useEffect(() => {
    if (refreshActivities) {
      (async () => {
        await refetchData('getLeads');
        setRefreshActivities(false);
      })();
    }
  }, [refreshActivities, refetchData]);

  useEffect(() => {
    const updateButtonPosition = () => {
      const cardWidth = cardRef.current?.offsetWidth;
      const cardRightEdge = cardRef.current?.getBoundingClientRect().right;
      if (cardWidth && cardRightEdge) {
        // Calculate the offset from the right edge of the viewport to the right edge of the card
        const offsetFromViewportRight = window.innerWidth - cardRightEdge - 20;
        setButtonRightOffset(offsetFromViewportRight);
      }
    };

    updateButtonPosition(); // Call immediately to set initial position
    window.addEventListener('resize', updateButtonPosition);

    // Also update position when navSize changes
    const navSizeListener = () => updateButtonPosition();
    window.addEventListener('navSizeChange', navSizeListener); // Assuming there's an event that fires when navSize changes

    return () => {
      window.removeEventListener('resize', updateButtonPosition);
      window.removeEventListener('navSizeChange', navSizeListener);
    };
  }, [navSize]); // React on navSize changes

  if (!lead) return null;

  return (
    <Card
      ref={cardRef}
      id="selectedLeadContainer"
      width="100%"
      m={1}
      p={1}
      zIndex="10000"
      height="100%"
      overflowY="auto"
      position="relative"
    >
      <Tooltip label="Hide Lead" hasArrow placement="right">
        <IconButton
          icon={<FaChevronLeft />}
          position="fixed"
          right={`${buttonRightOffset}px`}
          top="50%"
          transform="translateY(-50%)"
          aria-label="Hide Lead"
          background="lightgray"
          borderRadius="50%"
          padding="0"
          width="30px"
          height="30px"
          minWidth="auto"
          minHeight="auto"
          _hover={{
            background: 'lightgray',
            cursor: 'pointer', // Ensures cursor changes to pointer on hover
          }}
          zIndex="9999"
          onClick={onClose}
        />
      </Tooltip>
      <Tabs isFitted variant="enclosed" height="100%">
        <TabList mb="1em">
          <Tab _selected={{ color: '#008D3F' }}>Details</Tab>
          <Tab _selected={{ color: '#008D3F' }}>Activity</Tab>
        </TabList>
        <TabPanels width="100%" height="100%" overflowY="auto">
          <TabPanel height="100%">
            <Stack direction="column" spacing={2} mb={2}>
              <LeadDetail
                lead={lead}
                leadStatuses={leadStatuses}
                updateRefreshActivities={updateRefreshActivities}
                setLeadStatuses={setLeadStatuses}
              />
            </Stack>
          </TabPanel>
          <TabPanel>
            <LeadActivity leadId={lead.id} refreshTrigger={refreshActivities} updateRefreshActivities={updateRefreshActivities} leadStatuses={leadStatuses} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default SelectedLeadDetailsCard;
