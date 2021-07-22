import Vue from 'vue';
import { ariesuser } from '@common/base';
import App from './App';
import store from '@entry/analysis/loadedClasses/vuex';
import i18n from '@entry/analysis/loadedClasses/i18n';
import './index.scss';

new Vue({
    el: '#vue_app',
    store,
    components: {
        App,
    },
    provide: {
        theme: ariesuser.theme,
        i18n,
    },
});
