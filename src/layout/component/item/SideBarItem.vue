<template>
    <tooltip :message="menuName.displayName">
        <div class="side-bar-item"
             :class="{ active, dotted }"
             @click="$emit('click', menuName.key)">
            <svg-icon :style="{ color: fillColor }"
                      :icon-type="icons[menuName.key]" />
        </div>
    </tooltip>
</template>

<script>
import { ICON_TYPE } from "@vuejs/component/icon/iconType";
import SvgIcon from "@vuejs/component/icon/SvgIcon";
import Tooltip from "@vuejs/component/tooltip/Tooltip";

export default {
    name: "SideBarItem",
    components: {
        SvgIcon,
        Tooltip,
    },
    inject: {
        i18n: {
            default: {},
        },
    },
    props: {
        menuName: {
            type: Object,
            required: true,
            validator(n) {
                return 'key' in n && 'displayName' in n;
            }
        },
        active: {
            type: Boolean,
            default: false,
        },
        dotted: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default: 'default',
            validator(s) {
                return ['success', 'danger', 'default'].includes(s);
            }
        }
    },
    computed: {
        fillColor() {
            switch (this.status) {
                case 'success':
                    return '#1fa558';
                case 'danger':
                    return '#df2c34';
                default:
                    return '#fff';
            }
        }
    },
    created() {
        this.icons = {
            dashboard: ICON_TYPE.dashboard,
            userDefinedDashboard: ICON_TYPE.userDefinedDashboard2,
            analysis: ICON_TYPE.analysis,
            statistics: ICON_TYPE.chartPieStroke,
            report: ICON_TYPE.report2,
            alarm: ICON_TYPE.bell,
            talk: ICON_TYPE.talk,
            setting: ICON_TYPE.settings,
            userMenu: ICON_TYPE.userStroke,
            notice: ICON_TYPE.caution3,
        };
    }
}
</script>

<style lang="scss" scoped>
.side-bar-item {

    display: flex;
    align-items: center;
    opacity: 0.5;
    transition: opacity 0.18s ease-in-out;
    cursor: pointer;
    position: relative;

    &.active, &.dotted, &:hover {
        opacity: 1;
    }

    &.dotted {
        &::before {
            content: ' ';
            position: absolute;
            top: 10px;
            left: -10px;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
        }
    }
}
</style>