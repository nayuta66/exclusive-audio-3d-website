import voiceMakeRouter from "./voiceMake/routers";
import voicePlayerRouter from "./voicePlayer/routers";
import voiceShowRouter from "./voiceShow/routers";

import Login from "@/pages/login";
import NotFound from "@/pages/notFound";
import HomePage from "@/pages/homepage";

const routes = [
    {
        tag: 'Route',
        name: '主页',
        path: '/',
        element: HomePage,
    },
    {
        tag: 'Route',
        name: '登录',
        path: '/login',
        element: Login,
    },
    ...voiceMakeRouter,
    ...voicePlayerRouter,
    ...voiceShowRouter,
    {
        tag: 'Route',
        name: '404',
        path: '*',
        element: NotFound,
    }
]

export default routes;