<template>
  <div class="adminTp">
    <div class="title">
      上面的部分没用，不要点
      <p>
        <!-- tp操作 -->
      </p>
    </div>
    <br />
    <br />
    当前钱包:{{ user.name }}
    <br />
    {{ user.address }}
    <br />
    <br />
    请选择要操作的网络
    <div class="chain">
      <el-select
        @change="getTokens(actionChain)"
        value-key="chainId"
        v-model="actionChain"
        placeholder="请选择"
      >
        <el-option
          v-for="item in chainList"
          :key="item.chainId"
          :label="item.name"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <br />
    <!-- 如果菜单中没有则手动输入要发布的链id
    <el-input v-model="actionChain.chainId" placeholder="请输入内容"></el-input> -->
    <!-- <br /> -->
    <el-button type="primary" @click="sendTrans('in')">锁定合约</el-button>
    <el-button type="primary" @click="sendTrans('un')">解锁合约</el-button>
    <br />
    <br />

    要提取的币
    <br />
    <el-select
      value-key="contractAddress"
      v-model="actionToken"
      placeholder="请选择"
    >
      <el-option
        v-for="item in TokenList"
        :key="item.contractAddress"
        :label="item.name"
        :value="item"
      >
      </el-option>
    </el-select>
    {{ actionToken.contractAddress }}
    <br />
    <br />
    要提取的金额
    <el-input
      type="number"
      v-model="withdraw.amount"
      placeholder="提取的币的金额"
    ></el-input>

    <br />
    <br />
    <el-button type="primary" @click="sendTrans('tk')">提取代币</el-button>

    <br />
    <br />
    事务哈希(长按可复制)
    <p>{{ transHash }}</p>
  </div>
</template>

<script>
import Store from "../store";
// @ is an alias to /src
const tp = require("tp-js-sdk");
const abi = require("../components/abi2");

