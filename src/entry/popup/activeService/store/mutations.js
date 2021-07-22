import { OTypeDef } from '@common/definition';

export default {
    loadParameters(state, params) {
        state.activeTab =
            params.defaultTab === '' ? 'APPLICATION' : params.defaultTab;

        state.domainIds = params.domainIds.map(id => parseInt(id));
        state.instanceOids = params.instanceOids;
        state.otype = params.otype;

        state.isFromBatchJobDomain = params.isFromBatchJobDomain;
        state.dataSourceName = params.dataSourceName;

        state.isIncoming = params.isIncoming;
        state.isOutgoing = params.isOutgoing;
        state.isGroupNode = params.isGroupNode;
        state.existReverse = params.existReverse;
        state.sourceDomainId = params.sourceDomainId;
        state.sourceInstanceOid = params.sourceInstanceOid;
        state.sourceInfoList = params.sourceInfoList;
        state.targetDomainId = params.targetDomainId;
        state.targetInstanceOid = params.targetInstanceOid;
        state.targetRemoteCallType = params.targetRemoteCallType;
        state.targetCustomMethodDescHash = params.targetCustomMethodDescHash;
        state.targetIpAddress = params.targetIpAddress;
        state.targetPort = params.targetPort;
        state.targetInfoList = params.targetInfoList;

        state.useServiceDump = state.instanceOids.length === 1;
    },
    changeActiveTab(state, tab) {
        state.activeTab = tab;
    },
    updateScoreRanges(state, payload) {
        state.scoreRanges = {
            info: payload.range1,
            warn: payload.range2,
            fatal: payload.range3,
        };
    },
    updateScoreValues(state) {
        const type = state.activeTab.toUpperCase();
        const scoreValues = {
            info: 0,
            warn: 0,
            fatal: 0,
            normal: 0,
        };

        state.filteredData.forEach(row => {
            const time =
                type === 'APPLICATION' ? row.elapsedTime : row.runningTime;

            if (time > state.scoreRanges.fatal) scoreValues.fatal += 1;
            else if (time > state.scoreRanges.warn) scoreValues.warn += 1;
            else if (time > state.scoreRanges.info) scoreValues.info += 1;
            else scoreValues.normal += 1;
        });

        state.scoreValues = scoreValues;
    },
    updateActiveServiceList(state, list) {
        const type = state.activeTab.toUpperCase();
        let result = [];

        if (type === 'EXTERNALCALL') {
            result = list.filter(row => row.runningMode === type);
        } else if (type === 'SQL') {
            result = list
                .filter(row => row.runningMode === type)
                .map(row => {
                    const jndiAndDb =
                        row.runningDataSourceName || row.runningConnectionName;
                    const isContinue =
                        state.dataSourceName !== '' &&
                        state.dataSourceName !== jndiAndDb;

                    return {
                        ...row,
                        jndiAndDb:
                            !isContinue && jndiAndDb === ''
                                ? 'Not Supported Agent'
                                : jndiAndDb,
                    };
                });
        } else {
            result = list.map(row => {
                return {
                    ...row,
                    jndiAndDb: '',
                };
            });
        }

        if (state.otype === OTypeDef.BUSINESS) {
            const bizOid = state.instanceOids[0];

            result = result.filter(
                row =>
                    Array.isArray(row.bizOids) && row.bizOids.includes(bizOid)
            );
        }

        state.filteredData = result.map(row => {
            const time =
                type === 'APPLICATION' ? row.elapsedTime : row.runningTime;

            let scoreType = 'normal';
            if (time > state.scoreRanges.fatal) scoreType = 'fatal';
            else if (time > state.scoreRanges.warn) scoreType = 'warn';
            else if (time > state.scoreRanges.info) scoreType = 'info';

            return {
                scoreType,
                ...row,
            };
        });
    },
    updateColumnMenus(state, menus) {
        state.columnMenus = menus;
    },
    toggleUseServiceDump(state, active) {
        state.useServiceDump = active;
    },
    calculateTableHeight(state) {
        const useTopBar =
            !state.isIncoming && !state.isOutgoing && !state.isGroupNode;
        const dist = useTopBar ? 317 : 285;
        state.tableHeight = window.innerHeight - dist;
    },
    increaseTableKey(state, isSummary) {
        state.tableKey += 1;
        state.useSummaryMode = isSummary;
    },
};
