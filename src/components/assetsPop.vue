<template>
  <transition name="assets">
    <div class="zi-chan" v-if="ifShow">
      <div class="zichan-box">
        <div class="inputBox">
          <input
            type="text"
            v-model="inp"
            :placeholder="$t('assetsPop.search')"
          />
          <a href="javascript:;">
            <div class="down" @click="down()">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-guanbi"></use>
              </svg>
            </div>
          </a>
        </div>
        <ul>
          <a href="javascript:;">
            <li
              v-for="(item, index) in store.assetsList"
              :key="index"
              @click="act(item)"
              v-show="show(item.name, inp)"
            >
              <img v-if="item.icon" :src="store.imgPath + item.icon" alt="" />
              <div>
                <span class="text1">{{ item.name }}</span>
                <br />
                <span class="text2">{{ item.msg }}</span>
              </div>
            </li>
          </a>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
import Store from "../store.js";
export default {
  props: {
    ifShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      store: Store.state,
      inp: "",
    };
  },
  methods: {
    // 关闭弹窗
    down() {
      this.$emit("down");
    },
    // 选择某一数据
    act(msg) {
      if (msg == this.store.actionAssets) {
        this.down();
        return;
      } else {
        Store.setActionAssets(msg);
        this.down();
      }
    },
    // 判断是否显示
    show(name, inp) {
      if (name.indexOf(inp) >= 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.zi-chan {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(22, 22, 22, 0.253);
  .zichan-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    background-color: #fff;
    border-radius: 15px;
    .inputBox {
      border: 0.5px solid #f1f1f1;
      height: 40px;
      margin: 10px;
      margin-top: 20px;
      margin-left: 15px;
      padding-left: 10px;
      border-radius: 5px 0 0 5px;
    }
    input {
      height: 40px;
      // margin: 10px;
      // margin-top: 20px;
      // margin-left: 15px;
      width: calc(100% - 70px);
      box-sizing: border-box;
      // padding-left: 10px;
      // border-radius: 5px 0 0 5px;
      border: none;
    }
    .down {
      position: absolute;
      width: 40px;
      height: 40px;
      // background-color: #ccc;
      text-align: center;
      line-height: 40px;
      color: #4760ff;
      font-size: 20px;
      right: 10px;
      top: 20px;
      border-radius: 0 05px 5px 0;
    }
    ul {
      max-height: 400px;
      width: 95%;
      margin: 10px auto 10px;
      background-color: #fff;
      overflow: auto;
      // border-radius: 15px;
    }
    ul li:nth-last-child(1) {
      border: none;
    }
    li {
      height: 65px;
      padding: 16px 12px;
      box-sizing: border-box;
      border-bottom: 0.5px solid #ccc;
      position: relative;
      transition: 0.5s;
      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        //
        position: absolute;
        // background-color: pink;
        border-radius: 50%;
        float: left;
        margin-right: 20px;
      }
      .text1 {
        position: absolute;
        left: 70px;
        top: 16px;
        line-height: 40px;
        font-size: 13px;
      }
      .text2 {
        position: absolute;
        left: 52px;
        bottom: 16px;
        font-size: 10px;
        color: #555;
        margin-top: -3px;
      }
    }
    li:hover {
      background-color: rgba(243, 220, 224, 0.295);
    }
  }
}
.assets-enter-active {
  animation: bounce-in 0.5s;
}
.assets-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
