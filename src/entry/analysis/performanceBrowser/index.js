import Vue from 'vue';
import { ariesuser } from '@common/base';
import i18n from '@entry/analysis/performanceBrowser/i18n';
import App from './App';
import '@layout/base';
import store from './store';
import './print.scss';

const app = new Vue({
    el: '#vue_app',
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: i18n,
    },
    components: {
        App,
    },
});
