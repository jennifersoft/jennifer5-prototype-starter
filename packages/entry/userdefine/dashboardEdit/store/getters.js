import { TOPBAR_TYPES } from '@entry/userdefine/dashboardEdit/const';
import { components } from '@entry/template/edit/vue';

export const getters = {
    notUseTopbarInDashboard: state => {
        return state.topbar === TOPBAR_TYPES.NONE;
    },

    maxZIndex: state => {
        const zIndexArray = Object.values(state.components)
            .map(component => component.zIndex)
            .filter(zIndex => Number.isInteger(zIndex));

        return zIndexArray.length > 0 ? Math.max(...zIndexArray) : 20;
    },

    nextZIndex: (state, getters) => {
        return getters.maxZIndex >= 1000 || isNaN(getters.maxZIndex)
            ? 20
            : getters.maxZIndex + 1;
    },

    selectedInsertTypeOnUI: state => {
        return state.selectedInsertTypeOnUI;
    },

    getCellOptionFromCellIndex: state => {
        const cellIndex = state.editingCellOptionOnScoreBoard.cellIndex;
        if (cellIndex !== undefined) {
            const cellOptions =
                state.editingChartOptions.cellConfigureArray[cellIndex];

            if (cellOptions && cellOptions !== 'null') return cellOptions;
        }

        return undefined;
    },

    hideWhenChartDontNeed: state => {
        return state.editingChartOptions.charttype === 'line.compare';
    },

    chartComponents: state => {
        return Object.values(state.components).filter(
            component => component.charttype !== undefined
        );
    },

    textComponents: state => {
        return Object.values(state.components).filter(
            component => component.toolType === 'textbox'
        );
    },

    iframeComponents: state => {
        return Object.values(state.components).filter(
            component => component.toolType === 'iframe'
        );
    },

    pluginComponents: state => {
        return Object.values(state.components).filter(
            component => component.toolType === 'plugin'
        );
    },

    countCharts: (state, getters) => {
        return getters.chartComponents.length;
    },

    hasDomainBarSyncChart: (state, getters) => {
        return getters.chartComponents.some(
            component => component.domainBarSync
        );
    },
};
