import { i18n } from '@common/utility';
import Vue from 'vue';
import App from '@entry/analysis/thread/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import { ariesuser } from '@common/base';
import store from './vuex';
import '@layout/base';

new Vue({
    el: '#vue-mount',
    provide: {
        theme: ariesuser.theme,
        i18n: {
            bookmark: i18n.get('ui.label.bookmark'),
            deltaInit: i18n.get('ui.label.deltaInit'),
            autoRefresh: i18n.get('ui.label.autoRefresh'),
            second: i18n.get('ui.label.unit.sec'),
            id: i18n.get('ui.label.id'),
            thread: i18n.get('ui.label.thread'),
            cpuTime: i18n.get('ui.label.cpuTime'),
            ms: i18n.get('ui.label.unit.ms'),
            deltaCpuTime: i18n.get('ui.label.deltaCpuTime'),
            state: i18n.get('ui.label.state'),
            started: i18n.get('ui.label.started'),
            deadLock: i18n.get('ui.label.deadLock'),
            currentThreadCount: i18n.get('ui.label.currentThreadCount'),
            lockName: i18n.get('ui.label.lockName'),
            blockedTime: i18n.get('ui.label.blockedTime'),
            blockedCount: i18n.get('ui.label.blockedCount'),
            threadUserTime: i18n.get('ui.label.threadUserTime'),
            lockOwnerId: i18n.get('ui.label.lockOwnerId'),
            waitedCount: i18n.get('ui.label.waitedCount'),
            waitedTime: i18n.get('ui.label.waitedTime'),
            refresh: i18n.get('ui.label.refresh'),
            threadName: i18n.get('ui.label.thread.name'),
            popupView: i18n.get('ui.button.popupView'),
        },
    },
    components: {
        App,
        CommonHeader,
    },
    store,
});
