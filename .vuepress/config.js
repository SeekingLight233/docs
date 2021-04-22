module.exports = {
  title: "SeekingLight",
  description: "赋时光以生命",
  base: "/", // 这是部署到github相关的配置
  dest: "public",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    themePicker: false,
    nav: [
      {
        text: "首页",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "时间轴",
        link: "/timeLine/",
        icon: "reco-date",
      },
      {
        text: "关于",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/SeekingLight233",
            icon: "reco-github",
          },
          {
            text: "BiliBili",
            link:
              "https://space.bilibili.com/37019841?from=search&seid=11160746842115235145",
            icon: "reco-bilibili",
          },
          {
            text: "网易云",
            link: "https://music.163.com/#/user/home?id=355059838",
            icon: "reco-douyin",
          },
          {
            text: "联系我",
            link: "../contact.md",
            icon: "reco-wechat",
          },
        ],
      },
    ],
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分类",
      },
      tag: {
        location: 3,
        text: "标签",
      },
    },
    logo: "/icon.png",
    search: true,
    searchMaxSuggestions: 10,
    sidebar: "auto",
    sidebarDepth: 5,
    lastUpdated: "Last Updated",
    author: "寻光",
    authorAvatar: "/images/hero.png",
    startYear: "2017",
    record: "豫ICP备2021007683号",
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    ["@vuepress-reco/vuepress-plugin-screenfull", false],
    ["@vuepress-reco/vuepress-plugin-back-to-top", false],
    "@vuepress/medium-zoom",
  ],
};
