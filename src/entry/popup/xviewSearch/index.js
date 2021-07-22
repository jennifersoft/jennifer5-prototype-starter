import Vue from 'vue';
import { ariesuser } from '@common/base';
import i18n from '@entry/analysis/xview/i18n';
import App from './App';
import store from '@entry/analysis/xview/store';
import './index.scss';

const app = new Vue({
    el: '#vue_app',
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: i18n,
        resourceSelectText: i18n.resourceSelectText,
        cancelText: i18n.cancelText,
        submitText: i18n.submitText,
    },
    components: {
        App,
    },
});
