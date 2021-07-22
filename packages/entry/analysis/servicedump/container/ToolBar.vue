<template>
    <div class="tool-bar">
        <navigation-bar
            :loading="searchLoading"
            :disable-search-btn="searchDisabled"
            @search="loadServiceDumpFiles"
        >
            <navigation-item>
                <format-date-input
                    :time="startDate"
                    :messages="messages"
                    @change="onChangeStartDate"
                    hide-time
                />
                <format-date-input
                    :time="endDate"
                    :messages="messages"
                    @change="onChangeEndDate"
                    hide-time
                />
            </navigation-item>
        </navigation-bar>
    </div>
</template>

<script>
import componentMessages from '@vuejs/component/messages';
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import { mapState, mapMutations, mapActions } from '../vuex';

export default {
    components: {
        NavigationBar,
        NavigationItem,
        FormatDateInput,
    },
    data() {
        return {
            messages: componentMessages,
        };
    },
    computed: {
        ...mapState({
            searchLoading: state => state.searchLoading,
            startDate: state => state.startDate,
            endDate: state => state.endDate,
        }),
        searchDisabled() {
            return this.startDate.valueOf() > this.endDate.valueOf();
        },
    },
    methods: {
        ...mapMutations(['updateSearchDates']),
        ...mapActions(['loadServiceDumpFiles']),
        onChangeStartDate(date) {
            this.updateSearchDates([date, this.endDate]);
        },
        onChangeEndDate(date) {
            this.updateSearchDates([this.startDate, date]);
        },
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
}
</style>
