import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { getDayjs } from '@common/base';

export default {
    filters: {
        toLocaleString(val) {
            return val.toLocaleForAries();
        },
        getMaxFromValues(values) {
            const max = values.reduce((a, b) => {
                if (a > b) return a;
                return b;
            }, 0);
            return ClientUtilities.getMaxValue(max);
        },
    },
    methods: {
        formatXAxis(date, i) {
            let hour = getDayjs(date).hour();
            // 마지막 시간은 24로 고정하기
            if (i !== 0 && hour === 0) hour = 24;
            return hour < 10 ? `0${hour}` : `${hour}`;
        },
        formatYAxis(value) {
            return typeof value === 'number'
                ? parseFloat(value).toUnitString(10000)
                : value;
        },
        comparedValue(prev, next) {
            const per = ((next - prev) / prev) * 100;
            return isNaN(per) ? 0 : per;
        },
    },
};
