import React, { useRef, useEffect, useState } from "react";
import { Box, Button, VStack, Input } from "@chakra-ui/react";
import { throttle } from 'lodash';
import { Timeline } from "vis-timeline/standalone";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import "vis-timeline/dist/vis-timeline-graph2d.css";
import dd from "./video/test.mp4";
import {
  ChakraProvider,
  theme,
  HStack,
  Flex,
} from '@chakra-ui/react';
import Nav from './component/nav';

function App() {
  const [second, setSecond] = useState(0);
  const canvasRefSettings = useRef(null);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      const canvas2 = canvasRefSettings.current;
      const context2 = canvas2.getContext("2d")

      context2.drawImage(videoRef.current, 0, 0, canvas2.width, canvas2.height);
    } else {
      videoRef.current.play().catch((error) => {
        console.log("Error playing video:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    let isUnmounted = false;

    const renderFrame = () => {
      if (isUnmounted) return;

      // const currentTime = videoRef.current.currentTime;
      // console.log(startTime, endTime, currentTime)
      // if (currentTime >= startTime && currentTime <= endTime) {
      // scaleLa  rgeSmoothly(); // Call the scaling function
      // } else {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      if (!isPlaying) {
        return
      }
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const startRendering = () => {
      if (videoRef.current.readyState >= 3) {
        // 检查是否需要自动播放
        if (isPlaying) {
          videoRef.current.play().catch((error) => {
            console.log("Error playing video:", error);
          });
        }
        renderFrame();
      } else {
        videoRef.current.addEventListener("canplay", startRendering);
      }
    };

    const stopRendering = () => {
      videoRef.current.pause();
      cancelAnimationFrame(animationFrameId);
      isUnmounted = true;
    };

    startRendering();

    return () => {
      stopRendering();
    };
  }, [isPlaying]);

  useEffect(() => {
    videoRef.current.pause();
    videoRef.current.currentTime = second;
    videoRef.current.playbackRate = 2;

    console.log("current vidoe time", videoRef.current.currentTime, Date.now())

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const canvas2 = canvasRefSettings.current;
    const context2 = canvas2.getContext("2d")

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    context2.drawImage(videoRef.current, 0, 0, canvas2.width, canvas2.height); // 这里会出现问题。 我们想实现这里的canvas 和外部的cnavas鲜果一样，然后选取。

    console.log("done", videoRef.current.currentTime, Date.now())

  }, [second]);

  function scaleLargeSmoothly() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    const targetWidth = width * 1.5;
    const targetHeight = height * 1.5;

    const scaleRatio = 0.05;

    const centerX = width / 2; // 计算画面中心点的 x 坐标
    const centerY = height / 2; // 计算画面中心点的 y 坐标

    const animate = () => {
      if (width < targetWidth || height < targetHeight) {
        width += (targetWidth - width) * scaleRatio;
        height += (targetHeight - height) * scaleRatio;

        const startX = centerX - (width / 2); // 计算绘制起点的 x 坐标
        const startY = centerY - (height / 2); // 计算绘制起点的 y 坐标

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, startX, startY, width, height);
        requestAnimationFrame(animate);

      }
    };
    animate();
  }

  function scaleSmallSmoothly() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;

    const targetWidth = width * 0.5; // 假设要缩小到原来的一半大小
    const targetHeight = height * 0.5;
    const scaleRatio = 0.05; // 调整步长以控制缩小速度

    const centerX = width / 2; // 计算画面中心点的 x 坐标
    const centerY = height / 2; // 计算画面中心点的 y 坐标

    const animate = () => {
      if (width > targetWidth || height > targetHeight) {
        width -= (width - targetWidth) * scaleRatio;
        height -= (height - targetHeight) * scaleRatio;

        const startX = centerX - (width / 2); // 计算绘制起点的 x 坐标
        const startY = centerY - (height / 2); // 计算绘制起点的 y 坐标

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, startX, startY, width, height);

        requestAnimationFrame(animate);
      }
    };

    animate();
  }


  const timelineRef = useRef(null);

  useEffect(() => {
    const container = timelineRef.current;
    container.classList.add("vis", "timeline");
    const options = {
      orientation: 'top',
      min: 0,
      max: 20000, // 20秒，以毫秒为单位
      // step: 1000, // 1秒，以毫秒为单位
      start: 0,
      end: 20000,
      zoomable: false,
      stack: false, // 禁用事件元素的堆叠
      format: {
        minorLabels: {
          second: 's [s]',
        },
      },
      showCurrentTime: true,
      groupOrder: 'y', // 根据轨道（y 值）进行排序    
    };


    // 创建时间轴
    // var timeline = new vis.Timeline(container, items, groups, options);

    const timeline = new Timeline(container);
    timeline.setOptions(options);
    timeline.addCustomTime(0);


    const handleMouseMove = throttle((event) => {
      const xPos = event.clientX - container.getBoundingClientRect().left;
      const timelineSection = timelineRef.current.querySelector('.vis-text.vis-minor.vis-odd');
      const timelineSecWidth = timelineSection.offsetWidth;
      const oddList = timelineRef.current.querySelectorAll('.vis-text.vis-minor.vis-odd');
      const eventList = timelineRef.current.querySelectorAll('.vis-text.vis-minor.vis-even');
      const totalSec = oddList.length + eventList.length - 1;
      const perPxSec = 20 / (totalSec * timelineSecWidth);
      const curTime = (perPxSec * xPos).toFixed(2);
      console.log("set", Date.now())
      setSecond(curTime);

    }, 100); // 控制节流的时间间隔，例如 20 毫秒

    // 监听鼠标移动事件
    container.addEventListener("mousemove", handleMouseMove);


    // 创建用于存储每一帧的事件数据的数组
    // const items = frames.map((frame, index) => ({
    //     id: index,
    //     content: `<img src="${frame}" width="${frameWidth}" height="${frameHeight}" />`,
    //     start: new Date(), // 根据需要设置帧的时间戳
    // }));

    var items = []
    items.push({
      id: 0,
      group: 0,
      start: '0000',
      end: '20000',
      type: "range",
      content: "Item " + 0,
    });

    // items.push({
    //     id: 3,
    //     group: 1,
    //     start: '1000',
    //     end: '2000',
    //     type: "range",
    //     content: "Item " + 0,
    // });

    items.push({
      id: 4,
      group: 1,
      start: '2000',
      end: '8000',
      type: "range",
      content: "Item " + 1,
    });

    var groups = []
    groups.push({
      id: 0,
      order: 0,
    });
    groups.push({
      id: 1,
      order: 1,
    });


    // 添加事件到时间轴
    timeline.setItems(items)
    timeline.setGroups(groups)


    // 可以根据需要自定义时间轴的其他配置

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      timeline.destroy(); // 清理时间轴
    };
  }, [])


  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={0}>
        <Nav />
        <Flex justifyContent="center" height="full" width="full" bg='#E1F3FF' color='white'>
          <HStack justifyContent={'space-around'} spacing={20}>
            {/* <Video canvasRef={canvasRefSettings} targetSec={second} startTime={2} endTime={8} /> */}
            {/* video */}
            <VStack justifySelf={'space-around'} spacing={10} h='700px' pt={10}>
              <Box w="985px" h="534px" color='#2E2E2E'>
                <canvas ref={canvasRef} width={985} height={534} >
                  <video ref={videoRef} src={dd} muted={false} controls={false} />
                </canvas>
              </Box>
              <Box w="50px" h="50px" color='#2E2E2E'>
                <Button onClick={togglePlay}>{isPlaying ? "暂停" : "播放"}</Button>
              </Box>
              <Box w="full" h="50px" color='#2E2E2E'>
                {/* <Input
                    ref={timeInputRef}
                    type="number"
                    placeholder="跳转到时间（秒）"
                /> */}
                <Button onClick={scaleLargeSmoothly}>放大</Button>
                <Button onClick={scaleSmallSmoothly}>缩小</Button>
              </Box>
            </VStack>
            {/* video */}


            {/* settings */}
            {/* <Settings canvasRef={canvasRefSettings} /> */}
            <Box w="600px" h='700px' bg='#EDEDED'>
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
                        <canvas ref={canvasRefSettings} width={500} height={300} >
                        </canvas>
                      </Box>
                    </TabPanel>
                    <TabPanel>
                      <p>two!</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Box>
            {/* settings */}
          </HStack>
        </Flex>
        {/* <MyBottom setSecond={setSecond} /> */}

        <Box h='20vh' w='full' bg='gray.200'>
          <div ref={timelineRef} style={{ width: "100%", height: "100%" }}></div>
        </Box >
      </VStack>
    </ChakraProvider >
  );
}

export default App;