import { printEscape } from '@common/utility';
import { getDayjs } from '@common/base';
import { DATE_FORMAT, TIME_FORMAT } from './constant';

export const getPercent = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
};

export const printSqlParams = params => {
    if (params == null) return '';

    const values = [];
    for (let i = 0; i < params.length; i++) {
        values.push(params[i].value);
    }

    return printEscape(values.join(','));
};

export const convertTableData = row => {
    const startObj = getDayjs(row.startTime);
    const endObj = getDayjs(row.endTime);
    const collectionObj = getDayjs(row.collectionTime);

    return {
        ...row,
        guid: row.guid.split(' ').join('&nbsp;'),
        networkTimeFormat: row.networkTime.toLocaleForAries(),
        frontEndElapsedTimeFormat: row.frontEndElapsedTime.toLocaleForAries(),
        startDateFormat: startObj.format(DATE_FORMAT),
        startTimeFormat: startObj.format(TIME_FORMAT),
        endDateFormat: endObj.format(DATE_FORMAT),
        endTimeFormat: endObj.format(TIME_FORMAT),
        collectionTimeFormat: collectionObj.format(TIME_FORMAT),
        elapsedTimeFormat: row.elapsedTime.toLocaleForAries(),
        sqlTimeFormat: row.sqlTime.toLocaleForAries(),
        txcallTimeFormat: row.txcallTime.toLocaleForAries(),
        fetchTimeFormat: row.fetchTime.toLocaleForAries(),
        cpuTimeFormat: row.cpuTime == -1 ? '' : row.cpuTime.toLocaleForAries(),
        cicsGeneralCpuTimeFormat:
            row.cicsGeneralCpuTime == -1
                ? ''
                : row.cicsGeneralCpuTime.toLocaleForAries(),
        cicsJavaCpuTimeFormat:
            row.cicsJavaCpuTime == -1
                ? ''
                : row.cicsJavaCpuTime.toLocaleForAries(),
        batchCountFormat: row.batchCount.toLocaleForAries(),
        batchTimeFormat: row.batchTime.toLocaleForAries(),
        serviceName: printEscape(row.serviceName),
        relatedTopology: !row.relatedTopology ? false : true,
    };
};

export const escapedStringToJson = jsonStr => {
    const escapedJsonStr = jsonStr.split('\\').join('\\\\');
    return JSON.parse(escapedJsonStr);
};

export const createTreeIndexes = (root, index) => {
    root.index = index;

    root.children.forEach((row, seq) => {
        const childIndex = index + '.' + seq;
        row.index = childIndex;

        if (root.children.length > 0) createTreeIndexes(row, childIndex);
    });
};
