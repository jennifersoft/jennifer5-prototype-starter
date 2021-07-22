import vuestore from '@vuejs/vuex/store';
import { state } from './store/state';
import { getters } from './store/getters';
import { mutations } from './store/mutations';
import { mutations as mutations_modal } from './store/mutations.modal';
import { actions } from './store/actions';

import AlertWindow from '@vuejs/component/window/AlertWindow';
import ConfirmWindow from '@vuejs/component/window/ConfirmWindow';
import TopBar from './component/TopBar';
import EditorTitle from './component/EditorTitle';
import TableOfContents from './component/TableOfContents';
import TemplateSetting from './component/modal/TemplateSetting';
import ManualBuild from './component/modal/ManualBuild';
import ChartChoice from './component/modal/ChartChoice';
import TableChoice from './component/modal/TableChoice';
import LineChartMetrics from './component/modal/chart/LineChartMetrics';
import LineChartMetricsSummary from './component/modal/chart/LineChartMetricsSummary';
import LineChartMetricsComparison from './component/modal/chart/LineChartMetricsComparison';
import BarChartMetrics from './component/modal/chart/BarChartMetrics';
import BarChartEvent from './component/modal/chart/BarChartEvent';
import BarChartError from './component/modal/chart/BarChartError';
import PieChartMetrics from './component/modal/chart/PieChartMetrics';
import PieChartEvent from './component/modal/chart/PieChartEvent';
import PieChartError from './component/modal/chart/PieChartError';
import TableMetrics from './component/modal/table/TableMetrics';
import TableMetricsComparePivot from './component/modal/table/TableMetricsComparePivot';
import TableMetricsSummary from './component/modal/table/TableMetricsSummary';
import TableMetricsSummaryMultidomain from './component/modal/table/TableMetricsSummaryMultidomain';
import TableDiskUsage from './component/modal/table/TableDiskUsage';
import TableMetricsTopN from './component/modal/table/TableMetricsTopN';
import TableServiceTopN from './component/modal/table/TableServiceTopN';
import TableEvent from './component/modal/table/TableEvent';
import TableError from './component/modal/table/TableError';
import TableErrorCountRate from './component/modal/table/TableErrorCountRate';
import TableEventTopN from './component/modal/table/TableEventTopN';
import TableErrorTopN from './component/modal/table/TableErrorTopN';
import TableErrorApplicationTopn from './component/modal/table/TableErrorApplicationTopn';

vuestore.registerModule('template', {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
});

vuestore.registerModule('template/modal', {
    namespaced: true,
    mutations_modal,
});

export const store = vuestore;

export const components = {
    AlertWindow,
    ConfirmWindow,
    TopBar,
    EditorTitle,
    TableOfContents,
    TemplateSetting,
    ManualBuild,
    ChartChoice,
    TableChoice,
    LineChartMetrics,
    LineChartMetricsSummary,
    LineChartMetricsComparison,
    BarChartMetrics,
    BarChartEvent,
    BarChartError,
    PieChartMetrics,
    PieChartEvent,
    PieChartError,
    TableMetrics,
    TableMetricsComparePivot,
    TableMetricsSummary,
    TableMetricsSummaryMultidomain,
    TableDiskUsage,
    TableMetricsTopN,
    TableServiceTopN,
    TableEvent,
    TableError,
    TableErrorCountRate,
    TableEventTopN,
    TableErrorTopN,
    TableErrorApplicationTopn,
};
