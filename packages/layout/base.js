import Vue from 'vue';
import store from './vuex';
import App from './App';
import i18n from './i18n';
import './base.scss';

// 앞으로는 @common/base의 ariesuser와 server를 사용하지 않는다.
// 다만 날짜 관련 getServerTime 같은 함수는 사용해도 된다.
const { theme } = store.state.server;

new Vue({
    el: '.layout-toolbar',
    store,
    provide: {
        theme,
        i18n,
    },
    components: {
        App,
    },
});
