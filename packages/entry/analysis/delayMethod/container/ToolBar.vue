<template>
    <div class="tool-bar">
        <navigation-bar
            :disable-search-btn="searchDisabled"
            :progress="searchProgress"
            :suspendible="false"
            @search="onClickSearchButton"
        >
            <navigation-item>
                <format-date-input
                    :time="startDate"
                    :messages="messages"
                    @change="onChangeStartDate"
                />
                <format-date-input
                    :time="endDate"
                    :messages="messages"
                    @change="onChangeEndDate"
                />
            </navigation-item>
            <navigation-item>
                <ResourcePopup
                    :popupPositionLeft="true"
                    :resources="resources"
                    @submit="onSubmitResourcePopup"
                ></ResourcePopup>
            </navigation-item>
        </navigation-bar>
    </div>
</template>

<script>
import componentMessages from '@vuejs/component/messages';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup.vue';
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
                return [{ resourceType: 'instance', tree: state.instanceData }];
            },
        }),
        searchDisabled() {
            return this.startDate.valueOf() >= this.endDate.valueOf();
        },
    },
    methods: {
        ...mapMutations([
            'updateSearchDates',
            'updateInstanceOids',
            'updateSearchProgress',
        ]),
        ...mapActions(['loadTopStackElements']),
        onChangeStartDate(date) {
            this.updateSearchDates([date, this.endDate]);
        },
        onChangeEndDate(date) {
            this.updateSearchDates([this.startDate, date]);
        },
        onSubmitResourcePopup({ tree }) {
            const oids = tree
                .filter(
                    node =>
                        !node.disabled &&
                        node.check === 'on' &&
                        node.data.oid !== -1
                )
                .map(node => node.data.oid);

            this.updateInstanceOids(oids);
        },
        async onClickSearchButton() {
            try {
                await this.loadTopStackElements();
            } catch (e) {
                this.updateSearchProgress(1);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
}
</style>
