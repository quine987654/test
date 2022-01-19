<template>
  <div class="airdrop">
    <!-- 主标题 -->
    <div class="title">
      <strong>{{ $t("airdrop.title") }}</strong>
    </div>
    <!-- 副标题 -->
    <!-- <div class="subTitle">
      <strong>{{ $t("airdrop.subTtitle") }}</strong>
    </div> -->
    <!-- 描述 -->
    <div class="p">
      {{ $t("airdrop.p") }}
    </div>
    <div class="inputBox">
      <input type="text" v-model="input" placeholder="PSC Address" />
      <a href="javascript:;"
        ><div @click="getAirdrop()" class="but">{{ $t("airdrop.but") }}</div></a
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    async getAirdrop() {
      if (!this.web3.utils.isAddress(this.input)) {
        // 地址有誤
        return this.$message.error(this.getTips("addErr"));
      }
      let { data: res } = await this.$http.post(`/swap/airdrop/${this.input}`);
      if (res.code !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success("Success");
    },
  },
};
</script>
<style lang="less" scoped>
.airdrop {
  width: 100%;
  height: calc(100vh - 80px);
  // background-color: rgba(12, 84, 240, 0.034);
  text-align: center;
  .title {
    font-size: 40px;
    padding-top: 150px;
    color: rgb(89, 89, 252);
    // line-height: 200px;
  }
  .subTitle {
    padding-top: 10px;
    font-size: 20px;
    color: #444;
  }
  .p {
    padding: 30px 0;
    width: 500px;
    margin: 0 auto;
    color: #666;
  }
  .inputBox {
    margin: 0 auto;
    width: 700px;
    height: 60px;
    border-radius: 30px;
    background-color: #f5f5f5;
    border: 1px solid rgb(189, 212, 245);
    display: flex;
    line-height: 50px;
    padding: 0 5px;
    input {
      border: none;
      margin: 0;
      padding: 0;
      margin-top: 5px;
      height: 50px;
      flex: 1;
      background: none;
      font-size: 20px;
      margin-left: 30px;
    }
    .but {
      // width: 100px;
      background-color: rgb(89, 89, 252);
      line-height: 50px;
      margin-top: 5px;
      height: 50px;
      padding: 0 30px;
      color: #fff;
      font-size: 20px;

      border-radius: 30px;
    }
  }
}
</style>
