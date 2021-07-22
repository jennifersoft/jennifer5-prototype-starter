import { generateIP } from '@entry/analysis/xview/common';
import { Observer } from '@common/legacy/Observer';
import { ErrorTypeDef } from '@common/definition';
import { server } from '@common/base';

export const MAX_XVIEW_UNIT_COUNT = 150 * 10000;

export const columnsTransactionGroup = {
    count: 0,
    errorCount: 0,
    elapsedTime: 0,

    sqlTime: 0,
    fetchTime: 0,
    txcallTime: 0,
    cpuTime: 0,
    maxElapsedTime: 0,
    lastElapsedTime: 0,
    startTime: Number.MAX_VALUE,
    lastTime: 0,
};

export const makeTransactionInTable = (
    filteredTransactions,
    domainIdNOidNNameAbountInstance,
    domainIdNOidNNameAbountBusiness
) => {
    const domains = Observer.get('domains');

    return filteredTransactions.map(transaction => {
        const domainId = transaction.sid;
        const domainName = domains.find(
            domain => domain.sid === Number(domainId)
        )?.shortName;

        //필요한 데이터는 x-view팝업의 서버쪽과 클라이언트를 참고했다.
        //XViewPointRecordHelper.java
        //view-server/src/main/client/entry/popup/xviewAnalysis/utility.js

        const instanceName =
            domainIdNOidNNameAbountInstance[domainId][transaction.sysOid] ??
            transaction.sysOid;
        const bizName = transaction.bizOids.map(
            bizOid =>
                domainIdNOidNNameAbountBusiness[domainId][bizOid] ?? bizOid
        );
        const ipaddr = generateIP(transaction.ip, transaction.ipType);

        const foundIndex = Object.values(ErrorTypeDef).findIndex(
            value => value === transaction.errCode
        );
        const errorCode =
            foundIndex > -1 ? Object.keys(ErrorTypeDef)[foundIndex] : '';

        return {
            ...transaction,
            errorCode,
            domainName,
            instanceName,
            bizName,
            ipaddr,
        };
    });
};

export const makeTransactionGroup = (
    filteredTransactions,
    keyInTransaction,
    needFields = []
) => {
    return Object.freeze(
        Object.values(
            filteredTransactions.reduce((acc, unit) => {
                const domainId = unit.sid;
                const key = unit[keyInTransaction];

                if (key === '') return acc;

                const fillNeedFields =
                    needFields.length > 0
                        ? Object.assign(
                              ...needFields.map(field => ({
                                  [field]: unit[field],
                              }))
                          )
                        : {};

                const transactionsGroup = acc[key] ?? {
                    txidArrayBySid: {},
                    ...columnsTransactionGroup,
                    ...fillNeedFields,
                };

                if (transactionsGroup.startTime > unit.collectTime) {
                    transactionsGroup.startTime = unit.collectTime;
                }
                if (transactionsGroup.lastTime < unit.collectTime) {
                    transactionsGroup.lastTime = unit.collectTime;
                    transactionsGroup.lastElapsedTime = unit.elapsedTime;
                }
                if (transactionsGroup.maxElapsedTime < unit.elapsedTime) {
                    transactionsGroup.maxElapsedTime = unit.elapsedTime;
                }

                transactionsGroup.txidArrayBySid[domainId] =
                    transactionsGroup.txidArrayBySid[domainId] ?? [];
                transactionsGroup.txidArrayBySid[domainId].push(unit.txid);

                transactionsGroup.count++;
                transactionsGroup.elapsedTime += unit.elapsedTime;
                transactionsGroup.sqlTime += unit.sqlTime;
                transactionsGroup.cpuTime += unit.cpuTime;
                transactionsGroup.fetchTime += unit.fetchTime;
                transactionsGroup.txcallTime += unit.txcallTime;

                if (unit.errCode !== 0) {
                    transactionsGroup.errorCount++;
                }

                acc[key] = transactionsGroup;
                return acc;
            }, {})
        ).map(obj => {
            obj.averageElapsedTime = obj.elapsedTime / obj.count;
            obj.averageSqlTime = obj.sqlTime / obj.count;
            obj.averageCpuTime = obj.cpuTime / obj.count;
            obj.averageFetchTime = obj.fetchTime / obj.count;
            obj.averageTxcallTime = obj.txcallTime / obj.count;

            return obj;
        })
    );
};

export const makeDomainIdNOidNName = tree => {
    return tree.reduce((domainIdNOidNName, objectInTree) => {
        const { sid, oid, shortName } = objectInTree.data;
        if (oid !== -1) {
            domainIdNOidNName[sid] = domainIdNOidNName[sid] ?? {};
            domainIdNOidNName[sid][oid] = shortName;
        }

        return domainIdNOidNName;
    }, {});
};

