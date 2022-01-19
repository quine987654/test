<template>
  <div class="orderList">
    <div class="w">
      <div class="title">{{ $t("orderList.title") }}</div>
      <div class="list" v-loading="loading">
        <div class="item" v-for="item in list" :key="item.id">
          <div class="from">
            <span class="t">{{ $t("orderList.from") }}</span>
            <br />
            <!-- 網絡 -->
            <span class="subT">{{ $t("orderList.network") }}:</span>
            <br />{{ item.assetNetworkFromName }}
            <br />
            <!-- 地址 -->
            <span class="subT">{{ $t("orderList.address") }}:</span>
            <br />{{ item.sponsor }}
          </div>
          <div class="to">
            <span class="t">{{ $t("orderList.to") }}</span>
            <br />

            <!-- 網絡 -->
            <span class="subT">{{ $t("orderList.network") }}:</span>
            <br />{{ item.assetNetworkToName }}
            <br />
            <!-- 地址 -->
            <span class="subT">{{ $t("orderList.address") }}:</span>
            <br />{{ item.receive }}
          </div>
          <div class="token">
            <!-- token -->
            <span class="t">{{ $t("orderList.token") }}</span>

            <br />
            <!-- 標識 -->
            <span class="subT">{{ $t("orderList.symbol") }}:</span
            >{{ item.assetSymbol }}
            <br />
            <!-- 名字 -->
            <span class="subT">{{ $t("orderList.name") }}:</span
            >{{ item.assetName }}
            <br />
            <!-- 金額 -->
            <span class="subT">{{ $t("orderList.amount") }}:</span
            >{{ item.amount }}
            <br />
            <!-- 到賬 -->
            <span class="subT">{{ $t("orderList.arrival") }}:</span
            >{{ item.realAmount }}
          </div>
          <div class="state">
            <!-- 狀態 -->
            <span class="t">{{ $t("orderList.status") }}</span>
            <br />
            <div class="div" v-if="item.status == 0">
              <span>{{ $t("orderList.status0") }}</span>
              <!-- <div class="but" @click="getAssets(item)">发起转账</div> -->
            </div>
            <span v-if="item.status == 1">{{ $t("orderList.status1") }}</span>
            <span v-if="item.status == 2">{{ $t("orderList.status2") }}</span>
            <span v-if="item.status == 3">{{ $t("orderList.status3") }}</span>
            <span v-if="item.status == 4">{{ $t("orderList.status4") }}</span>
            <span v-if="item.status == 5">{{ $t("orderList.status5") }}</span>
            <span v-if="item.status == 6">{{ $t("orderList.status6") }}</span>
            <span v-if="item.status == 7">{{ $t("orderList.status7") }}</span>
            <span v-if="item.status == 8">{{ $t("orderList.status8") }}</span>
            <span v-if="item.status == 200">{{
              $t("orderList.status200")
            }}</span>
          </div>
        </div>
      </div>
      <span class="wl-total">
        <i18n path="orderList.limit" tag="span">
          <span place="total">{{ total }}</span>
        </i18n>
      </span>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNumber"
        :page-size="pageSize"
        layout=" prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <trans-continue></trans-continue>
  </div>
</template>

