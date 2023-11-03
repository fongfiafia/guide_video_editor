import React, { useRef, useEffect, useState } from "react";
import { Box, Button, VStack, Input, Center } from "@chakra-ui/react";
import { throttle } from 'lodash';
import { Timeline } from "vis-timeline/standalone";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import "vis-timeline/dist/vis-timeline-graph2d.css";
// import dd from "./video/test.mp4";
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
  const [videoDuration, setVideoDuration] = useState(0);
  let timelineTmp = null;

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  var items = []
  var groups = []

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

  // function scaleLargeSmoothly(x, y) {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   let width = canvas.width;
  //   let height = canvas.height;

  //   const targetWidth = width * 2;
  //   const targetHeight = height * 2;

  //   const scaleRatio = 0.05;

  //   console.log("x y is ", x, y)
  //   const centerX = x; // 使用指定的 x 坐标作为中心点的 x 坐标
  //   const centerY = y; // 使用指定的 y 坐标作为中心点的 y 坐标

  //   // ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   // // *2 表示乘以倍数
  //   console.log("lage width height", x - x * 2, y - y * 2)
  //   ctx.drawImage(videoRef.current, x - x * 2, y - y * 2, targetWidth, targetHeight);



  //   // animate();
  // }

  function scaleLargeSmoothly(x, y) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const targetWidth = width * 2;
    const targetHeight = height * 2;
    const scaleRatio = 0.06;

    // 定义动画的状态
    let currentWidth = width;
    let currentHeight = height;

    // 创建动画循环
    function animate() {
      // console.log("csss", targetWidth - currentWidth, targetHeight - currentHeight)
      if ((targetWidth - currentWidth) < scaleRatio || (targetHeight - currentHeight) < scaleRatio) {
        return
      }
      if (currentWidth < targetWidth || currentHeight < targetHeight) {
        // 逐渐增加宽度和高度
        currentWidth += (targetWidth - currentWidth) * scaleRatio;
        currentHeight += (targetHeight - currentHeight) * scaleRatio;

        const startX = - (currentWidth * (x / width) - x);
        const startY = - (currentHeight * (y / height) - y);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, startX, startY, currentWidth, currentHeight);


        requestAnimationFrame(animate);
      }
    }

    // 启动动画
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
  const container = timelineRef.current;
  container.classList.add("vis", "timeline");
  const timeline = new Timeline(container);

  useEffect(() => {


    let rounded = Math.round(videoDuration)
    // 表示还没有导入视频
    if (rounded === 0) {
      return
    }
    console.log("rounded ", rounded)
    const options = {
      orientation: 'top',
      min: 0,
      max: rounded * 1000, // 20秒，以毫秒为单位
      step: 1000, // 1秒，以毫秒为单位
      start: 0,
      end: rounded * 1000,
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

    items.push({
      id: 0,
      group: 0,
      start: '0',
      end: rounded * 1000,
      type: "range",
      content: "",
    });
    groups.push({
      id: 0,
      order: 0,
    });

    // 添加事件到时间轴
    timeline.setItems(items)
    timeline.setGroups(groups)

    timelineTmp = timeline;


    // 可以根据需要自定义时间轴的其他配置
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      timeline.destroy(); // 清理时间轴
    };
  }, [videoDuration])


  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      videoRef.current.src = videoURL;
      videoRef.current.load();

      videoRef.current.onloadedmetadata = () => {
        // 获取视频的总时长（以秒为单位）
        const videoDuration = videoRef.current.duration;
        setVideoDuration(videoDuration)
        console.log("视频时长（秒）：" + videoDuration);
      };
    }
  };

  // 鼠标按下事件处理函数
  const handleMouseDown = (event) => {
    const settingsCanvasWidth = canvasRefSettings.current.offsetWidth;
    const settingsCanvasHeight = canvasRefSettings.current.offsetHeight;

    const canvasWidth = canvasRef.current.offsetWidth;
    const canvasHeight = canvasRef.current.offsetHeight;


    // 获取鼠标在 canvasRefSettings 上的坐标
    const xOnSettingsCanvas = event.nativeEvent.offsetX;
    const yOnSettingsCanvas = event.nativeEvent.offsetY;

    // 使用转换函数将坐标映射到 canvasRef 上
    const xOnMainCanvas = Math.round((xOnSettingsCanvas / settingsCanvasWidth) * canvasWidth)
    const yOnMainCanvas = Math.round((yOnSettingsCanvas / settingsCanvasHeight) * canvasHeight)

    // 在这里你可以使用 xOnMainCanvas 和 yOnMainCanvas 来执行你的操作
    console.log('Mouse Down on canvasRefSettings:');
    console.log('xOnSettingsCanvas:', xOnSettingsCanvas);
    console.log('yOnSettingsCanvas:', yOnSettingsCanvas);
    console.log('xOnMainCanvas:', xOnMainCanvas);
    console.log('yOnMainCanvas:', yOnMainCanvas);

    scaleLargeSmoothly(xOnMainCanvas, yOnMainCanvas)
  };

  function newZoomTrack() {
    //  用来放置zoom 轨道
    items.push({
      id: 4,
      group: 1,
      start: '2000',
      end: '8000',
      type: "range",
      content: "Item " + 1,
    });

    groups.push({
      id: 1,
      order: 1,
    });
    console.log(groups)
    // console.log(timelineTmp.getVisibleItems())
  }

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={0}>
        {/* <Nav /> */}

        <Box bg='gray.200' w='full' h='5vh' color='white'>
          <HStack>
            <Input
              type="file"
              accept="video/mp4"
              ref={fileInputRef}
              onChange={handleFileChange}
              display={"none"}
            />
            <Box>
              <Button colorScheme='blue' size={"sm"} onClick={() => {
                // Trigger the file input dialog
                fileInputRef.current.click();
              }}>Upload video</Button>
            </Box>

          </HStack>

        </Box>

        <Flex justifyContent="center" height="full" width="full" bg='#E1F3FF' color='white'>
          <HStack justifyContent={'space-around'} spacing={20}>
            {/* <Video canvasRef={canvasRefSettings} targetSec={second} startTime={2} endTime={8} /> */}
            {/* video */}
            <VStack justifySelf={'space-around'} spacing={10} h='700px' pt={10}>
              <Box w="985px" h="534px" color='#2E2E2E'>
                <canvas ref={canvasRef} width={985} height={534} >
                  {/* <video ref={videoRef} src={dd} muted={false} controls={false} /> */}
                  <video ref={videoRef} muted={false} controls={false} />
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
                {/* <Button onClick={scaleLargeSmoothly}>放大</Button>
                <Button onClick={scaleSmallSmoothly}>缩小</Button> */}
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
                        <canvas ref={canvasRefSettings} width={500} height={300} onMouseDown={handleMouseDown}>
                        </canvas>
                      </Box>
                      <Button mt={5} onClick={newZoomTrack}>
                        确定？
                      </Button>
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