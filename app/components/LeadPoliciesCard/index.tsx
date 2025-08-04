import {
  Box, Card, CardBody, Table, Thead, Tbody, Tr, Th, Td, CardHeader, Heading, Center, Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import { useData } from '@/app/contexts/DataFetchContext';

import NewPolicyButton from '../NewPolicyButton';


const LeadPoliciesCard = () => {
  const {
    businessItems, selectedLead, getPersonById, getApplicationStatusById, getCarrierById, getCarrierPlanById,
  } = useData();
  const [filteredBusinessItems, setFilteredBusinessItems] = useState([]);

  useEffect(() => {
    if (selectedLead) {
      setFilteredBusinessItems(businessItems?.filter(item => item.person_id === selectedLead?.person_id));
    }
  }, [selectedLead, businessItems]);

  const hasNoPolicies = filteredBusinessItems.length === 0;

  return (
    <Card
      w="100%"
      h="100%"
      minH="100%"
      maxH="100%"
      overflow="auto"
      border="1px"
      borderColor="#EAEAEA"
      sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        '-ms-overflow-style': 'none', /* IE and Edge */
        'scrollbar-width': 'none', /* Firefox */
      }}
    >
      <CardHeader position="sticky" top={0} zIndex={1} bg="white"><Heading p={0} margin={0} size="sm">Policies</Heading></CardHeader>
      <CardBody paddingTop={0} height="100%" minH="100%">
        {hasNoPolicies ? (
          <Center flexDirection="column" height="100%" justifyContent="flex-startr">
            <Text fontSize="lg" mb={4}>There are no policies associated with this lead.</Text>
            <NewPolicyButton />
          </Center>
        ) : (
          <Table size="sm" variant="simple" height="100%">
            <Thead position="sticky" top="40px" zIndex={1} bg="white">
              <Tr>
                <Th>Person</Th>
                <Th>Carrier</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBusinessItems?.map((item) => {
                const carrier = getCarrierById(item.carrier_1);
                const plan = getCarrierPlanById(item.carrier_plan_1);
                const status = getApplicationStatusById(item.status);
                const person = getPersonById(item.person_id);
                return (
                  <Tr key={item.id}>
                    <Td>
                      {person?.first_name}
                      {' '}
                      {person?.last_name}
                    </Td>
                    <Td>{carrier?.carrier_name}</Td>
                    <Td>{plan?.plan_name}</Td>
                    <Td>{status?.status_value}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default LeadPoliciesCard;
