export const getters = {
    isSelectionValid(state) {
        const { resource, partitions, metrics } = state.selected;
        const isDomainValid = resource.sid !== -1 && resource.instanceId !== -1;
        const isPartitionSelected = partitions.length > 0;
        const isMetricSelected = metrics.length > 0;
        return isDomainValid && isPartitionSelected && isMetricSelected;
    },
};
