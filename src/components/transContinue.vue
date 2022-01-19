<template>
  <!-- <div class="okTrans"> -->
  <!-- <div class="okTrans" v-if="true"> -->
  <div class="okTrans" v-if="ifShow">
    <div class="box">
      <div class="top">
        {{ $t("transContinue.title") }}
        <span class="down" @click="down()">
          <svg class="icon" aria-hidden="true" style="color: #4760ff">
            <use xlink:href="#icon-guanbi"></use>
          </svg>
        </span>
      </div>
      <h1>{{ `${store.amount} ${store.actionAssets.name}` }}</h1>
      <div class="miniBox">
        <div class="left">
          from
          <br />
          <img
            :src="store.imgPath + store.actionNetworkOne.network_icon"
            alt=""
          />
          <br />
          <span>{{ store.actionNetworkOne.network_name }}</span>
        </div>
        <div class="center">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-youjiantou"></use>
          </svg>
        </div>
        <div class="right">
          to
          <br />
          <img
            :src="store.imgPath + store.actionNetworkTwo.network_icon"
            alt=""
          />
          <br />
          <span>{{ store.actionNetworkTwo.network_name }}</span>
        </div>
      </div>
      <ul>
        <li>
          {{ $t("transContinue.accets") }}
          <div class="fr">{{ store.actionAssets.name }}</div>
        </li>
        <li>
          {{ $t("transContinue.address") }}
          <div class="fr">
            {{
              addressHide(
                this.store.actionNetworkOne.network_name == "WDC"
                  ? this.store.walletAddress
                  : this.store.inpAddress
              )
            }}
          </div>
        </li>
        <li>
          {{ $t("transContinue.fee") }}
          <div class="fr">{{ store.actionNetworkTwo.fee }}</div>
        </li>
        <li>
          {{ $t("transContinue.collect") }}
          <div class="fr">
            {{ reduce(store.amount, store.actionNetworkTwo.fee) }}
          </div>
        </li>
      </ul>
      <p>
        1. {{ $t("transContinue.tip1") }}
        <br />
        2. {{ $t("transContinue.tip2") }}
      </p>
      <div class="wl-but" @click="networkIfTrue()">
        {{ $t("transContinue.confirm") }}
      </div>
    </div>

    <qr-code ref="qrCode"></qr-code>
  </div>
</template>
<script>
import Store from "../store";
import QrCode from "@/components/qr-code.vue";

const Tx = require("ethereumjs-tx");
const abi = require("./abi.json");
// const BN = require('bn.js');

