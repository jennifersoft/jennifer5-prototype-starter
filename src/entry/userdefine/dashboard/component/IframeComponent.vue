<template>
    <div class="iframe-component" :style="style">
        <iframe :src="iframeOption.url"></iframe>
    </div>
</template>

<script>
import { positionAndSizeStyle } from '@entry/userdefine/dashboard/component/common';

export default {
    name: 'IframeComponent',
    props: {
        iframeOption: {
            type: Object,
            required: true,
        },
    },
    computed: {
        style() {
            return positionAndSizeStyle(this.iframeOption);
        },
    },
};
</script>
<style lang="scss" scoped>
.iframe-component {
    position: absolute;
    @import 'themes.scss';
    @include themify($themes) {
        box-shadow: themed('component-box-shadow');
    }

    > iframe {
        position: absolute;
        border: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
