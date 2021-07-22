import { checkPermission, i18n } from '@common/utility';
import { PermissionDef } from '@common/definition';

import Vue from 'vue';
import App from '@entry/analysis/collection/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import { ariesuser } from '@common/base';

import store, { mapActions } from '@entry/analysis/collection/vuex';
import '@layout/base';

new Vue({
    el: '#vue-mount',
    components: {
        App,
        CommonHeader,
    },
    provide: {
        theme: ariesuser.theme,
        i18n: {
            bookmark: i18n.get('ui.label.bookmark'),
            deltaInit: i18n.get('ui.label.deltaInit'),
            autoRefresh: i18n.get('ui.label.autoRefresh'),
            second: i18n.get('ui.label.unit.sec'),
            num: i18n.get('ui.label.num'),
            creationTime: i18n.get('ui.label.creationTime'),
            collection: i18n.get('ui.label.collection'),
            count: i18n.get('ui.label.count'),
            delta: i18n.get('ui.label.delta'),
            collectionName: i18n.get('ui.label.collectionName'),
            hash: i18n.get('ui.label.hash'),
            serviceName: i18n.get('ui.label.serviceName'),
            stacktrace: i18n.get('ui.label.stacktrace'),
            stacktraceRemove: i18n.get('ui.label.stacktraceRemove'),
            stackReceive: i18n.get('ui.label.stackReceive'),
            gc: i18n.get('ui.button.gc'),
            collectionCount: i18n.get('ui.label.collectionCount'),
            collectionSize: i18n.get('ui.label.collectionSize'),
            edit: i18n.get('ui.label.edit'),
            minimumStacktrace: i18n.get('ui.label.collectionMinimunTrace'),
            autoStacktrace: i18n.get('ui.label.collectionAutoStackTrace'),
            receiveAgain: i18n.get('ui.label.receiveAgain'),
            cancel: i18n.get('ui.button.cancel'),
            apply: i18n.get('ui.label.apply'),
            collectionSetting: i18n.get('ui.label.collectionSetting'),
            popupView: i18n.get('ui.button.popupView'),
        },
    },
    store,
    methods: {
        ...mapActions(['loadCollectionData']),
    },
    created() {
        this.gcPermission = checkPermission(PermissionDef.GC);
    },
    mounted() {
        this.loadCollectionData(true);
    },
});
