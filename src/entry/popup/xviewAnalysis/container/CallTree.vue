<template>
    <div class="calltree-tab">
        <div
            ref="callTree"
            class="xtable scroll"
            v-click-outside="onCloseCallTreeMenu"
        >
            <table class="table nowrap hover borderless">
                <thead>
                    <tr>
                        <th width="40px">
                            {{ i18n.no }}
                        </th>
                        <th width="50%">{{ i18n.profileName }}</th>
                        <th>{{ i18n.responseTime }}({{ i18n.ms }})</th>
                        <th>{{ i18n.package }}</th>
                        <th>{{ i18n.class }}</th>
                        <th>{{ i18n.cpuTime }}({{ i18n.ms }})</th>
                        <th>{{ i18n.parameters }}</th>
                        <th>{{ i18n.return }}</th>
                        <th>{{ i18n.api }}</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <layered-menu
            :width="180"
            :left="callTreeMenuLeft"
            :top="callTreeMenuTop"
            v-if="callTreeMenuType !== null"
        >
            <popup-list
                no-scroll
                :items="[
                    { text: i18n.findTextProfile },
                    { text: i18n.copyData },
                ]"
                @update:active-index="onClickEtcMenu"
                v-if="callTreeMenuType === 'ETC'"
            />
            <popup-list
                no-scroll
                :items="[
                    { text: i18n.methodProfile },
                    { text: i18n.exceptMethodProfile },
                    { text: i18n.txCall },
                    { text: i18n.guid },
                    { text: i18n.userId },
                ]"
                @update:active-index="onClickMethodMenu"
                v-else-if="callTreeMenuType === 'METHOD'"
            />
            <popup-list
                no-scroll
                :items="[
                    { text: i18n.packageProfile },
                    { text: i18n.exceptPackageProfile },
                ]"
                @update:active-index="onClickPackageMenu"
                v-else-if="callTreeMenuType === 'PACKAGE'"
            />
            <popup-list
                no-scroll
                :items="[
                    { text: i18n.classProfile },
                    { text: i18n.exceptClassProfile },
                    { text: i18n.showClass },
                ]"
                @update:active-index="onClickClassMenu"
                v-else-if="callTreeMenuType === 'CLASS'"
            />
        </layered-menu>

        <detail-window
            v-if="showDetailWindow"
            :top="windowTop"
            @cancel="() => (showDetailWindow = false)"
        >
            <template #subject>
                <span>{{ detailSubject }}</span>
            </template>
            <template #contents>
                <pre>{{ detailContents }}</pre>
            </template>
        </detail-window>

        <sql-window
            :sql="selectedRow.sql"
            :sql-key="selectedRow.sqlKey"
            :inline-parameters="selectedRow.sqlInlineParameters"
            :bound-parameters="selectedRow.sqlBoundParameters"
            :sherpa-oracle-server-config="selectedRow.sherpaOracleServerConfig"
            :sherpa-oracle-instance-name="selectedRow.sherpaOracleInstanceName"
            :sherpa-oracle-sequence="selectedRow.sherpaOracleSequence"
            :sherpa-oracle-guid="selectedRow.sherpaOracleGuid"
            v-if="showSqlWindow"
            @cancel="() => (showSqlWindow = false)"
        ></sql-window>

        <class-window
            v-if="showClassWindow"
            :class-name="className"
            @cancel="() => (showClassWindow = false)"
        ></class-window>

        <method-profile-window
            v-if="showMethodProfileWindow"
            :menu-index="methodProfileMenuIndex"
            :description="selectedRow.description"
            :full-method-description="selectedRow.fullMethodDescription"
            @cancel="() => (showMethodProfileWindow = false)"
        ></method-profile-window>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>

        <confirm-window
            :message="confirmMessage"
            @cancel="() => (confirmMessage = '')"
            @apply="applyConfirmSimpleProfile"
            v-if="confirmMessage !== ''"
        ></confirm-window>
    </div>
</template>

<script>
import jui from 'juijs-grid';
import XTableComp from 'juijs-grid/src/components/xtable';
import PopupList from '@vuejs/component/Dropdown/PopupList';
import clickOutside from '@vuejs/directive/clickOutside';
import { i18n, printEscape, copyClipboard } from '@common/utility';
import { DynamicProfileType } from '@common/definition';
import { UIManager } from '@common/legacy/UIManager';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import LayeredMenu from '../component/LayeredMenu';
import DetailWindow from '../component/DetailWindow';
import SqlWindow from './SqlWindow';
import ClassWindow from './ClassWindow';
import MethodProfileWindow from './MethodProfileWindow';
import { mapState as baseMapState } from '../store/base';
import { mapState, mapActions } from '../store/timeline';
import { getItem } from '../storage';
import { STORAGE_KEYS } from '../constant';
import { printSqlParams } from '../utility';

