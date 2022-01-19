<template>
  <div class="orderPop" v-show="store.orderId">
    <!-- <div class="orderPop" v-show="true"> -->
    <!-- <div class="topRight">未完成订单</div> -->
    <div class="miniBox" v-if="!bigOrMini" @click="bigOrMini = true">
      <div class="w">
        <span class="step suc">1.{{ $t("orderPop.one") }}</span>
        <span class="line sucLine"></span>
        <span
          class="step"
          :class="{
            suc: setState() == 2,
            err: setState() == 3,
            retry: setState() == 1,
          }"
          >2.{{ $t("orderPop.two") }}</span
        >
        <span
          class="line"
          :class="{ sucLine: setState() == 2, errLine: setState() == 3 }"
        ></span>
        <span
          class="step"
          :class="{ suc: setState() == 2, err: setState() == 3 }"
          >3.{{ $t("orderPop.three") }}</span
        >
        <span
          class="line"
          :class="{ sucLine: setState() == 2, errLine: setState() == 3 }"
        ></span>
        <span
          class="step"
          :class="{ suc: setState() == 2, err: setState() == 3 }"
          >4{{ $t("orderPop.four") }}</span
        >

        <!-- <div v-if="store.orderDetails.status == 0">发起交易，待转币</div>
          <div v-if="store.orderDetails.status == 1">转币超时</div>
          <div v-if="store.orderDetails.status == 2">转币成功，等待铸造</div>
          <div v-if="store.orderDetails.status == 3">铸造失败，等待重试</div>
          <div v-if="store.orderDetails.status == 4"> 铸造失败，等待退回资金 </div>
          <div v-if="store.orderDetails.status == 5">退还资金成功</div>
          <div v-if="store.orderDetails.status == 6"> 退还资金失败，等待重试 </div>
          <div v-if="store.orderDetails.status == 7"> 退还资金失败，等待手动结束 </div>
          <div v-if="store.orderDetails.status == 8">已手动结束</div>
          <div v-if="store.orderDetails.status == 200">铸造成功，已放币</div> -->
      </div>
    </div>
    <div class="bigBox" v-if="bigOrMini">
      <div class="bg"></div>
      <div class="orderDetails">
        <div class="fr closure" @click="bigOrMini = false">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-guanbi"></use>
          </svg>
        </div>
        <div class="title">{{ $t("orderPop.state") }}</div>
        <div class="box1">
          <ul>
            <li>
              {{ $t("orderPop.assets") }}
              <div class="fr">{{ store.orderDetails.assetName }}</div>
            </li>
            <li>
              {{ $t("orderPop.amount") }}
              <div class="fr">{{ store.orderDetails.amount }}</div>
            </li>
            <li>
              {{ $t("orderPop.address") }}
              <div class="fr">{{ store.orderDetails.receive }}</div>
            </li>
            <li v-if="store.orderDetails.realAmount > 0">
              {{ $t("orderPop.dao") }}
              <div class="fr">{{ store.orderDetails.realAmount }}</div>
            </li>
            <li>
              {{ $t("orderPop.fromNetwork") }}
              <div class="fr">
                {{ store.orderDetails.assetNetworkFromName }}
              </div>
            </li>
            <li>
              {{ $t("orderPop.toNetwork") }}
              <div class="fr">{{ store.orderDetails.assetNetworkToName }}</div>
            </li>
          </ul>
        </div>
        <div class="box2">
          <!-- 1重试，2成功，3失败 -->
          <div class="step suc"><strong>1</strong></div>
          <div class="line sucLine"></div>
          <div
            class="step"
            :class="{
              suc: setState() == 2,
              err: setState() == 3,
              retry: setState() == 1,
            }"
          >
            <strong>2</strong>
          </div>
          <div
            class="line"
            :class="{ errLine: setState() == 2, errLine: setState() == 3 }"
          ></div>
          <div
            class="step"
            :class="{ suc: setState() == 2, err: setState() == 3 }"
          >
            <strong>3</strong>
          </div>
          <div
            class="line"
            :class="{ errLine: setState() == 2, errLine: setState() == 3 }"
          ></div>
          <div
            class="step"
            :class="{ suc: setState() == 2, err: setState() == 3 }"
          >
            <strong>4</strong>
          </div>
        </div>
        <div class="box3">
          <div class="step suc">{{ $t("orderPop.one") }}</div>
          <div
            class="step"
            :class="{ suc: setState() == 2, err: setState() == 3 }"
          >
            {{ $t("orderPop.two") }}
          </div>
          <div
            class="step"
            :class="{ suc: setState() == 2, err: setState() == 3 }"
          >
            {{ $t("orderPop.three") }}
          </div>
          <div
            class="step"
            :class="{ suc: setState() == 2, err: setState() == 3 }"
          >
            {{ $t("orderPop.four") }}
          </div>
        </div>
        <div class="box4">
          <div class="tips">
            <div v-if="store.orderDetails.status == 0">
              {{ $t("orderPop.tips0") }}
            </div>
            <div v-if="store.orderDetails.status == 1">
              {{ $t("orderPop.tips1") }}
            </div>
            <div v-if="store.orderDetails.status == 2">
              {{ $t("orderPop.tips2") }}
            </div>
            <div v-if="store.orderDetails.status == 3">
              {{ $t("orderPop.tips3") }}

              <ul>
                <li
                  v-for="item in store.orderDetails.forgeRetryList"
                  :key="item.created_at"
                >
                  {{ $t("orderPop.tips3time") }}：{{ item.created_at }}
                  <br />
                  {{ $t("orderPop.tips3state") }}：
                  <span v-if="item.status == 0">{{
                    $t("orderPop.tips3error")
                  }}</span>
                  <span v-if="item.status == 1">{{
                    $t("orderPop.tips3success")
                  }}</span>
                  <br />
                  <span v-if="item.status">
                    {{ $t("orderPop.tips6reason") }}：{{ item.reason }}
                  </span>
                </li>
              </ul>
            </div>
            <div v-if="store.orderDetails.status == 4">
              {{ $t("orderPop.tips4") }}
            </div>
            <div v-if="store.orderDetails.status == 5">
              {{ $t("orderPop.tips5") }}
            </div>
            <div v-if="store.orderDetails.status == 6">
              {{ $t("orderPop.tips6") }}
            </div>
            <div v-if="store.orderDetails.status == 7">
              {{ $t("orderPop.tips7") }}
            </div>
            <div v-if="store.orderDetails.status == 8">
              {{ $t("orderPop.tips8") }}
            </div>
            <div v-if="store.orderDetails.status == 200">
              {{ $t("orderPop.tips200") }}
            </div>
          </div>
          <div class="tips" v-if="store.orderDetails.reason!=''">
            {{ $t("orderPop.err") }}:{{store.orderDetails.reason}}
          </div>
        </div>
        <!-- <div class="closeBut" @click="closeAlert()">
          {{ $t("orderPop.down") }}
        </div> -->
        <!-- <div class="tipss" >
          {{ $t("orderPop.wxTips") }}
        </div> -->
      </div>
    </div>
    <wl-alert ref="wlAlert" @clickOk="closeOrder()">{{
      $t("orderPop.downOK")
    }}</wl-alert>
  </div>
