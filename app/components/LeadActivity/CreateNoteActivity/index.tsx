// CreateNoteActivity.tsx
import {
  Flex, Text, Icon, VStack, Circle,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { MdNoteAdd } from 'react-icons/md';

import { Tables } from '../../../../types/types';


interface CreateNoteActivityProps {
  activity: Tables<'activity'>;
}

const CreateNoteActivity = React.forwardRef<HTMLDivElement, CreateNoteActivityProps>(({ activity }, ref) => (
  <Flex align="center" width="100%">
    <Circle size="40px" border="2px" borderColor="gray.200" color="gray.400" mr={4} ref={ref} zIndex="1" bg="white">
      <Icon as={MdNoteAdd} boxSize={6} />
    </Circle>
    <VStack align="start" spacing={0} width="100%">
      <Text fontSize="sm" color="gray.600">{activity?.activity_metadata?.note}</Text>
      <Text fontSize="sm" color="gray.600" ml="auto">{activity.action_date ? format(new Date(activity.action_date), 'hh:mm a') : ''}</Text>
    </VStack>
  </Flex>
));

CreateNoteActivity.displayName = 'CreateNoteActivity';

export default CreateNoteActivity;