export const makeTransactionArrayFromResponse = (
    dataView,
    offset,
    sid,
    count
) => {
    return Array.from(new Array(count).keys()).map(index => {
        const { transaction, endOffset } = makeTransactionFromByte(
            dataView,
            offset
        );

        // unit.sid = sid;
        transaction.color = index % 3;
        transaction.sid = sid;

        offset = endOffset;

        return transaction;
    });
};
export const makeTransactionFromByte = (dataView, startOffset) => {
    const transaction = {};

    let endOffset = startOffset;

    transaction.sysOid = dataView.getInt32(endOffset);
    endOffset += 4;

    const bizOidSize = dataView.getInt8(endOffset);
    endOffset += 1;

    transaction.bizOids = Array.from(new Array(bizOidSize).keys()).map(index =>
        dataView.getInt32(endOffset + index * 4)
    );
    endOffset += 4 * bizOidSize;

    transaction.collectTime = dataView.getFloat64(endOffset);
    endOffset += 8;

    transaction.agentEndTime = dataView.getFloat64(endOffset);
    endOffset += 8;

    //ARIES-10109
    if (server.useAgentTimeForXAxisOnXView)
        transaction.collectTime = transaction.agentEndTime;

    transaction.elapsedTime = dataView.getInt32(endOffset); // 응답시간
    endOffset += 4;

    transaction.sqlTime = dataView.getInt32(endOffset); // SQL 시간
    endOffset += 4;

    transaction.fetchTime = dataView.getInt32(endOffset); // Fetch 시간
    endOffset += 4;

    transaction.txcallTime = dataView.getInt32(endOffset); // External Call 시간
    endOffset += 4;

    transaction.cpuTime = dataView.getInt32(endOffset); // CPU 시간
    endOffset += 4;

    transaction.frontEndElapsedTime = dataView.getInt32(endOffset);
    endOffset += 4;

    transaction.networkTime = dataView.getInt32(endOffset);
    endOffset += 4;

    transaction.serviceHash = dataView.getInt32(endOffset);
    endOffset += 4;

    transaction.userHash = dataView.getInt32(endOffset);
    endOffset += 4;

    transaction.errCode = dataView.getInt16(endOffset);
    endOffset += 2;

    let ipLength = dataView.getInt8(endOffset);
    endOffset += 1;

    transaction.ipType = 'v0';
    if (ipLength === 4) {
        transaction.ipType = 'v4';
        transaction.ip =
            ((dataView.getInt8(endOffset) & 0xff) << 24) |
            ((dataView.getInt8(endOffset + 1) & 0xff) << 16) |
            ((dataView.getInt8(endOffset + 2) & 0xff) << 8) |
            (dataView.getInt8(endOffset + 3) & 0xff);
    } else if (ipLength === 16) {
        let ip = [];
        for (var i = 0, len = ipLength; i < len; i += 2) {
            ip.push(
                ((dataView.getInt8(endOffset + i) & 0xff) << 8) |
                    (dataView.getInt8(endOffset + i + 1) & 0xff)
            );
        }
        transaction.ipType = 'v6';
        transaction.ip = ip;
    }

    endOffset += ipLength;

    let strLength = dataView.getInt16(endOffset);

    endOffset += 2;

    transaction.userId =
        strLength > 0 ? dataView.getString(endOffset, strLength) : '';
    endOffset += strLength;

    strLength = dataView.getInt16(endOffset);
    endOffset += 2;

    transaction.guid =
        strLength > 0 ? dataView.getString(endOffset, strLength) : '';
    endOffset += strLength;

    strLength = dataView.getInt16(endOffset);
    endOffset += 2;

    transaction.serviceName =
        strLength > 0 ? dataView.getString(endOffset, strLength) : '';
    endOffset += strLength;

    strLength = dataView.getInt16(endOffset);
    endOffset += 2;

    transaction.txid =
        strLength > 0 ? dataView.getString(endOffset, strLength) : '';
    endOffset += strLength;

    strLength = dataView.getInt16(endOffset);
    endOffset += 2;

    transaction.wmonId =
        strLength > 0 ? dataView.getString(endOffset, strLength) : '';
    endOffset += strLength;

    transaction.async = dataView.getInt16(endOffset);
    endOffset += 1;

    transaction.cicsGeneralCpuTime = dataView.getFloat64(endOffset);
    endOffset += 8;
    transaction.cicsJavaCpuTime = dataView.getFloat64(endOffset);
    endOffset += 8;
    transaction.batchTime = dataView.getFloat64(endOffset);
    endOffset += 8;
    transaction.batchCount = dataView.getInt32(endOffset);
    endOffset += 4;

    return { transaction, endOffset };
};

export const extractFieldsFromTransactionsGroupArray = transactionsGroupArray => {
    const serviceHashList = [],
        serviceNameList = [],
        guidsList = [],
        wmonIdList = [],
        userIdsList = [],
        clientIPList = [],
        txidsList = [],
        avgResTimes = [],
        recentResTimes = [],
        maxResTimes = [],
        startTimes = [],
        lastTimes = [],
        sqlTimes = [],
        fetchTimes = [],
        cpuTimes = [],
        errorCounts = [];

    transactionsGroupArray.forEach(transactionsGroup => {
        serviceHashList.push(transactionsGroup.serviceHash);
        serviceNameList.push(transactionsGroup.serviceName);
        guidsList.push(transactionsGroup.guid);
        wmonIdList.push(transactionsGroup.wmonId);
        userIdsList.push(transactionsGroup.userId);
        clientIPList.push(transactionsGroup.ipaddr);
        txidsList.push(transactionsGroup.txidArrayBySid);
        avgResTimes.push(transactionsGroup.averageElapsedTime);
        recentResTimes.push(transactionsGroup.lastElapsedTime);
        maxResTimes.push(transactionsGroup.maxElapsedTime);
        sqlTimes.push(transactionsGroup.averageSqlTime);
        cpuTimes.push(transactionsGroup.averageCpuTime);
        fetchTimes.push(transactionsGroup.averageFetchTime);
        errorCounts.push(transactionsGroup.errorCount); //필요한건가?
        startTimes.push(transactionsGroup.startTime);
        lastTimes.push(transactionsGroup.lastTime);
    });

    return {
        serviceHashList,
        serviceNameList,
        guidsList,
        wmonIdList,
        userIdsList,
        clientIPList,
        txidsList,
        avgResTimes,
        recentResTimes,
        maxResTimes,
        startTimes,
        lastTimes,
        sqlTimes,
        fetchTimes,
        cpuTimes,
        errorCounts,
    };
};
