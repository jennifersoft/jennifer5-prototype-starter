import Vue from 'vue';
import App from '@entry/analysis/socket/App';
import CommonHeader from '@layout/container/header/CommonHeader';

import { ariesuser, getDayjs, serverDateFormat } from '@common/base';
import { i18n } from '@common/utility';
import store from '@vuejs/vuex/store';
import state from '@entry/analysis/socket/store/state';
import mutations from '@entry/analysis/socket/store/mutations';
import actions from '@entry/analysis/socket/store/actions';
import { mapState, NAMESPACE } from '@entry/analysis/socket/store';

import '@layout/base';
import './index.scss';

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    actions,
    mutations,
});

new Vue({
    el: '#vue-mount',
    store,
    components: {
        CommonHeader,
        App,
    },
    provide: {
        theme: ariesuser.theme,
        i18n: {
            bookmark: i18n.get('ui.label.bookmark'),
            help: i18n.get('ui.label.help'),
            localPort: i18n.get('ui.label.localPort'),
            remoteIpAddress: i18n.get('ui.label.remoteIpAddress'),
            remotePort: i18n.get('ui.label.remotePort'),
            autoRefresh: i18n.get('ui.label.autoRefresh'),
            second: i18n.get('ui.label.unit.sec'),
            num: i18n.get('ui.label.num'),
            ip: i18n.get('ui.label.ip'),
            streamAndSocketCount: i18n.get('ui.label.streamAndSocketCount'),
            stacktraceRemove: i18n.get('ui.label.stacktraceRemove'),
            gc: i18n.get('ui.button.gc'),
            stackReceive: i18n.get('ui.label.stackReceive'),
            openTime: i18n.get('ui.label.socked.opentime'),
            mode: i18n.get('ui.label.mode'),
            size: i18n.get('ui.label.size'),
            bytes: i18n.get('ui.label.bytes'),
            stacktrace: i18n.get('ui.label.stacktrace'),
            receiveAgain: i18n.get('ui.label.receiveAgain'),
            popupView: i18n.get('ui.button.popupView'),
        },
    },
    computed: {
        ...mapState({
            domain: state => state.domain,
            selectedRow: state => state.selectedRow,
        }),
    },
    methods: {
        openStacktrace() {
            window
                .open(
                    '',
                    'socketDetail',
                    'width=1024,height=768,history=no,resizable=no,status=no,scrollbars=no,menubar=no'
                )
                .focus();

            const form = this.$refs.frm;
            const { sid, oid } = this.domain;
            const { key, localport, host, port, time } = this.selectedRow;
            form.key.value = key;
            form.localport.value = localport;
            form.host.value = host;
            form.port.value = port;
            form.time.value = getDayjs(time).format(serverDateFormat.long);
            form.method = 'post';
            form.action = `/popup/socket?sid=${sid}&agent=${oid}`;
            form.target = 'socketDetail';
            form.submit();
        },
    },
});
