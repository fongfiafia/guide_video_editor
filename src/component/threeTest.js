import dd from "../video/test.mp4";
import React, { Component } from 'react';
import * as THREE from 'three';

class VideoWebGLRenderer extends Component {
    constructor() {
        super();
        this.videoRef = React.createRef();
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.videoTexture = null;
    }

    componentDidMount() {
        this.initializeThreeJS();
        this.loadVideo();
        this.animate();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.seekTime !== this.props.seekTime) {
            // 当外部传入的 seekTime 参数发生变化时，跳转视频到指定时间
            this.smoothSeekTo(this.props.seekTime);
        }
    }

    initializeThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(this.renderer.domElement);
    }

    loadVideo() {
        const video = this.videoRef.current;
        video.src = dd; // 替换为视频的路径
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        this.videoTexture = new THREE.VideoTexture(video);
        this.videoTexture.minFilter = THREE.LinearFilter;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ map: this.videoTexture });

        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);
    }

    playVideo = () => {
        const video = this.videoRef.current;
        video.play();
    };

    pauseVideo = () => {
        const video = this.videoRef.current;
        video.pause();
    };

    jumpToTime = (seconds) => {
        const video = this.videoRef.current;
        video.currentTime = seconds;
        video.pause();
    };

    smoothSeekTo = (newTime) => {
        const video = this.videoRef.current;
        const currentTime = video.currentTime;
        const duration = video.duration;

        if (currentTime !== newTime && newTime >= 0 && newTime <= duration) {
            const step = (newTime - currentTime) / 60; // 控制平滑跳转速度
            this.animateSeek(currentTime, newTime, step);
        }
    };

    animateSeek = (currentTime, targetTime, step) => {
        if (Math.abs(currentTime - targetTime) < Math.abs(step)) {
            // 最后一帧，确保时间准确
            const video = this.videoRef.current;
            video.currentTime = targetTime;
        } else {
            const video = this.videoRef.current;
            video.currentTime = currentTime + step;
            this.animationFrameId = requestAnimationFrame(() => this.animateSeek(currentTime + step, targetTime, step));
        }
    };

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.renderer && this.videoTexture) {
            this.renderer.render(this.scene, this.camera);
        }
    };

    render() {
        const canvasStyle = {
            width: '100%',
            height: '100%',
        };

        return (
            <div>
                <div style={canvasStyle} ref={(ref) => (this.mount = ref)}></div>
                <video
                    ref={this.videoRef}
                    style={{ display: 'none' }}
                    src=""
                    preload="auto"
                />
                <div>
                    <button onClick={this.playVideo}>播放</button>
                    <button onClick={this.pauseVideo}>停止</button>
                </div>
            </div>
        );
    }
}

export default VideoWebGLRenderer;
