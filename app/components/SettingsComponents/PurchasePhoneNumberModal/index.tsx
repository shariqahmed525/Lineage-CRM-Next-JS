import { SearchIcon } from '@chakra-ui/icons';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    HStack,
    FormControl,
    FormLabel,
    Input,
    IconButton,
    Tooltip,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';


const PurchasePhoneNumberModal = ({
    isOpen,
    onClose,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode,
    areaCode,
    setAreaCode,
    handleSubmit,
    isLoading,
    availableNumbers,
    setAvailableNumbers, // New prop
    searched,
    setSearched,
    fetchPhoneNumbers, // New prop
}) => {
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchasingNumber, setPurchasingNumber] = useState(null); // New state to track which number is being purchased
    const toast = useToast();

    const handlePurchase = async (phoneNumber) => {
        setIsPurchasing(true);
        setPurchasingNumber(phoneNumber); // Set the number being purchased
        try {
            const response = await fetch('/api/twilio/provisionPhoneNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Purchase successful:', data);
                fetchPhoneNumbers(); // Call the passed function to refresh the phone numbers
                setAvailableNumbers(availableNumbers?.filter(number => number.phoneNumber !== phoneNumber)); // Remove the purchased number from the available numbers list
                toast({
                    title: 'Purchase Successful',
                    description: `Phone number ${phoneNumber} successfully purchased.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error('Purchase failed:', data.error);
                toast({
                    title: 'Purchase Failed',
                    description: `Failed to purchase phone number ${phoneNumber}.`,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error purchasing phone number:', error);
        } finally {
            setIsPurchasing(false);
            setPurchasingNumber(null); // Reset the number being purchased
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent height="66vh">
                <ModalHeader>Purchase a New Phone Number</ModalHeader>
                <ModalCloseButton />
                <ModalBody paddingBottom={0} display="flex" flexDirection="column" maxHeight="66vh" overflow="hidden">
                    <Box>
                        <HStack spacing={4} alignItems="flex-end" bg="white">
                            <FormControl>
                                <FormLabel>City</FormLabel>
                                <Input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>State</FormLabel>
                                <Input placeholder="State" value={state} onChange={e => setState(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Zip</FormLabel>
                                <Input placeholder="Zip" value={zipCode} onChange={e => setZipCode(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Area Code</FormLabel>
                                <Input placeholder="Area Code" value={areaCode} onChange={e => setAreaCode(e.target.value)} />
                            </FormControl>
                            <Tooltip label="Search" fontSize="md">
                                <IconButton
                                    aria-label="Search"
                                    icon={<SearchIcon />}
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    bg="transparent"
                                    borderColor="#008D3F"
                                    color="#008D3F"
                                    borderWidth="1px"
                                    _hover={{ bg: 'transparent' }}
                                />
                            </Tooltip>
                        </HStack>
                    </Box>
                    <Box flex="1" overflowY="auto">
                        <Table variant="simple" paddingTop={10}>
                            <Thead position="sticky" top="0" bg="white" zIndex="sticky">
                                <Tr>
                                    <Th>Phone Number</Th>
                                    <Th>City</Th>
                                    <Th>State</Th>
                                    <Th>Zip</Th>
                                    <Th>Buy Now</Th>
                                </Tr>
                            </Thead>
                            {searched && availableNumbers.length === 0 ? (
                                <Text padding={10}>There are no phone numbers in your search. Set different options and try again</Text>
                            ) : (
                                <Tbody>
                                    {availableNumbers?.map(number => (
                                        <Tr key={number?.phoneNumber}>
                                            <Td>{number?.friendlyName}</Td>
                                            <Td>{number?.locality}</Td>
                                            <Td>{number?.region}</Td>
                                            <Td>{number?.postalCode}</Td>
                                            <Td>
                                                <Tooltip label="Buy now" fontSize="md">
                                                    <IconButton
                                                        aria-label="Buy now"
                                                        icon={<FaShoppingCart />}
                                                        onClick={() => handlePurchase(number?.phoneNumber)}
                                                        isLoading={isPurchasing && purchasingNumber === number?.phoneNumber} // Only show loading if this number is being purchased
                                                        bg="transparent"
                                                        borderColor="#008D3F"
                                                        color="#008D3F"
                                                        borderWidth="1px"
                                                        _hover={{ bg: 'transparent' }}
                                                        isDisabled={isPurchasing} // Disable all buttons while a purchase is in progress
                                                    />
                                                </Tooltip>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            )}
                        </Table>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PurchasePhoneNumberModal;
