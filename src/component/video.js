import { Box, Button, VStack, Input } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import dd from "../video/test.mp4";

export default function Video({ targetSec }) {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const timeInputRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [delayedTargetSec, setDelayedTargetSec] = useState(targetSec); // 新增一个状态用于存储延迟的 targetSec


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

    const seekToTime = () => {
        const timeInSeconds = parseFloat(timeInputRef.current.value);
        if (!isNaN(timeInSeconds)) {
            videoRef.current.currentTime = timeInSeconds;
            // 暂停视频播放
            videoRef.current.pause();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let animationFrameId;
        let isUnmounted = false;

        const renderFrame = () => {
            if (isUnmounted) return;
            console.log("111")
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
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
        // 当外部传入的 targetSec 发生变化时，将延迟处理 targetSec
        const timer = setTimeout(() => {
            setDelayedTargetSec(targetSec);
        }, 200); // 设置延迟时间，根据需求调整

        return () => {
            clearTimeout(timer); // 清除定时器
        };
    }, [targetSec]);

    useEffect(() => {
        // 当延迟的 targetSec 发生变化时，处理视频时间
        videoRef.current.currentTime = delayedTargetSec;
        videoRef.current.pause();

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    }, [delayedTargetSec]);



    return (
        <VStack justifySelf={'space-around'} spacing={10} h='700px'>
            <Box w="985px" h="534px" color='#2E2E2E' border={'solid'}>
                <canvas ref={canvasRef} width={985} height={534} >
                    <video ref={videoRef} src={dd} muted={false} controls={false} />
                </canvas>
            </Box>
            <Box w="50px" h="50px" color='#2E2E2E'>
                <Button onClick={togglePlay}>{isPlaying ? "暂停" : "播放"}</Button>
            </Box>
            <Box w="full" h="50px" color='#2E2E2E'>
                <Input
                    ref={timeInputRef}
                    type="number"
                    placeholder="跳转到时间（秒）"
                />
                <Button onClick={seekToTime}>跳转</Button>
            </Box>
        </VStack>
    );
}


