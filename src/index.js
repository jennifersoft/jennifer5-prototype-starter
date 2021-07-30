import Vue from 'vue';
import SideBar from './components/SideBar';
import router from './router';
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
