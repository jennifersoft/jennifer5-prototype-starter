import { endOfDayjs } from '@common/dayjsWrapper';

export default {
    dailyChartSearchDates: state => {
        if (state.searchRangeType === 'monthly') {
            return [state.startDateForMonthly, state.endDateForMonthly];
        }

        return [state.startDateForPeriod, state.endDateForPeriod];
    },
    hourlyChartSearchDates: state => {
        const index = state.activeDailyChartIndex;
        if (index !== -1) {
            const row = state.dailyChartRows[index];
            if (row)
                return [row.date.clone(), endOfDayjs(row.date.clone(), 'day')];
        }

        return null;
    },
    sumOfDailyChartValues: state => {
        return state.dailyChartRows.reduce((prev, next) => {
            return prev + next['value'];
        }, 0);
    },

    expandHourlyChartSearchDates: state => {
        const index = state.expandActiveDailyChartIndex;

        if (index !== -1) {
            const row = state.expandDailyChartRows[index];
            if (row)
                return [row.date.clone(), endOfDayjs(row.date.clone(), 'day')];
        }

        return null;
    },
    expandSumOfDailyChartValues: state => {
        return state.expandDailyChartRows.reduce((prev, next) => {
            return prev + next['count'];
        }, 0);
    },
    fetching: state => {
        return (
            state.dailyChartLoading ||
            state.hourlyChartLoading ||
            state.tableProgress !== 0
        );
    },
    fetchingDetails: state => {
        return (
            state.expandDailyChartProgress > 0 ||
            state.expandHourlyChartProgress > 0 ||
            state.expandTableProgress > 0
        );
    },
};
