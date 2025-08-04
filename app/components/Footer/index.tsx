// Footer.tsx

'use client';

import {
  IconButton, Box, Flex, VStack, Image, Text, Link, Icon, useBreakpointValue, Spacer, Button, useDisclosure,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useContext, createContext } from 'react';
import {
  MdDashboard,
  MdDateRange,
  MdMap,
  MdFilterList,
  MdPeople,
  MdTask,
  MdBook,
  MdLeaderboard,
  MdSettings,
  MdHelpOutline,
  MdMenu, // Added for the menu icon
} from 'react-icons/md'; // Placeholder icons, replace with actual icons as needed


const Footer = ({ }) => {
  'use client';

  const { isOpen: isFilterDrawerOpen, onOpen: onFilterDrawerOpen, onClose: onFilterDrawerClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      align="start" // Changed from "center" to "start" to align items to the top
      justify="space-around"
      bg="#1E2832"
      height="100%"
    >
      {/* Leads Tab */}
      <Link as={NextLink} href="/leads" py="4" display="flex" flexDirection="column" alignItems="center">
        <NextImage src="/icons/leads.svg" alt="Leads Icon" width={24} height={24} />
        <Text color="white" fontSize="sm">Leads</Text>
      </Link>
      {/* Map Tab */}
      <Link as={NextLink} href="/map" py="4" display="flex" flexDirection="column" alignItems="center">
        <NextImage src="/icons/map.svg" alt="Map Icon" width={24} height={24} />
        <Text color="white" fontSize="sm">Map</Text>
      </Link>
      {/* Calendar Tab */}
      <Link as={NextLink} href="/calendar" py="4" display="flex" flexDirection="column" alignItems="center">
        <NextImage src="/icons/calendar.svg" alt="Calendar Icon" width={24} height={24} />
        <Text color="white" fontSize="sm">Calendar</Text>
      </Link>
      {/* Calendar Tab */}
      <Box py="4" display="flex" flexDirection="column" alignItems="center" />
    </Flex>
  );
};

export default Footer;
