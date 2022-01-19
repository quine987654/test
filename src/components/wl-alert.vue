
<template>
  <div class="alert" v-if="ifshow">
    <div class="alertBox">
      <div class="title">{{$t('wlAlert.title')}}</div>
      <slot></slot>
      <div class="butBox">
        <div class="butItem">
          <div class="but" @click="down()">{{$t('wlAlert.close')}}</div>
        </div>
        <div class="butItem">
          <div class="but" @click="conturn()">{{$t('wlAlert.ok')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifshow: false
    };
  },
  methods: {
    // 确认
    conturn() {
        this.$emit("clickOk");
      this.down()
    },
    up() {
      this.ifshow = true;
    },
    down(){
        this.ifshow = false;

    }
  }
};
</script>

<style lang="less" scoped>
.alert {
  width: 100vw;
  height: 100vh;
  background-color: #6666;
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  text-align: center;
  .alertBox {
    width: 430px;
    min-height: 200px;
    background-color: #fff;
    position: absolute;
    z-index: 9;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    border-radius: 10px;
    .title {
      height: 50px;
      line-height: 50px;
      font-size: 25px;
    }
    slot {
      min-height: 200px;
    }
  }
  .butBox {
    position: absolute;
    width: 100%;
    bottom: 20px;
    display: flex;
    .butItem {
      flex: 1;
      .but {
        width: 80%;
        background-color: #4760ff;
        margin: 0 auto;
        line-height: 40px;
        border-radius: 5px;
        color: #fff;
      }
    }
  }
}
</style>