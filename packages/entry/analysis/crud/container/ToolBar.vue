<template>
    <div class="tool-bar">
        <navigation-bar
            :progress="searchProgress"
            :suspendible="false"
            :disable-search-btn="searchDisabled"
            @search="loadCrudData"
        >
            <navigation-item>
                <format-date-input
                    :time="startDate"
                    :messages="messages"
                    :disable-minute="true"
                    @change="onChangeStartDate"
                />
                <format-date-input
                    :time="endDate"
                    :messages="messages"
                    :disable-minute="true"
                    @change="onChangeEndDate"
                />
            </navigation-item>
            <navigation-item>
                <ResourcePopup
                    :popupPositionLeft="false"
                    :resources="resources"
                    @submit="onSubmitResourcePopup"
                ></ResourcePopup>
            </navigation-item>
        </navigation-bar>
    </div>
</template>

<script>
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup.vue';
import componentMessages from '@vuejs/component/messages';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    inject: ['i18n'],
    components: {
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        ResourcePopup,
    },
    data() {
        return {
            messages: componentMessages,
        };
    },
    computed: {
        ...mapState({
            searchProgress: state => state.searchProgress,
            startDate: state => state.startDate,
            endDate: state => state.endDate,
            resources: state => {
                return [
                    { resourceType: 'instance', tree: state.instanceData },
                    { resourceType: 'business', tree: state.businessData },
                ];
            },
            oidMap: state => state.oidMap,
        }),
        searchDisabled() {
            // 시작날짜가 크거나 같거나 대상선택이 아무것도 안되어있을 때
            return (
                this.startDate.valueOf() >= this.endDate.valueOf() ||
                Object.values(this.oidMap)[0].length === 0
            );
        },
        buttons() {
            return [{ text: `${this.i18n.targetConfig}` }];
        },
    },
    methods: {
        ...mapMutations(['updateSearchDates', 'changeTargetData']),
        ...mapActions(['loadCrudData']),
        onChangeStartDate(date) {
            this.updateSearchDates([date, this.endDate]);
        },
        onChangeEndDate(date) {
            this.updateSearchDates([this.startDate, date]);
        },
        onSubmitResourcePopup({ resourceType, tree }) {
            const sids = tree
                .filter(t => {
                    return t.data.oid === -1 && t.check === 'on';
                })
                .map(t => t.data.sid);

            const checked = tree.filter(t => {
                return t.check === 'on' && t.data.oid !== -1;
            });
            let oidMap = {};

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

            this.changeTargetData({
                resourceType,
                oidMap,
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
}
</style>
