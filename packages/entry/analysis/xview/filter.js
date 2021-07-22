import { XViewIPV4Filter } from '@module/chart/model/xview/XViewIPV4Filter';
import { XViewIPV6Filter } from '@module/chart/model/xview/XViewIPV6Filter';
import { ID } from '@common/legacy/ID';
import { OTypeDef } from '@common/definition';

export const filterTransactionsFlat = (rawTransactions, filterFuncList) => {
    return Object.keys(rawTransactions).length > 0
        ? Object.keys(rawTransactions).reduce((acc, domainId) => {
              const transactions = rawTransactions[domainId];
              acc = acc.concat(
                  transactions
                      //아래의 로직으로 인해 힙메모리가 일시적으로 증가하여 GC를 발생시켜 매우 늦은 성능을 확보 할수 밖에 없었다.
                      //기록차원에서 주석처리함.
                      // .map(transaction => {
                      //     return {
                      //         ...transaction,
                      //         sid: Number(domainId),
                      //     };
                      // })
                      .filter(transaction => {
                          return filterFuncList.every(func =>
                              func.call(this, transaction)
                          );
                      })
              );
              return acc;
          }, [])
        : [];
};

export const filterTransactions = (rawTransactions, filterFuncList) => {
    return Object.keys(rawTransactions).length > 0
        ? Object.assign(
              ...Object.keys(rawTransactions).map(domainId => {
                  const transactions = rawTransactions[domainId];

                  return {
                      [domainId]: transactions
                          .map(transaction => {
                              return {
                                  ...transaction,
                                  sid: Number(domainId),
                              };
                          })
                          .filter(transaction => {
                              return filterFuncList.every(func =>
                                  func.call(this, transaction)
                              );
                          }),
                  };
              })
          )
        : {};
};

export const CHECK_ID = filterIdsOnTopbar => {
    return transaction => {
        return (
            filterIdsOnTopbar.findIndex(id => {
                const { sid, otype, oid } = ID.parse(id);
                if (otype === OTypeDef.SYSTEM) {
                    return (
                        sid === transaction.sid && transaction.sysOid === oid
                    );
                } else {
                    return (
                        sid === transaction.sid &&
                        transaction.bizOids.includes(oid)
                    );
                }
            }) > -1
        );
    };
};
export const CHECK_FOCUS_TIME = (stime, etime) => {
    return transaction => {
        return (
            stime <= transaction.collectTime && transaction.collectTime <= etime
        );
    };
};
export const CHECK_ERROR_CODE = transaction => {
    return transaction.errCode !== 0;
};
export const CHECK_FIELD_INDEXOF_WITH_CONDITION_ARRAY = (
    field,
    conditionArray,
    isExclude = false
) => {
    return transaction => {
        const fieldValue = transaction[field];
        if (fieldValue === undefined) return isExclude;

        const index = conditionArray.findIndex(
            condition => fieldValue.indexOf(condition) > -1
        );

        return index > -1 ? !isExclude : isExclude;
    };
};
export const CHECK_FIELD_EQUALS_WITH_CONDITION_ARRAY = (
    field,
    conditionArray
) => {
    return transaction => {
        const fieldValue = transaction[field];

        if (fieldValue === undefined) return false;

        const index = conditionArray.findIndex(
            condition => fieldValue === condition
        );

        return index > -1;
    };
};

export const CHECK_COMPARE_TIME_WITH_CONDITION_ARRAY = conditionArray => {
    return transaction => {
        return conditionArray.every(condition => {
            const fieldKey = condition.standardTime;
            const inequality = condition.inequality;
            const valueInTransaction = transaction[fieldKey];

            if (inequality === '=') {
                return valueInTransaction === condition.data;
            } else if (inequality === '<') {
                return valueInTransaction < condition.data;
            } else if (inequality === '<=') {
                return valueInTransaction <= condition.data;
            } else if (inequality === '>') {
                return valueInTransaction > condition.data;
            } else if (inequality === '>=') {
                return valueInTransaction >= condition.data;
            }
        });
    };
};

export const CHECK_WHEN_SELECTED_INDEX_IN_TABLE = selectedIndexArray => {
    return (groupTransaction, groupTransactionIndex) => {
        return selectedIndexArray.includes(groupTransactionIndex);
    };
};
export const CHECK_WHEN_TRANSACTIONS_DRAG = (
    minYValue,
    maxYValue,
    startTime,
    endTime,
    yAxisInGroupTab
) => {
    return (transaction, transactionIndex) => {
        const unitTime = transaction.collectTime;
        const yValue = transaction[yAxisInGroupTab];
        return (
            yValue >= minYValue &&
            yValue <= maxYValue &&
            unitTime >= startTime &&
            unitTime <= endTime
        );
    };
};

export const CHECK_WHEN_GROUP_BY_DRAG = (
    minYValue,
    maxYValue,
    startTime,
    endTime,
    yAxisInGroupTab
) => {
    return (groupTransaction, groupTransactionIndex) => {
        const unitTime = groupTransaction.lastTime;
        const yValue = groupTransaction[yAxisInGroupTab];
        return (
            yValue >= minYValue &&
            yValue <= maxYValue &&
            unitTime >= startTime &&
            unitTime <= endTime
        );
    };
};

export const CHECK_IP_LIST = ipFilterList => {
    return transaction => {
        if (transaction.ip === undefined) return false;

        const index = ipFilterList.findIndex(
            ipFilter =>
                ipFilter.getIPType() === transaction.ipType &&
                ipFilter.checkIP(transaction.ip)
        );

        return index > -1;
    };
};

export const MAKE_IP_FILTER_LIST = ipList => {
    return ipList.map(ip =>
        ip.indexOf('.') > -1 ? new XViewIPV4Filter(ip) : new XViewIPV6Filter(ip)
    );
};
