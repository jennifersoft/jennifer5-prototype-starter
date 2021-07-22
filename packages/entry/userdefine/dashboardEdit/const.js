import { MxDef } from '@common/definition';

export const TOPBAR_TYPES = {
    NONE: 'none',
    DOMAIN_INSTANCE_SINGLE: 'domain_instance_single',
    DOMAIN_INSTANCE_MULTI: 'domain_instance_multi',
};

export const CHART_TYPE_ON_UI = {
    GENERAL: 'general',
    CUSTOM: 'custom',
    FRONT: 'front',
};

export const TOOL_TYPE_ON_UI = {
    TEXT: 'text',
    IFRAME: 'iframe',
    PLUGIN: 'plugin',
};

export const INSERT_TYPE_ON_UI = {
    ...CHART_TYPE_ON_UI,
    ...TOOL_TYPE_ON_UI,
};

export const CUSTOM_CHART_TYPE = {
    LIST: 'list',
    XVIEW: 'xview',
    XVIEW_DASHBOARD: 'xview.dashboard',
    EVENT: 'event',
    SPEEDHORIZON: 'speedhorizon',
    SPEEDVERTICAL: 'speedvertical',
    SCOREBOARD: 'scoreboard',
    LINECOMPARE: 'line.compare',
};

export const GRID_COUNT = {
    ROW: 60,
    COLUMN: 60,
    ROW_PERCENT: (1 / 60) * 100,
    COLUMN_PERCENT: (1 / 60) * 100,
};

export const COMPONENT_RESIZE = {
    START_X_UPDATE: 0,
    START_Y_UPDATE: 1,
    END_X_UPDATE: 2,
    END_Y_UPDATE: 3,
};

export const COMPONENT_MOVE = {
    RIGHT: 0,
    LEFT: 1,
    UP: 2,
    DOWN: 3,
};

export const PERCENTAGE_METRICS = [
    MxDef.gc_time_usage,
    MxDef.heap_usage,
    MxDef.sys_mem_rate,
    MxDef.max_sys_mem_rate,
    MxDef.proc_cpu,
    MxDef.sys_cpu,
    MxDef.max_proc_cpu,
    MxDef.max_sys_cpu,
];

export const IMPORTABLE_REALTIMEMENU_URL = [
    '/realtime/dbConnection',
    '/realtime/dbsql',
    '/realtime/memory',
    '/realtime/systemResource',
    '/realtime/user',
];
