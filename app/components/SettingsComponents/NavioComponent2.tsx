import { Stack, Text, Switch } from '@chakra-ui/react';
import { useState } from 'react';

const NavioComponent2 = () => {
  const [isEnable, setIsEnable] = useState(false);
  const handleToggle = () => setIsEnable(!isEnable);

  return (
    <Stack
      padding="24px"
      borderRadius="8px"
      direction="row"
      justify="space-between"
      spacing="10px"
      borderColor="grey 2"
      borderStartWidth="1px"
      borderEndWidth="1px"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      width="full"
      maxWidth="100%"
      mb="4"
    >
      <Text>
        The record call feature will automatically charge you $5 per month from your
        balance
      </Text>
      <Stack direction="row" spacing="8px">
        <Text fontSize="md">
          {isEnable ? "Disable call recording" : "Enable call recording"}
        </Text>
        <Switch colorScheme="green" isChecked={isEnable} onChange={handleToggle} />
      </Stack>
    </Stack>
  );
};

export default NavioComponent2;
