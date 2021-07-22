import { i18n } from '@common/utility';

import Vue from 'vue';
import App from '@entry/analysis/modifyfile/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import { ariesuser } from '@common/base';
import store from './vuex';
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
            maxDisplayCount: i18n.get('ui.label.maxDisplayCount'),
            searchPath: i18n.get('ui.label.searchPath'),
            no: i18n.get('ui.label.no'),
            fileName: i18n.get('ui.label.fileName'),
            path: i18n.get('ui.label.path'),
            modificationTime: i18n.get('ui.label.modificationTime'),
            size: i18n.get('ui.label.size'),
            bytes: i18n.get('ui.label.bytes'),
            M0021: i18n.get('M0021'),
            M0187: i18n.get('M0187'),
            exportCsv: i18n.get('ui.button.export.csv'),
        },
    },
    store,
});
