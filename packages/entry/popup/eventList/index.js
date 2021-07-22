import Vue from 'vue';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import App from '@entry/popup/eventList/App';
import store from '@entry/popup/eventList/store';
import './index.scss';
import '../base.scss';

new Vue({
    el: '#vue-mount',
    store,
    provide: {
        theme: ariesuser.theme,
        i18n: {
            recoveryAll: i18n.get('ui.label.recoveryAll'),
            searchCount: i18n.get('ui.label.searchCount'),
            showOnlyUnrecovered: i18n.get('ui.label.showOnlyUnrecovered'),
            eventLevel: i18n.get('ui.label.eventLevel'),
            time: i18n.get('ui.label.time'),
            target: i18n.get('ui.label.target'),
            eventType: i18n.get('ui.label.eventType'),
            message: i18n.get('ui.label.message'),
            value: i18n.get('ui.label.value'),
            transaction: i18n.get('ui.label.transaction'),
        },
    },
    components: {
        App,
    },
});
