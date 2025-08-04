// Sidebar.tsx

"use client";

import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Spacer,
  Text,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  MdBook,
  MdDashboard,
  MdDateRange,
  MdHelpOutline,
  MdLeaderboard,
  MdMap,
  MdMenu, // Added for the menu icon
  MdSettings,
  MdTask,
} from "react-icons/md"; // Placeholder icons, replace with actual icons as needed

import { useNavSizeContext } from "../../contexts/NavSizeContext";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string; // Add label prop
  href: string;
  isBottom: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = React.memo(({
  icon,
  label,
  href,
  isBottom,
}) => {
  "use client";

  const pathname = usePathname();
  const isActive = pathname === href || (href === "/leads" && pathname === "/");

  const bgGradient = "linear(to-r, #1E2832, #008D3F)";
  const activeBgGradient = isActive ? bgGradient : "";
  const { navSize } = useNavSizeContext();

  return (
    <Tooltip label={label} hasArrow placement="right">
      <Link
        display="flex"
        alignItems="left"
        justifyContent={isBottom ? "space-between" : "flex-start"}
        px="5"
        py="3"
        borderRadius="md"
        bgGradient={activeBgGradient}
        _hover={{
          bgGradient,
          textDecoration: "none",
        }}
        color={isBottom ? "gray.400" : "white"}
        fontWeight="normal"
        width="full"
        href={href}
        as={NextLink}
      >
        <Icon as={icon} w={7} h={7} />
        {navSize !== "small" && (
          <Text paddingLeft={4} fontSize="sm">{label}</Text>
        )}
        {isBottom && <Spacer />}
      </Link>
    </Tooltip>
  );
});

const Sidebar = () => {
  "use client";

  const { navSize, setNavSize } = useNavSizeContext();

  const toggleNavSize = React.useCallback(() => {
    setNavSize(navSize === "small" ? "large" : "small");
  }, [navSize, setNavSize]);

  return (
    <Flex
      position="relative" // Relative positioning to place the chevron button absolutely within
      bg="#1E2832"
      h="100%"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      w={navSize === "small" ? "75px" : "15%"}
      flexDir="column"
      justifyContent="space-between"
      transition="all 0.5s"
      zIndex="100000"
    >
      {/* Chevron button positioned absolutely to float in the middle right */}
      <Tooltip
        label={navSize === "small" ? "Open Sidebar" : "Close Sidebar"}
        hasArrow
        placement="right"
      >
        <IconButton
          position="absolute"
          right="-10px" // Adjusted to bring the button slightly inwards
          top="50%"
          transform="translateY(-50%)"
          aria-label={navSize === "small" ? "Open Sidebar" : "Close Sidebar"}
          background="lightgray"
          borderRadius="50%"
          padding="0" // Remove padding to reduce the size of the circular background
          width="30px" // Set width to fit the icon size
          height="30px" // Set height to fit the icon size
          minWidth="auto" // Override minimum width to allow button to be smaller
          minHeight="auto" // Override minimum height to allow button to be smaller
          _hover={{
            background: "lightgray",
          }}
          display={["none", "none", "flex"]} // 'none' for base and sm, 'flex' from md upwards
          icon={navSize === "small"
            ? <FaChevronRight color="black" />
            : <FaChevronLeft color="black" />}
          onClick={toggleNavSize}
        />
      </Tooltip>
      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize ? "left" : "flex"}
        as="nav"
        height="100%"
      >
        <Box p="4" width="full">
          {/* Conditional rendering based on isSidebarOpen */}
          <Image
            src={navSize === "small"
              ? "/lineage-crm-stacked.png"
              : "/lineage-crm.png"}
            alt="Lineage Logo"
            transition="all 0.5s"
            w={navSize === "small" ? "50px" : "150px"}
            h={navSize === "small" ? "50px" : "auto"}
          />
        </Box>
        {/* Other sidebar items */}
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/leads.svg"
              alt="Leads Icon"
              width={20}
              height={20}
            />
          )}
          href="/leads"
          label="Leads"
          isBottom={false}
        />
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/map.svg"
              alt="Map Icon"
              width={20}
              height={20}
            />
          )}
          href="/map"
          label="Map"
          isBottom={false}
        />
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/calendar.svg"
              alt="Calendar Icon"
              width={20}
              height={20}
            />
          )}
          href="/calendar"
          label="Calendar"
          isBottom={false}
        />
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/business.svg"
              alt="Policies Icon"
              width={20}
              height={20}
            />
          )}
          href="/policies"
          label="Policies"
          isBottom={false}
        />
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize ? "left" : "flex-start"}
        mb={4}
      >
        {/* Custom styled sidebar items for the bottom */}
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/analytics.svg"
              alt="Analytics Icon"
              width={20}
              height={20}
            />
          )}
          href="/analytics"
          label="Analytics"
          isBottom
        />
        <SidebarItem
          icon={() => (
            <NextImage
              src="/icons/settings.svg"
              alt="Settings Icon"
              width={20}
              height={20}
            />
          )}
          href="/settings"
          label="Settings"
          isBottom
        />
      </Flex>
    </Flex>
  );
};

export default Sidebar;
