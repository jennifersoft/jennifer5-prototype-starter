import Vue from 'vue';
import router from './router';
import SideBar from './components/SideBar';

import './index.scss';

new Vue({
    el: '#vue-app',
    provide: {
        theme: 'classic',
    },
    components: {
        SideBar,
    },
    router,
});
