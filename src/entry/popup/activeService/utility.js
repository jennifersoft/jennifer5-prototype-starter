import { ElementManager } from '@common/legacy/ElementManager';

export function getDomainAndInstanceInfo() {
    let sids = [],
        oids = [];

    if (ElementManager.getCache().hasSelectedInstance) {
        oids = ElementManager.getCache().selectedInstanceList;
    } else {
        sids = ElementManager.getSelectedDomainSidList();
    }

    return {
        domainIds: sids,
        instanceOids: oids,
    };
}
