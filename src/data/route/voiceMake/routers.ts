/**
 * 模块路由文件
 */
import URLS from './urls';
import Layout from '@/layout';
import VoiceMake from '@/pages/voiceMake';

// 自定义模块路由
const ModuleRouters = [
    {
        tag: 'Route',
        name: '音制作',
        path: URLS.basePath,
        element: Layout,
        children: [
            {
                tag: 'Route',
                name: 'ai制作',
                path: URLS.aiVoice,
                element: VoiceMake,
            },
            {
                tag: 'Route',
                name: '原音上传',
                path: URLS.originalVoice,
                element: VoiceMake,
            },
        ],
    }
];

export default ModuleRouters;

