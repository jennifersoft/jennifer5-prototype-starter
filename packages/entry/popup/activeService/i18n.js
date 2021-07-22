import { i18n } from '@common/utility';

export default {
    name: i18n.get('ui.label.name'),
    apply: i18n.get('ui.label.apply'),
    cancel: i18n.get('ui.label.cancel'),
    runBuildAndPlan: i18n.get('ui.label.runBuilldAndPlan'),
    notCollected: i18n.get('ui.en.notCollected'),
    linkToSherpaOracle: i18n.get('ui.label.linkToSherpaOracle'),
    inlineParam: i18n.get('ui.label.inlineParam'),
    boundParam: i18n.get('ui.label.boundParam'),
    activeServiceCount: i18n.get('ui.label.activeServiceCount'),
    rate: i18n.get('ui.label.rate'),
    unknown: i18n.get('ui.label.unknown'),

    autoRefresh: i18n.get('ui.label.autoRefresh'),
    activeService: i18n.get('ui.title.activeService'),
    activeSql: i18n.get('ui.label.activeSql'),
    activeTxcall: i18n.get('ui.label.activeTxcall'),
    serviceDump: i18n.get('ui.button.servicedump'),
    second: i18n.get('ui.label.unit.sec'),
    manageTableColumns: i18n.get('ui.label.manageTableColumns'),
    more: i18n.get('ui.label.more'),
    export: i18n.get('ui.button.export'),

    domain: i18n.get('ui.label.domain'),
    instance: i18n.get('ui.label.instance'),
    business: i18n.get('ui.label.business'),
    clientIp: i18n.get('ui.label.clientIp'),
    statusPerformTime: i18n.get('ui.label.status.performTime'),
    performTime: i18n.get('ui.label.performTime'),
    cpu: i18n.get('ui.label.cpu'),
    ms: i18n.get('ui.label.unit.ms'),
    sqlCount: i18n.get('ui.label.sqlCount'),
    fetchCount: i18n.get('ui.label.fetchCount'),
    application: i18n.get('ui.label.application'),
    applicationAlias: i18n.get('ui.label.applicationAlias'),
    connectionString: i18n.get('ui.label.connectionString'),
    jndiAndDBName: i18n.get('ui.label.jndiAndDBName'),
    txCall: i18n.get('ui.label.txCall'),
    sql: i18n.get('ui.label.sql'),
    startTime: i18n.get('ui.label.startTime'),
    batchCount: i18n.get('ui.label.batchCount'),
    batchTime: i18n.get('ui.label.batchTime'),

    txid: i18n.get('ui.label.txid'),
    asyncCallerId: i18n.get('ui.label.asyncCallerId'),

    total: i18n.get('ui.label.total'),
    summary: i18n.get('ui.label.summary'),
    showSql: i18n.get('ui.label.showSql'),
    showTxcall: i18n.get('ui.label.showTxcall'),
    show: i18n.get('ui.label.show'),
    status: i18n.get('ui.label.status'),
    M0050: i18n.get('M0050'),

    activeServiceStatus: {
        DB_CONNECTED: i18n.get('ui.en.activeService.db_connected'),
        DB_CONNECTING: i18n.get('ui.en.activeService.db_connecting'),
        DB_CONNECTION_CLOSED: i18n.get(
            'ui.en.activeService.db_connection_closed'
        ),
        DB_PREPARING: i18n.get('ui.en.activeService.db_preparing'),
        DB_RESULTSET_CLOSED: i18n.get(
            'ui.en.activeService.db_resultset_closed'
        ),
        DB_RESULTSET_FALSE: i18n.get('ui.en.activeService.db_resultset_false'),
        DB_RESULTSET_OPEN: i18n.get('ui.en.activeService.db_resultset_open'),
        DB_STATEMENT_CLOSED: i18n.get(
            'ui.en.activeService.db_statement_closed'
        ),
        DB_STATEMENT_OPEN: i18n.get('ui.en.activeService.db_statement_open'),
        END_RECURSIVE: i18n.get('ui.en.activeService.end_recursive'),
        EXTERNALCALL_EXECUTED: i18n.get(
            'ui.en.activeService.externalcall_executed'
        ),
        EXTERNALCALL_EXECUTING: i18n.get(
            'ui.en.activeService.externalcall_executing'
        ),
        INITIALIZED: i18n.get('ui.en.activeService.initialized'),
        INITIALIZING: i18n.get('ui.en.activeService.initializing'),
        REJECTED: i18n.get('ui.en.activeService.rejected'),
        REJECTING: i18n.get('ui.en.activeService.rejecting'),
        RUN: i18n.get('ui.en.activeService.run'),
        SQL_EXECUTED: i18n.get('ui.en.activeService.sql_executed'),
        SQL_EXECUTING: i18n.get('ui.en.activeService.sql_executing'),
    },
};
