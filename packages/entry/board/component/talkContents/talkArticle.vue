<template>
    <div class="talk-article">
        <div class="top row">
            <div class="subject col col-9">
                <div class="title" v-html="article.title"></div>
                <div class="description">
                    <span class="writer">{{ article.writeId }}</span>
                    <span class="date">{{ article.writeTime }}</span>
                </div>
            </div>
            <div class="tool col col-3" v-if="loginId == article.writeId">
                <a class="link" @click="onClickModifyBtn">{{ i18n.modify }}</a>
                <span>|</span>
                <a class="link" @click="onClickDeleteBtn">{{ i18n.delete }}</a>
            </div>
        </div>
        <div class="bottom">
            <div class="content" v-html="article.description"></div>
            <div class="files" v-if="links.length > 0">
                <div class="file" v-for="link in links">
                    <a :href="link.href" :title="link.name" target="_blank">
                        <img :src="link.href" v-if="link.image" />
                        <span v-else>{{ link.name }}</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, IMAGE_EXTS } from '../../constant';

export default {
    inject: {
        i18n: {
            default: {
                modify: 'Modify',
                delete: 'Delete',
                M0270: 'Are you sure you want to delete?',
            },
        },
        loginId: {
            default: 'root',
        },
    },
    computed: {
        ...mapState({
            article: state => state.article,
            files: state => state.files,
            links: state => {
                return state.files.map(file => {
                    return {
                        name: file.name,
                        href: `/report/board/file/link?fileKey=${file.key}&key=${file.location.key}`,
                        image: IMAGE_EXTS.includes(
                            file.extension.toLowerCase()
                        ),
                    };
                });
            },
            search: state => state.search,
        }),
    },
    methods: {
        ...mapActions({
            deleteArticle: 'deleteArticle',
            loadFirstArticle: 'loadFirstArticle',
            searchArticles: 'searchArticles',
        }),
        onClickModifyBtn() {
            this.$emit('modify-article', {
                article: this.article,
                files: this.files,
            });
        },
        onClickDeleteBtn() {
            this.deleteArticle(this.article.key).then(isOK => {
                if (isOK) {
                    this.searchArticles({
                        page: 0,
                        key: 'paging',
                        search: this.search,
                    }).then(data => {
                        const firstKey =
                            data.list.length == 0 ? 'paging' : data.list[0].key;
                        location.href = `/report/board?page=${data.page}&key=${firstKey}&search=${this.search}`;
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~@entry/popup/activeServiceDetail/active-service-detail-table.scss';
.talk-article {
    > .top {
        display: flex;
        padding-bottom: 24px;

        > .subject {
            flex: 3;
            > .title {
                font-size: 16px;
                font-weight: bold;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            > .description {
                font-size: 12px;
                > .writer {
                    margin-right: 16px;
                }
            }
        }

        > .tool {
            flex: 1;
            display: inline-block;
            height: 42px;
            line-height: 42px;
            text-align: right;
            > .link {
                cursor: pointer;
            }
            > span {
                opacity: 0.3;
            }
        }
    }

    > .bottom {
        padding: 24px 0px;
        min-height: 400px;
        overflow: hidden;

        > .files {
            margin-top: 20px;
            > .file {
                margin-bottom: 5px;
                span {
                    text-decoration: underline;
                }
                img {
                    max-width: 100%;
                }
            }
        }
        > .content {
            ::v-deep .active-service-detail-table {
                @include table-style;
            }
        }
    }
}
</style>
