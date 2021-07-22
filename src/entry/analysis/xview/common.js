import jui from 'juijs-grid';
import { setSortEff } from '@common/utility';
import $ from '@library/jquery';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm:ss SSS';

export const yAxisTypesInTransactionTab = [
    'elapsedTime',
    'sqlTime',
    'fetchTime',
    'txcallTime',
    'cpuTime',
    'frontEndElapsedTime',
    'networkTime',
];
export const sortTypesInApplicationBar = [
    { key: 'count', i18nKey: 'serviceCount' },
    { key: 'averageElapsedTime', i18nKey: 'responseTimeAverage' },
    { key: 'maxElapsedTime', i18nKey: 'responseTimeMax' },
    { key: 'averageSqlTime', i18nKey: 'averageSqlTime' },
    { key: 'averageCpuTime', i18nKey: 'averageCpuTime' },
];

export const yAxisTypesInGroupTab = [
    { key: 'averageElapsedTime', i18nKey: 'responseTimeAverage' },
    { key: 'maxElapsedTime', i18nKey: 'responseTimeMax' },
    { key: 'lastElapsedTime', i18nKey: 'responseTimeRecent' },
];
export const filterTypes = [
    { key: 'serviceName', i18nKey: 'application' },
    { key: 'excludeServiceName', i18nKey: 'excludeApplication' },
    { key: 'ip', i18nKey: 'ipaddr' },
    { key: 'userId', i18nKey: 'userId' },
    { key: 'guid', i18nKey: 'guid' },
    { key: 'elapsedTime', i18nKey: 'elapsedTime', compareTime: true },
    { key: 'sqlTime', i18nKey: 'sqlTime', compareTime: true },
    { key: 'fetchTime', i18nKey: 'fetchTime', compareTime: true },
    { key: 'txcallTime', i18nKey: 'txcallTime', compareTime: true },
    { key: 'cpuTime', i18nKey: 'cpuTime', compareTime: true },
    { key: 'frontEndTime', i18nKey: 'frontEndTime', compareTime: true },
    { key: 'networkTime', i18nKey: 'networkTime', compareTime: true },
];

export const generateIP = (ip, ipType) => {
    if (!ip) return '';

    if (ipType === 'v4') {
        var arr = [0, 0, 0, 0];

        arr[0] = (ip & (0xff << 24)) >>> 24;
        arr[1] = (ip & (0xff << 16)) >>> 16;
        arr[2] = (ip & (0xff << 8)) >>> 8;
        arr[3] = ip & 0xff;

        return arr.join('.');
    } else if (ipType === 'v6') {
        /*
        //과거 버젼에서 사용했던 방법..
        var temp = [];
        for(var i = 0, len = ip.length; i < len; i++) {
            temp[i] = ('0000' + ip[i].toString(16)).substr(-4);
        }

        return temp.join(":");
        */

        var text = '';
        var startPos = -1;
        var endPos = -1;

        var digit = ip[0];
        for (var i = 0, len = ip.length; i < len; i++) {
            text = text + ip[i].toString(16) + ':';
            var nextDigit = 1;
            if (i < ip.length - 1) {
                nextDigit = ip[i + 1];

                if (digit === 0 && nextDigit === 0) {
                    if (startPos === -1) {
                        startPos = Math.max(0, text.length - 3);
                    }
                    endPos = text.length + 2;
                }
            }

            digit = nextDigit;
        }

        if (startPos !== -1 && endPos !== -1) {
            var hi = text.substring(0, startPos);
            var lo = text.substring(endPos);
            if (lo.length === 0) {
                return hi + '::';
            }
            text = hi + '::' + lo;
        }

        return text.substring(0, text.length - 1);
    }

    return '';
};

