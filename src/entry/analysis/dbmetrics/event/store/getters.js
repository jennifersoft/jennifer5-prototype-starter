import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';

const METRIC_EVENT_KEY = -1;
const METRIC_COMPARE_EVENT_KEY = -2;
export const getters = {
    resourceNormalized: ({ resourceData: { instance, business } }) => {
        const n = normalizeOidConfigResponse(instance, 'instance');
        const domainNotClickable = n.map(l => ({
            ...l,
            noInteraction: l.resourceType === 'domain',
            check: 'off',
        }));
        const domain = n
            .filter(d => {
                return d.resourceType === 'domain';
            })
            .map(n => ({
                ...n,
                fold: 'no-fold',
                noFoldPadding: true,
                check: 'off',
            }));
        const n2 = normalizeOidConfigResponse(business, 'business')
            .map(n => ({
                ...n,
                check: 'off',
            }))
            .map(l => {
                if (l.resourceType === 'domain') {
                    return {
                        ...l,
                        noInteraction: true,
                    };
                }
                return l;
            });
        return [
            { resourceType: 'domain', tree: domain },
            {
                resourceType: 'instance',
                tree: Array.from(domainNotClickable),
            },
            {
                resourceType: 'business',
                tree: Array.from(n2),
            },
        ];
    },
    intervalInMinute: ({ filters }) => {
        const { gatheringInterval, time } = filters;
        const { start, end } = time;
        return gatheringInterval === 0
            ? parseInt((end.valueOf() - start.valueOf()) / 1000)
            : gatheringInterval;
    },
    includeMetricEvent: ({ filters }) => {
        const { eventTypes } = filters;
        return eventTypes.map(e => e.data.value).includes(METRIC_EVENT_KEY);
    },
    includeMetricCompareEvent: ({ filters }) => {
        const { eventTypes } = filters;
        return eventTypes
            .map(e => e.data.value)
            .includes(METRIC_COMPARE_EVENT_KEY);
    },
    isSelectionValid(state) {
        const { resources, eventTypes, eventLevels } = state.filters;
        return (
            Object.keys(resources.grouped).length > 0 &&
            eventTypes.length > 0 &&
            eventLevels.length > 0
        );
    },
};
