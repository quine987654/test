<template>
  <div
    class="qr-code"
    :class="{ up: store.qrCodeIfshow, down: !store.qrCodeIfshow }"
  >
    <div class="bg"></div>
    <div class="query">
      <h2>{{ $t("qrCode.ply") }}</h2>
      <div class="qrcodeBox">
        <div class="aaa"></div>
        <div id="qrcode" v-html="html" class="qrcode" ref="qrcode"></div>
      </div>
      <div class="tips">{{ $t("qrCode.upApp") }}</div>
      <div class="tips">({{ $t("qrCode.no") }})</div>
      <div class="but" @click="qrCodeDown()">{{ $t("qrCode.close") }}</div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import Store from "../store";

export default {
  data() {
    return {
      store: Store.state,
      html: "",
      qr: "",
      qrco: {
        // 原文
        bridge2data: {
          contractAddress: "0x90A11381eEa089D75876fc1E9188Fe3417674313", //contract_address
          methed: "swapETH2WDC", //常量
          amount: "1", //金额
          orderId: "", //订单id
          tokenAddress: "0xa3D072A1DD0058C8850D71E2A3f53c2c225bf944", //agent_address
        },
        icon: "https://wisdchain.com/img/jishu2.png", // 资产图标
        md5: "asdfa13a5g1435a61g436a51g46", //加密之后的字符串
      },
      // 盐
      salt:
        "0x3e1b49bc42d7732db1509c784dd6ee12a8589fb960c626a62c69f375840d572e",
    };
  },
  methods: {
    // 动态生成二维码
    qrcode() {
      // this.qr.clear();
      this.qr = new QRCode("qrcode", {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: this.store.qrCodeVal, // 设置二维码内容或跳转地址
      });
      // console.log(this.qr);
    },
    // 打开二维码
    qrCodeUp(val) {
      Store.setQrCodeIfshow(true);
      // Store.setRrCodeVal(val);
      this.qr.makeCode(val);
      // this.qrcode()
    },
    // 关闭二维码
    qrCodeDown() {
      Store.setQrCodeIfshow(false);
      Store.setRrCodeVal("");
    },
  },
  mounted() {
    this.qrcode("123");
    // console.log(this.inputPassToDbPass("aaaaaaaa", this.salt));
  },
};
</script>
<style lang="less" scoped>
.qr-code {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .bg {
    background-color: #0009;
    width: 100%;
    height: 100%;
  }
  .query {
    width: 480px;
    height: 535px;
    background-color: #fff;
    // box-shadow: 0 0 10px #4760ff;
    position: absolute;
    top: 170px;
    left: 50%;
    border-radius: 10px;
    transform: translateX(-51.5%);
    h2 {
      text-align: center;
      margin-bottom: 40px;
      line-height: 60px;
    }
    .qrcodeBox {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto;
      padding: 5px;
      // border: 5px solid #4e61dd;
      background-color: #fff;
    }
    .qrcode {
      width: 200px;
      height: 200px;
      // background-color: red;
    }
    .qrcodeBox::after {
      position: absolute;
      content: "";
      top: -3px;
      right: -3px;
      width: 50px;
      height: 50px;
      z-index: -1;
      background-color: #4760ff;
    }
    .qrcodeBox::before {
      position: absolute;
      content: "";
      bottom: -3px;
      left: -3px;
      width: 50px;
      height: 50px;
      z-index: -1;
      background-color: #4760ff;
    }
    .qrcode::after {
      position: absolute;
      content: "";
      top: -3px;
      left: -3px;
      width: 50px;
      height: 50px;
      z-index: -1;
      background-color: #4760ff;
    }
    .qrcode::before {
      position: absolute;
      content: "";
      bottom: -3px;
      right: -3px;
      width: 50px;
      height: 50px;
      z-index: -1;
      background-color: #4760ff;
    }
    .tips {
      padding: 30px;
      text-align: center;
    }
    .but {
      padding: 10px 10px;
      border-radius: 5px;
      width: 90%;
      position: absolute;
      bottom: 10px;
      left: 2.5%;

      text-align: center;
      border: 0.5px solid #4760ff;
      background-color: #4e61dd;
      color: #fff;
      margin: 10px auto;
      // top: 50%;
      // transform: translateY(-50%);
    }
  }
}
.down {
  z-index: -9999;
  display: none;
}
.up {
  z-index: 9999;
  display: block;
}
</style>
