# 说明
    声音是有温度和色彩的，这是一个倾听和制作专属声音的3d网站
# 功能板块：
    登录：
        一个酷炫的3d登录页
    音制作：
        1、ai音频训练生成：通过拖拽上传source音频轨道，model参照物音频轨道，生成你想要的专属target音频轨道
        2、ai图片生成：根据target音频轨道，生成音频的专属图片作为封面，打上音频标签
        3、也可以仅上传音频和封面
        4、制作完成之后，会发短信/邮件通知
        例如：你可以把喜欢的人或事物的音频作为model参照物音频，自己录制一段音频（想说什么都可以）作为source音频，
        然后这段音频的内容就会模仿参照物的声音，用参照物的声音说出你所说的内容。
        比如ai许嵩，ai本兮，也可以是你喜欢的那个人-ai某人。
    音发现：
        1、音频分类
            原音：
                音乐：各种类型的音乐
                人声：asmr、打招呼语等
                自然音：自然雨林、雪堆燃烧等
            ai音：
                音乐：ai生成的各种类型的音乐
                人声：ai人声
                自然音：暂不能很好处理
        2、作品列表按照热度，最新分类
        3、展示用户用ai生成或者自己上传的专属音乐/声音（例如白噪音、asmr助眠、自然音等），附带用户编辑的数字藏品链接。
        对音频感兴趣的话，可以联系制作人，目前仅支持私下联系
        4、作品点赞、评论、收藏
    音播区：
        一个3D的音乐播放展示区
        1、旋律可视化
        2、律动的人物模型
        3、3D播放器模型
    其他功能待定...
# 技术选型
    create-react-app、react18、ts；采用craco覆盖cra的webpack的配置
    less、antd5、styled-componets、react-spring动画库
    threejs、tweenjs补间动画、blender建模
    ai音频（训练模型待定）、ai图片（训练模型待定）

# 安装依赖
    yarn

# 执行程序
    yarn start

# 打包程序
    yarn run build