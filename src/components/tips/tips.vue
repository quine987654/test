<template>
  <div v-if="tipsifshow">
    <!-- 提示弹窗 -->
    <div class="popup">
      <div class="title">
        <!-- {{ $t("home.tips") }} -->
        {{ title }}
      </div>
      <div class="text">
        <!-- {{ $t("home.tipsText") }} -->
        {{ text }}
      </div>
      <div class="butbox">
        <a href="javascript:;" @click="downpop()">
          <!-- <div class="but">{{ $t("home.continue") }}</div> -->
          <div class="but">{{ but }}</div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
// import { TweenMax } from "gsap";
export default {
  data() {
    return {
      tipsifshow: false,
      tex: "这里是提示",
      // 提示类型，0为普通提示，1为成功，2为失败，3为警告
      tp: "0",
      // 定时器
      tm: "",
      title: "提示",
      text: "请前往 WDC Space 打开！",
      but: "确认",
    };
  },
  mounted() {},
  methods: {
    popshow(textName) {
      console.log(window.myVue.$i18n);
      let lang;
      // console.log(en.home.tips);
      if (window.myVue.$i18n.locale == "en") {
        lang = window.myVue.$i18n.messages.en;
      } else {
        lang = window.myVue.$i18n.messages.zh;
      }
      this.title = lang.home.tips;
      this.but = lang.home.continue;
      this.text = lang.home.tipsText1;
      if (textName == "tipsText1") {
        this.text = lang.home.tipsText1;
      } else if (textName == "tipsText2") {
        this.text = lang.home.tipsText2;
      } else {
        this.text = textName;
      }
      // this.text = text;
      // TweenMax.to(".popup", 0.5, {
      //   transform: "translateX(-50%)",
      //   opacity: 1,
      //   zIndex: -999
      // });
    },
    downpop() {
      // TweenMax.to(".popup", 0.25, {
      //   transform: "translateX(-50%)  translateY(-20%)",
      //   opacity: 0,
      //   zIndex: -1
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.popup {
  position: fixed;
  top: 250px;
  left: 50%;
  transform: translateX(-50%);
  z-index: -999;
  // width: 400px;
  display: inline-block;
  padding: 20px 50px;
  border-radius: 10px;
  min-width: 400px;
  max-height: 400px;
  background-color: #5136d7;
  color: white;
  // box-shadow: 0 0 99999px #000;
  border: 1px solid #eee;
  .title {
    text-align: center;
    font-size: 25px;
  }
  .text {
    padding-top: 30px;
  }
  .butbox {
    margin-top: 40px;
    .but {
      padding: 5px 20px;
      background-color: white;
      display: block;
      border-radius: 5px;
      float: right;
      color: #5136d7;
    }
  }
}
</style>
