<template>
    <div class="detail-toolbar" v-click-outside="onCloseToolbarMenus">
        <template v-if="dataMode === ''">
            <btn
                :class="[
                    'border-none',
                    !existGuid || loadingGuid ? 'disabled' : '',
                ]"
                :items="[{ text: 'GUID' }]"
                :loading="loadingGuid"
                :tooltip-options="{ message: i18n.guid }"
                @click="onClickLinkAndGuidBtn('guid')"
            />
            <btn
                :class="[
                    'border-none',
                    !existLink || loadingLink ? 'disabled' : '',
                ]"
                :items="[{ iconType: iconTypes.link }]"
                :loading="loadingLink"
                :tooltip-options="{ message: i18n.associatedTx }"
                @click="onClickLinkAndGuidBtn('link')"
            />
        </template>

        <btn
            :class="['border-none', !existJenniferFront ? 'disabled' : '']"
            :items="[{ iconType: iconTypes.jennifer }]"
            :tooltip-options="{ message: i18n.jenniferFrontTx }"
            @click="onClickJenniferFrontBtn()"
        />

        <btn
            class="border-none"
            :items="[{ iconType: iconTypes.talk }]"
            :tooltip-options="{ message: i18n.shareToTalk }"
            @click.native="onClickExportTalk()"
        ></btn>

        <template v-if="activeTab === tabKeys.TIMELINE">
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.column }]"
                :pressed="showColumnMenu"
                :tooltip-options="{
                    message: i18n.manageTableColumns,
                    position: 'bottom-right',
                }"
                @click.native="onClickToolbarButtons(true)"
            ></btn>
            <layered-menu
                :width="250"
                :right="25"
                :top="26"
                v-if="showColumnMenu"
            >
                <popup-list
                    type="checkbox"
                    no-scroll
                    multi-select
                    :items="[
                        { text: i18n.showZeroMethod },
                        { text: i18n.showNotProfiled },
                        { text: i18n.showLostProfile },
                    ]"
                    :active-index="callTreeFilters"
                    @update:active-index="onChangeCallTreeFilters"
                />
                <popup-list
                    type="checkbox"
                    style="max-height: 150px"
                    multi-select
                    :title="i18n.manageTableColumns"
                    :items="callTreeColumnMenuList"
                    :active-index.sync="callTreeActiveColumns"
                />
            </layered-menu>
        </template>

        <template
            v-if="
                [tabKeys.TIMELINE, tabKeys.SECTION, tabKeys.TEXT].includes(
                    activeTab
                )
            "
        >
            <btn
                class="border-none"
                :items="[{ iconType: iconTypes.more }]"
                :pressed="showMoreMenu"
                :tooltip-options="{ message: i18n.settingETC }"
                @click.native="onClickToolbarButtons(false)"
            ></btn>
            <layered-menu :width="150" :right="0" :top="27" v-if="showMoreMenu">
                <popup-list
                    no-scroll
                    :items="[{ text: i18n.export }]"
                    @update:active-index="onClickTimelineMenu"
                    v-if="activeTab === tabKeys.TIMELINE"
                />

                <popup-list
                    no-scroll
                    :items="[
                        { text: i18n.exportTxt },
                        { text: i18n.exportCsv },
                    ]"
                    @update:active-index="onClickTextMenu"
                    v-if="activeTab === tabKeys.TEXT"
                />

                <template v-if="activeTab === tabKeys.SECTION">
                    <popup-list
                        type="checkbox"
                        no-scroll
                        multi-select
                        :items="[{ text: i18n.showIndividual }]"
                        :active-index="showIndividualInSection"
                        @update:active-index="toggleShowIndividualInSection"
                    />
                    <popup-list
                        no-scroll
                        :items="[{ text: i18n.export }]"
                        @update:active-index="onClickSectionExportCsv"
                    />
                </template>
            </layered-menu>
        </template>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import AlertWindow from '@vuejs/component/window/AlertWindow';