<script>
import TransContinue from "../components/transContinue.vue";
import Store from "../store";
export default {
  components: {
    TransContinue,
  },
  mounted() {
    this.getOrderList();
  },
  data() {
    return {
      store: Store.state,
      loading: false,
      total: 885,
      pageSize: 10,
      pageNumber: 1,
      list: [
        {
          ID: "", // uint64
          AssetNetworkFrom: "", // uint64     //转换起始方的crossAsset ID
          AssetNetworkFromName: "", // string     //转换起始方的网络名称
          AssetNetworkFromTxUrl: "", // string     //转换起始方的事务查询地址
          AssetNetworkTo: "", // uint64     //转换目标方的crossAsset ID
          AssetNetworkToName: "", // string     //转换目标方的网络名称
          AssetNetworkToTxUrl: "", // string     //转换目标方的事务查询地址
          SwapDirection: "", // uint16     //转换方向 1入 2出
          TransferInTxhash: "", // string     //用户转入资金的事务hash
          ForgeSuccessHash: "", // string     //代币铸造成功的事务hash
          Sponsor: "", // string     //发起钱包地址
          Receive: "", // string     //转换目标地址
          AssetSymbol: "", // string     //资产标识
          AssetName: "", // string     //资产全名
          Amount: "", // string     //用户计划交易金额
          RealAmount: "", // string     //用户实际到账金额
          Status: "", // uint16     //0.发起交易，待转币  1.转币超时  2.转币成功，等待铸造 3.铸造失败，等待重试 4.交易失败，等待退回资金 5.退还资金成功 6.退还资金失败，等待重试 7.退还资金失败，等待手动结束 8.已手动结束  200.铸造成功，已放币
          CreatedAt: "", // time.Time  // 创建时间
          UpdatedAt: "", // time.Time  // 更新时间
        },
      ],
    };
  },
  methods: {
    // 获取订单记录
    async getOrderList() {
      this.loading = true;
      let { data: res } = await this.$http.post("/pub/swap/orderList", {
        sponsor: this.store.walletAddress,
        // sponsor: "0xb1612eef2f5d363EDB4D826DFFab390eF4aB2b05",
        Current: this.pageNumber,
        PageSize: this.pageSize,
      });
      this.loading = false;
      if (res.code != 200) {
        return this.$message.error(res.message);
      }
      this.list = res.data.list;
      this.total = res.data.pagination.total;
    },
    // 当页面发生变化的时候请求数据
    handleCurrentChange() {
      this.getOrderList();
    },
    /*
      链条式调起钱包
      1、请求资产列表 
      2、请求该资产的网络列表
      2.1、切换网络 添加网络
      3、构建事务转账
      3.1、询问是否有结果
      4、转账成功更新哈希

    */
  },
};
</script>

<style lang="less" scoped>
.orderList {
  min-height: 100vh;
  .w {
    width: 1350px;
    margin: 0 auto;
    // height: 100vh;
    background-color: rgba(235, 239, 245, 0.562);
    padding-bottom: 30px;
    border-radius: 20px;
    .title {
      font-size: 24px;
      padding: 30px;
    }
    .list {
      margin: 0 10px;
      // background-color: rgb(252, 241, 241);
      height: calc(100% - 90px);
      border-radius: 20px;
      .item {
        min-height: 100px;
        margin-top: 10px;
        border-radius: 10px;
        // border-bottom: 1px solid rgb(128, 126, 255);
        background-color: rgb(245, 255, 245);
        display: flex;
        padding: 15px 20px;
        .from {
          // flex: 1;
          padding: 0 10px;
          width: 390px;
        }
        .to {
          // flex: 1;
          width: 390px;
          padding: 0 10px;
          border-left: 1px solid rgba(128, 126, 255, 0.205);
        }
        .token {
          flex: 1;
          padding: 0 10px;
          border-left: 1px solid rgba(128, 126, 255, 0.205);
        }
        .state {
          // flex: 1;
          width: 180px;
          padding: 0 10px;
          border-left: 1px solid rgba(128, 126, 255, 0.205);
          text-align: center;
          span {
            line-height: 40px;
          }
          .but {
            background-color: rgb(30, 145, 26);
            padding: 5px 16px;
            display: inline-block;
            border-radius: 5px;
            color: #fff;
          }
        }
      }
      .item:nth-child(2n) {
        background-color: rgb(247, 248, 255);
      }
      .more {
        display: block;
        text-align: center;
        font-size: 20px;
        line-height: 100px;
      }
      .t {
        color: rgb(43, 107, 247);
        font-size: 20px;
        line-height: 30px;
      }
      .subT {
        font-size: 10px;
        color: rgb(92, 13, 238);
        margin-right: 10px;
      }
    }
    .bottom {
    }
  }
}
.wl-total {
  margin-left: 15px;
}
.orderList /deep/ .el-pagination {
  margin-left: 10px;
  margin-top: 30px;
  display: inline-block;
  .btn-next,
  .btn-prev {
    background: none;
  }
}
.orderList /deep/ .el-pager li {
  background: none;
}
</style>
