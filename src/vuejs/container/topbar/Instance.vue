<template>
    <btn
        :title="longName"
        :items="[{ text: shortName }]"
        class=" border-none edge-pill instance"
        :class="{
            'primary-reverse': selected,
            stopped: stopped,
            unlicensed: unlicensed,
            warning: warning,
        }"
        v-tooltip="{
            content: statusMsg,
            bgColor: tooltipBGColor,
            color: tooltipColor,
            isScrolling: false,
        }"
        @click="select"
    ></btn>
</template>

<script>
import { ElementManager } from '@common/legacy/ElementManager';
import Btn from '@vuejs/component/button/Btn';
import VInstanceTooltip from './vInstanceTooltip';
import { Observer } from '@common/legacy/Observer';
import { DataKeywordInObserver } from '@common/ObserverKeyword';
import { LicenseStatusDef } from '@common/definition';

export default {
    name: 'Instance',
    directives: {
        tooltip: VInstanceTooltip,
    },
    components: {
        Btn,
    },
    props: {
        id: {
            type: String,
            required: true,
        },

        selected: {
            type: Boolean,
            required: false,
            default: false,
        },
        name: {
            type: String,
            required: false,
            default: undefined,
        },
    },
    data() {
        return {
            LicenseStatusDef: LicenseStatusDef,
            NEED_TOOLTIP_LICENSE_STATUS: [
                LicenseStatusDef.STOPPED,
                LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS,
            ],
            object: undefined,
        };
    },
    methods: {
        select() {
            this.$emit('select');
        },
    },
    computed: {
        stopped() {
            return this.object?.license_status === LicenseStatusDef.STOPPED;
        },

        unlicensed() {
            return (
                this.object?.license_status ===
                LicenseStatusDef.STOPPED_RECENTLY_LICENSE_PROBLEM_OCCURS
            );
        },

        //warning 상태 일때는, (stopped,unlicensed) 와는 다르게 데이터를 가져올수는 있다.
        warning() {
            return this.object?.statusMsg.includes('Not supported');
        },

        disabled() {
            return this.stopped || this.unlicensed || this.warning;
        },

        shortName() {
            return this.name ? this.name : this.object.shortName;
        },
        longName() {
            return this.object?.longName;
        },

        statusMsg() {
            return this.object?.statusMsg;
        },
        tooltipBGColor() {
            return this.stopped
                ? '#ff4f55'
                : this.unlicensed
                ? '#8652ff'
                : this.warning
                ? '#ffe400'
                : '';
        },
        tooltipColor() {
            return this.warning ? '#212121' : '#ffffff';
        },
    },
    created() {
        this.object = ElementManager.getValue(this.id);

        Observer.on(DataKeywordInObserver.INSTANCE_INFO_IN_DOMAIN, () => {
            this.object = ElementManager.getValue(this.id);
        });
    },
    mounted() {},
};
</script>
<style lang="scss" scoped>
.instance {
    margin: 2px 0;

    &.unlicensed,
    &.stopped,
    &.warning {
        //statusMsg를 툴팁으로 표시해야함.

        ::v-deep .item {
            opacity: 0.5;
        }
    }
}
</style>
