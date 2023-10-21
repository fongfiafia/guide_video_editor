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
import MyBottom from './component/botoom';
import VideoWebGLRenderer from './component/threeTest'

function App() {
  const [second, setSecond] = useState(0);

  return (
    <ChakraProvider theme={theme}>

      <VideoWebGLRenderer seekTime={second} />

      <MyBottom setSecond={setSecond} />

      {/* <VStack spacing={0}>
        <Nav />
        <Flex justifyContent="center" height="100%" width="100%" w="full" h='75vh' bg='#E1F3FF' color='white'>
          <HStack justifyContent={'space-around'} spacing={20}>
            <Video targetSec={second} startTime={2} endTime={8} />
            <Settings />
          </HStack>
        </Flex>
        <MyBottom setSecond={setSecond} />
      </VStack> */}
    </ChakraProvider >
  );
}

export default App;