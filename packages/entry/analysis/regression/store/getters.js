import { getDayjs } from '@common/base';

export default {
    searchTimes: state => {
        const ldate = getDayjs(state.searchTime);
        const etime = ldate.add(state.period, 'day').valueOf();
        return [state.searchTime, etime];
    },
};
