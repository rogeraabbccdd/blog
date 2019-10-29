--- 
title: JavaScript 偵測黑暗模式
date: 2019-10-29
categories: 
 - Note
tags: 
 - javaScript
 - css
---

最近越來越多裝置支援黑暗模式了  
而且不只裝置，各家瀏覽器也漸漸支援 `@media (prefers-color-scheme: dark)`  
目前 JavaScript 還沒有直接偵測的方式，所以們需要搭配 CSS 來完成這個功能  

<!-- more -->

## CSS
先在黑暗模式的選擇器裡，在 `html` 加上 `content`  
這個不會出現在網頁上，只是給 JavaScript 抓取用  
```css
@media (prefers-color-scheme: dark){
  html{
    content: "dark"
  }
}

@media (prefers-color-scheme: light){
  html{
    content: "light"
  }
}
```

## JavaScript
然後就可以用 JavaScript 的 `getComputedStyle()` 和 `getPropertyValue()`  
檢查目前的網頁有沒有套用到黑暗模式或明亮模式的 CSS  
`getPropertyValue()` 出來的結果會有引號，所以用 `replace()` 拿掉  

```js
let isPreferDark = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue('content')
  .replace(/"/g, '') === 'dark';
  
if(isPreferDark) console.log('It\'s dark mode!');
```

## 效果圖
<img :src="$withBase('/images/preferdark.gif')" alt="效果gif">
