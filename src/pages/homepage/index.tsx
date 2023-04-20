import { useState, useRef, useEffect } from 'react';
import './index.less'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import TWEEN from '@tweenjs/tween.js';

const HomePage = () => {

    const [loading, setLoading] = useState(true);

    const scene = new THREE.Scene();
    // fov视野角度, aspect长宽比, near近截面, far远截面
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const controls = new OrbitControls(camera, renderer.domElement);
    const tween = new TWEEN.Tween(camera.position);
    const clock = new THREE.Clock();

    // 3D模型
    const model = useRef<any>();
    // 动画混合器
    const mixer = useRef<any>();
    // 光线投射鼠标拾取
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 鼠标事件查找
    const findEvent = (object: THREE.SkinnedMesh | THREE.Object3D) => {
        let parent = object.parent;
        let name = parent?.name;
        while (parent) {
            parent = parent.parent;
            name = parent?.name;
        }
        return name;
    };
    // 鼠标事件执行
    const executeEvent = (name: string | undefined) => {
        console.log(name);
    }

    const onMouseClick = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // 通过摄像机和鼠标位置更新射线
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            // 获取第一个交叉物体
            const obj = intersects[0].object;
            const name = findEvent(obj);
            executeEvent(name);
        }
    }

    // 循环渲染
    const animate = () => {
        requestAnimationFrame(animate);
        // 轨道更新
        controls.update();
        // 获取delta时间
        const delta = clock.getDelta();
        // 更新动画
        mixer.current && mixer.current.update(delta);
        // 补间动画更新
        TWEEN.update();
        renderer.render(scene, camera);
    };

    // 初始化
    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        textureLoader.load('texture/musician_cyber_bedroom.jpg', (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
        }, undefined, (error) => {
            console.error(error);
        });

        // 控制器配置初始化
        controls.enableZoom = true;
        controls.enablePan = true;

        // 将canvas添加到dom中
        const el = document.getElementById('homepage-canvas');
        el && el.appendChild(renderer.domElement);

        // 加载模型
        gltfLoader.load('gltf/robot_playground/scene.gltf', (gltf) => {
            model.current = gltf.scene;
            model.current.name = 'robot_playground';
            scene.add(model.current);

            // 加载模型动画
            const animations = gltf.animations;
            mixer.current = new THREE.AnimationMixer(gltf.scene);
            if (animations && animations.length > 0) {
                animations.forEach((clip: THREE.AnimationClip) => {
                    mixer.current.clipAction(clip).play();
                });
            }

            // 停止加载loading
            setLoading(false);

        }, undefined, (error) => {
            console.error(error);
        });

        // 设置相机初始位置
        camera.position.set(0, 0, 3);

        // 设置初始补间动画
        tween.to({ x: 0, y: 2 }, 3000);
        tween.start();

        // 加载灯光：环境光、平行光（产生阴影）
        const light = new THREE.AmbientLight(0xffffff); // soft white light scene.add( light );
        scene.add(light);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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
        // 监控鼠标点击事件
        window.addEventListener('click', onMouseClick, false);
        return () => {
            window.removeEventListener('resize', () => { });
            window.removeEventListener('click', () => { });
        }
    }, []);

    return <div className="homepage">
        <div id='homepage-canvas' style={{ visibility: loading ? 'hidden' : 'visible' }}></div>
        {loading ?
            <div className='homepage-loading'>
                <img className='homepage-loading-img' src={require('@/asserts/images/loading.gif')} />
            </div>
            : <></>}
    </div >
}

export default HomePage;