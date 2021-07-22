const getValue = (key, type = 'string', def = '') => {
    const el = document.querySelector(
        type === 'json' ? `textarea[name="${key}"]` : `input[name="${key}"]`
    );
    if (el && el.value) {
        if (type === 'number') return parseInt(el.value);
        else if (type === 'boolean') return el.value === 'true';
        else if (type === 'json') return JSON.parse(el.value);
        return el.value;
    }
    return def;
};

const locale = getValue('serverLocale', 'string', 'ko_KR').replace('_', '-');
const platform = getValue('serverPlatform', 'string', 'java');
const permission = getValue('serverPermission');
const utcOffset = getValue('utcOffset', 'number', 540);
const xviewRangeTimeOnDashboard = getValue(
    'xviewRangeTimeOnDashboard',
    'number',
    600000
);
const xviewCacheMinTimeByDomain = getValue('domainWithCacheLimit', 'json', []);
const tokenWhenUseJenniferFront = getValue('tokenWhenUseJenniferFront');
const defaultRuntimelineMerge = getValue(
    'defaultRuntimelineMerge',
    'boolean',
    false
);
const useAgentTimeForXAxisOnXView = getValue(
    'useAgentTimeForXAxisOnXView',
    'boolean',
    false
);
const reportTalkOnlyAllowPost = getValue(
    'reportTalkOnlyAllowPost',
    'boolean',
    false
);

const language = getValue('userLanguage', 'string', 'ko');
const userId = getValue('userId', 'string', 'root');
const groupId = getValue('userGroupId', 'string', 'admin');
const theme = getValue('userTheme', 'string', 'classic');
const uniqueAccessUrl = getValue('userUniqueAccessUrl');
const expandedDashboardTargetCount = getValue(
    'userCustomDashboardCount',
    'number',
    10
);

const useDomainGroup = getValue('isDomainGroupUsage', 'boolean');
const domainJson = getValue('domainJson', 'json', { domainList: { data: [] } })
    .domainList.data;
const domainListJson = getValue('domainListJson', 'json', {
    domainList: { data: [] },
}).domainList.data;
const domainGroupJson = getValue('domainGroupJson', 'json', {
    domainGroupList: { data: [] },
}).domainGroupList.data;
const activeServiceRange = getValue('activeServiceRange');

export default {
    namespaced: true,
    state: {
        locale,
        platform,
        permission,
        utcOffset,
        xviewRangeTimeOnDashboard,
        useAgentTimeForXAxisOnXView,
        xviewCacheMinTimeByDomain,
        tokenWhenUseJenniferFront,
        defaultRuntimelineMerge,
        reportTalkOnlyAllowPost,
        language,
        userId,
        groupId,
        theme,
        uniqueAccessUrl,
        expandedDashboardTargetCount,
        useDomainGroup,
        domainJson,
        domainListJson,
        domainGroupJson,
        activeServiceRange,
    },
    mutations: {
        // TODO: 사용자 관련 설정 변경시 여기에 추가하기
    },
    actions: {
        // TODO: 사용자 관련 설정 변경시 여기에 추가하기
    },
};
