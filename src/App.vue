<template>
  <div id="app">
    <wl-header />
    <router-view />
    <!-- <wl-footer /> -->
  </div>
</template>
<script>
// import WlFooter from "./components/wl-footer.vue";
import WlHeader from "./components/wl-header.vue";
import Store from "./store";

export default {
  components: {
    WlHeader,
    // WlFooter,
  },
  data() {
    return {
      store: Store.state,
    };
  },
  mounted() {
    window.myVue = this;
  },
};
</script>
<style lang="less">
@import url("./assets/global.less");

#app {
  background-color: @oneBgColor;
  padding-bottom: 1px;
  background-color: #fff;

  background-image: radial-gradient(
    50% 50% at 50% 50%,
    #2d1ff03d 0,
    rgba(255, 255, 255, 0) 90%
  );
  background-position: center -125vh;
  background-size: 200% 200vh;
  background-repeat: no-repeat;

  @font-face {
    font-family: "ubuntu";
    src: url("./assets/fonts/Ubuntu-L_W.woff2") format("woff2");
  }
  font-family: ubuntu;
}

.wl-but {
  padding: 5px 0;
  text-align: center;
  background-color: #4760ff;
  margin: 20px 0;
  line-height: 30px;
  font-size: 18px;
  border-radius: 5px;
}
.hui {
  background-color: #ccc !important;
  color: #000 !important;
}
</style>
