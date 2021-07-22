import Vue from 'vue';
import { i18n } from '@common/utility';
import store from './vuex';
import App from './App';
import './index.scss';
import '../base.scss';

new Vue({
    store,
    el: '#vue-mount',
    components: {
        App,
    },
    provide: {
        i18n: {
            M0630: i18n.get('M0630'),
            export: i18n.get('ui.button.export'),
            searchCount: i18n.get('ui.label.searchCount'),
            time: i18n.get('ui.label.time'),
            domain: i18n.get('ui.label.domain'),
            target: i18n.get('ui.label.target'),
            errorType: i18n.get('ui.label.errorType'),
            message: i18n.get('ui.label.message'),
            value: i18n.get('ui.label.value'),
            transaction: i18n.get('ui.label.transaction'),
            cases: i18n.get('ui.label.unit.cases'),
            M0647: i18n.get('M0647'),
        },
        theme: ariesuser.theme,
    },
});
