<template>
    <div class="talk-contents">
        <div class="body-scroll">
            <talk-article
                    @modify-article="(payload) => $emit('active-form', payload)"
            ></talk-article>
            <talk-comments></talk-comments>
        </div>
    </div>
</template>

<script>
    import TalkArticle from "./talkContents/talkArticle"
    import TalkComments from "./talkContents/talkComments";

    export default {
        components: {
            TalkArticle,
            TalkComments
        }
    }
</script>

<style lang="scss" scoped>
    .talk-contents {
        > .body-scroll {
            padding: 24px;
            max-height: calc(100% - 75px);
            overflow-y: auto;
        }
    }
</style>