export const getters = {
    // 서버에 저장되는 템플릿 데이터 (특정 프로퍼티는 제외)
    toJSONString: state => {
        const newState = {};
        for (let key in state) {
            if (key !== 'chartStyles') newState[key] = state[key];
        }
        return JSON.stringify(newState);
    },
};
