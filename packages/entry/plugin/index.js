import Vue from 'vue';
import CommonHeader from '@layout/container/header/CommonHeader';
import DomainStore from '@vuejs/vuex/store';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import '@layout/base';

new Vue({
    el: '.plugin-header',
    store: DomainStore,
    components: {
        CommonHeader,
    },
    provide: {
        theme: ariesuser.theme,
        i18n: {
            domainGroup: i18n.get('ui.label.domainGroup'),
            help: i18n.get('ui.label.help'),
        },
    },
});
