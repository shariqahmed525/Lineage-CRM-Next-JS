'use client';

import { Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  'use client';

  const router = useRouter();

  useEffect(() => {
    router.push('/leads');
  }, []);

  return (
    <Box />
  );
}
