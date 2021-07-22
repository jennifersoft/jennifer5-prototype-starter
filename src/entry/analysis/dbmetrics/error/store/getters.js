import { OTypeDef } from '@common/definition';

export default {
    group(state) {
        return JSON.stringify(state.resources);
    },
    otype(state) {
        return state.resourceType === 'business'
            ? OTypeDef.BUSINESS
            : OTypeDef.SYSTEM;
    },
    intervalInMinute(state) {
        const { start, end } = state.timeFilter;

        return state.gatheringInterval === 0
            ? parseInt((end.valueOf() - start.valueOf()) / 1000)
            : state.gatheringInterval;
    },
    isSelectionValid(state) {
        const resourceSelected = !!Object.keys(state.resources);
        const errorTypeSelected = state.errorTypes.length > 0;
        return resourceSelected && errorTypeSelected;
    },
};
