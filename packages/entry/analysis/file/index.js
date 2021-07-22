import _ from '@library/lodash';
import Vue from 'vue';
import axios from '@library/axios';
import { getJavaMajorVersion, i18n } from '@common/utility';
import { ariesuser, getDayjs, serverDateFormat } from '@common/base';
import {
    AgentFeatureCodeDef,
    AgentFeatureMessageDef,
} from '@common/definition';
import DomainStore from '@vuejs/vuex/store';
import CommonHeader from '@layout/container/header/CommonHeader';
import TopBar from '@vuejs/container/topbar/TopBar';
import Tab from '@vuejs/component/tab/Tab';
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';
import DetailTable from './component/DetailTable';
import '@layout/base';
import './index.scss';

new Vue({
    el: '#vue-app',
    store: DomainStore,
    components: {
        CommonHeader,
        TopBar,
        Tab,
        LoadingIndicator,
        DetailTable,
    },
    provide: {
        i18n: {
            bookmark: i18n.get('ui.label.bookmark'),
            help: i18n.get('ui.label.help'),
            dbdisk: i18n.get('ui.title.dbdisk'),
            moreMessage: i18n.get('ui.label.moreMessage'),
            no: i18n.get('ui.label.no'),
            lastModified: i18n.get('ui.label.time.lastModified'),
            fileName: i18n.get('ui.label.fileName'),
            mode: i18n.get('ui.label.mode'),
            size: i18n.get('ui.label.size'),
            bytes: i18n.get('ui.label.bytes'),
            class: i18n.get('ui.label.class'),
            serviceName: i18n.get('ui.label.serviceName'),
            fileSystem: i18n.get('ui.label.fileSystem'),
            currentUsage: i18n.get('ui.label.currentUsage'),
            freeSpace: i18n.get('ui.label.freeSpace'),
            availableSpace: i18n.get('ui.label.availableSpace'),
            total: i18n.get('ui.label.total'),
            mb: i18n.get('ui.label.unit.mb'),
        },
        theme: ariesuser.theme,
    },
    data() {
        return {
            tabs: [
                {
                    key: 'diskUsage',
                    value: i18n.get('ui.label.diskUsage'),
                },
                {
                    key: 'file',
                    value: i18n.get('ui.label.file'),
                },
            ],
            activeTab: 'diskUsage',
            fileData: [],
            diskUsageData: [],
            tableHeight: 300,
            tableSequence: 1,
            resizeHandler: null,
            loading: false,
        };
    },
    methods: {
        async onDomainBarClick(target) {
            // 초기화를 먼저 실행한다.
            this.fileData = [];
            this.setDiskData([]);

            if (target !== null) {
                const { domainId, instanceOid } = target;
                this.loading = true;

                if (this.activeTab === 'diskUsage') {
                    await this.loadDiskUsageData(domainId, instanceOid);
                    this.loading = false;
                    await this.loadTableData(domainId, instanceOid);
                } else {
                    await this.loadTableData(domainId, instanceOid);
                    this.loading = false;
                    await this.loadDiskUsageData(domainId, instanceOid);
                }
            }
        },
        async loadTableData(domainId, instanceOid) {
            const ret = await axios.get('/analysis/file', {
                params: {
                    format: 'json',
                    sid: domainId,
                    agent: instanceOid,
                },
            });

            if (ret.status === 200 && ret.data.list) {
                this.fileData = ret.data.list.map((e, i) => ({
                    no: i + 1,
                    lastModified: e.time,
                    lastModifiedFormat: getDayjs(e.time).format(
                        serverDateFormat.long
                    ),
                    fileName: e.name,
                    mode: e.mode,
                    size: e.size,
                    sizeFormat: e.size.toLocaleForAries(),
                    clazz: e.clazz,
                    serviceName:
                        e.usingApplicationName || i18n.get('ui.label.unknown'),
                }));
            }
        },
        async loadDiskUsageData(domainId, instanceOid) {
            const ret = await axios.get('/agent/feature', {
                params: {
                    sid: domainId,
                    oid: instanceOid,
                    code: AgentFeatureCodeDef.COLLECT_DISK_USAGE_BY_FILE_SYSTEM,
                },
            });

            if (ret.data === AgentFeatureMessageDef.SUPPORTED) {
                const ret2 = await axios.get('/analysis/file/usage', {
                    params: {
                        sid: domainId,
                        oid: instanceOid,
                    },
                });
                if (ret2.status === 200 && ret2.data.length > 0) {
                    // 자바는 버전이 표시되고, 닷넷/PHP는 공백으로 나옴
                    const version = ret2.data[0].platformVersion;
                    if (getJavaMajorVersion(version) > 6 || version === '')
                        this.setDiskData(ret2.data);
                }
            }
        },
        convertToMb(byte) {
            return Math.floor(byte / 1024 / 1024);
        },
        setDiskData(obj) {
            this.diskUsageData = obj
                .map(e => ({
                    fileSystem: e.fileSystem,
                    currentPercentage: e.per.toFixed(2),
                    percentLevel: this.getPercentLevel(e.per),
                    freeSpace: e.free,
                    freeSpaceFormat: this.convertToMb(
                        e.free
                    ).toLocaleForAries(),
                    availableSpace: e.available,
                    availableSpaceFormat: this.convertToMb(
                        e.available
                    ).toLocaleForAries(),
                    currentUsage: e.used,
                    currentUsageFormat: this.convertToMb(
                        e.used
                    ).toLocaleForAries(),
                    total: e.total,
                    totalFormat: this.convertToMb(e.total).toLocaleForAries(),
                }))
                .sort((a, b) => b.currentPercentage - a.currentPercentage);
        },
        getPercentLevel(per) {
            if (per >= 90) return 'fatal';
            if (per >= 80) return 'warn';
            return 'info';
        },
        onChangeActiveTab(tab) {
            this.activeTab = tab;
            this.tableSequence += 1;
        },
    },
    async created() {
        this.resizeHandler = _.throttle(() => {
            this.tableHeight = window.innerHeight - 240;
        }, 100);
        this.resizeHandler();
    },
    mounted() {
        window.addEventListener('resize', this.resizeHandler);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    },
});
