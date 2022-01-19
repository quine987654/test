<template>
  <div class="Bridge">
    <!-- <schedule-item></schedule-item> -->
    <!-- 顶部资产选择 -->
    <!-- <span @click="switchNetWork()"> 切换</span>
    <span @click="qiehuan()"> 添加</span> -->
    <div class="miniTitle">
      <strong> {{ $t("bridge.assets") }} </strong>
    </div>
    <div class="assets" @click="assetsIfshow = true">
      <img
        v-if="store.actionAssets.icon"
        :src="store.imgPath + store.actionAssets.icon"
        alt=""
      />
      <input type="text" v-model="store.actionAssets.name" disabled />
      <div class="fr">></div>
    </div>

    <div class="table">
      <div class="row">
        <div class="col">
          <div class="miniTitle">
            <strong> {{ $t("bridge.from") }} </strong>
          </div>
          <network-pop :tp="'act1'"></network-pop>
        </div>
        <div class="col">
          <a href="javascript:;"
            ><div class="itemBox" @click="transNetwork()">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-youjiantou-"></use>
              </svg></div
          ></a>
        </div>
        <div class="col">
          <div class="miniTitle">
            <strong> {{ $t("bridge.to") }} </strong>
          </div>
          <network-pop :tp="'act2'"></network-pop>
        </div>
      </div>
    </div>
    <!-- <div class="addNetWork" style="font-size: 12px">
      如果您尚未在您的 MetaMask 新增幣安智能鏈網路，請點擊
      <span @click="addNetWork()" class="mini-button">新增網路</span> 並繼續
    </div> -->
    <br />
    <!-- 输入数量 -->
    {{ $t("bridge.number") }}
    {{
      `( ${store.actionNetworkOne.min_amount} - ${store.actionNetworkOne.max_amount} )`
    }}
    <div class="inputBox" tabindex="0">
      <input type="text" v-model="store.amount" />
      <a href="javascript:;"><button @click="maxClick()">MAX</button></a>
    </div>
    <span v-if="store.input"
      >{{ $t("bridge.estimate") }}:
      {{ Number(store.amount) - Number(store.actionNetworkOne.fee) }}</span
    >
    {{ $t("bridge.fromAddress") }}
    <!-- 发起地址 -->
    <div class="address" v-if="store.actionNetworkOne.network_name != 'WDC'">
      <img src="../assets/metamask.svg" alt="" />
      {{ addressHide(store.walletAddress) }}
    </div>
    <div class="address" v-else>
      <input
        v-model="store.inpFromAddress"
        type="text"
        :placeholder="$t('bridge.input')"
      />
    </div>

    {{ $t("bridge.toAddress") }}
    <!-- 接收地址 -->
    <!-- <div class="address" v-if="store.actionNetworkOne.network_name == 'WDC'">
      <img src="../assets/metamask.svg" alt="" />
      {{ addressHide(store.walletAddress) }}
    </div> -->
    <div class="address">
      <input
        v-model="store.inpAddress"
        type="text"
        :placeholder="$t('bridge.input')"
      />
    </div>

    <div class="tips">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tishi"></use>
      </svg>
      {{ $t("bridge.tips") }}
    </div>
    <br />

    <br />

    <!-- 下一步 -->
    <!-- <div
      class="wl-but hui"
      v-if="store.walletAddress == ''"
      @click="linkWallet()"
    >
      {{$t('bridge.link')}}
    </div>
    <div
      class="wl-but hui"
      v-else-if="
        Number(store.amount) < Number(store.actionNetworkOne.min_amount) ||
        Number(store.amount) > Number(store.actionNetworkOne.max_amount)
      "
    >
      {{$t('bridge.next')}}
    </div> 
    <div class="wl-but" v-else @click="continueIfshow = true">{{$t('bridge.next')}}</div>-->
    <a href="javascript:;"
      ><div class="wl-but" v-if="ifnext()" @click="next()">
        {{ $t("bridge.next") }}
      </div>

      <div class="wl-but hui" v-else>{{ $t("bridge.next") }}</div>
    </a>

    <!-- <div @click="setOrderId('132456')">设置</div>  -->

    <!-- 弹窗组件 -->
    <!-- 资产选择 -->
    <assets-pop :ifShow="assetsIfshow" @down="assetsDown()"></assets-pop>
    <!-- 打开下单弹窗 -->
    <trans-continue
      :ifShow="continueIfshow"
      @down="continueDown()"
      @notify="tenGetNotify()"
    ></trans-continue>
    <!-- 订单组件 -->
    <order-pop></order-pop>
  </div>
