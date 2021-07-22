import { GetProfileResultCodeDef } from '@common/definition';
import i18n from './i18n';

export const TAB_KEYS = {
    TIMELINE: 'timeline',
    TEXT: 'text',
    SECTION: 'section',
    SOCKET: 'socket',
    FILE: 'file',
    MESSAGE: 'message',
    ERROR: 'error',
    STACKTRACE: 'stacktrace',
    ASYNC: 'async',
    CICS: 'cics',
    CUSTOM_LOG: 'custom/log',
};

export const CLASS_CODE_TYPES = {
    DECOMPILE: 'decompileCode',
    DISASSEMBLE: 'disassembleCode',
    CLASS: 'classType',
};

export const GROUP_TYPES = {
    APPLICATION: 'application',
    USERID: 'userId',
    GUID: 'guid',
    CLIENTID: 'clientId',
    CLIENTIP: 'clientIp',
};

export const METHOD_PROFILE_TYPES = {
    METHOD: 1,
    EXTERNALCALL: 2,
    GUID: 3,
    USERID: 4,
    EXCEPT: 8,
};

export const CHART_FILTERS = {
    APPLICATION: 'serviceHash',
    CLIENTID: 'wmonId',
    IP: 'ip',
    USERID: 'userid',
};

export const STORAGE_KEYS = {
    TRANSACTION_COLUMN_STATUS: 'vue/xviewTransactionActiveColumnsV2',
    TRANSACTION_MULTISORT_STATUS: 'vue/xviewTransactionMultiSort',
    PROFILE_AUTO_SEARCH: 'vue/xviewProfileAutoSearch',
    CALLTREE_COLUMN_STATUS: 'vue/xviewCalltreeActiveColumns',
    CALLTREE_ZERO_FILTER: 'vue/xviewCalltreeZeroFilter',
    CALLTREE_NOTPROFILED_FILTER: 'vue/xviewCalltreeNotProfiledFilter',
    CALLTREE_LOSTPROFILE_FILTER: 'vue/xviewCalltreeLostProfileFilter',
};

export const BACKEND_TYPES = {
    METHOD: 16,
    SQL: 48,
    EXTERNALCALL: 32,
};

// 메인 영역 여백
export const MAIN_PADDING = 24 * 2;

// 트랜잭션 테이블 높이
export const TOP_HEIGHT = 298;

// 상세 탭의 상단 높이
export const DETAIL_MARGIN_TOP = 352 + 16;

// 날짜 포맷
export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm:ss SSS';

export const DEFAULT_ROW_TEMPLATE = `
<! if (relatedTopology) { !>
<tr class="topology">
<! } else { !>
<tr>
<! } !>
    <td title="<!= domainName !>"><!= domainName !></td>
    <td title="<!= instanceName !>"><!= instanceName !></td>
    <td title="<!= bizName !>"><!= bizName !></td>
    <td title="<!= txid !>"><!= txid !></td>
    <td title="<!= guid !>"><!= guid !></td>
    <td title="<!= ipaddr !>"><!= ipaddr !></td>
    <td title="<!= wmonId !>"><!= wmonId !></td>
    <td title="<!= userId !>"><!= userId !></td>
    <td title="<!= networkTimeFormat !>" align="right"><!= networkTimeFormat !></td>
    <td title="<!= frontEndElapsedTimeFormat !>" align="right"><!= frontEndElapsedTimeFormat !></td>
    <td title="<!= startDateFormat !>"><!= startDateFormat !></td>
    <td title="<!= startTimeFormat !>"><!= startTimeFormat !></td>
    <td title="<!= endDateFormat !>"><!= endDateFormat !></td>
    <td title="<!= endTimeFormat !>"><!= endTimeFormat !></td>
    <td title="<!= collectionTimeFormat !>"><!= collectionTimeFormat !></td>
    <td title="<!= elapsedTimeFormat !>" align="right"><!= elapsedTimeFormat !></td>
    <td title="<!= sqlTimeFormat !>" align="right"><!= sqlTimeFormat !></td>
    <td title="<!= txcallTimeFormat !>" align="right"><!= txcallTimeFormat !></td>
    <td title="<!= fetchTimeFormat !>" align="right"><!= fetchTimeFormat !></td>
    <td title="<!= cpuTimeFormat !>" align="right"><!= cpuTimeFormat !></td>
    <td title="<!= cicsGeneralCpuTimeFormat !>" align="right"><!= cicsGeneralCpuTimeFormat !></td>
    <td title="<!= cicsJavaCpuTimeFormat !>" align="right"><!= cicsJavaCpuTimeFormat !></td>
    <td title="<!= batchCountFormat !>" align="right"><!= batchCountFormat !></td>
    <td title="<!= batchTimeFormat !>" align="right"><!= batchTimeFormat !></td>
    <td title="<!= errCode !>"><!= errCode !></td>
    <td title="<!= serviceName !>"><!= serviceName !></td>
</tr>
`;

export const DEFAULT_COLUMNS = [
    {
        key: 'domainName',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'instanceName',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'bizName',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'txid',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'guid',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'ipaddr',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'wmonId',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'userId',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'networkTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'frontEndElapsedTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'startDate',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'startTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'endDate',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'endTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'collectionTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'elapsedTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'sqlTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'txcallTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'fetchTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'cpuTime',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'cicsGeneralCpuTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'cicsJavaCpuTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'batchCount',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'batchTime',
        width: 'auto',
        sort: true,
        active: false,
    },
    {
        key: 'errCode',
        width: 'auto',
        sort: true,
        active: true,
    },
    {
        key: 'serviceName',
        width: '30%',
        sort: true,
        active: true,
    },
];

export const TIMELINE_STATUS_MESSAGES = {
    [GetProfileResultCodeDef.SEARCHED_ALL]: '',
    [GetProfileResultCodeDef.SEARCHED_PARTIALLY_COLLECTED]: i18n['M0314'],
    [GetProfileResultCodeDef.SEARCHED_COUNT_LIMITED]: i18n['M0315'],
    [GetProfileResultCodeDef.SEARCHED_TIME_LIMITED]: i18n['M0316'],
    [GetProfileResultCodeDef.NOT_COLLECTED]: i18n['M0258'],
};
