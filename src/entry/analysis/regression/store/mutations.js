const SCROLL_TOP = 550; // 상단 영역에 변화가 있을 경우, 값을 변경해야 함.
const FOLD_SIZE = 398; // 화면 접을 때, 넓어지는 높이

export default {
    updateTargetData: (state, data) => {
        state.domainId = data[0];
        state.instanceOid = data[0] != -1 && data[1] == -1 ? 0 : data[1];
        state.targetName = data[2];
    },
    updatePeriod: (state, period) => {
        state.period = period;
    },
    updateStartHour: (state, startHour) => {
        state.startHour = startHour;
    },
    updateEndHour: (state, endHour) => {
        state.endHour = endHour;
    },
    updateIntervalType: (state, intervalType) => {
        state.intervalType = intervalType;
    },
    updateComparisonType: (state, comparisonType) => {
        state.comparisonType = comparisonType;
    },
    updateSearchTime: (state, searchTime) => {
        state.searchTime = searchTime;
    },
    updateMetricData: (state, data) => {
        state.metricNames = data[0];
        state.metricValues = data[1];
    },
    updateCurrentResource: (state, resource) => {
        state.currentResource = resource;
    },
    updateHeatmapValues: (state, values) => {
        state.heatmapValues = values;
    },

    changeToolbarFold: (state, active) => {
        const scrollHeight = window.innerHeight - SCROLL_TOP;
        state.toolbarFold = active;
        state.scrollHeight = scrollHeight + (active ? FOLD_SIZE : 0);
    },
    resizeScrollHeight: state => {
        state.scrollHeight =
            window.innerHeight -
            SCROLL_TOP +
            (state.toolbarFold ? FOLD_SIZE : 0);
    },
    updateFetching: (state, fetching = true) => {
        state.fetching = fetching;
    },
};
