import axios from "axios";
import { OTypeDef, ServiceDBTypeDef } from "@common/definition";
import { createFormData } from "@common/utility";
import { INTERVAL_MAP } from "../metadata";

export const ServiceData = {
    async create(serviceType, groupData, startTime, endTime, serviceHashes, intervalType) {
        return await axios.post(`/analysis/service/${serviceType}/key`, createFormData({
            oidsBySid: groupData,
            otype: OTypeDef.SYSTEM,
            stime: startTime,
            etime: endTime,
            hashes: serviceHashes,
            gtype: intervalType
        }));
    },
    async read(serviceType, sessionKey) {
        return await axios.post(`/analysis/service/${serviceType}/data`, createFormData({
            sessionKey: sessionKey,
        }));
    }
}

export const ServiceDataLegacy = {
    async read(serviceType, groupData, startTime, endTime, serviceHashes, intervalType) {
        const targetData = JSON.parse(groupData);
        const domainId = Object.keys(targetData)[0];
        const oidList = targetData[domainId];
        const interval = (intervalType == 'ALL') ? (endTime - startTime) / 1000 / 60 : INTERVAL_MAP[intervalType];

        return await axios.get('/db/service', {
            params: {
                sid: domainId,
                oidList: oidList.join(','),
                stime: startTime,
                etime: endTime,
                serviceType: ServiceDBTypeDef[serviceType.toUpperCase()],
                hashList: serviceHashes.join(','),
                intervalInMinute: interval,
                startIntervalIndex: 0,
                intervalCountLimit: 1440,
                format: 'json'
            }
        });
    }
}

export const serviceDataHelper = (serviceType, groupData, startTime, endTime, serviceHashes, intervalType, callback, sessionKey="", data=[]) => {
    // const promise = sessionKey === "" ?
    //     ServiceData.create(serviceType, groupData, startTime, endTime, serviceHashes, intervalType) :
    //     new Promise(resolve => resolve({ request: { responseText: sessionKey } }));
    //
    // promise.then(res => {
    //     const realSessionKey = res.request.responseText;
    //
    //     ServiceData.read(serviceType, realSessionKey).then(res2 => {
    //         if (!res2.data.hasNext) {
    //             data = data.concat(res2.data.partialData);
    //             callback(data);
    //         } else {
    //             serviceDataHelper(serviceType, groupData, startTime, endTime, serviceHashes, intervalType, callback, realSessionKey, data);
    //         }
    //     });
    // });
    ServiceDataLegacy.read(serviceType, groupData, startTime, endTime, serviceHashes, intervalType).then(res => {
        callback(res.data);
    });
}