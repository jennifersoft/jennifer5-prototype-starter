//dayjs의 .startOf() .endOf() 를 사용할 수 없어서 만듬.
//http://issue.jennifersoft.com/browse/ARIES-9922
export const startOfDayjs = (dayjs, type) => {
    let resultDayjs = undefined;

    switch (type) {
        case 'year':
            resultDayjs = dayjs
                .month(0)
                .date(1)
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0);
            break;
        case 'month':
            resultDayjs = dayjs
                .date(1)
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0);
            break;
        case 'week':
            resultDayjs = dayjs
                .day(0)
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0);
            break;
        case 'date':
        case 'day':
            resultDayjs = dayjs
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0);
            break;
        default:
            console.error(`cannot support type = (${type}), in  startOfDayjs`);
    }

    return resultDayjs;
};

//.endOf() 함수의 경우 'month' 와 'day' 만 사용하고 있어 2가지만 구현함.
export const endOfDayjs = (dayjs, type) => {
    let resultDayjs = undefined;

    switch (type) {
        case 'month':
            resultDayjs = dayjs
                .date(1)
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(1, 'month')
                .subtract(1, 'millisecond');
            break;
        case 'date':
        case 'day':
            resultDayjs = dayjs
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .add(1, 'day')
                .subtract(1, 'millisecond');
            break;
        default:
            console.error(`cannot support type = (${type}), in  endOfDayjs`);
    }

    return resultDayjs;
};
