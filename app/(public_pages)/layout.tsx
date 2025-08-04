"use client";

import { Box, ChakraProvider, Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { ReactNode } from "react";

import {
  NavSizeProvider,
  useNavSizeContext,
} from "@/app/contexts/NavSizeContext";

interface RootLayoutProps {
  children: ReactNode;
}

const MainContentBox = ({ children }: { children: ReactNode }) => {
  const { navSize } = useNavSizeContext(); // Use useNavSizeContext

  // Adjust marginLeft and width based on navSize
  const marginLeft = navSize === "small" ? "75px" : { base: "0", md: "0" };
  const width = navSize === "small" ? "calc(100% - 75px)" : "100%";

  return (
    <Flex
      id="main-content-box"
      height="100%"
      width="100%"
      marginLeft={marginLeft}
      flexDirection="column"
    >
      <Box
        id="header-container"
        maxHeight="50px"
        height="50px"
        width="100%"
        position="fixed"
        zIndex={99999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#1E2832" // Set the background color for the entire header
      >
        <NextLink href="/" passHref>
          <Link>
            <Image
              src="/lineage-crm-stacked.png"
              alt="Lineage Logo"
              height="40px"
            />
          </Link>
        </NextLink>
      </Box>
      <Box
        height="100%"
        width={width}
        paddingTop="50px" // Adjust padding to ensure content scrolls behind the header
        scrollPaddingTop="50px"
        position="relative"
      >
        {children}
      </Box>
    </Flex>
  );
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <ChakraProvider>
        <NavSizeProvider>
          <Box
            width="100vw"
            height="100vh"
            position="fixed"
            overflow="hidden"
            flexShrink={0}
          >
            <MainContentBox>
              {children}
            </MainContentBox>
          </Box>
        </NavSizeProvider>
      </ChakraProvider>
    </body>
  </html>
);

export default RootLayout;
