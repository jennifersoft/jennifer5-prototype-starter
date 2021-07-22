<template>
    <div class="tool-bar">
        <search-bar
            :search-range-type="searchRangeType"
            :start-date-for-monthly="startDateForMonthly"
            :start-date-for-period="startDateForPeriod"
            :end-date-for-period="endDateForPeriod"
            :resources="resources"
            @change-type="onChangeSearchType"
            @search="onClickSearchButton"
            @change-monthly-date="onChangeMonthlyDate"
            @change-start-date="onChangeStartDate"
            @change-end-date="onChangeEndDate"
            @submit-resources="onSubmitResourcePopup"
        ></search-bar>
    </div>
</template>

<script>
import SearchBar from '../component/SearchBar';
import { mapState, mapMutations, mapActions, mapGetters } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        SearchBar,
    },
    data() {
        return {
            onReady: false,
        };
    },
    computed: {
        ...mapState({
            isLoadedFirstData: state => state.isLoadedFirstData,
            onlyDailyChartMode: state => state.activeDailyChartIndex === -1,
            searchRangeType: state => state.searchRangeType,
            startDateForMonthly: state => state.startDateForMonthly,
            startDateForPeriod: state => state.startDateForPeriod,
            endDateForPeriod: state => state.endDateForPeriod,
            resources: state => {
                return [
                    { resourceType: 'instance', tree: state.instanceData },
                    { resourceType: 'business', tree: state.businessData },
                ];
            },
        }),
        ...mapGetters(['dailyChartSearchDates']),
    },
    methods: {
        ...mapMutations([
            'updateOidMap',
            'changeResourceType',
            'changeSearchRangeType',
            'updateSearchDatesForMonthly',
            'updateSearchDatesForPeriod',
            'changeActiveDailyChartIndex',
            'initLoadedFirstData',
        ]),
        ...mapActions([
            'loadDailyChartData',
            'loadHourlyChartData',
            'loadTableData',
        ]),
        async onSubmitResourcePopup({ tree, resourceType }) {
            this.changeResourceType(resourceType);

            const oidMap = {};

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                return t.check === 'on' && t.data.oid !== -1;
            });

            sids.forEach(s => {
                oidMap[s] = [];
            });

            checked.forEach(c => {
                oidMap[c.data.sid] = [];
            });
            checked.forEach(c => {
                if (oidMap.hasOwnProperty(c.data.sid)) {
                    oidMap[c.data.sid].push(c.data.oid);
                } else {
                    oidMap[c.data.sid] = [c.data.oid];
                }
            });

            this.updateOidMap(oidMap);

            // 최초에 화면 로드시 한번만 호출함
            if (!this.onReady) {
                await this.onClickSearchButton();
                this.onReady = true;
            }
        },
        onChangeMonthlyDate(date) {
            this.updateSearchDatesForMonthly(date);
        },
        onChangeStartDate(date) {
            this.updateSearchDatesForPeriod({
                startDate: date,
                endDate: this.endDateForPeriod,
            });
        },
        onChangeEndDate(date) {
            this.updateSearchDatesForPeriod({
                startDate: this.startDateForPeriod,
                endDate: date,
            });
        },
        onChangeSearchType({ value }) {
            this.changeSearchRangeType(value);
        },
        async onClickSearchButton() {
            const [start, end] = this.dailyChartSearchDates;

            if (
                start.valueOf() >
                end
                    .clone()
                    .add(-1, 'day')
                    .valueOf()
            ) {
                this.$emit('alert', this.i18n.M0187);
                return;
            }

            if (end.diff(start, 'day') > 30) {
                this.$emit('alert', this.i18n.M0010);
                return;
            }

            await this.loadDailyChartData();

            // 일간 차트가 전체 모드일 때
            if (this.onlyDailyChartMode) this.changeActiveDailyChartIndex(-1);
            else {
                // 두번째 검색부터 일간 차트는 첫번째 노드를 선택함
                if (this.isLoadedFirstData) this.changeActiveDailyChartIndex(0);

                // 시간당 차트 데이터 다시 로드하기
                this.loadHourlyChartData();
            }

            // 테이블 데이터 로드하기
            this.loadTableData();

            // 최초 한번 검색 버튼 실행시 관련 상태를 변경함
            this.initLoadedFirstData();
        },
    },
};
</script>

<style lang="scss" scoped></style>
