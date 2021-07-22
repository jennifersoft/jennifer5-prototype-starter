import methods from './methods'

export default {
    mixins: [methods],
    methods: {
        onChangeSetting(key, value) {
            const newCode = JSON.stringify(
                { ...this.theme, [key]: value },
                null,
                2
            )
            this.onChangeEditorCode(newCode)
            this.$emit('sync-editor', newCode)
        },
    },
}
