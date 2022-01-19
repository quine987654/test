<template>
  <div class="footer myTitle">
    <div class="w">
      <div class="fl">
        <!-- <p>Terms of Use</p>
        <span>© 2021 - 2100 .保留所有權利。</span> -->
      </div>
      <div class="fr">
        <ul>
          <!-- <li>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-twitter-circle-fill"></use>
            </svg>
          </li>
          <li>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-dianbao"></use>
            </svg>
          </li>
          <li>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-facebook"></use>
            </svg>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
.myTitle {
  background: var(--theme_bg_color);
}
.footer {
  // height: 95px;
  height: 0px;
  width: 100%;
  // position: fixed;
  // bottom: 0;
  background-color: #fff;
  display: none;
  .w {
    margin: 0 auto;
    width: 1200px;
    // line-height: 95px;
  }
  .fl {
    padding-top: 20px;
    line-height: 20px;
    span {
      font-size: 8px;
      line-height: 30px;
    }
  }
  .fr {
    margin-top: 26px;
    li {
      float: left;
      margin-left: 20px;
    }
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background-color: pink;
    }
    svg {
      width: 46px;
      height: 46px;
    }
  }
}
</style>
