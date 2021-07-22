export default {
    updateTemplateList(state, list) {
        state.templateList = list
            .map((row, i) => {
                return {
                    ...row,
                    no: i + 1,
                    // 수정시간이 없으면 생성시간으로 대체하기
                    updateTime: row.updateTime ? row.updateTime : row.time,
                };
            })
            // 생성시간으로 내림차순 정렬하기
            .sort((a, b) => b.time - a.time);
    },
    updateCheckedTemplateKeys(state, keys) {
        state.checkedTemplateKeys = Array.from(new Set(keys));
    },
    updateAutoBuildTime(state, { hour, minute }) {
        state.autoBuildHour = hour;
        state.autoBuildMinute = minute;
    },
    updateUserMailList(state, payload) {
        state.userMailList = payload.map(row => {
            return {
                key: `${row.key}`,
                mail: row.sender,
            };
        });
    },
    updateUserGroupList(state, list) {
        state.userGroupList = list;
    },
};
