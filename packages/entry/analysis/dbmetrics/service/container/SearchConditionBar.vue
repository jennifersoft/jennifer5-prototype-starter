<template>
    <navigation-bar :types="serviceTypes"
                    :type-dropdown-width="195"
                    :show-search-btn="false"
                    @update:type="onChangeServiceType">
        <navigation-item>
            <format-date-input :time="startTime"
                               :messages="messages"
                               @change="updateStartTime"
                               disable-minute />
            <format-date-input :time="endTime"
                               :messages="messages"
                               @change="updateEndTime"
                               disable-minute />
        </navigation-item>
        <navigation-item :label="i18n.interval">
            <dropdown :items="intervalTypes"
                      :width="108"
                      @onchange="updateIntervalType"/>
        </navigation-item>
    </navigation-bar>
</template>

<script>
import { INTERVAL_TYPES, SERVICE_TYPES } from "../metadata";

import { mapState, mapMutations } from '../store';

import NavigationBar from "@vuejs/component/NavigationBar/NavigationBar";
import NavigationItem from "@vuejs/component/NavigationBar/NavigationItem";
import FormatDateInput from "@vuejs/component/Input/FormatDateInput";
import Dropdown from "@vuejs/component/Dropdown/Dropdown";
import messages from "@vuejs/component/messages";

export default {
    name: 'SearchConditionBar',
    components: {
        NavigationBar,
        NavigationItem,
        FormatDateInput,
        Dropdown,
    },
    inject: {
        i18n: {
            default: () => ({
                searchTerm: 'Search Term',
                showStartTime: 'Show Start Time',
                viewByDate: 'View By Date',
                interval: 'Interval',
                type: 'Type'
            }),
        },
    },
    computed: {
        ...mapState({
            startTime: state => state.startTime,
            endTime: state => state.endTime,
            intervalType: state => state.intervalType,
            serviceType: state => state.serviceType,
            serviceHashes: state => state.serviceHashes
        })
    },
    methods: {
        ...mapMutations([
            'updateStartTime',
            'updateEndTime',
            'updateServiceType',
            'updateIntervalType',
            'resetServiceNames',
            'updateServiceMetrics',
        ]),
        onChangeServiceType(item) {
            const { value: type } = item;
            if (this.serviceType !== type) {
                this.resetServiceNames();
                this.updateServiceMetrics([]);
            }
            this.updateServiceType(item)
        }
    },
    data() {
        return {
            intervalTypes: INTERVAL_TYPES,
            serviceTypes: SERVICE_TYPES
        }
    },
    created() {
        this.messages = messages;
    }
}
</script>

<style lang='scss' scoped>
</style>
