import React from 'react';
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
  HStack
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box bg='tomato' w='100%' p={4} color='white' mb={4}>
        This is the Box
      </Box>
      <VStack>
        <Box w="full" h='70vh' bg='tomato' color='white'>
          <HStack>
            <Box w="80vh" h='60vh' bg='green' color='white'>

            </Box>
            <Box w="20vh" h='60vh' bg='blue' color='white'>

            </Box>
          </HStack>
        </Box>
        <Box w="full" h='20vh' bg='tomato' color='white'>
          dddd
        </Box>
      </VStack>
    </ChakraProvider >
  );
}

export default App;