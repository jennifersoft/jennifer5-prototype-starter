import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';

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
    resourceNameMap: ({ resourceData: { instance, business } }) => {
        const ret = {
            domain: {},
            instance: {},
            business: {},
        };

        for (const ins of instance) {
            if (ins.oid === -1) {
                ret.domain[ins.sid] = ins.shortName;
                continue;
            }
            const key = ins.sid + ':' + ins.oid;
            ret.instance[key] = ins.shortName;
        }

        for (const biz of business) {
            if (biz.oid !== -1) {
                const key = biz.sid + ':' + biz.oid;
                ret.business[key] = biz.shortName;
            }
        }

        return ret;
    },
    columnIndexMap: ({ searchConditionQueue }) => {
        const ret = {};

        let columnIndex = 1;
        for (const index in searchConditionQueue) {
            const { resources, resourceType } = searchConditionQueue[index];
            const { grouped } = resources;
            let isFirst = true;

            for (const sid in grouped) {
                const oidCount = grouped[sid].length;

                if (resourceType === 'domain') {
                    ret[`${index}:${sid}:0`] = columnIndex;
                    columnIndex++;
                } else {
                    for (let j = 0; j < oidCount; j++) {
                        const oid = grouped[sid][j];
                        ret[`${index}:${sid}:${oid}`] = columnIndex;
                        columnIndex++;
                    }
                }

                isFirst = false;
            }
        }

        return ret;
    },
    excludeDatesDuringTerm: ({ filters }) => {
        const { start, end } = filters.time;
        const ret = [];

        let added = start;
        while (added.valueOf() < end.valueOf()) {
            ret.push(added);
            added = added.add(1, 'day');
        }

        return ret;
    },
    isSelectionValid(state) {
        const { oidList, metric } = state.filters;
        return oidList.length > 0 && !!metric;
    },
};
