import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/dist/vis-timeline-graph2d.css";

export default function MyTimeline({ frames, frameWidth, frameHeight }) {
    const timelineRef = useRef(null);

    useEffect(() => {
        const container = timelineRef.current;

        // 创建时间轴
        const timeline = new Timeline(container);

        // 创建用于存储每一帧的事件数据的数组
        // const items = frames.map((frame, index) => ({
        //     id: index,
        //     content: `<img src="${frame}" width="${frameWidth}" height="${frameHeight}" />`,
        //     start: new Date(), // 根据需要设置帧的时间戳
        // }));
        var items = [
            { id: 1, content: 'item 1', start: '2014-04-20' },
            { id: 2, content: 'item 2', start: '2014-04-14' },
            { id: 3, content: 'item 3', start: '2014-04-18' },
            { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
            { id: 5, content: 'item 5', start: '2014-04-25' },
            { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' }
        ];

        // 添加事件到时间轴
        timeline.setItems(items);

        // 可以根据需要自定义时间轴的其他配置

        return () => {
            timeline.destroy(); // 清理时间轴
        };
    }, [frames, frameWidth, frameHeight])


    return <Box w="full" h='20vh' bg='#DBC9E1' color='white'>
        <div ref={timelineRef} style={{ height: "40px" }}></div>;
    </Box>
}





