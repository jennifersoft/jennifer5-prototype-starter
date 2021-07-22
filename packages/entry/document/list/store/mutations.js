import { getDayjs } from '@common/base';

export default {
    updateViewAll(state, active) {
        state.viewAll = active;
    },
    updateDirectoryName(state, name) {
        state.directoryName = name;
    },
    updateDirectoryKey(state, key) {
        const activeDirs = state.directoryList.filter(dir => dir.key === key);
        if (activeDirs.length > 0) state.directoryName = activeDirs[0].name;
        state.directoryKey = key;
    },
    updateDirectoryList(state, list) {
        state.directoryList = [{ key: '*', name: '' }, ...list];
        state.directoryList.forEach(dir => {
            state.directoryNameMap[dir.key] = dir.name;
        });
    },
    updateReportList(state, list) {
        state.reportList = list.map(report => {
            const directoryName =
                state.directoryNameMap[report.directoryKey] || '';
            return {
                ...report,
                directoryName: directoryName,
            };
        });
    },
    updateReportListInDirectory(state) {
        const lastWeek = getDayjs().add(-7, 'day'); // 일주일 전 시간 데이터 구하기
        const dirMap = { lastWeek: [] };

        state.reportList.forEach(report => {
            // 과거 버전은 디렉토리 지정이 안되면 공백으로 저장됨 (현재는 '*'로 저장되는듯)
            const key = report.directoryKey === '' ? '*' : report.directoryKey;

            if (!dirMap[key]) dirMap[key] = [];

            // 최근 업로드 (일주일)
            if (getDayjs(report.time).valueOf() > lastWeek.valueOf())
                dirMap.lastWeek.push(report);

            // 디렉토리 별로 추가하기
            dirMap[key].push(report);
        });

        state.reportListInDirectory = dirMap;
    },
    updateCheckedReportKeys(state, keys) {
        state.checkedReportKeys = Array.from(new Set(keys));
    },
};
