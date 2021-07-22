export const mutations = {
    updateEditorCode: (state, code) => {
        state.editorCode = code
    },
    changeActiveTab: (state, tab) => {
        state.activeTab = tab
    },
    loadChartStyles: (state, chartStyles) => {
        state.chartStyles = chartStyles
    },
    updateChartStyle: (state, payload) => {
        state.chartStyles[payload.brush] = JSON.parse(payload.code)
    },
    toggleUseEditor: state => {
        state.useEditor = !state.useEditor
    },
}
