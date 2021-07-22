<template>
    <div class="talk-list">
        <div ref="container" class="list">
            <div
                class="item"
                v-for="item in articles"
                @click="onLinkArticle(item.key)"
                :class="[activeKey == item.key ? 'active' : '']"
                :key="item.id"
                :title="item.title"
            >
                <div
                    class="subject"
                    v-if="search !== ''"
                    v-html="item.searchedTitle"
                ></div>
                <div class="subject" v-else v-html="item.title"></div>

                <div class="description">
                    <span class="writer">{{ item.writeId }}</span>
                    <span class="date">{{ item.writeTime }}</span>
                </div>
            </div>
        </div>
        <div class="page-navi row">
            <div class="col col-3">
                <svg-icon
                    :icon-type="iconType.firstPage"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="onChangePaging(0)"
                ></svg-icon>
                <svg-icon
                    :icon-type="iconType.chevronLeft"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="onChangePaging(currentPage - 1)"
                ></svg-icon>
            </div>

            <div class="col col-6" align="center">
                <span>{{ pageText }}</span> of <span>{{ totalCount }}</span>
            </div>

            <div class="col col-3" align="right">
                <svg-icon
                    :icon-type="iconType.chevronRight"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="onChangePaging(currentPage + 1)"
                ></svg-icon>
                <svg-icon
                    :icon-type="iconType.lastPage"
                    :width="iconSize"
                    :height="iconSize"
                    @click.native="onChangePaging(lastPage)"
                ></svg-icon>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import { ICON_TYPE } from '@vuejs/component/icon/iconType';
import { mapState, mapActions } from '../constant';

const screenCount = 20;

export default {
    components: {
        SvgIcon,
    },
    computed: {
        ...mapState({
            pageText: state => {
                const start = state.page * screenCount + 1;
                const end = start + screenCount - 1;
                return `${start}-${
                    end > state.totalCount ? state.totalCount : end
                }`;
            },
            lastPage: state => {
                return Math.floor(state.totalCount / screenCount);
            },
            currentPage: state => state.page,
            totalCount: state => state.totalCount,
            articles: state => {
                if (state.search != '') {
                    state.list.forEach(item => {
                        item.searchedTitle = item.title
                            .split(state.search)
                            .join(
                                `<span style="font-style: italic; text-decoration: underline;">${state.search}</span>`
                            );
                    });
                }
                return state.list;
            },
            activeKey: state => state.article.key,
            search: state => state.search,
        }),
    },
    data() {
        return {
            iconType: ICON_TYPE,
            iconSize: 13,
        };
    },
    methods: {
        ...mapActions({
            searchArticles: 'searchArticles',
            loadArticles: 'loadArticles',
        }),
        onChangePaging(page) {
            if (page < 0 || page > this.lastPage) return;

            // 마지막 페이지 처리
            if (page === this.lastPage && this.totalCount % screenCount === 0) {
                page -= 1;
            }

            if (this.search !== '')
                this.searchArticles({
                    page: page,
                    key: 'paging',
                    search: this.search,
                });
            else this.loadArticles({ page: page, key: 'paging' });
        },
        onLinkArticle(key) {
            const link = `/report/board?page=${this.currentPage}&key=${key}`;
            location.href =
                link + (this.search !== '' ? `&search=${this.search}` : '');
        },
    },
    mounted() {
        const $scroll = this.$refs.container;

        $scroll.addEventListener('scroll', e => {
            sessionStorage.talkListScrollTop = e.target.scrollTop;
        });

        $scroll.scrollTop = sessionStorage.talkListScrollTop || 0;
    },
};
</script>

<style lang="scss" scoped>
.talk-list {
    display: flex;
    flex-direction: column;

    > .list {
        height: calc(100% - 56px);
        max-height: calc(100% - 56px);
        overflow-y: auto;

        > .item {
            padding: 16px 19px;
            cursor: pointer;

            > .subject {
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                > .search {
                    text-decoration: underline;
                }
            }
            > .description {
                font-size: 11px;
            }
        }
    }

    > .page-navi {
        padding: 6px 16px;
        height: 16px;
        svg {
            cursor: pointer;
        }
    }
}
</style>
