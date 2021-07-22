export const mutations = {
    selectDomain: (state, domain) => {
        state.domainId = domain.id;
        state.domainName = domain.name;
    },

    setPeakData: (state, peakData) => {
        Object.assign(state.peakData, peakData);
    },

    setTotalData: (state, totalData) => {
        state.totalData.today = totalData.totalDaily[0];

        state.totalData.total = totalData.total;

        state.totalData.chartHour = totalData.chartHour;
        state.totalData.chart5Min = totalData.chart5Min;
    },

    setTotalDataListInMonth: (state, totalDataListInMonth) => {
        state.totalDataListInMonth = totalDataListInMonth;
    },

    setSummaryData: (state, summaryData) => {
        state.summaryData.operateTime = summaryData.daily;
        state.summaryData.peakTime = summaryData.peaktime;
    },

    setSummaryDataInMonthly: (state, summaryDataInMonthly) => {
        state.summaryDataInMonthly.chart = summaryDataInMonthly.chart;
        state.summaryDataInMonthly.peakday = summaryDataInMonthly.peakday;
    },

    setDetailData: (state, detailData) => {
        state.detailData = detailData;
    },

    setDetailChartData: (state, chartData) => {
        state.detailData = {
            ...state.detailData,
            chart: chartData,
        };
    },

    setDetailTableData: (state, tableData) => {
        state.detailData = {
            ...state.detailData,
            table: tableData,
        };
    },

    appendErrorData: (state, errorData) => {
        if (errorData.length > 0) {
            const cache = {};
            errorData.forEach(e => {
                if (!cache[e.name]) Object.assign(cache, { [e.name]: [e] });
                else cache[e.name].push(e);
            });
            state.errorData = state.searchCondition.checkedTargetList
                .filter(e => !!cache[e.label])
                .map(e => cache[e.label])
                .flat();
        }
    },

    clearErrorData: state => {
        state.errorData = [];
    },

    configureSearchCondition: (state, searchCondition) => {
        state.searchCondition = searchCondition;
    },

    configureSearchTimeInDaily: (state, searchTimeInDaily) => {
        state.searchTimeInDaily = searchTimeInDaily;
    },

    configureSearchTimeInMonthly: (state, searchTimeInMonthly) => {
        state.searchTimeInMonthly = searchTimeInMonthly;
    },

    configureSearchTimeInPeriod: (state, searchTimeInPeriod) => {
        state.searchTimeInPeriod = searchTimeInPeriod;
    },

    configureDetailConditionByTarget: (state, detailConditionByTarget) => {
        state.detailConditionByTarget = detailConditionByTarget;
    },

    updateLoading: (state, loading = true) => {
        state.loading = loading;
    },

    updateProgressForErrorData: (state, progress = 0) => {
        state.progressForErrorData = progress;
    },
};
