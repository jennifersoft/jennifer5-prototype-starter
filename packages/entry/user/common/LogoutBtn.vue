<template>
    <btn :items="[{ text: i18n.logout }]" @click="logout" large />
</template>

<script>
import Btn from "@vuejs/component/button/Btn";
export default {
    name: "LogoutBtn",
    inject: {
        i18n: {
            default: {},
        },
    },
    components: {
        Btn,
    },
    methods: {
        logout() {
            localStorage.setItem('autoLogin', 'false');
            sessionStorage.clear();
            location.href = '/logout';
        },
    },
};
</script>

<style scoped></style>
