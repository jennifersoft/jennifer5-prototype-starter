<template>
    <transition name="fade" appear>
        <window
            class="detail-filter-window"
            :open-x="openX"
            :open-y="openY"
            :open-w="540"
            ref="w"
            hide-footer
            @cancel="$emit('close')"
            @apply="onUpdateFilter"
        >
            <template #subject>
                <span>{{ i18n.detailFiltering }}</span>
            </template>
            <div class="detail-filter-contents">
                <list-selector
                    v-for="filter in detailFilterData"
                    :key="filter.category"
                    class="detail-filter-item"
                    :list="filter.list"
                    :title-label="i18n[filter.category]"
                    :active-indexes="filtered[filter.category]"
                    no-search
                    multi-select
                    @check="list => onUpdateFilter(list, filter.category)"
                />
            </div>
        </window>
    </transition>
</template>

<script>
import Window from '@vuejs/component/window/Window';
import ListSelector from '@vuejs/component/ListSelector/ListSelector';
import { mapState, mapMutations } from '@entry/analysis/userAgent/store';

export default {
    name: 'DetailFilterWindow',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: () => ({
                apply: 'apply',
                cancel: 'cancel',
                detailFiltering: 'detailFiltering',
                browser: 'browser',
                os: 'os',
                device: 'device',
            }),
        },
    },
    props: {
        openX: {
            type: Number,
            required: true,
        },
        openY: {
            type: Number,
            required: true,
        },
    },
    components: {
        Window,
        ListSelector,
    },
    computed: {
        ...mapState({
            detailFilterData: state => state.detailFilterData,
            filtered: ({ filters }) => filters.details,
        }),
    },
    methods: {
        ...mapMutations(['updateFilteredDetails']),
        onUpdateFilter(filtered, category) {
            this.updateFilteredDetails({
                [category]: filtered.map(f => f.data),
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.detail-filter-window {
    .detail-filter-contents {
        display: flex;
        justify-content: space-between;
        .detail-filter-item {
            width: 160px;
        }
    }
}
.fade-enter-active {
    transition: all 0.3s;
}
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
