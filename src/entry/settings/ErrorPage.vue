<template>
    <http-error-page
        :code-message="'404 Not Found'"
        :title="i18nMessage.title"
        :message="i18nMessage.message"
    />
</template>

<script>
import { i18n } from '@common/utility';
import HttpErrorPage from '@entry/error/HttpErrorPage';

export default {
    components: {
        HttpErrorPage,
    },
    data() {
        return {
            i18nMessage: {
                title: i18n.get('M0094'),
                message: i18n.get('M0657'),
            },
        };
    },
};
</script>

<style scoped></style>
