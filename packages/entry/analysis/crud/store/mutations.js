import { OTypeDef } from '@common/definition';

export default {
    updateDomainId(state, domainId) {
        state.domainId = domainId;
    },

    resetCrudData(state) {
        state.crudData = [];
        state.filteredCrudData = [];
    },
    updateCrudData(state, crudData) {
        const newCrudData = {};

        // 하나의 배열로 데이터를 중복없이 합치기
        for (let i = 0; i < crudData.length; i++) {
            const obj = crudData[i];

            for (let key in crudData[i]) {
                // 기본 값 설정
                if (!newCrudData[key]) {
                    newCrudData[key] = obj[key];
                    newCrudData[key].crudKey = {};

                    state.crudData.push({
                        service: key,
                        table: newCrudData[key].tableToOperationSet,
                        func: newCrudData[key].functionSet,
                        crudKey: newCrudData[key].crudKey,
                    });
                }

                const prevCrud = newCrudData[key];
                const nextCrud = obj[key];

                // 함수 관련 데이터 추가
                for (let j = 0; j < nextCrud.functionSet.length; j++) {
                    if (
                        !prevCrud.functionSet.includes(nextCrud.functionSet[j])
                    ) {
                        prevCrud.functionSet.push(nextCrud.functionSet[j]);
                    }
                }

                // CRUD 테이블 별로 데이터 추가
                for (let key2 in nextCrud.tableToOperationSet) {
                    if (!prevCrud.tableToOperationSet[key2]) {
                        prevCrud.tableToOperationSet[key2] =
                            nextCrud.tableToOperationSet[key2];
                    } else {
                        const prev = prevCrud.tableToOperationSet[key2];
                        const next = nextCrud.tableToOperationSet[key2];

                        for (let k = 0; k < next.length; k++) {
                            if (!prev.includes(next[k])) {
                                prev.push(next[k]);
                            } else {
                                prevCrud.crudKey[next[k]] = true;
                            }
                        }
                    }
                }
            }
        }
    },
    filterCrudData(state) {
        const filteredCrudData = [];

        state.crudData.forEach(data => {
            // 해당 테이블의 CRUD 상태를 가져옴
            const crudStatus = data.table[state.tableFilter];

            if (
                (data.service.indexOf(state.applicationFilter) !== -1 ||
                    state.applicationFilter === '') &&
                (crudStatus || state.tableFilter === '') &&
                (data.func.includes(state.functionFilter) ||
                    state.functionFilter === '')
            ) {
                // 테이블 필터가 적용된 상태에서 CRUD 필터 적용하기
                if (crudStatus) {
                    let isOK = false;
                    for (let i = 0; i < crudStatus.length; i++) {
                        if (state.crudFilter[crudStatus[i]]) {
                            isOK = true;
                            break;
                        }
                    }
                    if (isOK) filteredCrudData.push(data);
                } else {
                    filteredCrudData.push(data);
                }
            }
        });

        state.filteredCrudData = filteredCrudData;
    },

    updateSearchDates(state, dates) {
        state.startDate = dates[0];
        state.endDate = dates[1];
    },
    updateSearchProgress(state, progress) {
        state.searchProgress = progress;
    },
    updateInstanceData(state, data) {
        state.instanceData = data;
    },
    updateBusinessData(state, data) {
        state.businessData = data;
    },
    changeTargetData(state, { resourceType, oidMap }) {
        state.otype =
            resourceType === 'instance' ? OTypeDef.SYSTEM : OTypeDef.BUSINESS;
        state.oidMap = oidMap;
    },
    calculateMainHeight(state) {
        state.mainHeight = window.innerHeight - 290;
    },
    updateTableFilter(state, payload) {
        state.applicationFilter = payload['application'];
        state.tableFilter = payload['table'];
        state.functionFilter = payload['function'];
        state.crudFilter = payload['crud'];
    },
};
