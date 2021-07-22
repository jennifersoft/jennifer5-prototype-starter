import { i18n } from '@common/utility';
import { TRANSACTION_LIMIT } from './constant';

export const initializeColumn = column => {
    if (!column.hasOwnProperty('width')) column.width = 'auto';
    if (!column.hasOwnProperty('isNumber')) column.isNumber = true;
    if (!column.hasOwnProperty('isHide')) column.isHide = false;
    if (!column.hasOwnProperty('className')) column.className = '';
    return { ...column };
};

export const createRowTemplate = columns => {
    const tplArr = columns
        .filter(col => !col.isHide)
        .map(col => {
            let td = `<!= ${col.key} !>`;

            if (col.isNumber) {
                td = `<!= ${col.key} === -1 ? '' : ${col.key}.toLocaleForAries() !>`;
                if (
                    col.className === 'xview-link' ||
                    col.className === 'xview-fail-link'
                )
                    td = `<! if(${col.key} > 0 && ${col.key} < ${TRANSACTION_LIMIT}) { !><span class="${col.className}">${td}</span><! } else { !>${td}<! } !>`;
            } else {
                if (col.className === 'sql-link') {
                    td = `<span class="${col.className}">${i18n.get(
                        'ui.label.showSql'
                    )}</span> ${td}`;
                } else if (col.className === 'error-link') {
                    td = `<span class="${col.className}">${i18n.get(
                        'ui.label.showErrorList'
                    )}</span> ${td}`;
                } else if (col.className === 'bar-chart') {
                    td = `<span class="${col.className}"><span class="percent"><span class="gauge" style="width: ${td}%;"></span></span><span class="text">${td}%</span></span>`;
                }
            }

            return `<td align="${col.isNumber ? 'right' : 'left'}">${td}</td>`;
        });

    return `<tr>${tplArr.join('')}</tr>`;
};

export const createExpandColumnChartData = (startDate, endDate, rows) => {
    const newRows = [];
    const rowMap = {};

    rows.forEach(row => {
        rowMap[row.date.date()] = row;
    });

    for (let i = startDate.date(); i <= endDate.date(); i++) {
        if (rowMap[i]) newRows.push(rowMap[i]);
        else
            newRows.push({
                date: startDate.clone().date(i),
                count: 0,
            });
    }

    return newRows;
};
