import { i18n } from '@common/utility';
import Vue from 'vue';
import store from './vuex';
import './index.scss';
import App from '@entry/popup/agentHelp/App.vue';

new Vue({
    el: '#vue-mount',
    provide: {
        theme: ariesuser.theme,
        i18n,
    },
    store,
    components: {
        App,
    },
});
