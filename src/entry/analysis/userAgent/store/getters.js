import { BrowserTypeDef, DeviceTypeDef, OSTypeDef } from '@common/definition';

function getFilterUserAgentData(list, details) {
    const filteredData = [];

    const browserFilter = details.browser,
        osFilter = details.os,
        deviceFilter = details.device;

    for (let i = 0; i < list.length; i++) {
        if (
            deviceFilter.includes(DeviceTypeDef[list[i].device]) &&
            osFilter.includes(OSTypeDef[list[i].os]) &&
            browserFilter.includes(BrowserTypeDef[list[i].browser])
        ) {
            filteredData.push(list[i]);
        }
    }

    return filteredData;
}

function calculateFetchData(originData) {
    const browser = [],
        os = [],
        device = [];

    for (let i = 0; i < originData.length; i++) {
        const bn = originData[i].browser,
            bv = originData[i].browserVersion,
            on = originData[i].os,
            ov = originData[i].osVersion;

        browser.push({
            key: bv != '' ? bn + ' ' + bv : bn,
            name: bn,
            version: bv,
            hit: originData[i].hit,
            responseTime: originData[i].responseTime,
        });

        os.push({
            key: ov != '' ? on + ' ' + ov : on,
            name: on,
            version: ov,
            hit: originData[i].hit,
            responseTime: originData[i].responseTime,
        });

        device.push({
            key: originData[i].device,
            name: originData[i].device,
            version: originData[i].deviceVersion,
            hit: originData[i].hit,
            responseTime: originData[i].responseTime,
        });
    }
    return { browser, os, device };
}

export const getters = {
    filteredData: state => {
        const { data, filters } = state;

        return calculateFetchData(
            getFilterUserAgentData(data, filters.details)
        );
    },
    tableData: (state, getters) => {
        const { donutFilter, currentTab } = state;
        const { filteredData } = getters;
        const originData = filteredData[currentTab];
        const cacheData = {},
            newData = [];

        for (let i = 0; i < originData.length; i++) {
            if (!cacheData[originData[i].key]) {
                cacheData[originData[i].key] = {
                    hit: 0,
                    responseTime: 0,
                    name: originData[i].name,
                    version: originData[i].version,
                };
            }

            cacheData[originData[i].key].hit += originData[i].hit;
            cacheData[originData[i].key].responseTime +=
                originData[i].responseTime;
        }

        for (let key in cacheData) {
            const name = cacheData[key].name;

            if (
                donutFilter.length === 0 ||
                (donutFilter.length > 0 && donutFilter.includes(name))
            ) {
                newData.push({
                    key: key,
                    name: name,
                    hit: cacheData[key].hit,
                    responseTime:
                        cacheData[key].responseTime / cacheData[key].hit,
                    version: cacheData[key].version,
                });
            }
        }
        return newData;
    },
    donutData: (state, getters) => {
        const { currentTab } = state;
        const { filteredData } = getters;
        const list = filteredData[currentTab],
            hitData = {};

        for (let i = 0; i < list.length; i++) {
            const key = list[i].name;

            if (!hitData[key]) {
                hitData[key] = 0;
            }
            hitData[key] += list[i].hit;
        }

        return list.length > 0 ? [hitData] : [];
    },
};
