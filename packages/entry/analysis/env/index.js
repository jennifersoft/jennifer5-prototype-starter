import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';
import axios from '@library/axios';
import { ariesuser } from '@common/base';
import { i18n } from '@common/utility';
import DomainStore from '@vuejs/vuex/store';
import CommonHeader from '@layout/container/header/CommonHeader';
import BasicTable from '@entry/analysis/env/basicTable';
import TopBar from '@vuejs/container/topbar/TopBar';
import { DomainBarBatchjobModeDef } from '@common/definition';
import '@layout/base';
import './index.scss';

const { mapGetters } = createNamespacedHelpers('domain');

new Vue({
    el: '#vue-app',
    name: 'EnvWrapper',
    store: DomainStore,
    components: {
        CommonHeader,
        BasicTable,
        TopBar,
    },
    provide: {
        theme: ariesuser.theme,
        i18n: {
            domainGroup: i18n.get('ui.label.domainGroup'),
            help: i18n.get('ui.label.help'),
            delete: i18n.get('ui.button.delete'),
            M0004: i18n.get('M0004'),
        },
    },
    data() {
        return {
            domainId: 1004,
            tableData: [],
            tableHeader: [
                {
                    key: 'key',
                    name: i18n.get('ui.label.key'),
                    sort: true,
                    fullContents: false,
                },
                {
                    key: 'value',
                    name: i18n.get('ui.label.value'),
                    sort: true,
                    fullContents: true,
                },
            ],
            DomainBarBatchjobModeDef: DomainBarBatchjobModeDef,
        };
    },
    computed: {
        ...mapGetters({
            domains: 'sidList',
        }),
    },
    watch: {
        domains(newVal, oldVal) {
            // 도메인 박스/트리 변경시 발생함.
            console.log(newVal, oldVal);
        },
    },
    methods: {
        async onDomainBarClick({ domainId, instanceOid }) {
            const ret = await axios.get('/analysis/env', {
                params: {
                    format: 'json',
                    sid: domainId,
                    agent: instanceOid,
                },
            });

            this.tableData = ret.data;
        },
        sortCompare(a, b, key) {
            if (key === 'key') return a.key.localeCompare(b.key);
            else if (key === 'value') return a.value.localeCompare(b.value);
        },
    },
});
