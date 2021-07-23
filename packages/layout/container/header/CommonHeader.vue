<template>
    <div class="common-header">
        <loading-indicator v-if="loading" />
        <div class="left" v-if="!hideDomainGroupBox">
            <tooltip
                :message="i18nMessages.domainGroup"
                :position="'bottom-left'"
                :cursor-none="true"
                :show-tooltip="
                    activeDomainTree && !hideDomainGroupBox ? false : undefined
                "
            >
                <btn
                    class="border-none domain-group-tree-btn"
                    :pressed="activeDomainTree"
                    :items="[{ iconType: iconTypes.hierarchy }]"
                    @click="onActiveDomainTree"
                    v-if="useDomainGroup === true"
                />
            </tooltip>

            <div class="divider" v-if="useDomainGroup === true" />

            <DomainGroupSelector
                @elementSelected="onSelectDomainGroup"
                :selectedOne="selectedOne"
                :domain-group-tree="domainList"
            />
        </div>
        <div class="subject" v-html="subject"></div>
        <div class="right">
            <slot name="tools"></slot>

            <more-button
                :items="menuItems"
                v-if="!hideMoreButton"
            ></more-button>

            <tooltip
                :message="description"
                :position="'bottom-right'"
                :cursor-none="true"
            >
                <btn
                    class="border-none"
                    normal
                    :items="[{ iconType: iconTypes.help }]"
                    @click="onClickOpenManual"
                />
            </tooltip>
        </div>

        <domain-tree-layer
            v-if="activeDomainTree && !hideDomainGroupBox && !hideDomainTree"
            @active-tree="onActiveDomainTree"
        />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import DomainGroupSelector from '@vuejs/component/domain/domainGroupSelector/DomainGroupSelector';
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import MoreButton from './MoreButton';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { linkManual, hashManual } from '@common/utility';
import LoadingIndicator from '@vuejs/component/loading/LoadingIndicator';

import i18nMessages from '../../i18n';
import DomainTreeLayer from '@layout/container/DomainTreeLayer';

const {
    mapState,
    mapGetters,
    mapMutations,
    mapActions,
} = createNamespacedHelpers('domain');

const serverMap = createNamespacedHelpers('server');

export default {
    props: {
        subject: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isDomainGroupPage: {
            type: Boolean,
            required: false,
            default: true,
        },
        hideDomainGroupBox: {
            type: Boolean,
            required: false,
            default: false,
        },
        hideDomainTree: {
            type: Boolean,
            required: false,
            default: false,
        },
        hideMoreButton: {
            type: Boolean,
            required: false,
            default: false,
        },
        menuItems: {
            type: Array,
            required: false,
            default: () => [],
        },
        manualLink: {
            type: String,
            required: false,
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        DomainGroupSelector,
        Btn,
        Tooltip,
        MoreButton,
        DomainTreeLayer,
        LoadingIndicator,
    },
    computed: {
        ...serverMap.mapState(['useDomainGroup']),
        ...mapState(['domainList', 'selectedOne', 'multiDomainFlag']),
    },
    data() {
        return {
            iconTypes: {
                help: ICON_TYPE.help,
                close: ICON_TYPE.close,
                hierarchy: ICON_TYPE.hierarchy,
            },
            activeDomainTree: false,
            i18nMessages,
        };
    },
    methods: {
        ...mapMutations(['selectDomain']),
        ...mapActions(['updateMultiDomainFlag']),
        onClickOpenManual() {
            if (this.manualLink === '') linkManual();
            else hashManual(this.manualLink);
        },
        onActiveDomainTree() {
            this.activeDomainTree = !this.activeDomainTree;
            this.$emit('active:tree', this.activeDomainTree);
        },
        onSelectDomainGroup(element) {
            this.selectDomain(element.treeIndex);
        },
    },
    beforeMount() {
        this.updateMultiDomainFlag(
            this.useDomainGroup ? this.isDomainGroupPage : false
        );
    },
};
</script>

<style lang="scss" scoped>
@import './themes';

.common-header {
    position: relative;
    height: 28px;
    padding: 18px 0;

    @include themify($themes) {
        background-color: themed('common-header-background-color');
        border-bottom: 1px solid themed('common-header-border-bottom');

        > div {
            position: absolute;
        }

        > .subject {
            color: themed('common-header-font-color');
            width: 100%;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }

        > .left {
            display: flex;
            z-index: 2000;
            left: 24px;
        }

        > .right {
            margin-top: -4px;
            right: 24px;
            font-size: 11px;
            display: flex;
            align-items: center;
        }

        .divider {
            width: 1px;
            height: 16px;
            margin: 0 8px;
            vertical-align: middle;
            align-self: center;
            display: inline-flex;
            background-color: themed('common-header-divider-border-color');
        }
    }
}
</style>
