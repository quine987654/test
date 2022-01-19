<template>
  <div class="networkPop">
    <div class="networkItem">
      <div class="img">
        <img
          v-if="tp == 'act1' && store.actionNetworkOne.network_icon"
          :src="store.imgPath + store.actionNetworkOne.network_icon"
          alt=""
        />
        <img
          v-if="tp == 'act2' && store.actionNetworkTwo.network_icon"
          :src="store.imgPath + store.actionNetworkTwo.network_icon"
          alt=""
        />
      </div>
      <div class="textBox">
        <span v-if="tp == 'act1'">{{
          store.actionNetworkOne.network_name
        }}</span>
        <span v-if="tp == 'act2'">{{
          store.actionNetworkTwo.network_name
        }}</span>
      </div>
      <a href="javascript:;" @click.stop="">
        <div class="downMinu" tabindex="-1" @blur="miniListIfshow = false">
          <div class="downIcon" @click="miniListIfshow = !miniListIfshow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiala"></use>
            </svg>
          </div>
          <transition name="network">
            <ul class="list" v-if="miniListIfshow">
              <li
                v-for="item in store.networkList"
                :key="item.id"
                :class="{
                  act: tp == 'act1' && item.id == store.actionNetworkTwo.id,
                }"
                @click="itemClick(item)"
              >
                {{ item.network_name }}
                <svg
                  class="icon"
                  v-if="tp == 'act1' && item.id == store.actionNetworkOne.id"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-tick"></use>
                </svg>
                <svg
                  class="icon"
                  v-if="tp == 'act2' && item.id == store.actionNetworkTwo.id"
                  aria-hidden="true"
                >
                  <use xlink:href="#icon-tick"></use>
                </svg>
              </li>
            </ul>
          </transition>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Store from "../store.js";
export default {
  props: {
    tp: {
      type: String,
      default: "act1",
    },
  },
  data() {
    return {
      store: Store.state,
      // 下拉菜单
      miniListIfshow: false,
    };
  },
  methods: {
    // 选择某一项
    itemClick(val) {
      if (this.tp == "act1") {
        if (
          val.id == this.store.actionNetworkTwo.id ||
          val.id == this.store.actionNetworkOne.id
        ) {
          return;
        } else {
          Store.setActionNetworkOne(val);
        }
      } else {
        if (
          val.id == this.store.actionNetworkOne.id ||
          val.id == this.store.actionNetworkTwo.id
        ) {
          return;
        } else {
          Store.setActionNetworkTwo(val);
        }
      }
      this.miniListIfshow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.networkPop {
  width: 200px;
  height: 110px;
  border-radius: 10px;
  .networkItem {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 0.5px solid #e0e0e0;
    // box-shadow: 3px 3px 10px #94a0ec48;
    // background-image: linear-gradient( to left top ,#4760FF,#0DCCFF);
    border-radius: 10px;
    position: relative;
    .img {
      position: absolute;
      left: 5%;
      top: 5%;
      width: 40px;
      height: 40px;
      border: 0.5px solid #aaa;
      border-radius: 50%;
      padding: 3px;
      box-sizing: border-box;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        // height: 40px;
      }
    }
    .textBox {
      position: absolute;
      left: 8%;
      bottom: 12%;
      width: 90%;
      font-size: 1.3em;
    }
    .downMinu {
      position: absolute;
      right: 5%;
      bottom: 5%;
      width: 30px;
      height: 30px;
      // color: #fff;
      .downIcon {
        width: 30px;
        height: 30px;
        // background-color: #f1f1f1;
        line-height: 30px;
        font-size: 20px;
        text-align: center;
        border-radius: 5px;
      }
      // 待改
      .downIcon::before {
        // background-color: blue;
      }

      .list {
        position: absolute;
        right: 5%;
        top: 95%;
        box-shadow: 0 0 5px rgba(85, 85, 85, 0.26);
        background-color: #fff;
        border-radius: 5px;
        overflow: auto;
        box-sizing: border-box;
        overflow: hidden;
        li {
          line-height: 20px;
          padding: 10px 16px;
          box-sizing: border-box;
          min-width: 150px;
          max-width: 500px;
          border-top: 0.5px solid #7484ec56;
          margin-top: -1px;
          transition: 0.3s;
        }
        li:hover {
          background-color: rgba(117, 188, 235, 0.068);
        }
        // .act {
        //   color: #fff;

        //   background-color: #4760ff;
        // }
        svg {
          float: right;
          display: inline-block;
        }
      }
    }
  }
}
.network-enter-active {
  animation: bounce-in 0.4s;
}
.network-leave-active {
  animation: bounce-in 0.4s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(1.3, 1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
