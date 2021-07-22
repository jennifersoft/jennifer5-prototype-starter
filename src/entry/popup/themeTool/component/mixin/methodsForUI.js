export default {
    methods: {
        onSyncEditor(code) {
            this.$emit('sync-editor', code);
        }
    }
}