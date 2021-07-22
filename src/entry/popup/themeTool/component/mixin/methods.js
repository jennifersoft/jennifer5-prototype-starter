import { mapMutations } from '../../constant'

export default {
    methods: {
        ...mapMutations({
            updateChartStyle: 'updateChartStyle',
            updateEditorCode: 'updateEditorCode',
        }),
        onChangeEditorCode(code) {
            this.updateEditorCode(code)
            this.updateChartStyle({
                brush: this.activeTab,
                code: code,
            })
        },
    },
}