</template>

<script>
import Store from "../store";
import WlAlert from "./wl-alert.vue";
export default {
  components: {
    WlAlert
  },
  data() {
    return {
      store: Store.state,
      // true为大窗口 false为小窗口
      bigOrMini: false,
      type: ""
    };
  },
  mounted() {
    this.fiveGet();
  },
  methods: {
    // 查询订单状态
    async getOrder() {
      let { data: res } = await this.$http.get(
        "/pub/swap/orderInfo?id=" + this.store.orderId
      );
      if (res.code != 200) {
        return;
      }
      Store.setOrderDetails(res.data);
    },
    // 循环查询订单
    fiveGet() {
      setInterval(() => {
        if (this.store.orderId != "") {
          this.getOrder();
        }
      }, 5000);
    },
    setState() {
      if (this.store.orderDetails.status == 3) {
        return 1; //重试
      }
      if ([4, 5, 6, 7, 8].indexOf(this.store.orderDetails.status) >= 0) {
        return 3; //失败
      }
      if (this.store.orderDetails.status == 200) {
        return 2; //成功
      }
    },
    // 关闭订单弹窗
    closeAlert() {
      this.$refs.wlAlert.up();
    },
    // 关闭订单
    async closeOrder() {
      let { data: res } = await this.$http.post(
        `/pub/swap/close/${this.store.orderId}`
      );
      if (res.code != 200) {
        return this.$message.error(res.message);
      }
      // 还原订单窗口
      this.bigOrMini = false;
      // 关闭订单成功
      this.$message.success(this.getTips("close"));
      // 订单清空
      Store.setOrderId("");
      // 订单详情清空
      Store.setOrderDetails("");
    }
  }
};
</script>