</template>
<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>
<script>
// @ is an alias to /src
import Store from "../store.js";
import AssetsPop from "@/components/assetsPop.vue";
import NetworkPop from "@/components/networkPop.vue";
// 下单确认弹窗
import TransContinue from "@/components/transContinue.vue";
// 订单弹窗
import OrderPop from "@/components/orderPop.vue";
// 进度条
// import ScheduleItem from "@/components/ScheduleItem.vue";

export default {
  name: "Home",
  components: {
    AssetsPop,
    NetworkPop,
    TransContinue,
    OrderPop,
    // ScheduleItem
  },
  data() {
    return {
      // 全局数据
      store: Store.state,
      // 资产选择框是否弹出
      assetsIfshow: false,
      continueIfshow: false,
      notify: false,
      tenGet: "",
    };
  },
  mounted() {
    this.getAssets();
  },
  methods: {
    // 设置订单id
    setOrderId(val) {
      Store.setOrderId(val);
    },
    // 关闭资产选择弹窗
    assetsDown() {
      this.assetsIfshow = false;
      this.getBridge();
    },
    // 关闭下单确认弹窗
    continueDown() {
      this.continueIfshow = false;
    },
    // 获取资产列表
    async getAssets() {
      const { data: res } = await this.$http.get("/pub/cross/assets");
      if (res.code != 200) {
        return false;
      }
      // 设置资产列表
      Store.setAssetsList(res.data);
      // 设置默认资产
      Store.setActionAssets(res.data[0]);

      this.getBridge();
    },
    // 获取网络列表
    async getBridge() {
      const { data: res } = await this.$http.get(
        "/pub/cross/networks/" + this.store.actionAssets.id
      );
      if (res.code != 200) {
        return false;
      }
      // 设置网络列表
      if (res.data == null) {
        Store.setNetworkList([]);
        Store.setActionNetworkOne({});
        Store.setActionNetworkTwo({});
        return;
      }
      // 如果有eth的网络则把eth放到首位去
      for (const i in res.data) {
        if (res.data[i].network_name == "ETH") {
          let a = res.data[0];
          res.data[0] = res.data[i];
          res.data[i] = a;
        }
      }
      Store.setNetworkList(res.data);

      if (res.data.length >= 2) {
        Store.setActionNetworkOne(res.data[0]);
        // 设置选中2
        Store.setActionNetworkTwo(res.data[1]);
      }
      // 设置选中1
    },
    // 交换网络
    transNetwork() {
      // 中转元素
      let one = Object.assign({}, this.store.actionNetworkOne);
      // let two = Object.assign({}, this.store.actionNetworkTwo);
      Store.setActionNetworkOne(this.store.actionNetworkTwo);
      Store.setActionNetworkTwo(one);
    },
    // 链接钱包
    linkWallet() {
      window.ethereum.request({ method: "eth_requestAccounts" });
      // this.wallet.address = window.ethereum.selectedAddress;
      // Store.setWalletAddress()
      Store.setWalletAddress(window.ethereum.selectedAddress);
    },
    // 点击最大值
    maxClick() {
      Store.setAmount(this.store.actionNetworkOne.max_amount);
    },
    // 向metamask添加psc网络
    async addNetWork() {
      await window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              // 链id
              chainId: this.web3.utils.numberToHex(
                this.store.actionNetworkOne.chain_id
              ),
              // 链名称
              // chainName: "bsc",
              chainName: this.store.actionNetworkOne.network_name,
              // 链节点
              // rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
              rpcUrls: [this.store.actionNetworkOne.rpc_url],

              // 浏览器网站
              blockExplorerUrls: [this.store.actionNetworkOne.scan_url],
            },
          ],
        })
        .then((res) => {
          this.switchNetWork();
          // console.log("添加成功");
          return true;

          //添加成功
        })
        .catch((err) => {
          // console.log("添加失败");
          // console.log(err);
          //添加失败
        });
    },
    // 切换网络
    async switchNetWork() {
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: this.web3.utils.numberToHex(
                this.store.actionNetworkOne.chain_id
              ),
            },
          ],
        })
        .then((res) => {
          // console.log("切换成功");
          this.qiehuan();
        })
        .catch((err) => {
          // console.log(err);
          if (err.code == 4902) {
            console.log(this.addNetWork());
          }
          // console.log("切换失败");
        });
    },
    async qiehuan() {
      // 看看当前网络是否是发起网络
      // console.log(window.ethereum.networkVersion);
      // console.log(this.store.actionNetworkOne.chain_id);

      if (
        this.store.actionNetworkOne.chain_id == window.ethereum.networkVersion
      ) {
        // console.log('当前是发起网络');
      } else {
        // console.log('当前不是发起网络');
        await this.switchNetWork();
      }
    },
    // 处理地址，隐藏
    addressHide(add) {
      return add.slice(0, 7) + "···" + add.slice(add.length - 7);
    },
    // 询问订单
    async notifyTransaction() {
      let { data: res } = await this.$http
        .get(`${this.store.wdcPath}/notify/transaction/${this.store.orderId}`)
        .catch(() => {
          return;
        });
      if (res.code != 200) {
        return;
      }
      // 更新订单哈希
      this.upOrder(res.data);
      // 删除定时器
      clearInterval(this.tenGet);
    },
    // 每10秒询问一次订单，直到true为止
    tenGetNotify() {
      this.tenGet = setInterval(() => {
        // 设置轮询订单状态
        this.notifyTransaction();
      }, 10000);
    },
    // 更新订单
    async upOrder(hash) {
      Store.setOrderReqHash(hash);
      let { data: res } = await this.$http.put(
        "/pub/swap/orderHash",
        this.store.orderReq
      );
      if (res.code != 200) {
        // return this.$tips.error(res.message);
        return; //console.log("更新订单失败");
      }
      // console.log(res.data);
      // Store.setOrderId(res.data.id);
      // 设置订单
    },
    // 是否可以下一步
    ifnext() {
      // 如果输入的不是数字
      if (isNaN(Number(this.store.amount))) {
        return false;
      }
      // 如果网络列表长度不够两个则无法进入下一步
      if (this.store.networkList.length < 2) {
        return false;
      }

      // 如果小数点后面位数大于decimals 000000000000000001
      if (this.store.amount.indexOf(".") > 0) {
        let ri = this.store.amount.substr(
          this.store.amount.indexOf(".") + 1,
          this.store.amount.length
        );
        if (ri.length > this.store.actionNetworkOne.decimals) {
          return false;
        }
      }
      // 如果转账jine小于于可跨链金额
      if (
        Number(this.store.amount) <
        Number(this.store.actionNetworkOne.min_amount)
      ) {
        return false;
      }
      // 如果转账jine大于可跨链金额
      if (
        Number(this.store.amount) >
        Number(this.store.actionNetworkOne.max_amount)
      ) {
        return false;
      }
      // 如果转到wdc，没填接收地址
      if (this.store.inpAddress == "") {
        return false;
      }
      // 如果wdc转出，没填发起地址
      if (
        this.store.actionNetworkOne.network_name == "WDC" &&
        this.store.inpFromAddress == ""
      ) {
        return false;
      }
      // 如果没连钱包
      if (this.store.walletAddress == "") {
        return false;
      }
      return true;
    },
    // 点击下一步 判断输入地址是否合理
    async next() {
      let da = true;
      // 收款网络不是wdc
      if (this.store.actionNetworkTwo.network_name != "WDC") {
        if (!this.web3.utils.isAddress(this.store.inpAddress)) {
          // 地址有誤
          return this.$message.error(this.getTips("addErr"));
        }
      }
      // 从wdc转出
      if (this.store.actionNetworkOne.network_name == "WDC") {
        let { data: res } = await this.$http.get(
          `${this.store.wdcPath}/verifyAddress/${this.store.inpFromAddress}`
        );
        if (res.code != 200) {
          // wdc地址錯誤
          return this.$message.error(this.getTips("wdcAddErr"));
        }
        da = res.data;
      }
      // 转到wdc
      if (this.store.actionNetworkTwo.network_name == "WDC") {
        let { data: res } = await this.$http.get(
          `${this.store.wdcPath}/verifyAddress/${this.store.inpAddress}`
        );
        if (res.code != 200) {
          return this.$message.error(this.getTips("wdcAddErr"));
        }
        da = res.data;
      }
      // 如果输入数量小于等于预估手续费
      if (
        this.amountMax(
          this.amountMul(
            this.store.actionNetworkOne.fee,
            this.store.actionNetworkOne.decimals
          ),
          this.amountMul(
            this.store.amount,
            this.store.actionNetworkOne.decimals
          )
        ) ==
        this.amountMul(
          this.store.actionNetworkOne.fee,
          this.store.actionNetworkOne.decimals
        )
      ) {
        // 輸入數量過低
        return this.$message.error(this.getTips("inpSmall"));
      }
      if (da) {
        this.continueIfshow = true;
      } else {
        return this.$message.error(this.getTips("wdcAddErr"));
      }
    },
    // 判断谁大,返回较大的值
    amountMax(amL, amR) {
      // 首先判断位数 哪个位数长就哪个大
      if (amL.length > amR.length) {
        return amL;
      }
      if (amR.length > amL.length) {
        return amR;
      }
      for (let i = 0; i < amL.length; i++) {
        if (Number(amL[i]) > Number(amR[i])) {
          return amL;
        }
        if (Number(amR[i]) > Number(amL[i])) {
          return amR;
        }
      }
      return amL;
    },
    // 添加decimals
    amountMul(amount, decimals) {
      amount = String(amount);
      let lf = "";
      let ri = "";
      let lin = "";

      let ret = "0";
      if (amount.indexOf(".") > 0) {
        lf = amount.substring(0, amount.indexOf("."));
        ri = amount.substring(amount.indexOf(".") + 1, amount.length);
        for (let i = 0; i < decimals - ri.length; i++) {
          lin += "0";
        }
        ret = `${lf == 0 ? "" : lf}${ri}${lin}`;
      } else {
        for (let i = 0; i < decimals; i++) {
          lin += "0";
        }
        //   console.log(amount);
        //   console.log(lin);
        ret = `${amount}${lin}`;
      }
      ret = Number(ret.substr(0, 10)) + ret.substr(10, ret.length);
      ret = Number(ret.substr(0, 10)) + ret.substr(10, ret.length);
      return ret;
    },
    // 獲取中英文提示
    // getTips(val){
    //   // 當前為中文還是英文
    //   let lang  = this.$i18n.locale
    //   // 當前為中文還是英文
    //   let aa = this.$i18n.messages[lang].tips[val]

    // }
  },
};
</script>
<style lang="less" scoped>
.Bridge {
  width: 500px;
  // height: 500px;
  background-color: #fff;
  border-radius: 15px;
  margin: 50px auto;
  border: 0 0 13px #e1e3f0;
  padding: 20px;
  box-shadow: 0 0 15px #ccc;

  .miniTitle {
    line-height: 40px;
  }
  .assets {
    padding: 5px 16px;
    height: 47px;
    line-height: 47px;
    border: 1px solid #e0e0e0;

    // margin: 0 20px;
    border-radius: 5px;
    img {
      width: 47px;
      height: 47px;
      float: left;
      border-radius: 50%;
      margin-right: 16px;
    }
    input {
      border: none;
      margin-top: 9px;
      background: none;
      line-height: 31px;
      font-size: 24px;
    }
  }
  table {
    width: 100%;
    // text-align: center;
    margin: 20px 0;
    .networkPop {
      margin: 0 auto;
    }
    td {
      .itemBox {
        width: 30px;
        height: 30px;
        // border: 0.5px solid #475fff5e;
        box-shadow: 5px 5px 13px #e1e3f0;
        border-radius: 5px;
        font-size: 25px;
        background-color: #edeef9;
        text-align: center;
        color: #4760ff;
        line-height: 30px;
        font-size: 14px;
      }
    }
  }
  .table {
    margin: 20px 0;
    .row {
      display: flex;
      justify-content: space-between;
      .col {
        .itemBox {
          width: 30px;
          height: 30px;
          // border: 0.5px solid #475fff5e;
          // box-shadow: 5px 5px 13px #E1E3F0;
          border-radius: 5px;
          background-color: #edeef9;
          text-align: center;
          color: #4760ff;
          margin-top: 75px;
          line-height: 30px;
          font-size: 20px;
        }
      }
    }
  }
  .inputBox {
    padding: 20px 16px;
    // background-color: #f1f1f1;
    border: 1px solid #e0e0e0;
    margin: 20px 0;
    border-radius: 10px;
    input {
      line-height: 50px;
      // background-color: #f1f1f1;
      font-size: 20px;
      width: 100%;
      width: calc(100% - 80px);
      border: none;
    }
    button {
      padding: 5px 10px;
      border-radius: 5px;
      border: 0.5px solid #4760ff;
      background-color: #4e61dd;
      color: #fff;
      float: right;
      margin-top: 10px;
      // top: 50%;
      // transform: translateY(-50%);
    }
  }
  // 待改
  .inputBox:focus-within {
    border: 0.5px solid #4760ff;
  }
  .address {
    border-radius: 5px;
    background-color: #f5f5f5;
    // border: 0.5px solid orange;
    padding: 10px 10px;
    margin: 20px 0;
    img {
      width: 16px;
      height: 16px;
    }
    input {
      border: none;
      background: none;
      width: 95%;
      padding: 0 5px;
    }
  }
  .tips {
    border-radius: 5px;
    // background-color: rgba(245, 235, 91, 0.363);
    // border: 0.5px solid orange;
    color: #d4237a;
    padding: 10px 10px;
  }
  .mini-button {
    background-color: #475fff;
    padding: 4px 8px;
    border-radius: 5px;
    color: #fff;
  }
  .wl-but {
    color: #fff;
  }
}
</style>
