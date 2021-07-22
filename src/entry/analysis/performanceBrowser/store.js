import { getDayjs, serverDateFormat } from '@common/base';
import vuestore from '@vuejs/vuex/store';
import { LicenseStatusDef, OTypeDef } from '@common/definition';
import { ElementManager } from '@common/legacy/ElementManager';
import axios from '@library/axios';
import { ClientUtilities } from '@common/legacy/ClientUtilities';

vuestore.registerModule('performancebrowser', {
    namespaced: true,
    state: {
        chartOnlyLayout: false,
        selected: {
            periodDays: 1,
            dayjs: getDayjs(),
            tab: 'instance',
            target: {
                grouped: {},
                length: 0,
                names: undefined,
            },
            metric: undefined,
        },
        selectedLineKey: undefined,
        chart: undefined,
        preferDotCount: 300,
        //선택된 대상 정보
        //선택된 매트릭스
        loadingData: false,

        searchConditionQueue: [],
        focusTimeStack: [],
    },
    mutations: {
        toggleChartOnlyLayout(state) {
            state.chartOnlyLayout = !state.chartOnlyLayout;
        },
        configurePeriodDays(state, periodDays) {
            state.selected = Object.assign(state.selected, {
                periodDays: periodDays,
            });
        },
        configureSelectedDayjs(state, dayjs) {
            state.selected = Object.assign(state.selected, { dayjs: dayjs });
        },
        configureTab(state, type) {
            state.selected = Object.assign(state.selected, { tab: type });
        },
        configureTarget(state, target) {
            state.selected = Object.assign(state.selected, { target: target });
        },
        configureMetric(state, metric) {
            state.selected = Object.assign(state.selected, {
                metric: metric,
            });
        },
        configureChart(state, chart) {
            state.chart = chart;
        },
        changeLoadingData(state, loadingData) {
            state.loadingData = loadingData;
        },
        removeCondition: (state, key) => {
            state.searchConditionQueue = state.searchConditionQueue.filter(
                item => item.key !== key
            );

            if (state.selectedLineKey === key) {
                state.chart.lineSelectByDom(undefined);
                state.selectedLineKey = undefined;
            }
        },
        clearSearchConditionQueue: state => {
            state.searchConditionQueue = [];
            state.chart.lineSelectByDom(undefined);
            state.selectedLineKey = undefined;

            const modelGroup = state.chart?.getModel();
            modelGroup.clear();
            // modelGroup.cmdMap.dataKeys = [];
        },
        selectLineKey(state, key) {
            state.selectedLineKey = key;
        },

        appendFocusTimeStack: (state, focusTime) => {
            state.focusTimeStack.push(focusTime);
        },

        popFocusTimeStack: state => {
            state.focusTimeStack.pop();
        },

        clearFocusTimeStack: state => {
            state.focusTimeStack = [];
        },
    },
    getters: {
        searchTimes: state => {
            const startDayjs = state.selected.dayjs;
            const etime = startDayjs
                .add(state.selected.periodDays, 'day')
                .valueOf();
            return [startDayjs.valueOf(), etime];
        },
        preferDotCount: state => {
            return Math.floor(state.chart?.getContentWidth() / 3);
        },
        focusTimeRange: state => {
            return state.focusTimeStack.length > 0
                ? Object.assign(
                      {},
                      state.focusTimeStack[state.focusTimeStack.length - 1]
                  )
                : undefined;
        },
    },
    actions: {
        addConditionIfSelectedMetricWhenSelectTarget: (context, target) => {
            context.commit('configureTarget', target);
            if (context.state.selected.metric)
                context
                    .dispatch('appendConditionAndFetchData')
                    .then(r => context.state.chart.paintChart());
        },
        addConditionIfSelectedTargetWhenSelectMetric: (context, metric) => {
            context.commit('configureMetric', metric);
            if (context.state.selected.target)
                context
                    .dispatch('appendConditionAndFetchData')
                    .then(r => context.state.chart.paintChart());
        },
        changePeriodDays: ({ state, commit }, periodDays) => {
            commit('configurePeriodDays', periodDays);
            commit('configureTarget', undefined);
            commit('configureMetric', undefined);
            commit('clearSearchConditionQueue');

            state.chart.setRange(0, ClientUtilities.ONE_DAY * periodDays);

            state.chart.paintChart();
        },
        changeDayjs: ({ state, commit }, dayjs) => {
            commit('configureSelectedDayjs', dayjs);
            commit('configureTarget', undefined);
            commit('configureMetric', undefined);
        },
        removeCondition: ({ state, commit }, key) => {
            commit('removeCondition', key);

            const modelGroup = state.chart?.getModel();
            modelGroup.remove(key);

            state.chart?.paintChart();
        },
        downloadChartData: ({ state }, { key, fileName, i18n }) => {
            const model = state.chart?.getModel()?.models[key];

            let csv = '';
            const columnArray = [];
            columnArray.push(i18n.time);
            columnArray.push(i18n.value);

            csv += columnArray.join(',') + '\n';

            //-- 현재 데이터 내보내기 시작 --//
            var units = model.getValues();
            for (var i = 0, len = units.length; i < len; i++) {
                var dataArray = [];

                dataArray.push(
                    getDayjs(units[i].time).format(serverDateFormat.longWithSec)
                );
                dataArray.push(units[i].value.toShortForAries());

                csv += dataArray.join(',') + '\n';
            }

            const _form = document.createElement('form');
            _form.id = 'form_csv';
            _form.method = 'post';
            _form.action = '/file/download/csv';

            const _name = document.createElement('input');
            _name.name = 'name';
            _name.value = fileName;
            const _csv = document.createElement('textarea');
            _csv.name = 'csv';
            _csv.value = csv;

            _form.appendChild(_name);
            _form.appendChild(_csv);
            document.body.appendChild(_form);

            _form.submit();
            _form.remove();
        },
        downloadRawData: ({ state }, { key, fileName }) => {
            const condition = state.searchConditionQueue.find(
                queue => queue.key === key
            );
            const param = {
                name: fileName,
                sid: condition.sid,
                oid: condition.oid,
                otype: condition.otype,
                mxid: condition.mxid,
                stime: condition.stime,
                etime: condition.etime,
                dateFormat: serverDateFormat.longWithSec,
            };

            const _form = document.createElement('form');
            _form.id = 'form_csv';
            _form.method = 'post';
            _form.action = '/download/raw';

            Object.entries(param).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.name = key;
                input.value = value;
                _form.appendChild(input);
            });

            document.body.appendChild(_form);

            _form.submit();
            _form.remove();
        },
        appendConditionAndFetchData: async ({ state, getters, dispatch }) => {
            const searchTimes = getters.searchTimes;
            //oid가 -1 이라면 도메인이다.
            const condition = {
                stime: searchTimes[0],
                etime: searchTimes[1],
                sid: state.selected.target.sid,
                otype:
                    state.selected.tab === 'business'
                        ? OTypeDef.BUSINESS
                        : OTypeDef.SYSTEM,
                oid:
                    state.selected.target.oid === -1
                        ? 0
                        : state.selected.target.oid,
                mxid: Number(state.selected.metric.value),
            };

            condition.key = Object.values(condition).join('');
            //이미 등록된 조회조건이라면 등록하지 않는다.
            if (
                state.searchConditionQueue.find(
                    queue => queue.key === condition.key
                )
            )
                return;

            const modelGroup = state.chart?.getModel();

            const agent = ElementManager.createInstance(
                {
                    agent: condition.key,
                    id: condition.key,
                    license_status: LicenseStatusDef.RUNNING,
                },
                state.searchConditionQueue.length
            );
            const perfModel = modelGroup.getPerfModel(agent, state.chart);

            perfModel.setRange(condition.stime, condition.etime);
            //아래 3개는 필요한것인가?
            perfModel.setDatetime(condition.stime);
            // perfModel.datakey(sid, otype, metrics, oid);
            // modelGroup.cmdMap.dataKeys.push(agent.oid());

            const color = agent?.color();
            const transparentColor = agent?.color().copy();
            transparentColor.setAlpha(0.5);
            condition.displayOption = {
                domainName: state.selected.target.domainName,
                shortName: state.selected.target.shortName,
                metricName: state.selected.metric.label,
                switchButtonColor: color.toString(),
                switchColor: transparentColor.toString(),
                agent: agent,
                model: perfModel,
            };

            state.searchConditionQueue.push(condition);

            await dispatch('fetchOneData', {
                condition: Object.assign({}, condition),
                model: perfModel,
            });
        },

        reloadDataWhenChangeTime: async ({ state, commit, dispatch }) => {
            commit('changeLoadingData', true);
            await Promise.all(
                state.searchConditionQueue.map(async condition => {
                    const model = condition.displayOption.model;
                    await dispatch('fetchOneData', {
                        condition: Object.assign({}, condition, {
                            stime: model.range.stime,
                            etime: model.range.etime,
                        }),
                        model: model,
                    });
                })
            );
            commit('changeLoadingData', false);
            state.chart.paintChart();
        },
        fetchOneData: async ({ state, getters }, { condition, model }) => {
            condition.format = 'json';
            condition.preferDotCount = getters.preferDotCount;
            delete condition.key;
            delete condition.displayOption;

            const urlSearchParams = new URLSearchParams(condition);

            const url = '/analysis/performance?' + urlSearchParams.toString();

            const responseAxios = await axios.get(url);
            const jsonByDay = responseAxios.data;
            const dotsArray = jsonByDay.dots;

            const intervalSec = jsonByDay.interval / 1000;
            state.chart.setIntervalSec(intervalSec);

            model.setValues(dotsArray);
        },

        loadMetrics: async ({ state }, type) => {
            const url = '/metrics/avg_max/' + type;

            return await axios.get(url);
        },
    },
});

export default vuestore;
