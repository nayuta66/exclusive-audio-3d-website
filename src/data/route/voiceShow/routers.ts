/**
 * 模块路由文件
 */
import URLS from './urls';
import Layout from '@/layout/index';
import VoiceShow from '@/pages/voiceShow';

// 自定义模块路由
const ModuleRouters = [
    {
        tag: 'Route',
        name: '音发现',
        path: URLS.basePath,
        element: Layout,
        children: [
            {
                tag: 'Route',
                name: '音发现',
                path: URLS.show,
                element: VoiceShow,
                exact: true,
            },
        ],
    }
];

export default ModuleRouters;
