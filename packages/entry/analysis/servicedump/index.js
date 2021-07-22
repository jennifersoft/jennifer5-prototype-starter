import Vue from 'vue';
import { ariesuser, server } from '@common/base';
import CommonHeader from '@layout/container/header/CommonHeader';
import App from './App';
import store from './vuex';
import i18n from './i18n';
import '@layout/base';

new Vue({
    el: '#vue_app',
    store,
    components: {
        CommonHeader,
        App,
    },
    provide: {
        theme: ariesuser.theme,
        platform: server.platform,
        i18n,
    },
    filters: {
        stringToNumber(val) {
            if (val === '') return -1;
            return parseInt(val);
        },
    },
});
