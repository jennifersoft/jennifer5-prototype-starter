import axios from "@library/axios";
import { OTypeDef } from "@common/definition";

export const loadMetrics = async (otype) => {
    const type = (otype === OTypeDef.SYSTEM)? "instance" : "business";
    const url = "/metrics/" + type;

    return await axios.get(url);
};

export const loadTarget = async (otype, domainId, searchTime) => {
    const url = (otype === OTypeDef.BUSINESS) ? "/biz/group/treeList" : "/agent/list/period";

    const params = {
        format: 'json',
        sid: domainId,
    };

    if (otype === OTypeDef.SYSTEM) {
        params.startTime = searchTime.startTime;
        params.endTime = searchTime.endTime;
    }

    return await axios.get(url, {
        params: params
    });
};