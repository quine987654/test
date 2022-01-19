import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import Tips from './components/tips/tips';
import './assets/global.less'
import Web3 from 'web3'
import './plugins/element.js'
// import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5'

Vue.prototype.$md5 = md5


Vue.prototype.$web3 = Web3


Vue.use(VueI18n)
Vue.use(Tips)

// 导入挂载axios
Vue.prototype.$http = axios
// 配置请求根路径
// axios.defaults.baseURL = 'http://10.192.1.104:5522'
// axios.defaults.baseURL = 'http://43.155.81.246:9090/api/v2'
axios.defaults.baseURL = 'https://bridge.polysmartchain.com/app/api/v2'



// 创建i18n实例
const i18n = new VueI18n({
  // 这是设置语言包，默认语言，
  locale: 'en',
  messages: {
    //这是对应语言的语言文件所在，
    'en': require('/public/language/en.json'),
    'zh-hk': require('/public/language/zh-hk.json')
  }
})
Vue.mixin({
  mounted () {
    if (typeof window.ethereum !== "undefined") {
      this.web3 = new this.$web3(
        this.$web3.givenProvider || "ws://some.local-or-remote.node:8546"
      );
    }
  },
  data () {
    return {
      web3: ''
    }
  },
  methods: {
    // 獲取中英文提示
    getTips(val){
      // 當前為中文還是英文
      let lang  = this.$i18n.locale
      // 返回提示文字 
      let ts = this.$i18n.messages[lang].tips[val]
      // 如果有提示則返回，沒有則返回提示名
      if(ts){
        return ts
      }else{
        return(val)
      }
    }
  },
})

Vue.config.productionTip = false
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
