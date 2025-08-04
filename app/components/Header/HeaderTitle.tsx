'use client';

import { Text } from '@chakra-ui/react';

interface Props {
  title: string;
}

const HeaderTitle = ({ title }: Props) => (
  <Text
    ml={{ base: '0', md: '2' }}
    width="100%"
    fontSize="lg"
    fontWeight="bold"
    color="#0C2115"
  >
    {title}
  </Text>
);

export default HeaderTitle;
