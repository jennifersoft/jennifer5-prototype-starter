import { i18n } from '@common/utility';
import Vue from 'vue';
import App from '@entry/analysis/jarcheck/App';
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
            treeSearch: i18n.get('ui.label.treeSearch'),
            keywordSearch: i18n.get('ui.label.keywordSearch'),
            reset: i18n.get('ui.button.reset'),
            class: i18n.get('ui.label.class'),
            filePath: i18n.get('ui.label.filePath'),
            className: i18n.get('ui.label.className'),
            select: i18n.get('ui.label.select'),
            close: i18n.get('ui.label.close'),
            selectClass: i18n.get('ui.label.selectClass'),
            M0635: i18n.get('M0635'),
            M0021: i18n.get('M0021'),
        },
    },
    store,
});
