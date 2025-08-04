"use client";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import InitializeTrackers from "../components/InitializeTrackers";
import CustomChakraProvider from "../providers/customChakraProvider";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  "use client";

  return (
    <html>
      <body>
        <CustomChakraProvider>
          <InitializeTrackers shouldInitTrackers={false}>
            <Box
              h="100vh"
              w="100vw"
              display="flex"
              flexDirection="column"
              alignItems={{ base: "start", sm: "center" }}
              justifyContent="start"
              bg="#F3F3F3"
              id="login-layout"
            >
              {/* Logo in the top left above sm breakpoint */}
              <Box
                display={{ base: "none", md: "flex" }}
                alignSelf="flex-start"
                p={8}
                id="login-logo-container"
              >
                <Link href="/" passHref>
                  <Image
                    src="/lineage-crm-stacked-dark.png"
                    alt="Lineage Logo"
                    width={75}
                    height={75}
                  />
                </Link>
              </Box>

              {/* Center content */}
              <Box
                w="100%"
                flexGrow={1}
                display="flex"
                alignItems={{ base: "center", sm: "center" }}
                justifyContent="center"
                id="login-content"
              >
                {children}
              </Box>
            </Box>
          </InitializeTrackers>
        </CustomChakraProvider>
      </body>
    </html>
  );
};

export default LoginLayout;
