import { i18n } from '@common/utility';

import Vue from 'vue';
import App from '@entry/analysis/searchclass/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import store from './vuex';

import { ariesuser } from '@common/base';
import '@layout/base';

new Vue({
    el: '#vue-mount',
    components: {
        App,
        CommonHeader,
    },
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: {
            bookmark: i18n.get('ui.label.bookmark'),
            searchAllClass: i18n.get('ui.label.searchAllClass'),
            searchUseedClass: i18n.get('ui.label.searchUseedClass'),
            searchUnusedClass: i18n.get('ui.label.searchUnusedClass'),
            maxDisplayCount: i18n.get('ui.label.maxDisplayCount'),
            searchDirOrJarFile: i18n.get('ui.label.searchDirOrJarFile'),
            jarFileName: i18n.get('ui.label.jarFileName'),
            path: i18n.get('ui.label.path'),
            className: i18n.get('ui.label.className'),
            jarFileModifiedTime: i18n.get('ui.label.jarFileModifiedTime'),
        },
    },
});
