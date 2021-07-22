import Vue from 'vue';
import App from './App';
import store from './vuex';
import { i18n } from '@common/utility';

window.vm = new Vue({
    store,
    el: '#app',
    provide: {
        i18n: {
            socket: i18n.get('ui.title.socket'),
            localPort: i18n.get('ui.label.localPort'),
            remoteIpAddress: i18n.get('ui.label.remoteIpAddress'),
            remotePort: i18n.get('ui.label.remotePort'),
        },
    },
    components: {
        App,
    },
});
