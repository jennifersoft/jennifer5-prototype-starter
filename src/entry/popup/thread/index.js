import Vue from 'vue';
import App from './App';
import store from './vuex';
import { i18n } from '@common/utility';
import '@entry/popup/base.scss';

new Vue({
    store,
    el: '#vue-mount',
    provide: {
        i18n: {
            thread: i18n.get('ui.title.thread'),
            lockName: i18n.get('ui.label.lockName'),
            blockedTime: i18n.get('ui.label.blockedTime'),
            blockedCount: i18n.get('ui.label.blockedCount'),
            threadUserTime: i18n.get('ui.label.threadUserTime'),
            lockOwnerId: i18n.get('ui.label.lockOwnerId'),
            waitedCount: i18n.get('ui.label.waitedCount'),
            waitedTime: i18n.get('ui.label.waitedTime'),
            refresh: i18n.get('ui.label.refresh'),
        },
    },
    components: {
        App,
    },
});
