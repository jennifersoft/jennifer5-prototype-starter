import Vue from 'vue';
import { ariesuser } from '@common/base';
import CommonHeader from '@layout/container/header/CommonHeader';
import App from './App';
import store from './vuex';
import i18n from './i18n';
import '@layout/base';
import './index.scss';

new Vue({
    el: '#vue_app',
    store,
    components: {
        CommonHeader,
        App,
    },
    computed: {
        fetching() {
            return this.$store.getters['service/fetching'];
        },
    },
    provide: {
        theme: ariesuser.theme,
        i18n,
    },
});
