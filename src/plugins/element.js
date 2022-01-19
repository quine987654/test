import Vue from 'vue'
import {Loading, Button ,Card ,Select,Option,Message, Input, Pagination } from 'element-ui'

Vue.use(Button)
Vue.use(Card )
Vue.use(Select)
Vue.use(Option)
Vue.use(Input)
Vue.use(Pagination)
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;

Vue.prototype.$message = Message;