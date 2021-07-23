<template>
    <div class="side-bar-menu-layer">
        <div class="layer-header">
            <div class="title">{{ title }}</div>
        </div>
        <search
            v-if="!hideSearch"
            v-model="searchKeyword"
            :placeholder="i18n.searchMenu"
            :width="224"
        />
        <div class="menu-item-wrapper">
            <transition-group name="list">
                <menu-item
                    v-for="item in sortedList"
                    :active="isActiveMenu(item)"
                    :display-name="item.displayName"
                    :image-url="item.imageUrl"
                    :key="item.key"
                    @click="onClickMenu(item)"
                />
            </transition-group>
        </div>
    </div>
</template>

<script>
import MenuItem from '@layout/component/item/MenuItem';
import { MENU_COUNT_KEY } from '@layout/constant';
import Search from '@vuejs/component/input/Search';

export default {
    name: 'MenuLayer',
    inject: {
        theme: {
            default: 'classic',
        },
        i18n: {
            default: {},
        },
    },
    components: {
        MenuItem,
        Search,
    },
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '',
        },
        list: {
            type: Array,
            default: () => [],
            validator(l) {
                return l.every(e => 'key' in e && 'displayName' in e);
            },
        },
        hideSearch: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        sortedList() {
            const menuCountMap = this.getMenuCountMap();

            return this.list
                .map(item => {
                    return { ...item, hit: menuCountMap[item.key] || 0 };
                })
                .sort((a, b) => {
                    if (a.isDivision || b.isDivision) return 0;
                    return b.hit - a.hit;
                })
                .filter(e => {
                    if (this.searchKeyword.length === 0) return true;
                    return e.displayName
                        .toLowerCase()
                        .includes(this.searchKeyword.toLowerCase());
                });
        },
    },
    data() {
        return {
            searchKeyword: '',
        };
    },
    methods: {
        onClickMenu({ url }) {
            this.updateMenuCount(url);
            location.href = url;
        },
        isActiveMenu({ url }) {
            return location.pathname === url;
        },
        getMenuCountMap() {
            return JSON.parse(localStorage.getItem(MENU_COUNT_KEY) || '{}');
        },
        updateMenuCount(url) {
            const menuCountMap = this.getMenuCountMap();

            if (menuCountMap[url] && typeof menuCountMap[url] === 'number')
                menuCountMap[url] += 1;
            else menuCountMap[url] = 1;

            localStorage.setItem(MENU_COUNT_KEY, JSON.stringify(menuCountMap));
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@layout/style/layer-style.scss';
@import '~@vuejs/transition/listing.scss';

.side-bar-menu-layer {
    @include layer-style(256px);
    @include listing;
}
</style>
