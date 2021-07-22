<template>
    <div class="domain-list-in-group">
        <div class="domain" v-for="domain in items">
            <input type="checkbox" @change="onCheckDomain(domain, $event)" />
            <span class="icon">
                <svg-icon
                    :icon-type="iconType"
                    :width="iconSize"
                    :height="iconSize"
                ></svg-icon>
            </span>
            <span class="text">
                {{ domain.shortName }}
            </span>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';

export default {
    inject: ['i18n'],
    components: {
        SvgIcon,
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            iconSize: 14,
            iconType: ICON_TYPE.domain,
        };
    },
    methods: {
        onCheckDomain(domain, event) {
            this.$emit('change', domain, event);
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../themes';
.domain-list-in-group {
    @include themify($themes) {
        > .domain {
            position: relative;
            height: 18px;
            > * {
                position: absolute;
                &.icon {
                    top: -1px;
                    left: 18px;
                }
                &.text {
                    top: -3px;
                    left: 36px;
                }
            }
            &:hover {
                .text {
                    color: themed('common-subject-font-color');
                }
            }
        }
    }
}
</style>
