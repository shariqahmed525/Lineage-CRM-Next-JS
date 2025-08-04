import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import { Tables } from '../../../types/types';

interface PersonsTableProps {
  persons: Tables<'persons'>[];
}

const PersonsTable = ({ persons }: PersonsTableProps) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Age</Th>
          <Th>Email</Th>
          <Th>Primary Phone</Th>
          <Th>Secondary Phone</Th>
        </Tr>
      </Thead>
      <Tbody>
        {persons?.map((person) => (
          <Tr key={person.person_id}>
            <Td>{`${person.first_name} ${person.last_name}`}</Td>
            <Td>{person.age}</Td>
            <Td>{person.email_address}</Td>
            <Td>{person.phone1}</Td>
            <Td>{person.phone2}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default PersonsTable;