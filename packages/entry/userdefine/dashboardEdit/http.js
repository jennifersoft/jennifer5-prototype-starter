import axios from '@library/axios';

export const loadMetrics = async type => {
    const url = '/metrics/' + type;

    return await axios.get(url);
};

export const loadMenuList = async dashboardOrRealtime => {
    const url = '/menu/accessbleList?format=json&type=' + dashboardOrRealtime;

    return await axios.get(url);
};

export const loadDashboardData = async subUrl => {
    const url = '/script/data' + subUrl + '.json';

    return await axios.get(url);
};

export const loadGroupList = async () => {
    const url = '/group/list';

    return await axios.get(url);
};

export const getAccessByMetrics = async (type, metrics) => {
    const url = '/metrics/access?type=' + type + '&mxid=' + metrics;

    //access
    //0: isRealtimeInclude, 1: isStandardInclude, 2: isDomainInclude
    return await axios.get(url);
};

export const loadPluginList = async () => {
    const url = '/menu/accessbleList?type=labs';

    return await axios.get(url);
};

export const readDashboard = async dashboardKey => {
    let url = '/userdefine/dashboard/read?key=' + dashboardKey;

    return await axios.get(url);
};

//데이터 량이 많아서 formData를 사용함.
export const saveDashboard = async params => {
    const url = '/userdefine/dashboard/save';
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        formData.append(
            key,
            params[key] instanceof Object
                ? JSON.stringify(params[key])
                : params[key]
        );
    });

    return await axios.post(url, formData);
};

export const deleteDashboard = async params => {
    const url = '/userdefine/dashboard/delete';

    return await axios.post(url, null, { params: params });
};
