<template>
    <popup-list-composed :offset-x="60" :offset-y="offsetTop" normal>
        <popup-list
            :items="accounts"
            :title="i18n.account"
            @update:active-index="$emit('click:user-menu', 'accountManagement')"
        />
        <popup-list :items="utilities" @update:active-index="onClickUtility" />
        <popup-list :items="extra" @update:active-index="onClickExtra" />
    </popup-list-composed>
</template>

<script>
import PopupListComposed from '@vuejs/component/dropdown/PopupListComposed';
import PopupList from '@vuejs/component/dropdown/PopupList';

export default {
    name: 'UserMenuLayer',
    inject: {
        i18n: {
            default: {
                account: 'Account',
                accountManagement: 'Account management',
                setting: 'Setting',
                myBackgroundJob: 'My background job',
                queryBuilder: 'Query builder',
                help: 'Help',
                about: 'About',
                logout: 'Logout',
            },
        },
    },
    props: {
        offsetTop: {
            type: Number,
            default: 0,
        },
        userInfo: {
            type: Object,
            default: () => ({
                name: '',
                email: '',
            }),
        },
    },
    components: {
        PopupList,
        PopupListComposed,
    },
    methods: {
        onClickUtility(index) {
            this.$emit('click:user-menu', this.utilities[index].value);
        },
        onClickExtra(index) {
            this.$emit('click:user-menu', this.extra[index].value);
        },
    },
    created() {
        const { name, email } = this.userInfo;
        this.accounts = [
            {
                text: `
                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                    <span class="marked">${name}</span>
                    ${
                        !!email
                            ? `<span style="font-size: 12px;">${email}</span>`
                            : ''
                    }
                </div>`,
                value: 'name',
                style: {
                    lineHeight: 1.2,
                    pointerEvents: 'none',
                },
            },
            {
                text: this.i18n.accountManagement,
                value: 'accountManagement',
                style: {
                    textDecoration: 'underline',
                },
            },
        ];
        this.utilities = [
            { text: this.i18n.setting, value: 'setting' },
            { text: this.i18n.myBackgroundJob, value: 'myBackgroundJob' },
            { text: this.i18n.queryBuilder, value: 'queryBuilder' },
            { text: this.i18n.help, value: 'help' },
        ];
        this.extra = [
            { text: this.i18n.about, value: 'about' },
            { text: this.i18n.logout, value: 'logout' },
        ];
    },
};
</script>

<style scoped></style>
