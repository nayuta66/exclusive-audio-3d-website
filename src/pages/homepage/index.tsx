import React from 'react'
import { useState, useRef, useEffect } from 'react';
import './index.less'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import TWEEN from '@tweenjs/tween.js';
import { Loading } from '@/components';

const HomePage = React.memo(() => {

    const [loading, setLoading] = useState(true);

    const scene = new THREE.Scene();
    // fov视野角度, aspect长宽比, near近截面, far远截面
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    const controls = new OrbitControls(camera, renderer.domElement);
    const clock = new THREE.Clock();

    // 3D模型
    const model = useRef<any[]>([]);
    // 动画混合器
    const mixer = useRef<any[]>([]);
    // 光线投射鼠标拾取
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 角度弧度换算
    const degToRad = (deg: number) => deg * Math.PI / 180;

    // 鼠标事件查找
    const findEvent = (object: THREE.SkinnedMesh | THREE.Object3D) => {
        let cur = object;
        let parent = object.parent;
        while (parent) {
            cur = parent;
            parent = parent.parent;
        }
        let name: string = '';
        //  遍历其子节点，获取模型name
        cur.children.forEach((child: THREE.SkinnedMesh | THREE.Object3D) => {
            if (child.name) {
                name = child.name;
            }
        });
        return name;
    };
    // 鼠标事件执行
    const executeEvent = (name: string | undefined) => {
        switch (name) {
            case 'robot_playground':
                loadSceneModel('gltf/cloud_home_station/scene.gltf', 'cloud_home_station', [0, 0, 0], [0, 0, 0], (success: boolean) => {
                    if (success) {
                        new TWEEN.Tween(camera.position).to({ x: 0, y: 1, z: 4 }, 3000)
                            .easing(TWEEN.Easing.Quartic.InOut).start()
                            .onComplete(() => {
                                removeSceneModel('robot_playground');
                                // 根据名称查找模型
                                model.current.forEach((item) => {
                                    const key = Object.keys(item)[0];
                                    if (key === 'cloud_home_station') {
                                        scene.add(item[key]);
                                    };
                                });
                                new TWEEN.Tween(camera.position).to({ x: 0, y: 1, z: 5 }, 1500).start();
                            });
                    }
                }, true);
                break;
            default:
                loadSceneModel('gltf/robot_playground/scene.gltf', 'robot_playground', [0, 0, 0], [0, 0, 0], (success: boolean) => {
                    if (success) {
                        const ta = new TWEEN.Tween(camera.position).to({ x: 0, y: 1, z: 2 }, 3000)
                            .easing(TWEEN.Easing.Quartic.InOut)
                            .start()
                            .onComplete(() => {
                                changeSceneTexture('texture/making_voice_cyber_bedroom.jpg');
                                removeSceneModel('cloud_home_station');
                                // 根据名称查找模型
                                model.current.forEach((item) => {
                                    const key = Object.keys(item)[0];
                                    if (key === 'robot_playground') {
                                        scene.add(item[key]);
                                    };
                                });
                            });
                        const tb = new TWEEN.Tween(camera.position).to({ x: 0, y: 1, z: 3 }, 1500);
                        ta.chain(tb);
                    }
                }, true);
                break;
        }
    }
    // 鼠标点击事件
    const onMouseDBClick = (event: any) => {
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

    // 更换场景贴图
    const changeSceneTexture = (path: string) => {
        textureLoader.load(path, (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
        }, undefined, (error) => {
            console.log(error);
        });
    }

    // 加载场景模型
    const loadSceneModel = (path: string, name: string,
        position: [x: number, y: number, z: number],
        rotation: [x: number, y: number, z: number],
        onFinish?: Function,
        temp?: boolean,
    ) => {
        gltfLoader.load(path, (gltf) => {
            const newName = gltf.scene.name = name;
            model.current.push({ [newName]: gltf.scene });
            !temp && scene.add(gltf.scene);
            // 设置模型初始位置
            gltf.scene.position.set(position[0], position[1], position[2]);
            gltf.scene.rotation.set(rotation[0], rotation[1], rotation[2]);
            // 加载模型动画
            const animations = gltf.animations;
            const newMixer = new THREE.AnimationMixer(gltf.scene);
            mixer.current.push({ [newName]: newMixer });
            if (animations && animations.length > 0) {
                animations.forEach((clip: THREE.AnimationClip) => {
                    newMixer.clipAction(clip).play();
                });
            }
            onFinish && onFinish(true);

        }, undefined, (error) => {
            console.error(error);
            onFinish && onFinish(false);
        });
    }

    // 删除场景模型
    const removeSceneModel = (name: string) => {
        model.current.forEach((item, index) => {
            const key = Object.keys(item)[0];
            if (key === name) {
                scene.remove(item[key]);
                model.current.splice(index, 1);
                mixer.current.splice(index, 1);
            }
        });
    }

    // 循环渲染
    const animate = () => {
        // 提供更好的渲染性能
        requestAnimationFrame(animate);
        // 轨道更新
        controls.update();
        // 获取delta时间
        const delta = clock.getDelta();
        // 更新动画
        if (mixer.current && mixer.current.length > 0) {
            mixer.current.forEach(item => {
                const key = Object.keys(item)[0];
                item[key].update(delta);
            });
        }
        // 补间动画更新
        TWEEN.update();
        renderer.render(scene, camera);
    };

    // 初始化
    useEffect(() => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;

        // 控制器配置初始化
        controls.enabled = false;
        controls.enableZoom = false;
        controls.autoRotate = false;

        // 将canvas添加到dom中
        const el = document.getElementById('homepage-canvas');
        el && el.appendChild(renderer.domElement);

        // 加载模型
        loadSceneModel(
            'gltf/cloud_home_station/scene.gltf',
            'cloud_home_station', [0, 0, 0], [0, 0, 0],
            () => {
                setLoading(false)
            });

        // 设置相机初始位置
        camera.position.set(0, 3, 5);

        // 设置初始补间动画
        const tween = new TWEEN.Tween(camera.position);
        controls.target.set(0, 0, 0);
        tween.to({ x: 0, y: 1, z: 5 }, 3000).start().onComplete(() => controls.enabled = true);

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
        // 监听鼠标双击事件
        window.addEventListener('dblclick', onMouseDBClick);
        return () => {
            window.removeEventListener('resize', () => { });
            window.removeEventListener('dblclick', () => { });
        }
    }, []);

    return <div className="homepage">
        <div id='homepage-canvas' style={{ visibility: loading ? 'hidden' : 'visible' }}></div>
        {loading ? <Loading /> : <>
        </>}
    </div >
});

export default HomePage;