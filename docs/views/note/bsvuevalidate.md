--- 
title: BootstrapVue 表單驗證
date: 2019-10-27
categories: 
 - Note
tags: 
 - vue
 - veevalidate
 - bootstrapvue
 - javascript
---

最近在使用 [BootstrapVue](https://bootstrap-vue.js.org/) 製作網頁，需要驗證互動視窗內表單輸入資料  
官方提供了 [Vuelidate](https://vuelidate.netlify.com/) 和 [VeeValidate](https://logaretm.github.io/vee-validate/) 兩種驗證方式，我選擇使用 Github 星星數較多的 VeeValidate   
在使用時發現官方文件內的 [VeeValidate範例](https://bootstrap-vue.js.org/docs/reference/validation/#veevalidate) 不是最新的 3.x，所以花了些時間研究 

<!-- more -->

## 安裝 VeeValidate

在 `main.js` 加入
```js
// 需要用到 ValidationProvider 和 ValidationObserver 兩個元件
// 因為不知道我這個網站到底會用到哪些驗證
// 所以 from 設定為 vee-validate/dist/vee-validate.full 可以一次引用所有驗證規則
import {
  ValidationProvider,
  ValidationObserver
} from "vee-validate/dist/vee-validate.full";
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
```
## HTML
HTML 的部分我是以 [pug](https://pugjs.org/) 編寫，節省時間與打字量  
VeeValidate 的在標籤的基本使用上不會很複雜，把表單的 `form` 標籤替換成 `ValidationObserver`，然後用 `ValidationProvider` 將 `input` 包起來  
要注意的是 `b-form-group` 也要跟著包在 `ValidationProvider` 裡面，才會顯示錯誤訊息  

```pug
<template lang="pug">
  // bootstrapVue的互動視窗
  // 基本上就是複製官方文件的範例來修改
  // @show 和 @hidden 時重設表單資料
  // @ok 點 ok 按鈕時要做送表單的動作
  // okTitle okVariant cancelTitle cancelVariant 為互動視窗 footer 的按鈕文字和樣式
  b-modal#loginModal(
      ref="modal" 
      title="登入" 
      @show="resetModal" 
      @hidden="resetModal" 
      @ok="handleOk" 
      okTitle="登入" 
      okVariant="success" 
      cancelTitle="取消" 
      cancelVariant="danger"
    )
    // 使用 ValidationObserver 來代替 form 標籤，因為送出表單時需要驗證整份表單的狀態
    ValidationObserver#loginForm(
      ref="loginForm" 
      tag="form" 
      @submit.stop.prevent="handleSubmit"
    )
      // 使用 ValidationProvider 制定驗證規則，這裡我沒有用 v-slot 抓錯誤訊息和狀態，因為我訊息直接用中文寫死
      ValidationProvider(
        rules="required|min:4" 
        ref="pvdInputAcc"
      )
        b-form-group(
          label="帳號" 
          label-for="inputAcc" 
          invalid-feedback="帳號格式錯誤"
        )
          // b-form-input 的 state 需要自己寫驗證 method，下面會說明
          b-form-input#inputAcc(
            ref="inputAcc" 
            type="text" 
            v-model="acc" 
            :state="validState('pvdInputAcc')"
          )
      ValidationProvider(rules="required|min:4" ref="pvdInputPW")
        b-form-group(label="密碼" label-for="inputPW" invalid-feedback="密碼格式錯誤")
          b-form-input#inputPW(ref="inputPW" type="password" v-model="pw" :state="validState('pvdInputPW')")
</template>
```

## Script
JS 的部分有點麻煩，veeValidate 沒有提供修改像是 `dirty` 之類的狀態的函式  
所以我用 Vue 開發工具找到元件屬性後直接改  
`dirty` 指的是輸入欄位有沒有被動過，有 focus 過或編輯過就算 dirty  
  
這裡其實 `handleSubmit` 後表單驗證失敗直接 return 就好了  
不過為了使 UX 更流暢，我有做一些調整  
如果使用者沒有動過輸入欄位就送出，強制將欄位的 dirty 改為 true 來觸發驗證  
如果將必填欄位的 `b-form-input` 的 `state` 綁定 `ValidationProvider` 的 valid 屬性會使表單一出現就有錯誤訊息  
所以 `b-form-input` 的 `state` 要綁一個自己寫的 method  

還有一點就是 `FormData()` 這個物件裡面不能放 `this.$refs.xxx`   
所以要建立一個新的然後用 `append()` 丟資料進去  
   
```js
// 我把資料庫網址和一些設定寫在獨立的 js 檔裡面
import { config } from "@/config.js";

export default {
  name: "modalLogin",
  data() {
    return {
      acc: "",
      pw: ""
    };
  },
  methods: {
    // 當點擊互動視窗的ok
    handleOk(bvModalEvt) {
      // 防止互動視窗關閉
      bvModalEvt.preventDefault();
      // 處理表單送出
      this.handleSubmit();
    },
    // 處理表單，veeValidate 文件有寫需要使用 async 和 await
    async handleSubmit() {
      // 確認表單有沒有問題
      const isValid = await this.$refs.loginForm.validate();
      // 如果有問題，迴圈所有的 ValidationProvider 欄位，將欄位的 dirty 設為 true
      if (!isValid) {
        for (let i in this.$refs) {
          if (i.includes("pvdInput")) {
            this.$refs[i].flags.dirty = true;
          }
        }
      } 
      // 沒問題的話就送出表單
      else {
        let fd = new FormData();
        fd.append("acc", this.acc);
        fd.append("pw", this.pw);
        this.axios
          .post(config.apiUrl + "/POST/login", fd)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    resetModal() {
      this.loginacc = "";
      this.loginpw = "";
    },
    // b-form-input 的 state
    // true 是綠色打勾，false 是紅色叉叉加錯誤訊息，null 是一般狀態
    // dirty 是 true 才去判斷sttate
    // dirty 是 false 代表表單沒被動過，沒被動過就出現錯誤訊息很奇怪
    // modal剛出現時抓 ref 會是 undefined，所以要再加一層判斷
    validState(ref) {
      if (this.$refs[ref] != undefined && this.$refs[ref].classes.dirty) {
        if (this.$refs[ref].classes.valid) return true;
        else return false;
      } else return null;
    }
  }
};
```

## 效果圖
![效果gif](/images/bsvuevalidate.gif)