<style lang="less" scoped>
.orderPop {
  .topRight {
    width: 100px;
    height: 100px;
    background-color: #4760ff;

    position: fixed;
    right: 100px;
    top: 100px;
    z-index: 999;
    border-radius: 10px;
  }
  .miniBox {
    // position: fixed;
    position: absolute;
    // top: 10%;
    z-index: 0;
    top: 65px;
    // right: 10%;
    left: 0;
    width: 100%;
    height: 40px;
    background-color: #e4e6f5;
    color: #999999;
    padding: 10px;
    box-sizing: border-box;
    .w {
      width: 800px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .line {
        background-color: #999999;
        height: 1px;
        width: 100px;
        display: inline-block;
        margin-top: 9px;
      }
      .suc {
        color: #4760ff;
      }
      .err {
        color: red;
      }
      .sucLine {
        background-color: #4760ff;
      }
      .errLine {
        background-color: red;
      }
    }
  }
  .bigBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    .bg {
      width: 100%;
      height: 100vh;
      background-color: #0009;
    }
    .orderDetails {
      position: absolute;
      width: 600px;
      min-height: 500px;
      top: 10%;
      left: calc(50% - 300px);
      background-color: #fff;
      padding: 20px;
      border-radius: 15px;
      .title {
        text-align: center;
        font-size: 20px;
      }
      .closure {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 25px;
        margin-top: -10px;
        margin-right: -10px;
        color: #4760ff;
      }
      .box1 {
        // border-bottom: 0.5px solid #4760FF;
        margin-top: 30px;
        background-color: #f5f5f5;
        // border-radius: 15px;
        ul {
          margin: 10px 30px;
          overflow: auto;
          li {
            // border-top: 0.5px solid #475fff15;
            line-height: 30px;
            margin-top: -1px;
            padding: 5px 16px;
          }
        }
      }
      .box2 {
        display: flex;
        font-size: 16px;
        width: 80%;
        margin: 30px auto 0;
        color: #999;
        .step {
          flex: 1, 0, 0;
          width: 2em;
          height: 2em;
          line-height: 2em;
          border-radius: 50%;
          border: 0.5px solid #999;
          text-align: center;
        }
        .line {
          width: 50px;
          flex: 1;
          border-top: 0.5px solid #999;
          transform: translateY(50%);
          margin: 0 10px;
        }

        .suc {
          color: #fff;
          border-color: #4760ff;
          background-color: #4760ff;
        }
        .err {
          color: #fff;
          border-color: #ff4747;
          background-color: #ff4747;
        }
        .retry {
          border-color: #4760ff;
          position: relative;
          animation: turnX 5s linear infinite;
          color: #fff;
        }
        .retry::after {
          position: absolute;
          content: ">";
          color: #4760ff;
          top: -1.1em;
          left: 1em;
          transform: translateX(-50%);
        }
        .retry::before {
          position: absolute;
          color: #4760ff;
          content: "<";
          bottom: -0.95em;
          left: 1em;
          transform: translateX(-50%);
        }
        @keyframes turnX {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .sucLine {
          border-color: #4760ff;
        }
        .errLine {
          border-color: #ff4747;
        }
      }
      .box3 {
        display: flex;
        font-size: 16px;
        margin: 0px auto 0;
        .step {
          flex: 1;
          height: 2em;
          line-height: 1em;
          margin: 15px 0 0;
          border-radius: 50%;
          text-align: center;
          color: #999;
        }
        .action {
          color: #4760ff;
          border-color: #4760ff;
        }
        .suc {
          color: #4760ff;
        }
        .err {
          color: #ff4747;
        }
      }
      .box4 {
        border-top: 0.5px solid #475fff59;
        margin-top: 20px;
        padding: 10px 30px;
      }
      .closeBut {
        width: 90%;
        margin: 0 auto;
        height: 40px;
        text-align: center;
        background-color: #f36b72;
        line-height: 40px;
        color: #fff;
        border-radius: 10px;
      }
      .tips {
        // border-radius: 5px;
        background-color: rgba(245, 235, 91, 0.363);
        // border: 0.5px solid orange;
        margin: 5px 0;
        line-height: 30px;
        padding: 10px 10px;
      }
      .tipss {
        margin: 5px auto;
        color: #999;
        line-height: 30px;
        width: 90%;
      }
    }
  }
}
</style>