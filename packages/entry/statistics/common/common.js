import { MxDef } from '@common/definition';

export const DEFAULT_CHECKED_METRICS = [
    MxDef.service_count,
    MxDef.service_time,
    MxDef.service_rate,
    MxDef.max_tps,
    MxDef.concurrent_user,
    MxDef.event_count,
    MxDef.error_count,
    MxDef.visit_day,
    MxDef.visit_hour,
];

export const COLUMN_CHART_METRICS = [
    MxDef.gc_count,
    MxDef.file_count,
    MxDef.collection_count,
    MxDef.socket_count,
    MxDef.service_count,
    MxDef.service_err_count,
    MxDef.service_slow_count,
    MxDef.event_normal_count,
    MxDef.event_warning_count,
    MxDef.event_fatal_count,
    MxDef.event_count,
    MxDef.error_count,
    MxDef.sql_count,
    MxDef.externalcall_count,
    MxDef.fetch_count,
    MxDef.frontend_measure_count,
    MxDef.average_db_pool_active_count,
    MxDef.average_db_pool_idle_count,
    MxDef.average_db_pool_configured_count,
    MxDef.max_db_pool_active_count,
];

export const PAGE_TYPE = {
    DAILY: 1,
    MONTHLY: 2,
    PERIOD: 3,
};
