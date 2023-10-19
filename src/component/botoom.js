import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/dist/vis-timeline-graph2d.css";

export default function MyBottom({ frames, setSecond }) {
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


        // 创建事件处理函数，此函数不会引起 timeline 的重新渲染
        const handleMouseMove = (event) => {
            // 获取鼠标在时间轴上的 X 坐标位置
            const xPos = event.clientX - container.getBoundingClientRect().left;

            const timelineSection = timelineRef.current.querySelector('.vis-text.vis-minor.vis-odd');
            // 获取元素刻度的长度
            const timelineSecWidth = timelineSection.offsetWidth;

            // 获取包含指定类名的元素列表
            const oddList = timelineRef.current.querySelectorAll('.vis-text.vis-minor.vis-odd');
            const eventList = timelineRef.current.querySelectorAll('.vis-text.vis-minor.vis-even');

            const totalSec = oddList.length + eventList.length - 1 // 20s

            const perPxSec = 20 / (totalSec * timelineSecWidth)
            const curTime = (perPxSec * xPos).toFixed(2);
            console.log("cur Time is ", curTime)

            setSecond(curTime)

        };

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



    return <Box h='20vh' w='full' bg='gray.200'>
        <div ref={timelineRef} style={{ width: "100%", height: "100%" }}></div>
    </Box >
}