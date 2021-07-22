<template>
    <div class="report-header">
        <div
            :class="['menu', templateStatus]"
            @click="onClickTemplateLink"
            v-if="useTemplate"
        >
            {{ i18nMessages.templateNavi }}
        </div>
        <div
            :class="['menu', documentStatus]"
            @click="onClickDocumentLink"
            v-if="useDocument"
        >
            {{ i18nMessages.reportNavi }}
        </div>
        <div class="right">
            <tooltip
                :message="i18nMessages.help"
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
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Tooltip from '@vuejs/component/tooltip/Tooltip';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { linkManual } from '@common/utility';
import i18nMessages from '../../i18n';

export default {
    components: {
        Btn,
        Tooltip,
    },
    props: {
        useTemplate: {
            type: Boolean,
            required: false,
            default: true,
        },
        useDocument: {
            type: Boolean,
            required: false,
            default: true,
        },
        menuItems: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    computed: {
        templateStatus() {
            return location.pathname.includes('/template/') ? 'active' : '';
        },
        documentStatus() {
            return location.pathname.includes('/document/') ? 'active' : '';
        },
    },
    data() {
        return {
            iconTypes: {
                help: ICON_TYPE.help,
            },
            i18nMessages,
        };
    },
    methods: {
        onClickTemplateLink() {
            if (this.templateStatus === '')
                location.href = '/report/template/list';
        },
        onClickDocumentLink() {
            if (this.documentStatus === '')
                location.href = '/report/document/list';
        },
        onClickOpenManual() {
            linkManual();
        },
    },
};
</script>

<style lang="scss" scoped>
@import './themes';

.report-header {
    @include themify($themes) {
        position: relative;
        height: 65px;
        line-height: 65px;
        text-align: center;
        background-color: themed('report-header-background-color');

        > .menu {
            display: inline-block;
            padding: 23px 24px 23px 24px;
            font-size: 16px;
            font-weight: bold;
            font-stretch: normal;
            font-style: normal;
            line-height: 1;
            letter-spacing: normal;
            cursor: pointer;
            color: themed('report-header-menu-font-color');

            &.active {
                cursor: default;
                color: themed('report-header-active-menu-font-color');
                border-bottom: 2px solid
                    themed('report-header-active-menu-border-color');
            }
        }

        > .right {
            position: absolute;
            top: 15px;
            right: 24px;
            font-size: 11px;
            display: flex;
            align-items: center;
            z-index: 2;
            text-align: left;
        }

        &::after {
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: themed('common-header-border-bottom');
        }
    }
}
</style>
