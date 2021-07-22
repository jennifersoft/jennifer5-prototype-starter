import { i18n } from '@common/utility';
import Vue from 'vue';
import App from '@entry/analysis/methodStacktrace/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import store from './vuex';
import '@layout/base';

import { ariesuser } from '@common/base';

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
            autoRefresh: i18n.get('ui.label.autoRefresh'),
            second: i18n.get('ui.label.unit.sec'),
            num: i18n.get('ui.label.num'),
            time: i18n.get('ui.label.time'),
            method: i18n.get('ui.label.method'),
            class: i18n.get('ui.label.class'),
            classloader: i18n.get('ui.label.classloader'),
            stacktrace: i18n.get('ui.label.stacktrace'),
            stacktraceRemove: i18n.get('ui.label.stacktraceRemove'),
            addStackMethod: i18n.get('ui.label.addStackMethod'),
            addStackClass: i18n.get('ui.label.addStackClass'),
            deleteStackClass: i18n.get('ui.label.deleteStackClass'),
            select: i18n.get('ui.label.select'),
            close: i18n.get('ui.label.close'),
            receiveAgain: i18n.get('ui.label.receiveAgain'),
            M0312: i18n.get('M0312'),
            M0338: i18n.get('M0338'),
            M0635: i18n.get('M0635'),
            M0261: i18n.get('M0261'),
            selectMethod: i18n.get('ui.label.selectMethod'),
            selectClass: i18n.get('ui.label.selectClass'),
            selectPackageAndClass: i18n.get('ui.label.selectPackageAndClass'),
            bookmark: i18n.get('ui.label.bookmark'),
            popupView: i18n.get('ui.button.popupView'),
            treeSearch: i18n.get('ui.label.treeSearch'),
            keywordSearch: i18n.get('ui.label.keywordSearch'),
            className: i18n.get('ui.label.className'),
            M0059: i18n.get('M0059'),
        },
    },
});
