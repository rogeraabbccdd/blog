--- 
title: Voicemeeter 分離遊戲和 Discord 聲音
date: 2020-12-20
categories: 
 - Note
tags: 
 - other
---

用 OBS 開直播過濾 Discord 的語音  

<!-- more -->

## 安裝 VoiceMeeter
下載 VoiceMeeter，我自己是用 Banana 版  
[下載連結](https://vb-audio.com/Voicemeeter/banana.htm)  

## 設定
- 將 VoiceMeeter 左邊硬體輸出的 A1 設為 `WDM 喇叭`，並將軟體輸入的 A1 輸出打開
  <img :src="$withBase('/images/voicemeeter/voicemeeter.png')" height="400px">
- 設定 VoiceMeeter Aux Input 為預設裝置和預設通訊裝置  
  <img :src="$withBase('/images/voicemeeter/system.png')" height="400px">
- 設定 Discord 輸出裝置為 `VoiceMeeter Input`  
  <img :src="$withBase('/images/voicemeeter/discord.png')" height="200px">
- OBS 安裝 [obs-asio](https://github.com/Andersama/obs-asio/releases/latest)
- OBS 設定兩個桌面音效
  - 一個設為 `VoiceMeeter Input`，為 Discord 聲音
  - 一個設為 `VoiceMeeter Aux Input`，為電腦聲音
  - 記得重新命名避免搞混
  <img :src="$withBase('/images/voicemeeter/obs.png')" height="200px">