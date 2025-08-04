// ChangeLeadStatusActivity.tsx
import { Box, Flex, Text, Icon, VStack, Circle } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { forwardRef } from 'react';
import { MdSwapHoriz } from 'react-icons/md';

import { Tables } from '../../../../types/types';

interface ChangeLeadStatusActivityProps {
  activity: Tables<'activity'>;
  leadStatuses: Tables<'lead_statuses'>[];
}

const ChangeLeadStatusActivity = forwardRef<HTMLDivElement, ChangeLeadStatusActivityProps>(({ activity, leadStatuses }, ref) => {
  const oldStatus = leadStatuses?.find(status => status.status_id === activity.old_lead_status_id);
  const newStatus = leadStatuses?.find(status => status.status_id === activity.new_lead_status_id);

  return (
    <Flex align="center" width="100%">
      <Circle size="40px" border="2px" borderColor="gray.200" color="gray.400" mr={4} ref={ref} zIndex="1" bg="white">
        <Icon as={MdSwapHoriz} boxSize={6} />
      </Circle>
      <VStack align="start" spacing={0} width="100%">
        <Text fontSize="sm" color="gray.600">
          Lead status changed from <Text as="span" color={oldStatus?.badge_color_hexcode || ""}>{oldStatus?.status_name}</Text> to <Text as="span" color={newStatus?.badge_color_hexcode || ""}>{newStatus?.status_name}</Text>
        </Text>
        <Text fontSize="sm" color="gray.600" ml="auto">{activity?.action_date ? format(new Date(activity.action_date), 'hh:mm a') : ''}</Text>
      </VStack>
    </Flex>
  );
});

ChangeLeadStatusActivity.displayName = 'ChangeLeadStatusActivity';

export default ChangeLeadStatusActivity;