export const DEFAULT_ROW_TEMPLATE_IN_TRANSACTION = `
<!
    var startTime = agentEndTime - elapsedTime;
    var endTime = agentEndTime;
    var startTimeDayjs = getDayjs(agentEndTime - elapsedTime);
    var endTimeDayjs = getDayjs(agentEndTime);
    var collectTimeDayjs = getDayjs(collectTime);
!>
<tr>
    <td title="<!= domainName !>"><!= domainName !></td>
    <td title="<!= instanceName !>"><!= instanceName !></td>
    <td title="<!= bizName !>"><!= bizName !></td>
    <td title="<!= txid !>"><!= txid !></td>
    <td title="<!= guid !>"><!= guid !></td>
    <td title="<!= ipaddr !>"><!= ipaddr !></td>
    <td title="<!= wmonId !>"><!= wmonId !></td>
    <td title="<!= userId !>"><!= userId !></td>
    <td align="right"><!= networkTime.toLocaleForAries() !></td>
    <td align="right"><!= frontEndElapsedTime.toLocaleForAries() !></td>
    <td><!= startTimeDayjs.format('YYYY-MM-DD') !></td>
    <td><!= startTimeDayjs.format('HH:mm:ss SSS') !></td>
    <td><!= endTimeDayjs.format('YYYY-MM-DD') !></td>
    <td><!= endTimeDayjs.format('HH:mm:ss SSS') !></td>
    <td><!= collectTimeDayjs.format('HH:mm:ss SSS') !></td>
    <td align="right"><!= elapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= sqlTime.toLocaleForAries() !></td>
    <td align="right"><!= txcallTime.toLocaleForAries() !></td>
    <td align="right"><!= fetchTime.toLocaleForAries() !></td>
    <td align="right"><!= cpuTime.toLocaleForAries() !></td>
    <td align="right"><!= cicsGeneralCpuTime.toLocaleForAries() !></td>
    <td align="right"><!= cicsJavaCpuTime.toLocaleForAries() !></td>
    <td align="right"><!= batchCount.toLocaleForAries() !></td>
    <td align="right"><!= batchTime.toLocaleForAries() !></td>
    <td title="<!= errorCode !>"><!= errorCode !></td>
    <td title="<!= serviceName !>"><!= serviceName !></td>
</tr>
`;

export const DEFAULT_ROW_TEMPLATE_IN_APPLICATION = `
<tr>
    <td title="<!= serviceName !>"><!= serviceName !></td>
    <td align="right"><!= count.toLocaleForAries() !></td>
    <td align="right"><!= averageSqlTime.toLocaleForAries() !></td>
    <td align="right"><!= averageFetchTime.toLocaleForAries() !></td>
    <td align="right"><!= averageTxcallTime.toLocaleForAries() !></td>
    <td align="right"><!= averageCpuTime.toLocaleForAries() !></td>
    <td align="right"><!= averageElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= maxElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= lastElapsedTime.toLocaleForAries() !></td>
</tr>`;

export const DEFAULT_ROW_TEMPLATE_IN_USERID = `
<tr>
    <td title="<!= userId !>"><!= userId !></td>
    <td align="right"><!= count.toLocaleForAries() !></td>
    <td align="right"><!= averageSqlTime.toLocaleForAries() !></td>
    <td align="right"><!= averageFetchTime.toLocaleForAries() !></td>
    <td align="right"><!= averageTxcallTime.toLocaleForAries() !></td>
    <td align="right"><!= averageCpuTime.toLocaleForAries() !></td>
    <td align="right"><!= averageElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= maxElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= lastElapsedTime.toLocaleForAries() !></td>
</tr>`;

export const DEFAULT_ROW_TEMPLATE_IN_CLIENTIP = `
<tr>
    <td title="<!= ipaddr !>"><!= ipaddr !></td>
    <td align="right"><!= count.toLocaleForAries() !></td>
    <td align="right"><!= averageSqlTime.toLocaleForAries() !></td>
    <td align="right"><!= averageFetchTime.toLocaleForAries() !></td>
    <td align="right"><!= averageTxcallTime.toLocaleForAries() !></td>
    <td align="right"><!= averageCpuTime.toLocaleForAries() !></td>
    <td align="right"><!= averageElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= maxElapsedTime.toLocaleForAries() !></td>
    <td align="right"><!= lastElapsedTime.toLocaleForAries() !></td>
</tr>`;

export const COMMON_COLUMNS_IN_BY_GROUP = [
    {
        key: 'count',
        width: 'auto',
    },
    {
        key: 'averageSqlTime',
        width: 'auto',
    },
    {
        key: 'averageFetchTime',
        width: 'auto',
    },
    {
        key: 'averageTxcallTime',
        width: 'auto',
    },
    {
        key: 'averageCpuTime',
        width: 'auto',
    },
    {
        key: 'averageElapsedTime',
        width: 'auto',
    },
    {
        key: 'maxElapsedTime',
        width: 'auto',
    },
    {
        key: 'lastElapsedTime',
        width: 'auto',
    },
];

export const createTable = (
    ref,
    fields,
    colshow,
    scrollHeight,
    tpl,
    selectFunc
) => {
    return jui.create('grid.xtable', ref, {
        fields: fields,
        colshow: colshow,
        sort: true,
        sortCache: true,
        sortLoading: true,
        scrollHeight: scrollHeight,
        vscrollKeydownEvent: false,
        rowHeight: 27,
        buffer: 'vscroll',
        resize: true,
        event: {
            sort: setSortEff,
            select: selectFunc,
        },
        tpl: {
            row: tpl,
        },
    });
};

export const getTransactionInnerTable = () => {
    const table = jui.get('grid.table')[2][0];

    if (table.count() === 0) {
        return jui.get('grid.table')[1][0];
    }

    return table;
};
