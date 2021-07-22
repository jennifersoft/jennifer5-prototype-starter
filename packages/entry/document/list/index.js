import Vue from 'vue';
import { ariesuser } from '@common/base';
import ReportHeader from '@layout/container/header/ReportHeader';
import App from './App';
import store from './vuex';
import i18n from './i18n';
import '@layout/base';
import './index.scss';

window.vm = new Vue({
    store,
    el: '#app',
    provide: {
        isAdmin: ariesuser.groupId === 'admin',
        theme: ariesuser.theme,
        language: ariesuser.language,
        i18n: i18n,
    },
    components: {
        ReportHeader,
        App,
    },
});
