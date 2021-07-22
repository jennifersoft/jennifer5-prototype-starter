import { OTypeDef, RemoteCallTypeDef } from '@common/definition';

export default {
    activeTab: 'APPLICATION',
    domainIds: [],
    instanceOids: [],
    otype: OTypeDef.SYSTEM,
    isFromBatchJobDomain: false,
    dataSourceName: '',

    isIncoming: false,
    isOutgoing: false,
    isGroupNode: false,
    existReverse: false,
    sourceDomainId: -1,
    sourceInstanceOid: -1,
    sourceInfoList: '',
    targetDomainId: -1,
    targetInstanceOid: -1,
    targetRemoteCallType: RemoteCallTypeDef.CUSTOM,
    targetCustomMethodDescHash: 0,
    targetIpAddress: '',
    targetPort: 0,
    targetInfoList: '',

    filteredData: [],
    columnMenus: [],

    scoreRanges: {
        info: 3000,
        warn: 6000,
        fatal: 8000,
    },
    scoreValues: {
        info: 0,
        warn: 0,
        fatal: 0,
        normal: 0,
    },

    useServiceDump: false,
    tableKey: 1,
    tableHeight: 460,

    useSummaryMode: false,
};