import Btn from '@vuejs/component/button/Btn';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import LayeredMenu from '../component/LayeredMenu';
import { UIManager } from '@common/legacy/UIManager';
import clickOutside from '@vuejs/directive/clickOutside';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { downloadText, downloadCsv, printEscape } from '@common/utility';
import { Exporter } from '@common/legacy/Exporter';
import { getItem, setItem } from '../storage';
import { STORAGE_KEYS, TAB_KEYS, BACKEND_TYPES } from '../constant';
import { createTableMetadata as createSectionTableMetadata } from './SectionTab';
import { createTableMetadata as createCallTreeColumns } from './CallTree';
import { printSqlParams } from '../utility';
import { mapState, mapMutations, mapActions } from '../store/toolbar';
import {
    mapState as textMapState,
    mapActions as textMapActions,
} from '../store/text';
import { mapState as sectionMapState } from '../store/section';
import {
    mapState as timelineMapState,
    mapMutations as timelineMapMutations,
    mapActions as timelineMapActions,
} from '../store/timeline';
import {
    mapState as baseMapState,
    mapGetters as baseMapGetters,
} from '../store/base';

export default {
    inject: {
        i18n: {
            default: {
                settingETC: 'Setting ETC',
                manageTableColumns: 'Manage Table Columns',
                jenniferFrontTx: 'JENNIFER Front',
                guid: 'GUID',
                associatedTx: 'Associated Transactions',
                shareToTalk: 'Share to talk',
                showIndividual: 'Show Individual',
                export: 'Export',
                exportTxt: 'Export Text',
                exportCsv: 'Export CSV',
                M0378: 'M0378',

                no: 'No.',
                detail: 'Detail',
                api: 'API',
                repeatCount: 'Repeat Count',
                selfTimeSum: 'Sum of self time',
                selfTimeAverage: 'Average of self time',
                responseTimeSum: 'Sum of response time',
                responseTimeAverage: 'Average of response time',
                dbConnection: 'DB Connection',
                inlineParam: 'Inline Parameter',
                boundParam: 'Bound Parameter',
                serviceExternalCall: 'External Call',

                ms: 'ms',
                profileName: 'profileName',
                responseTime: 'responseTIme',
                package: 'package',
                class: 'class',
                cpuTime: 'cpuTime',
                parameters: 'parameters',
                return: 'return',
                showZeroMethod: 'Show zero method',
                showNotProfiled: 'Show not profiled',
            },
        },
    },
    components: {
        Btn,
        PopupList,
        LayeredMenu,
        AlertWindow,
    },
    directives: { clickOutside },
    watch: {
        transactionRow(newVal, oldVal) {
            if (!oldVal) return;
            if (newVal.txid !== oldVal.txid) this.resetTransactionRows();
        },
        callTreeActiveColumns(newVal) {
            setItem(STORAGE_KEYS.CALLTREE_COLUMN_STATUS, [
                true,
                true,
                ...newVal,
                true,
            ]);
            this.reloadCallTree();
            this.loadCallTreeNodes(this.params);
        },
    },
    computed: {
        ...baseMapState({
            dataMode: state => state.dataMode,
            transactionRow: state => state.transactionRow,
            existGuid: state => state.existGuid,
            existLink: state => state.existLink,
            existJenniferFront: state => state.existJenniferFront,
            activeTab: state => state.activeTab,
        }),
        ...baseMapGetters({
            params: 'transactionToProfileSearchParams',
        }),
        ...textMapState({
            profileText: state => state.profileText,
            profileCsv: state => state.profileCsv,
        }),
        ...sectionMapState({
            profileType: state => state.profileType,
            methodRows: state => state.methodRows,
            sqlRows: state => state.sqlRows,
            externalCallRows: state => state.externalCallRows,
            individualRows: state => state.individualRows,
        }),
        ...timelineMapState({
            callTreeNodes: state => state.callTreeNodes,
        }),
        ...mapState({
            linkedTransactionRows: state => state.linkedTransactionRows,
            guidTransactionRows: state => state.guidTransactionRows,
            talkTitle: state => state.talkTitle,
            talkContents: state => state.talkContents,
            showIndividualInSection: state => [state.showIndividualInSection],
        }),
    },
    data() {
        const callTreeColumns = createCallTreeColumns(this.i18n).filter(
            (col, i) => {
                if (i === 0 || i === 1 || i === 8) return false;
                return true;
            }
        );

        return {
            iconTypes: {
                link: ICON_TYPE.topology,
                jennifer: ICON_TYPE.jenniferFront,
                column: ICON_TYPE.tableColumn,
                more: ICON_TYPE.moreHorizon,
                talk: ICON_TYPE.talk,
            },
            tabKeys: TAB_KEYS,
            showColumnMenu: false,
            showMoreMenu: false,
            loadingGuid: false,
            loadingLink: false,

            callTreeFilters: [
                getItem(STORAGE_KEYS.CALLTREE_ZERO_FILTER, true, Boolean),
                getItem(
                    STORAGE_KEYS.CALLTREE_NOTPROFILED_FILTER,
                    true,
                    Boolean
                ),
                getItem(
                    STORAGE_KEYS.CALLTREE_LOSTPROFILE_FILTER,
                    true,
                    Boolean
                ),
            ],
            callTreeColumnMenuList: callTreeColumns.map(col => ({
                text: col.text,
            })),
            callTreeActiveColumns: callTreeColumns.map(column => column.active),

            alertMessage: '',
        };
    },
    methods: {
        ...mapMutations([
            'resetTransactionRows',
            'toggleShowIndividualInSection',
        ]),
        ...mapActions([
            'loadLinkedTransactionRows',
            'loadGuidTransactionRows',
            'shareWithTalk',
        ]),
        ...textMapActions(['loadProfileCsv']),

        ...timelineMapMutations(['updateCallTreeFilters', 'reloadCallTree']),
        ...timelineMapActions(['loadCallTreeNodes']),

        onChangeCallTreeFilters(payload) {
            this.callTreeFilters = payload;
            this.updateCallTreeFilters(payload);
            this.loadCallTreeNodes(this.params);
        },

        // TODO: 조회 시간이 오래 걸리므로 버튼에 로딩 처리를 해야 함!!!
        async onClickLinkAndGuidBtn(mode) {
            const { collectionTime, elapsedTime } = this.transactionRow;
            const startTime = collectionTime - elapsedTime;

            if (mode == 'link') {
                if (this.linkedTransactionRows.length === 0) {
                    this.loadingLink = true;
                    await this.loadLinkedTransactionRows(this.params);
                    this.loadingLink = false;
                }

                UIManager.getXViewPointListForTopologyOrGuid(
                    mode,
                    startTime,
                    collectionTime,
                    this.linkedTransactionRows
                );
            } else if (mode == 'guid') {
                if (this.guidTransactionRows.length === 0) {
                    this.loadingGuid = true;
                    await this.loadGuidTransactionRows(this.params);
                    this.loadingGuid = false;
                }

                UIManager.getXViewPointListForTopologyOrGuid(
                    mode,
                    startTime,
                    collectionTime,
                    this.guidTransactionRows
                );
            }
        },

        async onClickJenniferFrontBtn() {
            const {
                startTime,
                jenniferFrontAppId,
                jenniferFrontPageLoadId,
            } = this.transactionRow;

            window.open(
                `https://front.jennifersoft.com/popup.html?collectTime=${startTime}&appId=${jenniferFrontAppId}&pageLoadId=${jenniferFrontPageLoadId}`,
                'jenniferFront',
                "width=1280,height=800,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
            );
        },

        onClickToolbarButtons(isColumnBtn) {
            if (isColumnBtn) {
                this.showColumnMenu = !this.showColumnMenu;
                this.showMoreMenu = false;
            } else {
                this.showColumnMenu = false;
                this.showMoreMenu = !this.showMoreMenu;
            }
        },

        onCloseToolbarMenus() {
            if (this.showColumnMenu) this.showColumnMenu = false;
            if (this.showMoreMenu) this.showMoreMenu = false;
        },

        async onClickTimelineMenu(index) {
            if (index === 0) {
                const columns = createCallTreeColumns(this.i18n).filter(
                    col => col.active === true
                );

                downloadCsv('callTreeCsv', {
                    fields: columns.map(col => col.key),
                    names: columns.map(col => col.text),
                    rows: this.callTreeNodes.map(row => {
                        return {
                            ...row,
                            profileName: printEscape(
                                row.sql !== '' ? row.sql : row.description
                            ),
                            parameter:
                                row.iconType === 'SQL'
                                    ? `${printSqlParams(
                                          row.sqlInlineParameters
                                      )} ${printSqlParams(
                                          row.sqlBoundParameters
                                      )}`
                                    : printEscape(row.parameter),
                            return: printEscape(row['return']),
                        };
                    }),
                });
            }

            this.showMoreMenu = false;
        },

        async onClickTextMenu(index) {
            if (index === 0) {
                downloadText('profileText', this.profileText);
            } else if (index === 1) {
                if (this.profileCsv === '') {
                    await this.loadProfileCsv(this.params);
                }
                downloadText('profileCsv', this.profileCsv, 'csv');
            }

            this.showMoreMenu = false;
        },

        async onClickExportTalk() {
            if (this.talkTitle === '' && this.talkContents === '') {
                await this.shareWithTalk({
                    params: this.params,
                    serviceName: this.transactionRow.serviceName,
                });
            }

            Exporter.text(this.talkTitle, this.talkContents, () => {
                this.alertMessage = this.i18n.M0378;
            });
        },

        onClickSectionExportCsv() {
            const metadata = createSectionTableMetadata(this.i18n);

            let fields = [];
            let names = [];
            let rows = [];

            if (this.showIndividualInSection[0]) {
                if (this.profileType === BACKEND_TYPES.METHOD) {
                    fields = metadata.individualMethodTableColumns.map(
                        col => col.key
                    );
                    names = metadata.individualMethodTableColumns.map(
                        col => col.name
                    );
                } else if (this.profileType === BACKEND_TYPES.SQL) {
                    fields = metadata.individualSqlTableColumns.map(
                        col => col.key
                    );
                    names = metadata.individualSqlTableColumns.map(
                        col => col.name
                    );
                } else {
                    fields = metadata.individualExternalCallTableColumns.map(
                        col => col.key
                    );
                    names = metadata.individualExternalCallTableColumns.map(
                        col => col.name
                    );
                }

                rows = this.individualRows.map(row => {
                    const data = {
                        detail: printEscape(row.detail),
                        time: row.time.toLocaleForAries(),
                    };

                    if (this.profileType === BACKEND_TYPES.SQL) {
                        data.etc1 =
                            typeof row.etc1 === 'string' ? row.etc1 : '';
                        data.etc2 = printSqlParams(row.etc2);
                        data.etc3 = printSqlParams(row.etc3);
                    }

                    return {
                        ...row,
                        ...data,
                    };
                });
            } else {
                if (this.profileType === BACKEND_TYPES.METHOD) {
                    fields = metadata.methodTableColumns.map(col => col.key);
                    names = metadata.methodTableColumns.map(col => col.name);
                    rows = [...this.methodRows];
                } else if (this.profileType === BACKEND_TYPES.SQL) {
                    fields = metadata.sqlTableColumns.map(col => col.key);
                    names = metadata.sqlTableColumns.map(col => col.name);
                    rows = [...this.sqlRows];
                } else {
                    fields = metadata.externalCallTableColumns.map(
                        col => col.key
                    );
                    names = metadata.externalCallTableColumns.map(
                        col => col.name
                    );
                    rows = [...this.externalCallRows];
                }
            }

            downloadCsv('xviewSection', {
                fields: fields,
                names: names,
                rows: rows,
            });

            this.showMoreMenu = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-toolbar {
    position: absolute;
    top: 5px;
    right: 0px;
}
</style>
