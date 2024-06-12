import './assets/main.css'
import './input.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import VueSplide from '@splidejs/vue-splide';
import AOS from 'aos';
import 'aos/dist/aos.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueLazyload)
app.use(VueSplide);

app.mount('#app')
AOS.init();
