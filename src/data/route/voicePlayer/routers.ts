/**
 * 模块路由文件
 */
import URLS from './urls';
import Layout from '@/layout';
import VoicePlayer from '@/pages/voicePlayer';

// 自定义模块路由
const ModuleRouters = [
    {
        tag: 'Route',
        name: '音展区',
        path: URLS.basePath,
        element: Layout,
        children: [
            {
                tag: 'Route',
                name: '3d音频',
                path: URLS.voice3d,
                element: VoicePlayer,
                exact: true,
            },
            {
                tag: 'Route',
                name: '2d音频',
                path: URLS.voice2d,
                element: VoicePlayer,
                exact: true,
            },
        ],
    }
];

export default ModuleRouters;