jui.use(XTableComp);

const ROW_TEMPLATE = `
<!
    var hasChild = row.children.length > 0;
!>
<tr class="<!= selectedClass !>">
    <td class="profile">
        <span class="icon-etc"><!= idx !></span>
    </td>

    <td>
        <span style="display: inline-block; width: <!= row.depth * 20 !>px"></span>

        <! if(hasChild) { !>
        <i style="margin-left: -2px;" class="icon-<! if(row.type == "fold") { !>left<! } else { !>right<! } !>"></i>
        <! } else { !>
        <i style="margin-right: 10px;" class="icon-blank"></i>
        <! } !>

        <i class="ico-calltree <!= iconType.toLowerCase() !>"></i>

        <! if(sql != "") { !>
        <span title="<!= profileName !>">
            <span class="detail sql">${i18n.get('ui.label.showSql')}</span>
            <!= profileName !>
        </span>

        <! } else if(threadId != "") { !>
        <span title="<!= profileName !>">
            <span class="detail thread">${i18n.get(
                'ui.label.threadView'
            )}</span>
            <!= profileName !>
        </span>

        <! } else if(detailMessageOrEmpty != "") { !>

        <! if(iconType == "ERROR") { !>
        <span title="<!= profileName !>">
            <span class="detail error">${i18n.get(
                'ui.label.showErrorMessage'
            )}</span>
        <! } else { !>
        <span title="<!= profileName !>">
            <span class="detail dbconn">${i18n.get(
                'ui.label.showDetailMessage'
            )}</span>
        <! } !>
            <!= profileName !>
        </span>

        <! } else if(iconType == "TX_CALL") { !>
        <span title="<!= profileName !>">
            <! if(owlensServerConfig != null && owlensGuid != null) { !>
            <span class="detail owlens">${i18n.get(
                'ui.label.showDetailTxcall'
            )}</span>
            <! } !>
            <!= profileName !>
        </span>

        <! } else if(iconType == "ASYNC_CALL") { !>
        <span title="<!= profileName !>">
            <! if(calleeId != '0' && calleeId != '-1') { !>
            <span class="detail async">${i18n.get(
                'ui.label.transaction'
            )}</span>
            <! } !>
            <!= profileName !>
        </span>

        <! } else { !>
        <span class="<!= iconType.toLowerCase() !>" title="<!= profileName !>"><!= profileName !></span>
        <! } !>
    </td>

    <td align="right">
    <! if(timeEnabled) { !>
        <div class="time-layout">
            <div class="time"><!= timeFormat !></div>
            <div class="time-bar">
                <div class="time-bar-per" style="width: <!= timePer !>%;"></div>
                <div class="time-bar-text"><!= timePer !>%</div>
            </div>
        </div>
    <! } !>
    </td>

    <td class="package" title="<!= packageName !>"><!= packageName !></td>

    <td class="class" title="<!= className !>"><!= className !></td>

    <td align="right">
    <! if(timeEnabled) { !>
        <!= (cpuTime == -1) ? "" : cpuTimeFormat !>
    <! } !>
    </td>

    <td title="<!= paramsFormat !>"><!= paramsFormat !></td>

    <td title="<!= returnFormat !>"><!= returnFormat !></td>

    <td title="<!= api !>"><!= api !></td>
</tr>`;

function getColshowListStorage() {
    const colshow = getItem(
            STORAGE_KEYS.CALLTREE_COLUMN_STATUS,
            [
                'true',
                'true',
                'true',
                'true',
                'true',
                'false',
                'false',
                'false',
                'true',
            ],
            Array
        ),
        result = [];

    // No, 프로파일 이름, API는 무조건 노출하기
    colshow[0] = 'true';
    colshow[1] = 'true';
    colshow[8] = 'true';

    for (let i = 0; i < colshow.length; i++) {
        if (colshow[i] === 'true') result.push(i);
    }

    return result;
}

