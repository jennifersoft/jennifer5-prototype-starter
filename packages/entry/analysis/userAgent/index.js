import { i18n } from '@common/utility';
import { ariesuser } from '@common/base';
import _ from '@library/lodash';
import './index.scss';

import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import CommonHeader from '@layout/container/header/CommonHeader';
import App from '@entry/analysis/userAgent/App';

import store from '@vuejs/vuex/store';
import { state } from '@entry/analysis/userAgent/store/state';
import { getters } from '@entry/analysis/userAgent/store/getters';
import { actions } from '@entry/analysis/userAgent/store/actions';
import { mutations } from '@entry/analysis/userAgent/store/mutations';
import { mapState, mapMutations, mapActions, NAMESPACE } from './store';

import '@layout/base';

const domainHelper = createNamespacedHelpers('domain');

store.registerModule(NAMESPACE, {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
});

const DEBOUNCE_INTERVAL = 300;

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
            resourceSelect: i18n.get('ui.button.targetConfig'),
            cancel: i18n.get('ui.button.cancel'),
            submit: i18n.get('ui.button.done'),
            versionedData: i18n.get('ui.label.versionedData'),
            hit: i18n.get('ui.label.hit'),
            detailFiltering: i18n.get('ui.label.detailFiltering'),
            export: i18n.get('ui.button.export'),
            apply: i18n.get('ui.button.apply'),
            browser: i18n.get('ui.label.browser'),
            os: i18n.get('ui.label.os'),
            device: i18n.get('ui.label.device'),
            search: i18n.get('ui.label.search'),
            searchTerm: i18n.get('ui.label.template.searchTerm'),
            responseTime: i18n.get('ui.label.responseTime'),
            ms: i18n.get('ui.label.unit.ms'),
            dayLabels: [
                i18n.get('ui.label.time.sunday.short'),
                i18n.get('ui.label.time.monday.short'),
                i18n.get('ui.label.time.tuesday.short'),
                i18n.get('ui.label.time.wednesday.short'),
                i18n.get('ui.label.time.thursday.short'),
                i18n.get('ui.label.time.friday.short'),
                i18n.get('ui.label.time.saturday.short'),
            ],
            helpMessages: {
                EMPTY: i18n.get('M0390'),
                UNKNOWN: i18n.get('M0391'),
                BOT: i18n.get('M0392'),
                OTHER: i18n.get('M0393'),
            },
            M0187: i18n.get('M0187'),
            M0266: i18n.get('M0266'),
            M0629: i18n.get('M0629'),
            M0410: i18n.get('M0410'),
            targetConfig: i18n.get('ui.button.targetConfig'),
        },
    },
    computed: {
        ...mapState({
            tabData: state => state.tabData,
            domains: state => state.domains,
            progress: state => state.progress,
        }),
        ...domainHelper.mapGetters({
            domainsInDomainBox: 'sidList',
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, this.DEBOUNCE_INTERVAL);
        },
    },
    data() {
        return {
            contentHeight: window.innerHeight - 215,
        };
    },
    watch: {
        domains: {
            handler() {
                this.fetchResource();
            },
            deep: true,
        },
        domainsInDomainBox(newVal) {
            if (newVal.length !== 1) return;

            this.updateDomains({
                sidList: newVal,
                sid: newVal[0],
            });
        },
    },
    methods: {
        ...mapMutations(['updateDomains', 'setTabData', 'setDetailFilterData']),
        ...mapActions(['fetchResource']),
        onResize() {
            this.contentHeight = window.innerHeight - 280;
        },
    },
    created() {
        this.DEBOUNCE_INTERVAL = DEBOUNCE_INTERVAL;

        if (this.domainsInDomainBox.length === 1) {
            this.updateDomains({
                sidList: this.domainsInDomainBox,
                sid: this.domainsInDomainBox[0],
            });
        }
    },
    beforeMount() {
        this.setTabData(
            this.tabData.map(t => ({
                key: t.key,
                value: i18n.get(`ui.label.${t.key}`),
            }))
        );
        this.setDetailFilterData();
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
});
