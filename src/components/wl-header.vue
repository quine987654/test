<template>
  <div class="header">
    <div class="fr" v-if="!store.walletAddress">
      <a href="javascript:;">
        <div class="fr-but" @click="linkWallet()">{{ $t("header.link") }}</div>
      </a>
    </div>
    <div class="fr">
      <div class="fr-text" v-if="store.walletAddress">
        <!-- 钱包地址  -->
        <img src="../assets/metamask.svg" alt="" />
        <span>{{ addressHide(store.walletAddress) }}</span>
        <br />
        <!-- 钱包网络 -->
        <!-- <span>{{ store.walletNetworkName }}</span> -->
      </div>
    </div>
    <div class="fl">
      <ul>
        <a href="javascript:;">
          <li
            :class="{
              act: $route.fullPath == '/' || $route.fullPath == '/bridge',
            }"
            @click="goBridge()"
          >
            {{ $t("header.bridge") }}
          </li>
        </a>
        <a href="javascript:;">
          <li
            :class="{ act: $route.fullPath == '/airdrop' }"
            @click="goAirdrop()"
          >
            {{ $t("header.airdrop") }}
          </li>
        </a>
        <a href="javascript:;">
          <li
            :class="{ act: $route.fullPath == '/orderList' }"
            @click="goOrderList()"
          >
            {{ $t("header.orderList") }}
          </li>
        </a>
        <a href="javascript:;">
          <li class="lang" @click="changeLang()">{{ $t("header.lang") }}</li>
        </a>
      </ul>
    </div>
  </div>
</template>
<script>
import Store from "../store.js";
export default {
  components: {},
  mounted() {
    // 如果有metamask环境
    if (typeof window.ethereum !== "undefined") {
      // 监听网络变化
      window.ethereum.on("chainChanged", (aaa) => {
        // this.wallet.network = parseInt(aaa.slice(2), 16);
        if (this.networks[parseInt(aaa.slice(2), 16)]) {
          Store.setWalletNetworkId(parseInt(aaa.slice(2), 16));
          Store.setWalletNetworkName(
            this.networks[parseInt(aaa.slice(2), 16)].name
          );
        } else {
          this.wallet.network = "loading...";
        }
      });
      // 监听地址变化
      window.ethereum.on("accountsChanged", (aaa) => {
        // this.wallet.address = aaa[0];
        // console.log(aaa[0]);
        Store.setWalletAddress(aaa[0]);
      });
    }
    // 如果有地址则填充
    // if (window.ethereum.selectedAddress) {
    //   Store.setWalletAddress(window.ethereum.selectedAddress)
    // }
  },
  data() {
    return {
      // 公用数据
      store: Store.state,
      // 控制链接钱包弹窗
      popIfshow: false,
      // 钱包数据
      wallet: {
        address: "",
        name: "",
        network: "",
        chainId: "",
      },
      // 网络名列表
      networks: require("../assets/networks.json"),
    };
  },
  methods: {
    // 关闭钱包弹窗
    downWallet() {
      this.popIfshow = false;
    },
    // 选择钱包
    cliWallet(dt) {
      this.wallet = dt;
      // this.list1Act = this.wallet
      /**
       *寻找有没有选中的钱包
       */
      let iftrut = false;
      let num = 0;
      for (let i = 0; i < this.list1.length; i++) {
        if (this.list1[i].network == this.wallet.network) {
          iftrut = true;
          num = this.list1[i].code;
          // console.log(num);
          break;
          // i = -1;
        }
      }
      if (iftrut == true) {
        for (let i = 0; i < this.list1.length; i++) {
          if (this.list1[i].network == this.wallet.network) {
            this.list1[i].code = num;
            if (num == 1) {
              this.list1Act = this.list1[i];
            } else {
              this.list2Act = this.list1[i];
            }
          } else if (this.list1[i].code == num) {
            this.list1[i].code = null;
          }
        }
      }
      this.list1Act.name = this.wallet.name;
      // this.list1Act.img = this.wallet.img;
    },
    // 链接钱包
    async linkWallet() {
      if (typeof window.ethereum == "undefined") {
        // 請安裝MetaMask
        return this.$message.error(this.getTips("pleIns"));
      }

      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((item) => {
          console.log(item);
        });
      // this.wallet.address = window.ethereum.selectedAddress;
      // Store.setWalletAddress()
      Store.setWalletAddress(window.ethereum.selectedAddress);
    },
    // 处理地址，隐藏
    addressHide(add) {
      return add.slice(0, 7) + "···" + add.slice(add.length - 7);
    },
    // 切换语言
    changeLang() {
      if (this.$i18n.locale == "zh-hk") {
        this.$i18n.locale = "en";
        window.sessionStorage.setItem("lang", "en");
      } else {
        this.$i18n.locale = "zh-hk";
        window.sessionStorage.setItem("lang", "zh-hk");
      }
    },
    // 前往空头
    goAirdrop() {
      this.$router.push("/airdrop");
    },
    goBridge() {
      this.$router.push("/");
    },
    goOrderList() {
      this.$router.push("/orderList");
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../assets/global.less");
.header {
  height: 85px;
  // background-color: @twoBgColor;
  background: none;
  line-height: 85px;
  font-size: 18px;
  position: relative;
  .fl {
    // margin-left: 25px;
    position: absolute;
    float: none;
    left: 50%;
    height: 65px;
    line-height: 65px;
    transform: translate(-50%, 10px);
    border-radius: 15px;
    padding: 0 15px;
    background-color: #fff;
    width: 540px;
    box-sizing: border-box;
    ul {
      display: flex;
      justify-content: space-between;
    }

    li {
      float: left;
      // padding-left: 50px;
      padding: 0 20px;
      height: 45px;
      margin-top: 10px;
      border-radius: 10px;
      line-height: 45px;
      transition: 0.5;
    }
    a {
      .act {
        color: rgb(41, 50, 110) !important;
        background-color: #f1f1f1;
        font-weight: 600;
      }
    }
  }
  .fr {
    margin-right: 25px;
  }
  .fr-but {
    height: 40px;
    //   width: 80px;
    line-height: 40px;
    border-radius: 10px;
    text-align: center;
    margin-top: 10px;
    color: #fff;
    padding: 0 16px;
    background-color: #4760ff;
  }
  .fr-text {
    img {
      width: 26px;
      height: 26px;
      float: left;
      margin-right: 5px;
    }
    height: 40px;
    //   width: 80px;
    // line-height: 16px;
    line-height: 30px;
    border-radius: 10px;
    text-align: center;
    margin-top: 10px;
    color: #fff;
    padding: 5px 16px;
    box-sizing: border-box;
    background-color: #4760ff;
  }
}
</style>
