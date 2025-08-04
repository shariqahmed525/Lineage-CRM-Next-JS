/**
 * We needed to add a custom ChakraProvider to allow Chakra to play nicely with React Server Components
 * in Next.js. Here is the link to that tutorial: https://chakra-ui.com/getting-started/nextjs-app-guide#installation
 */
'use client'

import { ChakraProvider } from '@chakra-ui/react'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

export default Providers;
