import '@/app/styles/index.scss';
import { createApp } from 'vue';
import App from '@/App.vue';
import { router } from '@/app/providers/router';

createApp(App).use(router).mount('#app');
