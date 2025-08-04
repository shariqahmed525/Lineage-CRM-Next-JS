'use client';

import '../globals.css';
import { ChakraProvider, Flex, Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useEffect } from 'react';

import { createClient } from '../../utils/supabase/client.ts'; // Adjust the path as necessaryImport createClient from supabase
import Footer from '../components/Footer';
import HeaderComponent from '../components/Header';
import InitializeTrackers from '../components/InitializeTrackers';
import Sidebar from '../components/Sidebar';
import { DataProvider } from '../contexts/DataFetchContext';
import { LeadsProvider } from '../contexts/LeadsContext';
import { NavSizeProvider, useNavSizeContext } from '../contexts/NavSizeContext';

interface RootLayoutProps {
  children: ReactNode;
}
const MainContentBox = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const supabase = createClient();
    async function fetchUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log('Yo here be the user!', user)
      if (user) {
        const APP_ID = 'ygw8scj3'; // Your actual workspace ID from Intercom
        window.intercomSettings = {
          app_id: APP_ID,
          name: user.name, // User's name
          email: user.email, // User's email
          user_id: user.id, // User's ID
        };
        (function () {
          const w = window;
          const ic = w.Intercom;
          if (typeof ic === 'function') {
            ic('update', w.intercomSettings);
          } else {
            const d = document;
            const i = function () {
              i.c(arguments);
            };
            i.q = [];
            i.c = function (args) {
              i.q.push(args);
            };
            w.Intercom = i;
            const l = function () {
              const s = d.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src = `https://widget.intercom.io/widget/${APP_ID}`;
              const x = d.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s, x);
            };
            if (d.readyState === 'complete') {
              l();
            } else if (w.attachEvent) {
              w.attachEvent('onload', l);
            } else {
              w.addEventListener('load', l, false);
            }
          }
        })();
      }
    }
    fetchUserData();
  }, []);

  useEffect(
    () => () => {
      if (typeof window.Intercom === 'function') {
        window.Intercom('shutdown');
      }
    },
    []
  ); // The empty dependency array ensures this effect runs only once

  const { navSize } = useNavSizeContext(); // Use useNavSizeContext

  // Adjust marginLeft and width based on navSize
  const marginLeft = navSize === 'small' ? '75px' : { base: '0', md: '15%' };
  const width =
    navSize === 'small' ? 'calc(100% - 75px)' : { base: '100%', md: '85%' };

  return (
    <Flex
      id="main-content-box"
      height="100%"
      width="100%"
      marginLeft={marginLeft}
    >
      <Box
        id="header-container"
        maxHeight="50px"
        height="8%"
        width={width}
        position="absolute"
        zIndex={99999}
      >
        <HeaderComponent />
      </Box>
      <Box
        height="100%"
        width={width}
        paddingTop="64px"
        scrollPaddingTop="64px"
        position="absolute"
      >
        {children}
      </Box>
    </Flex>
  );
};

const queryClient = new QueryClient();

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <DataProvider>
            <LeadsProvider>
              <NavSizeProvider>
                <InitializeTrackers shouldInitTrackers={true}>
                  <Box
                    width="100vw"
                    height="100vh"
                    position="fixed"
                    overflow="hidden"
                    flexShrink={0}
                  >
                    <Box
                      height="100%"
                      width="100%"
                      position="absolute"
                      overflow="hidden"
                      display={{ base: 'none', md: 'block' }}
                    >
                      <Sidebar />
                    </Box>
                    <MainContentBox>{children}</MainContentBox>
                    <Box
                      id="footerContainer"
                      height="10%"
                      position="absolute"
                      bottom="0"
                      width="100%"
                      display={{ base: 'block', md: 'none' }} // Adjusted to hide the sidebar on small devices
                      zIndex="999999"
                    >
                      <Footer />
                    </Box>
                  </Box>
                </InitializeTrackers>
              </NavSizeProvider>
            </LeadsProvider>
          </DataProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </body>
  </html>
);

export default RootLayout;
