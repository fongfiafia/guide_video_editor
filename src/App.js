import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Container,
  SimpleGrid,
  HStack,
  Center,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Nav from './component/nav';
import Settings from './component/settings';
import Video from './component/video';
import MyBottom from './component/botoom';

function App() {
  const [second, setSecond] = useState(0);

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={0}>
        <Nav />
        <Flex justifyContent="center" height="100%" width="100%" w="full" h='75vh' bg='#E1F3FF' color='white'>
          <HStack justifyContent={'space-around'} spacing={20}>
            <Video targetSec={second} />
            <Settings />
          </HStack>
        </Flex>
        <MyBottom setSecond={setSecond} />
      </VStack>
    </ChakraProvider >
  );
}

export default App;