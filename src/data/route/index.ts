import voiceMakeRouter from "./voiceMake/routers";
import voicePlayerRouter from "./voicePlayer/routers";
import voiceShowRouter from "./voiceShow/routers";

const routes = [
    ...voiceMakeRouter,
    ...voicePlayerRouter,
    ...voiceShowRouter,
]

export default routes;