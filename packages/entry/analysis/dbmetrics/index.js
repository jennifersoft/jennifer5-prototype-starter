import { ariesuser } from '@common/base';
import '@entry/analysis/dbmetrics/styles/index.scss';
import '@layout/base';
import Vue from 'vue';
import App from '@entry/analysis/dbmetrics/App';
import CommonHeader from '@layout/container/header/CommonHeader';
import i18n from '@entry/analysis/dbmetrics/i18n';
import store from '@entry/analysis/dbmetrics/store.js';

new Vue({
    el: '#vue-mount',
    provide: {
        theme: ariesuser.theme,
        i18n,
    },
    store,
    components: {
        App,
        CommonHeader,
    },
    data() {
        return {
            pageType: 'metrics',
        };
    },
    computed: {
        manualKey() {
            const prefix = 'analysis';
            if (this.pageType === 'metrics')
                return `${prefix}_db${this.pageType}2`;
            return `${prefix}_db${this.pageType.toLowerCase()}`;
        },
    },
    methods: {
        onChangePageType(type) {
            this.pageType = type;
        },
    },
    created() {
        this.descriptions = {
            metrics: i18n.dbmetricsDesc,
            event: i18n.dbeventDesc,
            error: i18n.dberrorDesc,
            service: i18n.dbserviceDesc,
            connPool: i18n.dbconnpoolDesc,
            disk: i18n.dbdiskDesc,
        };
    },
});
