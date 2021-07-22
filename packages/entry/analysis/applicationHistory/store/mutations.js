import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import { serverDateFormat } from '@common/base';
import {
    getResourceType,
    getResourceStatus,
    checkReadResourceContents,
} from '../utility';

export default {
    updateDomainId(state, domainId) {
        state.domainId = domainId;
    },
    changeTargetData(state, oids) {
        state.checkedOids = oids;
    },
    updateInstanceData(state, data) {
        state.instanceData = data;
    },

    selectMonthlyDate(state, date) {
        state.year = date.year();
        state.month = date.month() + 1;
    },
    selectDeployDates(state, time) {
        const date = getDayjs(time);
        state.startTime = startOfDayjs(date, 'day').valueOf();
        state.endTime = startOfDayjs(date.clone(), 'day').add(1, 'day');
    },
    selectCollectTime(state, time) {
        state.collectTime = time;
    },

    updateDeployCount(state, data) {
        state.deployCount = [];

        for (let key in data) {
            state.deployCount.push({
                date: getDayjs(parseInt(key)),
                value: data[key],
            });
        }
    },
    findDeployIndex(state) {
        state.deployCount.forEach((data, index) => {
            if (data.value > 0) state.day = index;
        });
    },
    selectDeployIndex(state, index) {
        state.day = index;
    },

    updateDeploySearchTimes(state) {
        const row = state.deployCount[state.day];
        if (row) {
            state.startTime = row.date.valueOf();
            state.endTime = row.date
                .clone()
                .add(1, 'day')
                .valueOf();
        }
    },
    updateDeployData(state, data) {
        state.deployData = data.map(row => {
            return {
                timeFormat: getDayjs(row.collectTime).format(
                    serverDateFormat.longWithSec
                ),
                fileSizeFormat: row.fileSize.toLocaleForAries(),
                ...row,
            };
        });
    },

    updateResourceSearchParams(state, index) {
        const row = state.deployData[index];
        if (row) {
            state.collectTime = row.collectTime;
            state.deployKey = row.key;
        }
    },
    updateResourceData(state, data) {
        state.resourceData = data.map(row => {
            return {
                timeFormat: getDayjs(row.lastModified).format(
                    serverDateFormat.longWithSec
                ),
                resourceTypeFormat: getResourceType(row.resourceType),
                resourceStatusFormat: getResourceStatus(row.resourceStatus),
                existContents: checkReadResourceContents(row.resourceType),
                ...row,
            };
        });
    },
    updateResourceContents(state, payload) {
        state.contents = payload.contents;
        state.prettyContents = payload.prettyContents;
        state.beforeContents = payload.beforeContents;
        state.useEscaping = payload.useEscaping;
    },

    resetAllData(state) {
        state.deployCount = [];
        state.deployData = [];
        state.resourceData = [];
        state.collectTime = -1;
        state.deployKey = '';
    },

    calculateMainHeight(state) {
        state.mainHeight = window.innerHeight - 568;
    },
    updateFetching(state, fetching = true) {
        state.fetching = fetching;
    },
};
