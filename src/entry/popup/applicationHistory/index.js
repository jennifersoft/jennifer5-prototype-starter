import Vue from 'vue';
import store from './vuex';
import App from './App';
import { i18n } from '@common/utility';
import { ariesuser } from '@common/base';
import '../base.scss';

new Vue({
    el: '#vue-mount',
    store,
    components: {
        App,
    },
    provide: {
        theme: ariesuser.theme,
        i18n: {
            applicationHistory: i18n.get('ui.title.applicationHistory'),
            deployList: i18n.get('ui.label.deployList'),
            detail: i18n.get('ui.label.detail'),
            resourceName: i18n.get('ui.label.resourceName'),
            M0471: i18n.get('M0471'),
            lastModifiedTime: i18n.get('ui.label.lastModifiedTime'),
            resourceType: i18n.get('ui.label.resourceType'),
            resourceStatus: i18n.get('ui.label.resourceStatus'),
            compareCode: i18n.get('ui.label.compareCode'),
        },
    },
});
