--- 
title: 從零開始架設 CentOS 7 的 CSGO 伺服器
date: 2020-03-18
categories: 
 - Note
tags: 
 - csgo
 - linux
---

最近收了二手零件組了台伺服器主機  
雖然架好幾次都知道流程了，還是寫下來給有需要的人好了  

<!-- more -->

## 系統安裝
CentOS 目前最新的版本是 8，不過我沒用過 8，所以選擇用舊版
- 到 [官方網站](https://wiki.centos.org/Download) 下載 iso 檔
- 用 [Rufus](https://rufus.ie/zh_TW.html) 製作開機 USB
- 灌系統時插 USB 3.0 會有 USB 錯誤，所以要插 USB 2.0
- 我自己是習慣選 GNOME 桌面環境以便初始設定，都弄好後再停用桌面節省資源  
- 第一次登入時會需要建立 root 以外的使用者，就順便把 CSGO 伺服器的使用者建好

## 安裝 Webmin
Webmin 是網頁系統管理工具，安裝之後遠端管理比較方便  
安裝方式有很多種，我習慣用 Yum 安裝  
- 以 root 登入
- 新增 `/etc/yum.repos.d/webmin.repo`，打上設定，可以從 [官方下載頁](http://www.webmin.com/rpm.html) 複製
  ```
  [Webmin]
  name=Webmin Distribution Neutral
  #baseurl=https://download.webmin.com/download/yum
  mirrorlist=https://download.webmin.com/download/yum/mirrorlist
  enabled=1
  ```
- 用終端機指令取得 key
  ```
  wget https://download.webmin.com/jcameron-key.asc
  rpm --import jcameron-key.asc
  ```
- 用 `yum install webmin` 安裝
- 開啟 `https://localhost:10000/`，用 root 登入
- 到 Networking 的 FirewallD 開啟 10000 的 TCP Port，就能用外部網路登入 Webmin

## 安裝 LGSM 與伺服器
[Linux Game Server Managers](https://linuxgsm.com/) 是在 Linux 架設遊戲伺服器的好工具  
- 切換到 CSGO 伺服器使用者
- 安裝依賴套件
  ```
  yum install epel-release
  yum install mailx postfix curl wget tar bzip2 gzip unzip python3 binutils bc jq tmux glibc.i686 libstdc++ libstdc++.i686
  ```
- 下載 LGSM
  ```
  wget -O linuxgsm.sh https://linuxgsm.sh && chmod +x linuxgsm.sh && bash linuxgsm.sh csgoserver
  ```
- 安裝伺服器
  ```
  ./csgoserver install
  ```

## 伺服器設定
- [申請 GSLT](https://steamcommunity.com/dev/managegameservers)
- 編輯設定檔，伺服器設定檔在 `家目錄/lgsm/config-lgsm/csgoserver/csgoserver.cfg`
- 安裝 [Metamod](https://www.sourcemm.net/downloads.php?branch=stable)
- 安裝 [Sourcemod](https://www.sourcemod.net/downloads.php?branch=stable)
- 如果遊戲資料庫想要設定 MySQL 的話，可以在 Webmin 的 Un-used Modules 裡安裝 MySQL Database Server
- 如果遊戲資料庫想要設定 MySQL 的話，要安裝 zlib 才使用 Sourcemod 的 MySQL Extension
  ```
  yum install zlib.i686
  ```
- 如果 Sourcemod 出現 `Can’t connect to local MySQL server through socket '/tmp/mysql.sock'` 的話，建立捷徑解決
  ```
  ln -s /var/lib/mysql/mysql.sock /tmp/mysql.sock
  ```
- 我個人習慣用 WinSCP 登入 SFTP 上傳檔案到伺服器