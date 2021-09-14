import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Navbar from '../src/components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Navbar pageProps={undefined} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
