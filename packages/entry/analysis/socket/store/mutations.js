function eachSocketData(list, callback) {
    for (var i = 0; i < list.length; i++) {
        var localKey = list[i].localport,
            remoteKey = list[i].host + ':' + list[i].port;

        callback(list[i], localKey, remoteKey);
    }
}

function calculateFilterData(list) {
    var result1 = [],
        result2 = [];
    var localCache = {},
        remoteCache = {},
        filterCache = {};

    // 로컬 및 리모트 key 카운트하기
    eachSocketData(list, function(data, localKey, remoteKey) {
        if (!localCache[localKey]) {
            localCache[localKey] = [];
        }

        if (!remoteCache[remoteKey]) {
            remoteCache[remoteKey] = [];
        }

        // 기본 프로퍼티 설정
        data.children = [];
        data.isLocalFilter = false;
        data.isRemoteFilter = false;

        localCache[localKey].push(data);
        remoteCache[remoteKey].push(data);
    });

    // 로컬 필터링하기
    eachSocketData(list, function(data, localKey, remoteKey) {
        if (localCache[localKey].length < 4) {
            data.children = [data];
            result1.push(data);
        } else {
            if (!filterCache[localKey]) {
                data.children = localCache[localKey];
                data.isLocalFilter = true;

                result1.push(data);
                filterCache[localKey] = true;
            }
        }
    });

    // 리모트 필터링하기
    eachSocketData(result1, function(data, localKey, remoteKey) {
        if (data.isLocalFilter) {
            result2.push(data);
        } else {
            if (remoteCache[remoteKey].length < 4) {
                data.children = [data];
                result2.push(data);
            } else {
                if (!filterCache[remoteKey]) {
                    data.children = remoteCache[remoteKey];
                    data.isRemoteFilter = true;

                    result2.push(data);
                    filterCache[remoteKey] = true;
                }
            }
        }
    });

    // JQA-788: 그룹핑이 local 또는 remote 중 한가지로만 적용. 그룹핑 후 예외처리
    result2.forEach(e => {
        if (e.isRemoteFilter) {
            e.isLocalFilter = e.children.every(
                c => c.localport === e.localport
            );
        } else if (e.isLocalFilter) {
            const parentKey = e.host + ':' + e.port;
            e.isRemoteFilter = e.children.every(c => {
                const remoteKey = c.host + ':' + c.port;
                return remoteKey === parentKey;
            });
        }
    });

    return result2;
}

function getSocketCount(isLocalFilter, list) {
    const countCache = {};
    let count = 0;

    eachSocketData(list, (data, localKey, remoteKey) => {
        const key = isLocalFilter ? remoteKey : localKey;

        if (!countCache[key]) {
            countCache[key] = true;
            count += 1;
        }
    });
    return count;
}

export default {
    updateDomain(state, { domainId, instanceOid }) {
        state.domain = {
            ...state.domain,
            sid: domainId,
            oid: instanceOid,
        };
    },
    updateLocalPort(state, localPort) {
        state.filters = {
            ...state.filters,
            localPort,
        };
    },
    updateRemoteIpAddress(state, remoteIpAddress) {
        state.filters = {
            ...state.filters,
            remoteIpAddress,
        };
    },
    updateRemotePort(state, remotePort) {
        state.filters = {
            ...state.filters,
            remotePort,
        };
    },
    updateTableData(state, tableData) {
        state.tableData = calculateFilterData(tableData).map(e => ({
            ...e,
            socketCount: getSocketCount(e.isLocalFilter, e.children),
            succeeded: e.children.filter(c => !!c.stack && !!!c.newstack)
                .length,
            receiving: e.children.filter(c => !!c.newstack).length,
        }));
    },
    updateInnerTableData(state, { key, data, updateChild = true }) {
        state.innerTableData = {
            key,
            data,
        };
        if (updateChild) state.selectedRow = null;
    },
    updateSelectedRow(state, row = null) {
        state.selectedRow = row;
    },
    updateLoading(state, loading) {
        state.loading = loading;
    },
    updateAgentStatus(state, status) {
        state.agentStatus = status;
    },
};
