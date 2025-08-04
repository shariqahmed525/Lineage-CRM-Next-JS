import { EditIcon } from '@chakra-ui/icons';
import {
    Button, Stack, Text, Flex,
} from '@chakra-ui/react';
import { useState } from 'react';


const CallerAccessComponent = () => {
    const [callerAccessOptions, setCallerAccessOptions] = useState(['Option 1', 'Option 2']);

    const addNewCallerAccessOption = () => {
        const newCallerAccessOption = prompt('Enter new caller access option:');
        if (newCallerAccessOption) {
            setCallerAccessOptions([...callerAccessOptions, newCallerAccessOption]);
        }
    };

    return (
        <Stack width="full" height="175px" maxWidth="100%">
            <Flex justify="space-between" align="center">
                <Text
                    lineHeight="1.5"
                    fontWeight="bold"
                    fontSize="16px"
                    color="text"
                >
          Caller Access
                </Text>
                <Button onClick={addNewCallerAccessOption} width="132px" colorScheme="green">
                    <Text
                        lineHeight="1.43"
                        fontWeight="bold"
                        fontSize="14px"
                        letterSpacing="0.1px"
                        color="white"
                        textAlign="center"
                    >
            Add New
                    </Text>
                </Button>
            </Flex>
            <Stack width="full" justify="flex-start" align="flex-start" spacing="9px">
                {callerAccessOptions?.map((option, index) => (
                    <Stack
                        key={index}
                        paddingStart="16px"
                        paddingEnd="4px"
                        paddingY="4px"
                        width="full"
                        direction="row"
                        justify="space-between"
                        align="center"
                        spacing="10px"
                        border="1px solid #E0E0E0"
                        borderRadius="8px"
                    >
                        <Text
                            fontWeight="semibold"
                            fontSize="14px"
                            letterSpacing="0.1px"
                            color="#000000"
                        >
                            {option}
                        </Text>
                        <Button>
                            <EditIcon />
                        </Button>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};

export default CallerAccessComponent;
