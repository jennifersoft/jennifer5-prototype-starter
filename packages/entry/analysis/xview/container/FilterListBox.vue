<template>
    <div class="filter-list-box">
        <div class="text">{{ title }}</div>
        <div class="filter-list">
            <btn
                v-for="filter in filterList"
                class="edge-pill"
                :key="filter.key"
                :class="{ primary: filter.active }"
                :type-in-group-button="'noselect'"
                :items="items(filter)"
                @click="clickFilter"
            />
        </div>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { i18n } from '@common/utility';
import { mapActions } from 'vuex';
export default {
    name: 'FilterListBox',
    inject: {
        i18n,
        theme: {
            type: String,
            default: 'classic',
        },
    },
    components: {
        Btn,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        filterList: {
            type: Array,
            required: true,
            default: () => [],
        },
    },
    methods: {
        ...mapActions('xviewAnalysis', ['toggleFilter', 'removeFilter']),
        clickFilter(item) {
            if (item.value === 'toggle')
                this.toggleFilter({ type: this.type, key: item.key });
            else if (item.value === 'remove')
                this.removeFilter({ type: this.type, key: item.key });
        },
        items(filter) {
            const text = filter.standardTime
                ? `${this.i18n[filter.standardTime]} ${filter.inequality} ${
                      filter.data
                  }`
                : filter.data;

            return [
                { text, value: 'toggle', key: filter.key },
                { iconType: this.closeIcon, value: 'remove', key: filter.key },
            ];
        },
    },
    created() {
        this.closeIcon = ICON_TYPE.close;
    },
};
</script>

<style lang="scss" scoped>
.filter-list-box {
    > .text {
        font-size: 11px;
        @import '~@vuejs/component/themes.scss';
        @include themify($themes) {
            color: themed('typography-color-grey1');
        }
    }
    > .filter-list {
        margin-top: 8px;
        .aries-ui-btn {
            margin-right: 5px;
            margin-bottom: 5px;
            & + .aries-ui-btn {
                margin-left: 0;
            }
        }
    }
}
</style>
