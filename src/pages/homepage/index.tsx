import { useRef, useEffect } from 'react';
import './index.less'
import * as three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import tween from '@tweenjs/tween.js';

const HomePage = () => {

    const scene = new three.Scene();
    // fov视野角度, aspect长宽比, near近截面, far远截面
    const camera = new three.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new three.WebGLRenderer({ antialias: true });
    const gltfLoader = new GLTFLoader();
    const textureLoader = new three.TextureLoader();
    const controls = new OrbitControls(camera, renderer.domElement);
    const clock = new three.Clock();

    // 3D模型
    const model = useRef<any>();
    // 动画混合器
    const mixer = useRef<any>();

    // 循环渲染
    const animate = () => {
        controls.update();
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        mixer.current && mixer.current.update(delta);
        renderer.render(scene, camera);
    };

    // 初始化
    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = three.sRGBEncoding;
        textureLoader.load('texture/musician_cyber_bedroom.jpg', (texture) => {
            texture.encoding = three.sRGBEncoding;
            texture.mapping = three.EquirectangularReflectionMapping;
            scene.background = texture;
        }, undefined, (error) => {
            console.error(error);
        });

        // 控制器配置初始化
        controls.enableZoom = false;

        // 将canvas添加到dom中
        const el = document.getElementById('homepage-canvas');
        el && el.appendChild(renderer.domElement);

        // 加载模型
        gltfLoader.load('gltf/robot_playground/scene.gltf', (gltf) => {
            model.current = gltf.scene;
            scene.add(model.current);

            // 加载动画
            const animations = gltf.animations;
            mixer.current = new three.AnimationMixer(gltf.scene);
            if (animations && animations.length > 0) {
                animations.forEach((clip: three.AnimationClip) => {
                    mixer.current.clipAction(clip).play();
                });
            }
        }, undefined, (error) => {
            console.error(error);
        });

        // 设置相机初始位置
        camera.position.set(0, 1, 3);

        // 加载灯光：环境光、平行光（产生阴影）
        const light = new three.AmbientLight(0xffffff); // soft white light scene.add( light );
        scene.add(light);
        const directionalLight = new three.DirectionalLight(0xffffff, 1);
        scene.add(directionalLight);

        // webgl兼容性测试和animate执行
        if (WebGL.isWebGLAvailable()) {
            animate();
        } else {
            const warning = WebGL.getWebGLErrorMessage();
            document.body.appendChild(warning);
        }

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        return window.removeEventListener('resize', () => { });
    }, []);

    return <div className="homepage">
        <div id='homepage-canvas'></div>
        <div id='homepage-content'>
        </div>
    </div>
}

export default HomePage;