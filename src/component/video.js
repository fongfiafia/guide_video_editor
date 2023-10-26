import { Box, Button, VStack, Input } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import dd from "../video/test.mp4";

export default function Video({ targetSec, canvasRefSettings, startTime, endTime }) {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
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
        videoRef.current.currentTime = targetSec;
        videoRef.current.playbackRate = 4;

        console.log("current vidoe time", videoRef.current.currentTime, Date.now())

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");


        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        console.log("done", videoRef.current.currentTime, Date.now())

    }, [targetSec]);

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

    return (
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
    );
}


