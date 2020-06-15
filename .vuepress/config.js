module.exports = {
    "title": "SeekingLight",
    "description": "赋时光以生命",
    "base": '/', // 这是部署到github相关的配置
    "dest": "public",
    "head": [
        [
            "link",
            {
                "rel": "icon",
                "href": "/favicon.ico"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    "theme": "reco",
    "themeConfig": {
        "themePicker": false,
        "nav": [{
            "text": "首页",
            "link": "/",
            "icon": "reco-home"
        },
        {
            text: '时间轴',
            link: '/timeLine/',
            icon: 'reco-date'
        },
        {
            "text": "关于",
            "icon": "reco-message",
            "items": [{
                "text": "GitHub",
                "link": "https://github.com/SeekingLight233",
                "icon": "reco-github"
            },
            {
                "text": "BiliBili",
                "link": "https://space.bilibili.com/37019841?from=search&seid=11160746842115235145",
                "icon": "reco-bilibili"
            },
            {
                "text": "网易云",
                "link": "https://music.163.com/#/user/home?id=355059838",
                "icon": "reco-douyin"
            },
            {
                "text": "联系我",
                "link": "../contact.md",
                "icon": "reco-wechat"
            },


            ]
        }
        ],
        "type": "blog",
        "blogConfig": {
            "category": {
                "location": 2,
                "text": "分类"
            },
            "tag": {
                "location": 3,
                "text": "标签"
            }
        },
        "logo": "/icon.png",
        "search": true,
        "searchMaxSuggestions": 10,
        "sidebar": "auto",
        "sidebarDepth": 5,
        "lastUpdated": "Last Updated",
        "author": "寻光",
        "startYear": "2017"
    },
    "markdown": {
        "lineNumbers": true
    },
    "plugins": [
        ["@vuepress-reco/vuepress-plugin-screenfull", false],
        ["@vuepress-reco/vuepress-plugin-back-to-top", false],
        "@vuepress/medium-zoom",
        [
            "@vuepress-reco/vuepress-plugin-bgm-player",
            {
                audios: [
                    // 网络文件示例
                    {
                        name: 'The Moments We Shared...I Miss Them',
                        artist: 'Jacoo',
                        url: 'https://www.jixieclub.com/res/music/Jacoo - The Moments We Shared...I Miss Them.mp3',
                        cover: 'http://p2.music.126.net/BoG7QiDR9Ws6TlK68kCyfQ==/7700979441482813.jpg?param=130y130'
                    },
                    {
                        name: 'In the Shadows... Looking For a Light',
                        artist: 'Jacoo',
                        url: 'https://www.jixieclub.com/res/music/Jacoo - In the Shadows... Looking For a Light.mp3 ',
                        cover: 'http://p1.music.126.net/g2o2nxAgFpXeyP9HxNypww==/3239161256304956.jpg?param=130y130'
                    },

                    {
                        name: 'Everything.mp3',
                        artist: 'Yinyues',
                        url: 'https://www.jixieclub.com/res/music/Yinyues - Everything.mp3',
                        cover: 'http://p1.music.126.net/TcxdEdzRbKrwli4fVGeSiw==/6628955604788949.jpg?param=130y130'
                    },
                    {
                        name: '遺サレタ場所／斜光',
                        artist: '岡部啓一',
                        url: 'https://www.jixieclub.com/res/music/%E5%B2%A1%E9%83%A8%E5%95%93%E4%B8%80%20-%20%E9%81%BA%E3%82%B5%E3%83%AC%E3%82%BF%E5%A0%B4%E6%89%80%EF%BC%8F%E6%96%9C%E5%85%89.mp3',
                        cover: 'http://p2.music.126.net/rq1RmeyTRfJUHR4EwKJmmg==/18710389371705314.jpg?param=130y130'
                    },
                    {
                        name: 'Everywhere i go,to everyone i know',
                        artist: 'Beatsound',
                        url: 'https://www.jixieclub.com/res/music/beat1.mp3',
                        cover: 'http://p2.music.126.net/BgqpXKHLI8kWCzTUjuLHfQ==/109951164056982222.jpg?param=130y130'
                    },
                    {
                        name: 'Medicine',
                        artist: 'Daughter',
                        url: 'https://www.jixieclub.com/res/music/Daughter - Medicine.ncm',
                        cover: 'http://p1.music.126.net/QKooTkvnrunb0Y3FxO_lZQ==/18439909509679533.jpg?param=130y130'
                    },


                ],
                position: {
                    right: '10px',
                    bottom: '10px',
                    'z-index': '999999'
                },
                floatPosition: "right"
            }
        ]
    ]
}