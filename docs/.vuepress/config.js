module.exports = {
  plugins: ['cursor-effects', 'ribbon', 'reading-progress'],
  title: "Kento的學習筆記",
  base: '/blog/',
  description: " ",
  dest: "public",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  themeConfig: {
    intro: "🍰 It's Muffin Time!",
    themePicker: true,
    defaultDark: true,
    GAID: "UA-131804412-11",
    infoSMS: [
      {
        icon: "reco-home",
        link: "https://kento520.tw"
      },
      {
        link: "https://github.com/rogeraabbccdd",
        icon: "reco-github"
      }
    ],
    nav: [
      {
        text: "首頁",
        link: "/",
        icon: "reco-home"
      }
    ],
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "分類"
      },
      tag: {
        location: 3,
        text: "標籤"
      }
    },
    search: true,
    searchMaxSuggestions: 10,
    sidebar: "auto",
    lastUpdated: "Last Updated",
    author: "Kento",
    startYear: "2019"
  },
  markdown: {
    lineNumbers: true
  }
};
