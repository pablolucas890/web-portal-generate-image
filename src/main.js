import { createApp } from 'vue'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import App from './App.vue'
import './assets/main.css'

confirm("mensagem");
createApp(App).mount('#app')
