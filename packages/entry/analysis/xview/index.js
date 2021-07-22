import Vue from 'vue';
import { ariesuser } from '@common/base';
import i18n from '@entry/analysis/xview/i18n';
import App from './App';
import store from './store';
import '@layout/base';
import './contentWithoutPadding.scss';

new Vue({
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
