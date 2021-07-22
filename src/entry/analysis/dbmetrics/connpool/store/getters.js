export default {
    isSelectionValid(state) {
        const isResourceSelected = !!state.resource.oid;
        return (
            isResourceSelected &&
            state.poolNames.length > 0 &&
            state.metrics.length > 0
        );
    },
};
