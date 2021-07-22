<template>
    <div class="tool-bar">
        <search-bar
            :search-range-type="selectSearchType"
            :start-date-for-monthly="monthlyDate"
            :start-date-for-period="startDate"
            :end-date-for-period="endDate"
            :resources="resources"
            :resource-tab-index="1"
            :progress="progress"
            @change-type="onChangeSearchType"
            @search="onClickSearchButton"
            @change-monthly-date="onChangeMonthlyDate"
            @change-start-date="onChangeStartDate"
            @change-end-date="onChangeEndDate"
            @submit-resources="resourceChangeHandler"
        ></search-bar>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import SearchBar from '@entry/analysis/service/component/SearchBar';
import { getDayjs } from '@common/base';
import { startOfDayjs } from '@common/dayjsWrapper';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { OTypeDef } from '@common/definition';
import { normalizeOidConfigResponse } from '@vuejs/component/Resource/Tree/treeAction';
import { Business, Instance } from '@service/oidConfig';
const { mapGetters } = createNamespacedHelpers('domain');

function getResKey(norm) {
    return norm.map(r => `${r.data.oid}-${r.data.sid}`).join();
}

export default {
    inject: ['i18n'],
    components: {
        SearchBar,
    },
    props: {
        progress: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        const firstDate = startOfDayjs(getDayjs(), 'month');

        return {
            searchCondition: {}, // stime, etime, group, otype 필수 조건 */

            selectSearchType: 'monthly',
            monthlyDate: firstDate,
            startDate: firstDate.clone(),
            endDate: firstDate.clone(),

            resources: [
                { resourceType: 'domain', tree: [] },
                { resourceType: 'instance', tree: [] },
                { resourceType: 'business', tree: [] },
            ],
            grouped: [],
        };
    },
    computed: {
        ...mapGetters({
            sidList: 'sidList',
        }),
    },
    watch: {
        sidList() {
            this.updateSearchCondition();
            this.fetchResource();
        },
    },
    methods: {
        fetchResource() {
            const sidToFetch = this.sidList;
            const startTime = this.searchCondition.stime;
            const endTime = this.searchCondition.etime;

            return Promise.all([
                Instance.get(sidToFetch, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'instance');
                    if (getResKey(this.resources[1].tree) === getResKey(n)) {
                        return;
                    }
                    this.$set(this.resources, 1, {
                        resourceType: 'instance',
                        tree: Array.from(n),
                    });

                    const domains = n.filter(d => {
                        return d.resourceType === 'domain';
                    });
                    this.$set(this.resources, 0, {
                        resourceType: 'domain',
                        tree: domains,
                    });
                }),
                Business.get(sidToFetch, startTime, endTime).then(res => {
                    const n = normalizeOidConfigResponse(res, 'business');
                    if (getResKey(this.resources[2].tree) === getResKey(n)) {
                        return;
                    }
                    this.$set(this.resources, 2, {
                        resourceType: 'business',
                        tree: Array.from(n),
                    });
                }),
            ]);
        },
        resourceChangeHandler({ resourceType, tree }) {
            this.otypeString = resourceType;

            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                return t.check === 'on' && t.data.oid !== -1;
            });
            let grouped = {};
            sids.forEach(s => {
                grouped[s] = [];
            });
            checked.forEach(c => {
                grouped[c.data.sid] = [];
            });
            checked.forEach(c => {
                if (grouped.hasOwnProperty(c.data.sid)) {
                    grouped[c.data.sid].push(c.data.oid);
                } else {
                    grouped[c.data.sid] = [c.data.oid];
                }
            });

            // group -> doamin 일때는 [0],
            if (resourceType === 'domain') {
                sids.forEach(s => {
                    grouped[s] = [0];
                });
            }
            this.grouped = grouped;
        },
        onChangeSearchType(data) {
            this.selectSearchType = data.value;
        },
        onChangeMonthlyDate(date) {
            this.monthlyDate = date;
        },
        onChangeStartDate(date) {
            this.startDate = date;
        },
        onChangeEndDate(date) {
            this.endDate = date;
        },
        onClickSearchButton() {
            this.updateSearchCondition();
            this.emitSearchCondition();
        },
        updateSearchCondition() {
            const otype =
                this.otypeString == 'business'
                    ? OTypeDef.BUSINESS
                    : OTypeDef.SYSTEM;
            let sdate = this.startDate,
                edate = this.endDate;

            if (this.selectSearchType == 'monthly') {
                sdate = startOfDayjs(this.monthlyDate, 'date');
                edate = startOfDayjs(sdate.clone().add(1, 'month'), 'date');
            }

            // OType 설정
            this.searchCondition.otype = otype;

            // 시작 시간 설정
            this.searchCondition.stime = sdate.valueOf();

            // 종료 시간 설정
            if (this.selectSearchType == 'period') {
                this.searchCondition.etime =
                    edate.valueOf() + ClientUtilities.ONE_DAY;
            } else {
                this.searchCondition.etime = edate.valueOf();
            }
        },
        emitSearchCondition() {
            // 기간 검색시 유효성 검사
            if (
                this.searchCondition.etime - this.searchCondition.stime >
                ClientUtilities.ONE_DAY * 31
            ) {
                this.$emit('alert', this.i18n.M0010);
                return;
            }

            // 검색 기간 범위 유효성 검사
            if (this.searchCondition.stime >= this.searchCondition.etime) {
                this.$emit('alert', this.i18n.M0187);
                return;
            }

            // 도메인 그룹 데이터 설정
            this.searchCondition.group = JSON.stringify(this.grouped);

            this.$emit('update#condition', this.searchCondition);
        },
    },
    beforeMount() {
        this.updateSearchCondition();
        this.fetchResource().then(() => {
            this.emitSearchCondition();
        });
    },
};
</script>

<style lang="scss" scoped></style>
