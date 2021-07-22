<template>
    <pre>{{ text }}</pre>
</template>

<script>
import { mapState, mapActions } from './vuex';

export default {
    props: {
        domainId: {
            type: Number,
            required: true,
        },
        instanceOid: {
            type: Number,
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
    },
    computed: {
        ...mapState({
            text: state => state.text,
        }),
    },
    methods: {
        ...mapActions(['loadText']),
    },
    beforeMount() {
        this.loadText({
            domainId: this.domainId,
            instanceOid: this.instanceOid,
            fileName: this.fileName,
        });
    },
};
</script>

<style lang="scss" scoped>
pre {
    padding: 18px 24px;
}
</style>
