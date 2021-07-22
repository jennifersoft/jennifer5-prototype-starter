<template>
    <div class="app">
        <!-- Domain 목록 -->
        <template v-if="screenMode === 'list'">
            <div class="title">
                {{ i18nMessages.title }}
            </div>

            <tool-bar></tool-bar>

            <div class="domain-group-activation">
                <span class="sub-title">{{
                    i18nMessages.domainGroupActivation
                }}</span>
                <toggle-switch
                    normal
                    :active="useDomainGroup"
                    @change="onChangeUseDomainGroup"
                ></toggle-switch>
            </div>

            <div class="domain-list-group">
                <div class="sub-title">{{ i18nMessages.domainList }}</div>
                <domain-list></domain-list>
            </div>
        </template>
        <template v-else-if="screenMode === 'modify'">
            <div class="title">
                <back-button></back-button>
            </div>
            <tool-bar></tool-bar>
            <detail-domain :is-new="false"></detail-domain>
        </template>
        <template v-else-if="screenMode === 'write'">
            <div class="title">{{ i18nMessages.newDomain }}</div>
            <detail-domain :is-new="true"></detail-domain>
        </template>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import ToggleSwitch from '@vuejs/component/Toggle/ToggleSwitch';
import ToolBar from './container/ToolBar';
import DomainList from './container/DomainList';
import BackButton from './container/BackButton';
import DetailDomain from './container/DetailDomain';
import i18nMessages from './i18n';
import { mapState, mapActions } from './vuex';

export default {
    provide: {
        i18n: i18nMessages,
    },
    components: {
        Btn,
        ToggleSwitch,
        ToolBar,
        DomainList,
        BackButton,
        DetailDomain,
    },
    data() {
        return {
            i18nMessages,
        };
    },
    computed: {
        ...mapState({
            screenMode: state => state.screenMode,
            useDomainGroup: state => state.useDomainGroup,
        }),
    },
    methods: {
        ...mapActions([
            'loadUseDomainGroup',
            'changeUseDomainGroup',
            'loadDomainGroupTree',
        ]),
        async onChangeUseDomainGroup(active) {
            await this.changeUseDomainGroup(active);
            await this.loadDomainGroupTree();
        },
    },
    async created() {
        await this.loadUseDomainGroup();
        await this.loadDomainGroupTree();
    },
};
</script>

<style lang="scss" scoped>
@import '../../basic/base';
@import './themes';

.app {
    .sub-title {
        font-weight: bold;
        font-size: 14px;
    }

    @include themify($themes) {
        position: relative;

        > .domain-group-activation {
            display: flex;
            margin-top: 24px;
            padding-bottom: 40px;
            border-bottom: 1px solid themed('common-border-color');

            > span {
                display: inline-flex;
                align-items: center;
                margin-right: 120px;
            }
        }

        > .domain-list-group {
            > .sub-title {
                margin: 24px 0;
            }
        }
    }
}
</style>
