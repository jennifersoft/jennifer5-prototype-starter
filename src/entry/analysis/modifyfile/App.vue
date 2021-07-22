<template>
    <div class="modify-file-wrapper">
        <top-bar @change="onChangeInstance" />

        <div class="main-contents">
            <navigation-bar
                :loading="loading"
                :disable-search-btn="!isValidTimeRange"
                @search="onSearch"
            >
                <navigation-item>
                    <input-field
                        small
                        :value="searchPath"
                        :placeholder="i18n.searchPath"
                        @input="updateSearchPath"
                        @keyup.native.enter="onSearch"
                        style="margin-right: 8px;"
                    />
                    <format-date-input
                        :messages="messages"
                        :time="startTime"
                        @change="updateStartTime"
                    />
                    <format-date-input
                        :messages="messages"
                        :time="endTime"
                        @change="updateEndTime"
                    />
                </navigation-item>
                <navigation-item :label="i18n.maxDisplayCount">
                    <dropdown
                        :items="displayLimits"
                        :width="80"
                        no-scroll
                        @onchange="onChangeSearchLimit"
                    />
                </navigation-item>
            </navigation-bar>
            <btn class="transparent export-btn"
                 :items="[{ iconType: icons.download }]"
                 :tooltip-options="{
                    message: i18n.exportCsv,
                    position: 'top-right',
                 }"
                 @click="onClickExport"
                 normal />
            <modify-file-table :list="tableData"
                               :height="tableHeight" />
        </div>

        <alert-window
            :message="alertMessage"
            @cancel="updateAlertMessage"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import _ from '@library/lodash';
import TopBar from '@vuejs/container/topbar/TopBar';
import Btn from "@vuejs/component/button/Btn";
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import InputField from '@vuejs/component/Input/InputField';
import Dropdown from '@vuejs/component/Dropdown/Dropdown';
import messages from '@vuejs/component/messages';
import ModifyFileTable from '@entry/analysis/modifyfile/ModifyFileTable';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import { downloadCsv } from "@common/utility";

import { mapState, mapMutations, mapActions } from './vuex';
import { ICON_TYPE } from "@vuejs/component/icon/iconType";

const DEBOUNCE_DELAY = 300;
const TOP_PADDING = 276;

export default {
    inject: {
        i18n: {
            default: () => ({
                maxDisplayCount: 'maxDisplayCount',
                searchPath: 'searchPath',
                exportCsv: 'Export csv',
                no: 'no',
                fileName: 'fileName',
                path: 'path',
                modificationTime: 'modificationTime',
                size: 'size',
                bytes: 'bytes',
            }),
        },
    },
    name: 'App',
    components: {
        TopBar,
        Btn,
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        InputField,
        Dropdown,
        ModifyFileTable,
        AlertWindow,
    },
    computed: {
        ...mapState({
            searchPath: state => state.searchPath,
            startTime: state => state.timeFilter.start,
            endTime: state => state.timeFilter.end,
            tableData: state => state.tableData,
            loading: state => state.loading,
            alertMessage: state => state.alertMessage,
        }),
        onResizeDebounced() {
            return _.debounce(this.onResize, DEBOUNCE_DELAY);
        },
        isValidTimeRange() {
            return this.startTime.valueOf() < this.endTime.valueOf();
        },
    },
    data() {
        return {
            tableHeight: window.innerHeight - TOP_PADDING,
        };
    },
    methods: {
        ...mapMutations([
            'updateDomain',
            'updateSearchPath',
            'updateStartTime',
            'updateEndTime',
            'updateLimit',
            'updateTableData',
            'updateAlertMessage',
        ]),
        ...mapActions(['loadModifyFileData']),
        onChangeInstance({ domainId, instanceOid }) {
            this.updateDomain({ sid: domainId, oid: instanceOid });
            this.updateTableData();
        },
        onChangeSearchLimit({ value }) {
            this.updateLimit(value);
        },
        onResize() {
            this.tableHeight = window.innerHeight - TOP_PADDING;
        },
        onSearch() {
            // 키워드가 없을 때
            if (this.searchPath === '') {
                this.updateAlertMessage(this.i18n.M0021);
                return;
            }
            this.loadModifyFileData();
        },
        onClickExport() {
            const columns = [
                { key: 'no', name: this.i18n.no },
                { key: 'fileName', name: this.i18n.fileName },
                { key: 'directory', name: this.i18n.path },
                { key: 'timestamp', name: this.i18n.modificationTime },
                { key: 'size', name: `${this.i18n.size} (${this.i18n.bytes})` },
            ];

            downloadCsv(`modify-file`, {
                fields: columns.map(e => e.key),
                names: columns.map(e => e.name),
                rows: this.tableData.map((e, i) => ({
                    ...e,
                    no: i + 1,
                })),
            });
        }
    },
    created() {
        this.messages = messages;
        this.displayLimits = [
            { text: 100, value: 100 },
            { text: 90, value: 90 },
            { text: 80, value: 80 },
            { text: 70, value: 70 },
            { text: 60, value: 60 },
            { text: 50, value: 50 },
        ];
        this.icons = {
            download: ICON_TYPE.arrowDownward,
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResizeDebounced);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResizeDebounced);
    },
};
</script>

<style lang="scss" scoped>
.modify-file-wrapper {
    .topbar {
        margin: 0 0 8px 0;
    }
    .main-contents {
        padding: 16px 24px 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        > .export-btn {
            margin: 8px 0;
        }
    }
}
</style>