export const createTableMetadata = i18n => {
    const colshow = getColshowListStorage();

    const columns = [
        {
            key: 'idx',
            text: i18n.no,
        },
        {
            key: 'profileName',
            text: i18n.profileName,
        },
        {
            key: 'time',
            text: i18n.responseTime + ` (${i18n.ms})`,
        },
        {
            key: 'packageName',
            text: i18n.package,
        },
        {
            key: 'className',
            text: i18n['class'],
        },
        {
            key: 'cpuTime',
            text: i18n.cpuTime + ` (${i18n.ms})`,
        },
        {
            key: 'parameter',
            text: i18n.parameters,
        },
        {
            key: 'return',
            text: i18n['return'],
        },
        {
            key: 'api',
            text: i18n.api,
        },
    ];

    return columns.map((col, i) => {
        return {
            ...col,
            index: i,
            active: colshow.includes(i),
        };
    });
};

export default {
    components: {
        AlertWindow,
        ConfirmWindow,
        DetailWindow,
        SqlWindow,
        ClassWindow,
        MethodProfileWindow,
        PopupList,
        LayeredMenu,
    },
    directives: { clickOutside },
    inject: {
        i18n: {
            default: {
                no: 'no',
                ms: 'ms',
                profileName: 'profileName',
                responseTime: 'responseTime',
                package: 'package',
                class: 'class',
                cpuTime: 'cpuTime',
                api: 'api',
                parameters: 'parameters',
                return: 'return',
                copyData: 'Copy Data',
                findTextProfile: 'Find text profile',
                methodProfile: 'Mehtod profile',
                exceptMethodProfile: 'Except method profile',
                classProfile: 'Class profile',
                exceptClassProfile: 'Except class profile',
                packageProfile: 'Package profile',
                exceptPackageProfile: 'Except package profile',
                showClass: 'Show class',
                txCall: 'External Call',
                guid: 'GUID',
                userId: 'User ID',
                showDetailMessage: 'SHow detail message',
                showErrorMessage: 'SHow error message',
                M0624: 'M0624',
                M0347: '%s',
                M0348: '%s',
            },
        },
    },
    computed: {
        ...baseMapState({
            mainWidth: state => state.mainWidth,
            mainHeight: state => state.mainHeight - 160,
            windowTop: state => state.mainHeight - state.distHeight - 95,
            transactionRow: state => state.transactionRow,
        }),
        ...mapState({
            activeCallTreeNodes: state => state.activeCallTreeNodes,
            callTreeNodes: state => state.callTreeNodes,
        }),
        rows() {
            const rootRow = this.callTreeNodes[0];
            const activeCallTreeNodes = this.activeCallTreeNodes;

            const matchingList =
                activeCallTreeNodes != null
                    ? activeCallTreeNodes.matchingCallTreeNodeKeyList
                    : [];
            const passingList =
                activeCallTreeNodes != null
                    ? this.activeCallTreeNodes.passingCallTreeNodeKeyList
                    : [];

            return this.callTreeNodes.map((row, i) => {
                const per = (row.time / rootRow.time) * 100;
                let paramsFormat = '';
                let selectedClass = [];

                if (row.iconType == 'SQL')
                    paramsFormat = `${printSqlParams(
                        row.sqlInlineParameters
                    )} ${printSqlParams(row.sqlBoundParameters)}`;
                else paramsFormat = printEscape(row.parameter);

                if (passingList.includes(row.nodeKey))
                    selectedClass.push('selected-light');
                if (matchingList.includes(row.nodeKey))
                    selectedClass.push('selected-bold');

                if (row.iconType === 'NOT_PROFILED')
                    selectedClass.push('not-focus');

                return {
                    type: i === 0 ? 'open' : 'fold',
                    index: row.treeIndex,
                    data: {
                        ...row,
                        profileName: printEscape(
                            row.sql !== '' ? row.sql : row.description
                        ),
                        timePer: isNaN(per) ? 100 : per.toFixed(2),
                        timeFormat: row.time.toLocaleForAries(),
                        cpuTimeFormat: row.cpuTime.toLocaleForAries(),
                        paramsFormat: paramsFormat,
                        returnFormat: printEscape(row['return']),
                        selectedClass: selectedClass.join(' '),
                    },
                };
            });
        },
    },
    watch: {
        mainWidth(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.callTree.scrollWidth(newVal, true);
        },
        mainHeight(newVal, oldVal) {
            if (newVal === oldVal) return;
            this.callTree.scrollHeight(newVal);
        },
        rows(newVal) {
            // 콜-트리 테이블 업데이트
            this.callTree.updateTree(newVal);
        },
    },
    data() {
        return {
            // 공통 데이터
            selectedRow: null,

            // ERROR / DBConnection 상세보기 관련 데이터
            showDetailWindow: false,
            detailSubject: '',
            detailContents: '',

            // SQL 상세보기 관련 데이터
            showSqlWindow: false,

            // 콜트리 메뉴 관련 데이터
            callTreeMenuType: null,
            callTreeMenuTop: 27,
            callTreeMenuLeft: 0,

            // 클래스 보기 관련 데이터
            showClassWindow: false,
            className: '',

            // 메소드 프로파일 관련 데이터 (+GUID, 사용자 ID, 제외하기 등)
            showMethodProfileWindow: false,
            methodProfileMenuIndex: 0,

            // 알럿 메시지
            alertMessage: '',
            confirmMessage: '',
            confirmPayload: null,
        };
    },
    methods: {
        ...mapActions(['setPackageOrClassProfile', 'loadErrorMessage']),
        onClickEtcMenu(index) {
            if (index === 0) this.$emit('search-profile', this.selectedRow.idx);
            else if (index === 1) {
                copyClipboard(
                    this.selectedRow.sql !== ''
                        ? this.selectedRow.sql
                        : this.selectedRow.description
                );

                this.alertMessage = this.i18n.M0624;
            }

            this.onCloseCallTreeMenu();
        },
        onClickMethodMenu(index) {
            this.methodProfileMenuIndex = index;
            this.showMethodProfileWindow = true;
            this.onCloseCallTreeMenu();
        },
        onClickPackageMenu(index) {
            const packageName = `${this.selectedRow.packageName}.*`;

            if (index === 0) {
                this.showConfirmSimpleProfile(
                    this.i18n.M0347,
                    DynamicProfileType.BY_PACKAGE_NAME,
                    packageName,
                    false
                );
            } else if (index === 1) {
                this.showConfirmSimpleProfile(
                    this.i18n.M0348,
                    DynamicProfileType.BY_PACKAGE_NAME,
                    packageName,
                    true
                );
            }

            this.onCloseCallTreeMenu();
        },
        onClickClassMenu(index) {
            const className = `${this.selectedRow.packageName}.${this.selectedRow.className}`;

            if (index === 0) {
                this.showConfirmSimpleProfile(
                    this.i18n.M0347,
                    DynamicProfileType.BY_CLASS_NAME_PATTERN,
                    className,
                    false
                );
            } else if (index === 1) {
                this.showConfirmSimpleProfile(
                    this.i18n.M0348,
                    DynamicProfileType.BY_CLASS_NAME_PATTERN,
                    className,
                    true
                );
            } else if (index === 2) {
                this.showClassWindow = true;
                this.className = className;
            }

            this.onCloseCallTreeMenu();
        },
        onCloseCallTreeMenu() {
            this.callTreeMenuType = null;
        },
        replaceI18nMessage(message, value) {
            return message.replace('%s', value);
        },
        showConfirmSimpleProfile(message, profileType, profileTarget, ignore) {
            this.confirmPayload = {
                domainId: this.transactionRow.sid,
                instanceOid: this.transactionRow.sysOid,
                languageType: this.transactionRow.langType,
                profileType: profileType,
                profileTarget: profileTarget,
                ignore: ignore,
            };

            this.confirmMessage = this.replaceI18nMessage(
                message,
                profileTarget
            );
        },
        applyConfirmSimpleProfile() {
            this.setPackageOrClassProfile(this.confirmPayload);
            this.confirmMessage = '';
            this.confirmPayload = null;
        },
        searchActiveNodes() {
            // 테이블 업데이트 이후에 스크롤 이동
            const activeNodes = this.activeCallTreeNodes;

            if (
                this.rows.length > 0 &&
                activeNodes != null &&
                activeNodes.matchingCallTreeNodeKeyList.length > 0
            ) {
                const nodeKey = activeNodes.matchingCallTreeNodeKeyList[0];
                const matchingNodes = this.rows.filter(
                    row => row.data.nodeKey === nodeKey
                );

                if (matchingNodes.length > 0) {
                    const index = matchingNodes[0].index;

                    this.openAllParents(index);

                    setTimeout(() => {
                        this.callTree.scrollTop(index, -100);
                    }, 1);
                }
            }
        },
        openAllParents(index) {
            const row = this.callTree.get(index);
            if (row) {
                if (row.type === 'fold') this.callTree.open(row.index);
                if (row.parent !== null && row.parent.type === 'fold')
                    this.openAllParents(row.parent.index);
            }
        },
    },
    mounted() {
        const self = this;
        const columns = createTableMetadata(this.i18n);

        this.callTree = jui.create('grid.xtable', this.$refs.callTree, {
            fields: columns.map(col => col.key),
            colshow: columns
                .filter(col => col.active === true)
                .map(col => col.index),
            width: this.mainWidth,
            scrollWidth: this.mainWidth,
            scrollHeight: this.mainHeight,
            vscrollKeydownEvent: false,
            rowHeight: 27,
            buffer: 'vscroll',
            resize: true,
            event: {
                select: function(row, e) {
                    self.selectedRow = { ...row.data };

                    const {
                        sid,
                        sysOid,
                        collectionTime,
                        elapsedTime,
                    } = self.transactionRow;
                    const cls = e.target.className;
                    const distY = cls === 'method' ? 110 : 60;

                    if (
                        cls === 'method' ||
                        cls === 'package' ||
                        cls === 'class' ||
                        cls === 'profile' ||
                        cls === 'icon-etc'
                    ) {
                        self.callTreeMenuTop = `${e.clientY - distY}px`;
                        self.callTreeMenuLeft = `${e.pageX}px`;

                        if (self.callTreeMenuType !== null) {
                            self.onCloseCallTreeMenu();
                            return;
                        }
                    }

                    if (cls === 'profile' || cls === 'icon-etc') {
                        self.callTreeMenuType = 'ETC';
                    } else if (
                        cls === 'method' &&
                        row.data.iconType === 'METHOD'
                    ) {
                        self.callTreeMenuType = 'METHOD';
                    } else if (
                        cls === 'package' &&
                        row.data.packageName !== ''
                    ) {
                        self.callTreeMenuType = 'PACKAGE';
                    } else if (cls === 'class' && row.data.className !== '') {
                        self.callTreeMenuType = 'CLASS';
                    } else if (cls === 'detail sql') {
                        self.showSqlWindow = true;
                    } else if (cls === 'detail thread') {
                        UIManager.popup(
                            `/popup/thread?sid=${sid}&agent=${sysOid}&key=${row.data.threadId}`,
                            1040,
                            600
                        );
                    } else if (cls === 'detail dbconn') {
                        self.detailSubject = self.i18n.showDetailMessage;
                        self.detailContents = row.data.detailMessageOrEmpty;
                        self.showDetailWindow = true;
                    } else if (cls === 'detail error') {
                        self.loadErrorMessage({
                            domainId: sid,
                            startTime: collectionTime - elapsedTime,
                            endTime: collectionTime,
                            key: parseInt(row.data.detailMessageOrEmpty),
                        }).then(text => {
                            self.detailSubject = self.i18n.showErrorMessage;
                            self.detailContents = text;
                            self.showDetailWindow = true;
                        });
                    } else if (cls === 'detail owlens') {
                        const url = `${row.data.owlensServerConfig}?txid=${row.data.owlensGuid}`;
                        window.open(
                            url,
                            'owlensPopup',
                            "width=1024,height=768,location='no',history='no',resizable='no',status='no',scrollbars='no',toolbar='no',menubar='no'"
                        );
                    } else if (cls === 'detail async') {
                        const searchRange = 1000 * 60 * 60;
                        UIManager.getXViewPointList(
                            sid,
                            [row.data.calleeId],
                            collectionTime - elapsedTime - searchRange,
                            collectionTime + searchRange,
                            row.data.calleeId,
                            undefined,
                            undefined,
                            'xviewAnalysisForAsync'
                        );
                    } else {
                        // 자식 노드 열기/닫기
                        if (row.children.length > 0) {
                            if (row.type == 'fold') {
                                this.open(row.index);
                            } else {
                                this.fold(row.index);
                            }
                        }
                    }

                    // 로우 선택 효과
                    this.select(row.index);
                },
                updateTree: () => {
                    // 액티브 프로파일 찾기
                    this.searchActiveNodes();
                },
            },
            tpl: {
                row: ROW_TEMPLATE,
            },
        });
    },
};
</script>

<style lang="scss" scoped>
.calltree-tab {
}
</style>
