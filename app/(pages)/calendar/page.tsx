import { Flex, Box } from '@chakra-ui/react';

import CalendarComponent from '../../components/Calendar';

export default function Calendar() {
  return (
    <Flex h="100vh">
      <Box
        h="100vh"
        id="calendarContainer"
        flex="3"
        minW={{ base: '100%', md: '73%' }}
      >
        <CalendarComponent />
      </Box>
    </Flex>
  );
}
