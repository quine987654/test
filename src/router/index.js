import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)
let store = Store.state

const routes = [
  {
    path: '/',
    name: 'assetBridge',
    component: () => import( '../views/BridgeItem.vue')
  },
  {
    path: '/bridge',
    name: 'bridge',
    component: () => import( '../views/BridgeItem.vue')
  },
  // {
  //   path: '/admin/tp',
  //   name: 'bridge',
  //   component: () => import( '../views/adminTP.vue')
  // },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import( '../views/orderList.vue')
  },
  {
    path: '/airdrop',
    name: 'bridge',
    component: () => import( '../views/airdrop.vue')
  },
]

const router = new VueRouter({
  routes
  
})
router.beforeEach((to, from, next) => {
  // 如果用户未能验证身份，则 `next` 会被调用两次
  if (to.name == 'orderList' && !store.walletAddress) {
    window.myVue.$message.warning('Link wallets')
    next({ path: '/bridge' })
  } else{
    next()
  }
})

export default router
