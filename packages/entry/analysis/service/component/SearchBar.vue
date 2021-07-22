<template>
    <navigation-bar
        :types="searchTypes"
        :type-dropdown-width="184"
        :progress="progress"
        :suspendible="false"
        @update:type="data => $emit('change-type', data)"
        @search="() => $emit('search')"
    >
        <navigation-item>
            <template v-if="searchRangeType === 'monthly'">
                <format-date-input
                    small
                    hide-day
                    hide-time
                    :time="startDateForMonthly"
                    :messages="messages"
                    @change="date => $emit('change-monthly-date', date)"
                />
            </template>
            <template v-else>
                <format-date-input
                    small
                    hide-time
                    :time="startDateForPeriod"
                    :messages="messages"
                    @change="date => $emit('change-start-date', date)"
                />
                <format-date-input
                    small
                    hide-time
                    :time="endDateForPeriod"
                    :messages="messages"
                    @change="date => $emit('change-end-date', date)"
                />
            </template>
        </navigation-item>
        <navigation-item>
            <ResourcePopup
                :popupPositionLeft="true"
                :resources="resources"
                :default-selected-resource-index="resourceTabIndex"
                @submit="data => $emit('submit-resources', data)"
            ></ResourcePopup>
        </navigation-item>
    </navigation-bar>
</template>

<script>
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup.vue';
import componentMessages from '@vuejs/component/messages';

export default {
    inject: ['i18n'],
    components: {
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        ResourcePopup,
    },
    props: {
        searchRangeType: {
            type: String,
            required: true,
        },
        startDateForMonthly: {
            type: Object,
            required: true,
        },
        startDateForPeriod: {
            type: Object,
            required: true,
        },
        endDateForPeriod: {
            type: Object,
            required: true,
        },
        resources: {
            type: Array,
            required: true,
        },
        resourceTabIndex: {
            type: Number,
            required: false,
            default: 0,
        },
        progress: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    data() {
        return {
            messages: componentMessages,
            searchTypes: [
                { text: this.i18n.monthly, value: 'monthly' },
                { text: this.i18n.period, value: 'period' },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