export default {
  name: "Home",
  mounted() {
    // 如果是tp则获取当前用户信息
    if (tp.isConnected()) {
      this.getInfo();
    } else {
      // 否则从wdc获取当前用户信息
      window.getAppHtmlPukey = (val) => {
        this.getAppHtmlPukey(val);
      };
      // 请求钱包给我列表
      if (!window.sessionStorage.getItem("userList")) {
        document.location = "js://GetAllWallet";
      }
    }
    // 获取网络
    this.getNetworks();
    this.web3 = new this.$web3(
      this.$web3.givenProvider || "ws://some.local-or-remote.node:8546" || ""
    );
  },
  components: {},
  data() {
    return {
      store: Store.state,
      chainList: [
        {
          id: "1", //链id
          chainId: "1", //链id
          name: "bsc1", // 链名称
          rpcUrl: "bsc1", //rpc地址
          agentAddress: "bsc1", //代理合约地址
        },
        {
          chainId: "2", //链id
          id: "1", //链id
          name: "bsc2", // 链名称
          rpcUrl: "bsc1", //rpc地址
          agentAddress: "bsc1", //代理合约地址
        },
        {
          chainId: "3", //链id
          name: "bsc3", // 链名称
          rpcUrl: "bsc1", //rpc地址
          agentAddress: "bsc1", //代理合约地址
        },
        {
          id: "1", //链id
          chainId: "4", //链id
          name: "bsc4", // 链名称
          rpcUrl: "bsc1", //rpc地址
          agentAddress: "bsc1", //代理合约地址
        },
      ],
      // 选择的链id
      actionChain: {
        id: "", //数据id
        chainId: "", //链id
        name: "", // 链名称
        rpcUrl: "", //rpc地址
        agentAddress: "", //代理合约地址
      },
      // 代笔列表
      TokenList: [
        {
          // 代笔名称
          name: "111",
          // 代笔地址
          contractAddress: "111",
        },
        {
          // 代笔名称
          name: "222",
          // 代笔地址
          contractAddress: "222",
        },
      ],
      // 选中的代笔
      actionToken: {
        contractAddress: "",
        name: "",
      },
      // 当前钱包信息
      user: {
        name: "itokenpocket",
        address: "EOSaaaaaaaaabbbbbbbb",
        blockchain: "eos",
      },
      // 提取参数
      withdraw: {
        address: "",
        amount: "",
      },
      // 返回的事务哈希
      transHash: "12345678",
      web3: "",
    };
  },
  methods: {
    // tp获取当前钱包信息
    async getInfo() {
      let { data: res } = await tp.getCurrentWallet();
      // alert(JSON.stringify(res));
      this.user = res;
    },
    // wdc获取当前钱包信息
    getAppHtmlPukey(val) {
      // 获取用户列表数据==============================================
      this.user = JSON.parse(val)[0];
      alert(this.user);
    },
    // 获取链信息列表
    async getNetworks() {
      let { data: res } = await this.$http.get("/pub/cross/networks");
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      // console.log(res);
      this.chainList = res.data;
    },
    // 获取代币信息列表
    async getTokens(val) {
      let { data: res } = await this.$http.get(`/pub/cross/assets/${val.id}`);
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      // console.log(res);
      this.TokenList = res.data;
    },

    // 合约操作
    sendTrans(val) {
      // val可能是un(解锁) in(锁定) tk(提取代币)
      // this.sendTransTP(val);
      // 如果没有选择链
      if (!this.actionChain.name) {
        return this.$message.warning("请选择要操作的链");
      }
      if (val == "tk" && !this.actionToken.name) {
        return this.$message.warning("要提取的币是必选的");
      }
      if (val == "tk" && !this.withdraw.amount) {
        return this.$message.warning("提取数量是必填的");
      }
      if (tp.isConnected()) {
        if (this.actionChain.name == this.store.wdcName) {
          return this.$message.warning("tp钱包不能操作wdc链");
        }
        this.sendTransTP(val);
      } else {
        if (!this.user.pubkeyhash) {
          return this.$message.warning("请使用wdc钱包或tp钱包打开");
        }
        if (this.actionChain.name != this.store.wdcName) {
          return this.$message.warning("wdc钱包只能操作wdc链");
        }
        this.sendTransWDC(val);
      }
    },

    // tp合约操作
    async sendTransTP(val) {
      // val可能是un(解锁) in(锁定) tk(提取代币)
      // 设置测试合约
      // this.actionChain.agentAddress =
      //   "0x99D2330F92bf561bc833B1C6631eAe0C5E64614D";
      // this.actionChain.chainId = 3;
      // 设置测试代币合约
      // this.actionToken.address = "0x009f1eB5FD62f03f42C951e59c134d692BC3473c";
      // 要发布的链id
      // 如果没有钱包地址

      // 如果地址不是正常的地址
      if (!this.web3.utils.isAddress(this.user.address)) {
        return this.$message.warning("地址格式异常");
      }

      let myContract = await new this.web3.eth.Contract(
        abi,
        this.actionChain.agentAddress
        // "0x89777588aBC5aC97cE76DFB5E72fD1D0a671e2e2"
      );
      let dt;

      if (val == "up") {
        // 解锁
        dt = await myContract.methods.setUnLock().encodeABI();
      } else if (val == "in") {
        // 锁定
        dt = await myContract.methods.setLock().encodeABI();
      } else if (val == "tk") {
        //提取代币
        dt = await myContract.methods
          .withdraw(this.actionToken.contractAddress, this.withdraw.amount)
          .encodeABI();
      }
      // 构建事物
      let trans = {
        // from: this.user.address,
        from: "0xb1612eef2f5d363EDB4D826DFFab390eF4aB2b05",
        to: this.actionChain.agentAddress,
        // to: "0x89777588aBC5aC97cE76DFB5E72fD1D0a671e2e2",
        value: 0,
        data: dt,
        // chainId: this.actionChain.chainId,
        // chainId: 3,
      };
      // console.log(trans);
      // 发送事务
      let res = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [trans],
      });
      this.transHash = res;
    },

    // wdc合约操作
    async sendTransWDC(val) {
      // val可能是un(解锁) in(锁定) tk(提取代币)

      let res = "";
      if (val == "un") {
        let { data: rest } = await this.$http.get("/");
        res = rest;
      } else if (val == "in") {
        let { data: rest } = await this.$http.get("/");
        res = rest;
      } else if (val == "tk") {
        let { data: rest } = await this.$http.get("/");
        res = rest;
      }
      if (res.code != 200) {
        return this.$message.error(res.message);
      }
      // 签发事务
      document.location = "js://setTransaction?data=" + res.data.trans;
    },
  },
};
</script>
<style lang="less" scoped>
.adminTp {
  // height: 100vh;
  padding: 0 2.5%;
}
</style>
