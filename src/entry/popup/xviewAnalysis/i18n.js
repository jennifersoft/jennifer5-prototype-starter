import { i18n } from '@common/utility';

export default {
    // 데이터 없음 관련 메시지
    M0004: i18n.get('M0004'),
    M0632: i18n.get('M0632'),
    confirm: i18n.get('ui.button.confirm'),

    // 로딩 관련 메시지
    M0627: i18n.get('M0627'),
    M0628: i18n.get('M0628'),
    M0629: i18n.get('M0629'),
    M0631: i18n.get('M0631'),
    M0636: i18n.get('M0636'),
    M0258: i18n.get('M0258'),

    // 프로파일 상태 관련 메시지
    M0314: i18n.get('M0314'),
    M0315: i18n.get('M0315'),
    M0316: i18n.get('M0316'),

    // 그룹 테이블 관련 메시지
    application: i18n.get('ui.label.application'),
    averageResponseTime: i18n.get('ui.stats.service.averageResponseTime'),
    recentResponseTime: i18n.get('ui.label.responseTimeRecent'),
    maxResponseTime: i18n.get('ui.stats.service.maxResponseTime'),
    errorCount: i18n.get('ui.label.errorCount'),
    callCount: i18n.get('ui.label.hit'),
    topology: i18n.get('ui.title.topology'),
    cases: i18n.get('ui.label.unit.cases'),
    responseTimeSum: i18n.get('ui.label.responseTimeSum'),

    // 트랜잭션 테이블 관련 메시지
    transactionData: i18n.get('ui.label.transactionData'),
    domainName: i18n.get('ui.label.domain'),
    instanceName: i18n.get('ui.label.instance'),
    bizName: i18n.get('ui.label.business'),
    txid: i18n.get('ui.label.txid'),
    guid: i18n.get('ui.label.guid'),
    ipaddr: i18n.get('ui.label.clientIp'),
    clientIp: i18n.get('ui.label.clientIp'),
    wmonId: i18n.get('ui.label.clientId'),
    clientId: i18n.get('ui.label.clientId'),
    userId: i18n.get('ui.label.userId'),
    networkTime: i18n.get('ui.label.networkTime'),
    frontEndElapsedTime: i18n.get('ui.label.frontEndTime'),
    startDate: i18n.get('ui.label.startDate'),
    startTime: i18n.get('ui.label.startTime'),
    endDate: i18n.get('ui.label.endDate'),
    endTime: i18n.get('ui.label.endTime'),
    collectionTime: i18n.get('ui.label.collectionTime'),
    elapsedTime: i18n.get('ui.label.responseTime'),
    sqlTime: i18n.get('ui.label.sqlTime'),
    txcallTime: i18n.get('ui.label.txcallTime'),
    fetchTime: i18n.get('ui.label.fetchTime'),
    cicsGeneralCpuTime: i18n.get('ui.label.cicsGeneralCpuTime'),
    cicsJavaCpuTime: i18n.get('ui.label.cicsJavaCpuTime'),
    batchCount: i18n.get('ui.label.batchCount'),
    batchTime: i18n.get('ui.label.batchTime'),
    errCode: i18n.get('ui.label.error'),
    serviceName: i18n.get('ui.label.application'),
    multiColumnSort: i18n.get('ui.label.multiColumnSort'),
    manageTableColumns: i18n.get('ui.label.manageTableColumns'),
    profileAutoSearch: i18n.get('ui.label.autoSearch'),
    xviewChartFiltering: i18n.get('ui.label.xviewChartFiltering'),
    exportTransactionRows: i18n.get('ui.button.export'),
    exportProfileAll: i18n.get('ui.label.exportProfiles'),
    filteringCondition: i18n.get('ui.label.filterCondition'),
    viewByTable: i18n.get('ui.label.viewByTable'),
    viewByChart: i18n.get('ui.label.viewByChart'),
    associatedTx: i18n.get('ui.label.associatedTx'),
    jenniferFrontTx: i18n.get('ui.label.jenniferFrontTx'),
    settingETC: i18n.get('ui.label.more'),
    apply: i18n.get('ui.label.apply'),
    save: i18n.get('ui.button.save'),
    cancel: i18n.get('ui.label.cancel'),
    M0305: i18n.get('M0305'),
    M0623: i18n.get('M0623'),

    // 탭 목록 메시지
    timelineAnalysis: i18n.get('ui.label.timelineAnalysis'),
    textAnalysis: i18n.get('ui.label.textAnalysis'),
    sectionAnalysis: i18n.get('ui.label.sectionAnalysis'),
    socket: i18n.get('ui.label.socket'),
    file: i18n.get('ui.label.file'),
    message: i18n.get('ui.label.message'),
    stackTrace: i18n.get('ui.label.stacktrace'),
    cics: i18n.get('ui.en.cics'),
    error: i18n.get('ui.label.error'),
    async: i18n.get('ui.label.async'),
    customLog: i18n.get('ui.label.customLog'),

    // 콜-트리 관련 메시지
    no: i18n.get('ui.en.no'),
    ms: i18n.get('ui.label.unit.ms'),
    profileName: i18n.get('ui.label.profileName'),
    responseTime: i18n.get('ui.label.responseTime'),
    package: i18n.get('ui.label.package'),
    class: i18n.get('ui.label.class'),
    cpuTime: i18n.get('ui.label.cpuTime'),
    api: i18n.get('ui.label.api'),
    parameters: i18n.get('ui.label.params'),
    return: i18n.get('ui.label.return'),

    // 타임라인 관련 메시지
    server: i18n.get('ui.label.server'),
    client: i18n.get('ui.label.client'),
    dom: i18n.get('ui.en.dom'),
    network: i18n.get('ui.en.network'),
    render: i18n.get('ui.en.render'),
    method: i18n.get('ui.en.method'),
    sql: i18n.get('ui.en.sql'),
    externalCall: i18n.get('ui.en.externalcall'),
    batchJob: i18n.get('ui.title.batchjob'),
    detail: i18n.get('ui.label.rule.control.detail'),
    repeatCount: i18n.get('ui.label.repeatCount'),
    selfTimeSum: i18n.get('ui.label.selfTimeSum'),
    selfTimeAverage: i18n.get('ui.label.selfTimeAverage'),
    responseTimeAverage: i18n.get('ui.label.responseTimeAverage'),
    dbConnection: i18n.get('ui.label.dbconnection'),
    showZeroMethod: i18n.get('ui.label.showZeroMethod'),
    showNotProfiled: i18n.get('ui.label.showNotProfiled'),
    showLostProfile: i18n.get('ui.label.showLostProfile'),
    copyData: i18n.get('ui.label.copyData'),
    findTextProfile: i18n.get('ui.label.findTextProfile'),
    methodProfile: i18n.get('ui.label.methodProfile'),
    exceptMethodProfile: i18n.get('ui.label.exceptMethodProfile'),
    classProfile: i18n.get('ui.label.classProfile'),
    exceptClassProfile: i18n.get('ui.label.exceptClassProfile'),
    packageProfile: i18n.get('ui.label.packageProfile'),
    exceptPackageProfile: i18n.get('ui.label.exceptPackageProfile'),
    showClass: i18n.get('ui.label.showClass'),
    txCall: i18n.get('ui.label.txCall'),
    decompileCode: i18n.get('ui.label.decompiledCode'),
    classType: i18n.get('ui.label.classType'),
    disassembleCode: i18n.get('ui.label.disassembledCode'),
    selectAll: i18n.get('ui.label.selectAll'),
    activeProfileSettings: i18n.get('ui.label.activeProfileSettings'),
    showDetailMessage: i18n.get('ui.label.showDetailMessage'),
    showErrorMessage: i18n.get('ui.label.showErrorMessage'),
    M0624: i18n.get('M0624'),
    M0347: i18n.get('M0347'),
    M0348: i18n.get('M0348'),
    M0026: i18n.get('M0026'),

    // CICS 관련 메시지
    cicsTransactionResponseTime: i18n.get('ui.cics.transactionResponseTime'),
    cicsSuspendTime: i18n.get('ui.cics.suspendTime'),
    cicsFirstWaitTime: i18n.get('ui.cics.firstWaitTime'),
    cicsRmiSuspendTime: i18n.get('ui.cics.rmiSuspendTime'),
    cicsJvmSuspendTime: i18n.get('ui.cics.jvmSuspendTime'),
    cicsJvmThreadWaitTime: i18n.get('ui.cics.jvmThreadWaitTime'),
    cicsStartWaitTime: i18n.get('ui.cics.startWaitTime'),
    cicsMroWaitTime: i18n.get('ui.cics.mroWaitTime'),
    cicsDispatchTime: i18n.get('ui.cics.dispatchTime'),
    cicsMvsWaitTime: i18n.get('ui.cics.mvsWaitTime'),
    cicsZiipCpuTime: i18n.get('ui.cics.ziipCpuTime'),
    cicsGcpTime: i18n.get('ui.cics.gcpTime'),
    cicsFieldName: i18n.get('ui.cics.fieldName'),
    cicsMonitoringColumn: i18n.get('ui.cics.monitoringColumn'),
    cicsTransactionName: i18n.get('ui.cics.transactionName'),
    cicsTaskId: i18n.get('ui.cics.taskId'),
    cicsJavaClassCount: i18n.get('ui.cics.javaClassCount'),
    cicsJvmElapsedTime: i18n.get('ui.cics.jvmElapsedTime'),
    cicsMaxTcbDelayTime: i18n.get('ui.cics.maxTcbDelayTime'),
    cicsPthreadWaitTime: i18n.get('ui.cics.pthreadWaitTime'),
    cicsOriginalAbend: i18n.get('ui.cics.originalAbend'),
    cicsCurrentAbend: i18n.get('ui.cics.currentAbend'),
    value: i18n.get('ui.label.value'),
    cicsExecutionCount: i18n.get('ui.cics.executionCount'),
    cicsDb2RequestCount: i18n.get('ui.cics.db2RequestCount'),
    cicsLinkCount: i18n.get('ui.cics.linkCount'),
    cicsFileAccessCount: i18n.get('ui.cics.fileAccessCount'),
    cicsSyncPointCount: i18n.get('ui.cics.syncPointCount'),

    // 스택트레이스 탭 관련 메시지
    summary: i18n.get('ui.label.summary'),
    showDetail: i18n.get('ui.label.detail'),
    setTimeOfAutoStacktrace: i18n.get('ui.label.setTimeOfAutoStacktrace'),
    serviceExternalCall: i18n.get('ui.label.service.externalcall'),
    showIndividual: i18n.get('ui.label.showIndividual'),
    showSql: i18n.get('ui.label.showSql'),
    inlineParam: i18n.get('ui.label.inlineParam'),
    boundParam: i18n.get('ui.label.boundParam'),
    selfTime: i18n.get('ui.label.selfTime'),
    measureCount: i18n.get('ui.label.measureCount'),
    showStacktraceParents: i18n.get('ui.label.showStacktraceParents'),
    runBuildAndPlan: i18n.get('ui.label.runBuilldAndPlan'),
    notCollected: i18n.get('ui.en.notCollected'),
    linkToSherpaOracle: i18n.get('ui.label.linkToSherpaOracle'),
    M0400: i18n.get('M0400'),

    // 기타 탭 관련 메시지
    mode: i18n.get('ui.label.mode'),
    fileName: i18n.get('ui.label.fileName'),
    localIp: i18n.get('ui.label.localIp'),
    remoteIp: i18n.get('ui.label.remoteIpAddress'),
    errorType: i18n.get('ui.label.errorType'),
    relatedProfileNo: i18n.get('ui.label.relatedProfileNo'),
    help: i18n.get('ui.label.help'),
    shareToTalk: i18n.get('ui.button.shareToTalk'),

    // 탭 툴바 관련 메시지
    export: i18n.get('ui.button.export'),
    exportTxt: i18n.get('ui.button.export.txt'),
    exportCsv: i18n.get('ui.button.export.csv'),
    M0378: i18n.get('M0378'),
};