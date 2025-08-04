"use client";

import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

import { useLeads } from "@/app/contexts/LeadsContext";

import HeaderTitle from "./HeaderTitle";
import { createClient } from "../../../utils/supabase/client";

const Header = () => {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [allLeadsCount, setAllLeadsCount] = useState<number>(0); // New state variable
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const { filteredLeads } = useLeads();
  const totalFilteredLeads = filteredLeads.length;

  const [title, setTitle] = useState<string>();

  useEffect(() => {
    const segments = segment ? segment.split("/").filter(Boolean) : [];
    const formattedTitle = segments
      .slice(0, 3)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" > ");

    setTitle(formattedTitle);
  }, [segment]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to fetch user in header:", error.message);
        return;
      }
      setUser(user);
    };

    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchAllLeadsCount = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id", { count: "exact" });
      if (error) {
        console.error("Failed to fetch total leads count:", error.message);
        return;
      }
      setAllLeadsCount(data.length);
    };

    fetchAllLeadsCount();
  }, [supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to sign out:", error.message);
      return;
    }
    // Redirect to login page
    router.refresh();
    router.push("/login");
  };

  return (
    <Flex
      as="header"
      sx={{
        justifyContent: "space-between",
        bg: "white",
        boxShadow: "sm",
        height: "100%",
      }}
      padding={["8", "8", "8", "8"]} // Responsive Padding
      alignItems="center"
      width="100%"
      align="center"
      justify="space-between"
      px="4"
      bg="white"
      boxShadow="sm"
      height="100%"
      borderBottom="1px"
      borderColor="gray.200"
      zIndex={9999}
    >
      <Flex
        width="auto"
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        zIndex="9999"
      >
        {title && <HeaderTitle title={title} />}
        <Text
          mx="auto"
          p={2}
          width="full"
          minWidth="full"
          fontSize={{ base: "xs", md: "sm" }}
          color="#4D4D4D"
        >
          {`${totalFilteredLeads} of ${allLeadsCount}`}
        </Text>
      </Flex>

      <Box display="flex" alignItems="center">
        {/* Display settings and help icons on smaller breakpoints and hide them on larger breakpoints */}
        <Box display={{ base: "flex", md: "none" }} alignItems="center">
          <IconButton
            as={NextLink}
            href="/settings"
            aria-label="Settings"
            variant="ghost"
            size="md"
            icon={
              <Image
                src="./icons/settings-black.svg"
                alt="Settings"
                width={24}
                height={24}
              />
            }
            mr="4"
          />
          {
            /* <IconButton
            as={NextLink}
            href="/help"
            aria-label="Help"
            variant="ghost"
            size="md"
            icon={<Image src="./icons/help-black.svg" alt="Help" width={24} height={24} />}
    mr="4"
          /> */
          }
        </Box>
        <Popover>
          <PopoverTrigger>
            <Box display="flex" alignItems="center">
              <Avatar
                size="sm"
                name={user?.email || ""}
                src={user?.phone || "path-to-avatar-image"}
                cursor="pointer"
              />
              {/* Hide email on smaller screens and show on larger screens */}
              <Text
                as="span"
                ml="2"
                display={["none", "none", "block"]}
                fontSize={{ base: "xs", md: "sm" }}
                color="#4D4D4D"
              >
                {user?.email || ""}
              </Text>
            </Box>
          </PopoverTrigger>
          <PopoverContent zIndex={10000} position="sticky">
            <PopoverBody position="sticky">
              <Button onClick={handleSignOut} variant="ghost">
                Sign out
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Flex>
  );
};

export default Header;
