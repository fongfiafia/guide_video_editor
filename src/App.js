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
import Bottom from './component/bottom';

function App() {
  const [frames, setFrames] = useState([]); // 存储每一帧的图像数据

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={0}>
        <Nav />
        <Flex justifyContent="center" height="100%" width="100%" w="full" h='75vh' bg='#E1F3FF' color='white'>
          <HStack justifyContent={'space-around'} spacing={20}>
            <Video frames={frames} setFrames={setFrames} />
            <Settings />
          </HStack>
        </Flex>
        <Bottom frames={frames} />
      </VStack>
    </ChakraProvider >
  );
}

export default App;