const Common = require("ethereumjs-common").default;
export default {
  components: {
    QrCode,
  },
  props: {
    ifShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      store: Store.state,
      salt: "nOSEKtdspw3MiIUI9q4JFsH4WZAO98s7",
      chexc: false,
    };
  },
  mounted() {
    // console.log(this.web3);
  },
  methods: {
    // 关闭弹窗
    down() {
      this.$emit("down");
    },
    // 提交订单三连发
    async crossChain() {
      // 获取余额
      if (this.store.actionNetworkOne.network_name != "WDC") {
        let balnas = await this.getBalnas();
        // 如果输入金额比余额大 则退出
        if (
          this.amountMax(
            balnas,
            this.amountMul(
              this.store.amount,
              this.store.actionNetworkOne.decimals
            )
          ) != balnas
        )
          // 餘額不足
          return this.$message.error(this.getTips("balIns"));
      }
      //  await this.send();
      // 创建订单
      if ((await this.newOrder()) == false) {
        return;
      }
      // 获取授予权额度
      if (this.store.actionNetworkOne.network_name != "WDC") {
        let teachAmount = await this.getTeachAmount();
        // 如果输入金额比授权余额大 则授权
        if (
          this.amountMax(
            teachAmount,
            this.amountMul(
              this.store.amount,
              this.store.actionNetworkOne.decimals
            )
          ) != teachAmount
        )
          if (this.store.actionNetworkOne.network_name != "WDC") {
            // 授权
            let hz = await this.teach();
            console.log(hz);
          }
      }
      // 如果是wdc网络转出则生成二维码，否则调用metamask
      if (this.store.actionNetworkOne.network_name == "WDC") {
        this.newQrCode();
        this.$emit("notify");
      } else {
        // 签发事务
        let hash = await this.send();
        // 更新订单
        this.upOrder(hash);
      }
    },
    // 创建订单
    async newOrder() {
      // let random;
      // if (window.sessionStorage.getItem("random")) {
      //   random = window.sessionStorage.getItem("random");
      // } else {
      //   random = String(Math.random()).substring(2)+String(Math.random()).substring(2);
      //   window.sessionStorage.setItem("random", random);
      // }
      let toAddress = this.store.inpAddress.replace(/(^\s*)|(\s*$)/g, "");
      // this.store.actionNetworkTwo.network_name == "WDC"
      //   ? this.store.inpAddress
      //   : this.store.walletAddress;
      let fromAddress =
        this.store.actionNetworkOne.network_name != "WDC"
          ? this.store.walletAddress
          : this.store.inpFromAddress;

      let orderReq = {
        itu: this.$md5(
          `${this.store.actionAssets.symbol}${this.salt}${this.store.actionNetworkTwo.id}${fromAddress}${toAddress}${this.store.actionNetworkOne.id}`
        ),
        amount: this.store.amount,
        assetName: this.store.actionAssets.name,
        assetNetworkFrom: this.store.actionNetworkOne.id,
        assetNetworkTo: this.store.actionNetworkTwo.id,
        assetSymbol: this.store.actionAssets.symbol,
        receive: toAddress,
        // receive: this.store.inpAddress,
        // receive: this.store.walletAddress,
        sponsor: fromAddress,
        // 转换方向1入2出
        swapDirection:
          this.store.actionNetworkOne.network_name == "WDC" ? 2 : 1,
        // 资金转入的事务哈希
        transferInTxhash: "",
      };
      let { data: res } = await this.$http.post("/pub/swap/order", orderReq);

      if (res.code != 200) {
        this.$message.error(res.message);
        return false;
      }
      // orderReq.id=''
      Store.setOrderReq(orderReq);
      Store.setOrderId(res.data.id);

      return true;
    },
    // 授权前 查询授权金额是否足够
    async getTeachAmount() {
      // 构建合约
      let myContract = new this.web3.eth.Contract(
        abi,
        this.store.actionNetworkOne.contract_address
      );
      let guo = await myContract.methods
        .allowance(
          this.store.walletAddress,
          this.store.actionNetworkOne.agent_address
        )
        .call();
      return guo;
    },
    // 授权
    async teach() {
      // 构建合约
      let myContract = new this.web3.eth.Contract(
        abi,
        this.store.actionNetworkOne.contract_address
      );
      // 拿到data
      let dt = await myContract.methods
        .approve(
          this.store.actionNetworkOne.agent_address,
          // '0xD945a0CF31dDBBa4301E646CC0cf07C3ea06e2F2',
          this.amountMul(
            this.store.amount,
            this.store.actionNetworkOne.decimals
          )
        )
        .encodeABI();
      // 拿到nonce
      let nonce = await this.web3.eth.getTransactionCount(
        this.store.walletAddress
      );
      // let getGasPrice = 20000000000; //1gas为1*10**9
      // 发送授权
      let trans = {
        from: this.store.walletAddress,
        to: this.store.actionNetworkOne.contract_address,
        // to: '0xb93C3383F71df1a16fdD111732896931CB161E8e',
        value: 0,
        // gasLimit: this.web3.utils.toHex(3000000),
        // gasPrice: this.web3.utils.toHex(getGasPrice),
        data: dt,
        nonce: this.web3.utils.toHex(nonce),
      };
      // console.log(trans);

      let res = await this.web3.eth.sendTransaction(trans);
      // 获取回执
      return res;
    },
    // 查询余额
    async getBalnas() {
      // 构建合约
      let myContract = new this.web3.eth.Contract(
        abi,
        this.store.actionNetworkOne.contract_address
      );
      let bal = await myContract.methods
        .balanceOf(this.store.walletAddress)
        .call();
      return bal;
    },
    // 签发事务,转账
    async send() {
      // console.log("send");
      if (this.store.orderId == "") {
        return;
      }
      // let abi = require("../views/abi3.json");
      // 构造合约
      // this.store.actionNetworkOne.agent_address
      let myContract = new this.web3.eth.Contract(
        JSON.parse(this.store.actionNetworkOne.agent_abi),
        this.store.actionNetworkOne.agent_address
      );

      // 拿到data
      let dt = await myContract.methods
        .swapETH2WDC(
          this.store.actionNetworkOne.contract_address,
          this.amountMul(
            this.store.amount,
            this.store.actionNetworkOne.decimals
          )
        )
        .encodeABI();

      // 拿到nonce
      let nonce = await this.web3.eth.getTransactionCount(
        this.store.walletAddress
      );
      // let getGasPrice = 20000000000; //1gas为1*10**9
      // 发送交易
      let trans = {
        from: this.store.walletAddress,
        to: this.store.actionNetworkOne.agent_address,
        value: 0,
        // gasLimit: this.web3.utils.toHex(3000000),
        // gasPrice: this.web3.utils.toHex(getGasPrice),
        data: dt,
        nonce: this.web3.utils.toHex(nonce),
      };
      // console.log(trans);

      let res = await this.web3.eth.sendTransaction(trans);
      // 更新数据
      // console.log("发送成功");
      return res.transactionHash;
      // this.upOrder(res.transactionHash);
    },
    // wdc转出，生成二维码
    async newQrCode() {
      let qrco = {
        // 原文
        bridge2data: {
          // contractAddress: this.store.actionNetworkOne.contract_address, //contract_address
          // methed: "swapWDC2ETH", //常量
          // amount: this.store.amount, //金额
          orderId: this.store.orderId, // 订单id
          // tokenAddress: this.store.actionNetworkOne.agent_address, //agent_address
        },
        toIcon: this.store.imgPath + this.store.actionNetworkTwo.network_icon, // 资产图标
        fromIcon: this.store.imgPath + this.store.actionNetworkOne.network_icon, // 资产图标
        // md5: "123" //加密之后的字符串
      };
      this.qrshow(JSON.stringify(qrco));
    },
    // 更新订单
    async upOrder(hash) {
      // let tm = setTimeout( async()=>{
      Store.setOrderReqHash(hash);
      let { data: res } = await this.$http.put(
        "/pub/swap/orderHash",
        this.store.orderReq
      );
      if (res.code != 200) {
        // return this.$tips.error(res.message);
        // console.log("更新订单失败");
      }
      // console.log(res.data);
      // Store.setOrderId(res.data.id);
      // 设置订单
      // clearTimeout(tm)
      // },60000)
    },
    // 签名
    async qianming(trans, prKey) {
      // console.log(`开始签名的事务`);

      let customCommon = Common.forCustomChain(
        "mainnet",
        {
          name: "psc",
          networkId: 102,
          chainId: 102,
        },
        "petersburg"
      );

      var privateKey = new Buffer.from(prKey, "hex");

      var transaction = new Tx.Transaction(trans, { common: customCommon });
      transaction.sign(privateKey);

      var serializedTx = transaction.serialize();
      console.log(JSON.stringify(serializedTx));

      // let res = await this.web3.eth.accounts.sign(trans, prKey);
      // console.log(`签名的事务`);
      // console.log(this.store.amount);
      // console.log(res);
      /*
 参数为1
      messageHash: "0x5f35dce98ba4fba25530a026ed80b2cecdaa31091ba4958b99b52ea1d068adad"
      r: "0xbf6091d51ffc0006547fa394646bb9bd65a08d13bc9c2820fc40ada7a108bbfc"
      s: "0x54ac61c04c2a08d9fd70be15b83b2a309b887dddcddd2371eb3d8a119d279e34"
      signature: "0xbf6091d51ffc0006547fa394646bb9bd65a08d13bc9c2820fc40ada7a108bbfc54ac61c04c2a08d9fd70be15b83b2a309b887dddcddd2371eb3d8a119d279e341c"
      v: "0x1c"
写死数字一
      [248, 171, 128, 133, 4, 168, 23, 200, 0, 131, 45, 198, 192, 148, 163, 208, 114, 161, 221, 0, 88, 200, 133, 13, 113, 226, 163, 245, 60, 44, 34, 91, 249, 68, 1, 184, 68, 226, 92, 221, 171, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 178, 191, 161, 219, 47, 32, 209, 218, 161, 80, 152, 219, 159, 5, 235, 17, 165, 53, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
写死字符串1
      messageHash: "0x5f35dce98ba4fba25530a026ed80b2cecdaa31091ba4958b99b52ea1d068adad"
      r: "0xbf6091d51ffc0006547fa394646bb9bd65a08d13bc9c2820fc40ada7a108bbfc"
      s: "0x54ac61c04c2a08d9fd70be15b83b2a309b887dddcddd2371eb3d8a119d279e34"
      signature: "0xbf6091d51ffc0006547fa394646bb9bd65a08d13bc9c2820fc40ada7a108bbfc54ac61c04c2a08d9fd70be15b83b2a309b887dddcddd2371eb3d8a119d279e341c"
      v: "0x1c"
传参数字1
      [248, 171, 128, 133, 4, 168, 23, 200, 0, 131, 45, 198, 192, 148, 163, 208, 114, 161, 221, 0, 88, 200, 133, 13, 113, 226, 163, 245, 60, 44, 34, 91, 249, 68, 1, 184, 68, 226, 92, 221, 171, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 178, 191, 161, 219, 47, 32, 209, 218, 161, 80, 152, 219, 159, 5, 235, 17, 165, 53, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      

      */
      /*
     //  传参 数字10 失败 
      let aa = [248,171,2,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,240,160,201,134,189,108,240,189,166,57,12,7,9,8,240,62,3,136,13,174,103,82,37,125,79,63,158,220,174,149,189,136,46,151,160,102,254,58,14,173,83,168,100,61,177,137,158,127,95,25,45,98,175,245,218,85,153,63,4,22,133,117,8,161,7,170,43];
     //  写死 数字10 失败 
      let bb = [248,171,3,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,239,160,207,221,77,115,111,149,53,170,212,23,58,175,209,94,31,172,142,229,164,213,62,70,243,170,32,201,87,121,150,106,189,17,160,79,200,167,88,191,49,38,2,105,217,145,10,52,22,64,59,243,95,253,52,187,128,81,80,74,143,234,184,151,228,158,176];
     
*/
      /*
     //  传参 数字10 
     {"type":"Buffer","data":[248,171,83,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,240,160,27,5,114,101,47,118,160,4,110,234,9,107,133,73,111,61,245,237,40,155,253,229,198,179,41,171,48,227,219,246,142,108,160,61,174,40,6,83,150,207,100,168,107,168,94,128,135,228,136,103,130,71,143,130,175,1,163,48,213,12,249,65,233,173,36]}
     {"type":"Buffer","data":[248,171,83,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,240,160,27,5,114,101,47,118,160,4,110,234,9,107,133,73,111,61,245,237,40,155,253,229,198,179,41,171,48,227,219,246,142,108,160,61,174,40,6,83,150,207,100,168,107,168,94,128,135,228,136,103,130,71,143,130,175,1,163,48,213,12,249,65,233,173,36]}
      
     //  写死 数字10 
     {"type":"Buffer","data":[248,171,83,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,240,160,27,5,114,101,47,118,160,4,110,234,9,107,133,73,111,61,245,237,40,155,253,229,198,179,41,171,48,227,219,246,142,108,160,61,174,40,6,83,150,207,100,168,107,168,94,128,135,228,136,103,130,71,143,130,175,1,163,48,213,12,249,65,233,173,36]}
      写死10
      {"type":"Buffer","data":[248,171,84,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,239,160,161,59,150,252,20,67,228,213,33,246,131,104,165,19,198,240,113,148,226,152,109,98,120,98,64,75,67,210,74,134,12,201,160,10,223,168,154,230,5,227,25,59,127,34,116,182,111,66,24,161,84,135,101,165,81,193,162,71,139,229,219,233,47,147,135]}
     {"type":"Buffer","data":[248,171,84,133,4,168,23,200,0,131,45,198,192,148,163,208,114,161,221,0,88,200,133,13,113,226,163,245,60,44,34,91,249,68,10,184,68,226,92,221,171,0,0,0,0,0,0,0,0,0,0,0,0,36,178,191,161,219,47,32,209,218,161,80,152,219,159,5,235,17,165,53,126,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,129,239,160,161,59,150,252,20,67,228,213,33,246,131,104,165,19,198,240,113,148,226,152,109,98,120,98,64,75,67,210,74,134,12,201,160,10,223,168,154,230,5,227,25,59,127,34,116,182,111,66,24,161,84,135,101,165,81,193,162,71,139,229,219,233,47,147,135]}
*/
    },
    // 处理地址，隐藏
    addressHide(add) {
      return add.slice(0, 7) + "···" + add.slice(add.length - 7);
    },
    show() {
      // console.log(this.chexc);
    },
    // 打开二维码
    qrshow(val) {
      this.$refs.qrCode.qrCodeUp(val);
    },
    // 向metamask添加网络
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
        .then(() => {
          this.switchNetWork();
          // console.log("添加成功");
          return true;
        })
        .catch(() => {
          // console.log("添加失败");
          // console.log(err);
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
        .then(() => {
          // console.log("切换成功");
          this.networkIfTrue();
        })
        .catch((err) => {
          // console.log(err);
          // 如果没有添加网络则添加
          if (err.code == 4902) {
            console.log(this.addNetWork());
          }
          // console.log("切换失败");
        });
    },
    // 当前网络是否正常
    async networkIfTrue() {
      if (this.store.actionNetworkOne.network_name == "WDC") {
        this.crossChain();
        return;
      }
      // 看看当前网络是否是发起网络

      if (
        this.store.actionNetworkOne.chain_id == window.ethereum.networkVersion
      ) {
        // console.log('当前是发起网络');
        this.crossChain();
        return;
      } else {
        // console.log('当前不是发起网络');
        await this.switchNetWork();
        return;
      }
    },

    inputPassToFormPass(inputPass) {
      let str = `${this.salt.substring(4, 16)}${inputPass}${this.salt.substring(
        5,
        20
      )}`;
      return this.$md5(str);
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
    // 字符串数值减法
    reduce(a, b) {
      // 判断小数位数
      let ari = 0;
      let bri = 0;
      let ale = a.length;
      let ble = b.length;
      if (a.indexOf(".") > 0) {
        ale = a.indexOf(".");
        ari = a.length - a.indexOf(".") - 1;
      }
      if (b.indexOf(".") > 0) {
        ble = b.indexOf(".");
        bri = b.length - b.indexOf(".") - 1;
      }
      // 小数 补0 如果b的后面位数长于a则给a补零 否则给b补0
      if (bri > ari) {
        if (ari == 0) {
          a = a + ".";
        }
        for (let i = 0; i < bri - ari; i++) {
          a = a + "0";
        }
      }
      if (ari > bri) {
        if (bri == 0) {
          b = b + ".";
        }
        for (let i = 0; i < ari - bri; i++) {
          b = b + "0";
        }
      }
      // 整数补0
      if (ale > ble) {
        for (let i = 0; i < ale - ble; i++) {
          b = "0" + b;
        }
      }
      if (ble > ale) {
        for (let i = 0; i < ble - ale; i++) {
          a = "0" + a;
        }
      }
      // 相减
      let arr = [];
      for (let i = 0; i < a.length; i++) {
        if (typeof b[b.length - 1 - i] == undefined) {
          arr.push(a[a.length - 1 - i]);
        } else {
          arr.push(a[a.length - 1 - i] - b[b.length - 1 - i]);
        }
      }
      // 处理借位
      for (let i = 0; i < arr.length; i++) {
        if (isNaN(arr[i])) {
          arr[i] = ".";
        }
        if (arr[i] < 0) {
          if (isNaN(arr[i + 1])) {
            arr[i + 2]--;
          } else {
            arr[i + 1]--;
          }
          arr[i] += 10;
        }
      }
      // 最终结果
      let jg = "";
      for (let i = arr.length - 1; i >= 0; i--) {
        jg += arr[i];
      }
      // 如果第一个数为0 则去掉
      if (jg.indexOf(".") > 1 && jg[0] == "0") {
        jg = jg.substring(1);
      }
      return jg;
    },
  },
};
</script>

<style lang="less" scoped>
.okTrans {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(5, 5, 5, 0.37);
  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 500px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 0 5px #4760ff;
    .down {
      position: absolute;
      right: 20px;
      top: 20px;
      border-radius: 5px;
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      // background-color: #f1f1f1;
    }
    .top {
      padding: 16px;
      text-align: center;
      font-size: 20px;
      // border-bottom: 0.5px solid #ccc;
      width: calc(100% + 8px);
      margin-left: -20px;
    }
    h1 {
      text-align: center;
      margin: 10px 0;
    }
    .miniBox {
      // height: 120px;
      border-radius: 10px;
      margin: 20px 0;
      box-shadow: 0 0 13px #e1e3f0;
      display: flex;
      padding: 10px 0;
      .left,
      .right {
        flex: 1 1 0;
        text-align: center;
        // line-height: 20px;
        img {
          display: inline-block;
          width: 56px;
          height: 56px;
          margin: 10px 0;
          border-radius: 50%;
          // background-color: #4760ff;
        }
      }
      .center {
        border-radius: 5px;
        margin: 35px 10px 0;
        width: 42px;
        height: 42px;
        background-color: #edeef9;
        font-size: 30px;
        color: #4760ff;
        line-height: 42px;
        text-align: center;
      }
    }
    ul {
      li {
        // border-bottom: 0.5px solid rgba(204, 204, 204, 0.404);
        padding: 10px 0;
        font-weight: 10px;
      }
    }
    p {
      margin: 10px 0px;
      line-height: 24px;
      color: #999;
      font-size: 12px;
    }
    .but {
      padding: 10px 0;
      border: 10px;
      background-color: orange;
      border-radius: 10px;
      text-align: center;
      color: #fff;
      margin: 20px 0px;
    }
    .wl-but {
      color: white;
    }
    input[type="checkbox"] {
      position: relative;
    }
    input[type="checkbox"]::after {
      position: absolute;
      top: 0;
      color: #000;
      width: 15px;
      height: 15px;
      display: inline-block;
      visibility: visible;
      padding-left: 0px;
      text-align: center;
      content: " ";
      border-radius: 3px;
    }

    input[type="checkbox"]:checked::after {
      content: "✓";
      color: #fff;
      font-size: 12px;
      font-weight: bold;
      background-color: #4760ff;
    }
  }
}
</style>
