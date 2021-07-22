import { downloadCsv, i18n } from '@common/utility';
import { getDayjs, serverDateFormat } from '@common/base';

export function exportListData(data) {
    const names = [
            i18n.get('ui.label.eventLevel'),
            i18n.get('ui.label.time'),
            i18n.get('ui.label.target'),
            i18n.get('ui.label.eventType'),
            i18n.get('ui.label.message'),
            i18n.get('ui.label.value'),
            i18n.get('ui.label.transaction'),
            i18n.get('ui.label.application'),
        ],
        fields = [
            'eventLevelName',
            'time',
            'nameWithDomain',
            'errorTypeNameWithUnit',
            'newMessage',
            'value',
            'relevantTxId',
            'serviceName',
        ];
    const rows = data.map(e => {
        return {
            ...e,
            newMessage: e.message || e.detailMessage,
            time: getDayjs(e.time).format(serverDateFormat.longWithSec),
            value: e.value === -1 ? '' : e.value,
        };
    });

    downloadCsv('dbevent_list', {
        fields,
        names,
        rows,
    });
}
export function exportCountData(data) {
    const names = [
            i18n.get('ui.label.eventLevel'),
            i18n.get('ui.label.time'),
            i18n.get('ui.label.target'),
            i18n.get('ui.label.eventType'),
            i18n.get('ui.label.count'),
        ],
        fields = [
            'eventLevelName',
            'timeConverted',
            'nameWithDomain',
            'errorTypeNameWithUnit',
            'count',
        ];

    downloadCsv('dbevent_count', {
        fields: fields,
        names: names,
        rows: data,
    });
}
