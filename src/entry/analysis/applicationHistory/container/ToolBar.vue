<template>
    <div class="tool-bar">
        <navigation-bar
            :loading="searchLoading"
            :disable-search-btn="searchDisabled"
            @search="onClickSearchButton"
        >
            <navigation-item>
                <format-date-input
                    small
                    hide-day
                    hide-time
                    :time="monthlyDate"
                    :messages="messages"
                    @change="selectMonthlyDate"
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
import NavigationBar from '@vuejs/component/NavigationBar/NavigationBar';
import NavigationItem from '@vuejs/component/NavigationBar/NavigationItem';
import FormatDateInput from '@vuejs/component/Input/FormatDateInput';
import ResourcePopup from '@vuejs/component/Resource/ResourcePopup/ResourcePopup.vue';
import componentMessages from '@vuejs/component/messages';
import { getDayjsUseFullYear } from '@common/base';
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
            searchLoading: state => state.searchLoading,
            monthlyDate: state =>
                getDayjsUseFullYear(state.year, state.month - 1, 1),
            resources: state => {
                return [{ resourceType: 'instance', tree: state.instanceData }];
            },
            checkedOids: state => state.checkedOids,
        }),
        buttons() {
            return [{ text: `${this.i18n.targetConfig}` }];
        },
        searchDisabled() {
            return this.checkedOids.length === 0;
        },
    },
    methods: {
        ...mapMutations([
            'changeTargetData',
            'selectMonthlyDate',
            'resetAllData',
            'updateFetching',
        ]),
        ...mapActions([
            'loadDeployCount',
            'loadDeployData',
            'loadResourceData',
        ]),
        onSubmitResourcePopup({ tree }) {
            const checkedOids = tree
                .filter(t => {
                    return t.check === 'on' && t.data.oid !== -1;
                })
                .map(t => t.data.oid);

            this.changeTargetData(checkedOids);
        },
        async onClickSearchButton() {
            this.updateFetching();
            this.resetAllData();
            await this.loadDeployCount();
            await this.loadDeployData();
            await this.loadResourceData();
            this.updateFetching(false);
        },
    },
};
</script>

<style lang="scss" scoped>
.tool-bar {
}
</style>
