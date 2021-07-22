import Vue from 'vue';
import { ariesuser } from '@common/base';
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
        i18n,
    },
    filters: {
        stringToNumber(val) {
            if (val === '') return -1;
            return parseInt(val);
        },
    },
});
