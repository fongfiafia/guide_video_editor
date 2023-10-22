import { Box, Spacer } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Settings({ canvasRef }) {
    return <Box w="600px" h='700px' bg='#EDEDED'>
        <Box pt={10} pl={10}>
            <Tabs variant='soft-rounded' colorScheme='green'>
                <TabList>
                    <Tab>Zoom Setting</Tab>
                    <Tab>Tab 2</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel >
                        <strong>Pick a point to Zoom</strong>

                        <Box w={500} h={300} border={'solid'} mt={2}>
                            <canvas ref={canvasRef} width={985} height={534} ></canvas>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Box>
}