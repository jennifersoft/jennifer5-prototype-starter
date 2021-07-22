<template>
    <div class="talk-comments">
        <div class="input-box row">
            <div class="col main">
                <textarea
                    type="text"
                    rows="1"
                    :placeholder="i18n.M0368"
                    v-model="content"
                    @keyup.enter.prevent="() => onSaveComment(true)"
                ></textarea>
            </div>
            <div class="col sub">
                <btn
                    :items="[{ text: i18n.add }]"
                    @click="() => onSaveComment(false)"
                ></btn>
            </div>
        </div>

        <comment
            v-for="item in comments"
            :key="item.key"
            :comment-key="item.key"
            :writer="item.writeId"
            :date="item.writeTime"
            :content="item.content"
            @delete-comment="onDeleteComment"
        ></comment>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import Comment from './talkComments/comment';
import { mapState, mapActions } from '../../constant';

export default {
    components: {
        Btn,
        Comment,
    },
    inject: {
        i18n: {
            default: {
                add: 'Add',
                M0368: 'Please enter a comment.',
            },
        },
        language: {
            default: 'en',
        },
    },
    computed: {
        ...mapState({
            articleKey: state => state.article.key,
            comments: state => state.comments,
        }),
    },
    data() {
        return {
            content: '',
        };
    },
    methods: {
        ...mapActions({
            saveComment: 'saveComment',
            deleteComment: 'deleteComment',
        }),
        onSaveComment(isEnter) {
            // TODO: 일본어일 때, 엔터키 이벤트는 막는다. 차후에 InputField 컴포넌트가 개선되면 다시 수정하자.
            if (isEnter && this.language === 'ja') return;

            if (this.content !== '' && this.content !== '\n') {
                this.saveComment({
                    articleKey: this.articleKey,
                    content: this.content,
                });
            }

            this.content = '';
        },
        onDeleteComment(key) {
            this.deleteComment({ key: key, articleKey: this.articleKey });
        },
    },
};
</script>

<style lang="scss" scoped>
.talk-comments {
    > .input-box {
        padding: 24px;
        margin-bottom: 26px;

        > .main {
            width: calc(100% - 130px);
            > textarea {
                font-family: inherit;
                height: 64px;
                padding: 12px;
                border-radius: 2px;
            }
        }

        > .sub {
            padding-left: 16px;
            width: 130px;
        }
    }
}
</style>
