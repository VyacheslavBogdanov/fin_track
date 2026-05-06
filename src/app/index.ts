import '@/app/styles/index.scss';
import { createApp } from 'vue';
import App from '@/App.vue';
import { pinia } from '@/app/providers/pinia';
import { router } from '@/app/providers/router';

createApp(App).use(pinia).use(router).mount('#app');
