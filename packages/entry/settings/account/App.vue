<template>
    <div class="app">
        <div class="title">{{ i18nMessages.title }}</div>
        <div class="row">
            <div class="left">{{ i18nMessages.editProfile }}</div>
            <div class="right">
                <div class="form">
                    <div class="subject">{{ i18nMessages.userId }}</div>
                    <div class="input">
                        <input-field
                            normal
                            disabled
                            v-model="userForm.id"
                        ></input-field>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18nMessages.userName }}</div>
                    <div class="input">
                        <input-field
                            normal
                            :disabled="userForm.adapterMode"
                            v-model="userForm.name"
                        ></input-field>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18nMessages.company }}</div>
                    <div class="input">
                        <input-field
                            normal
                            :disabled="userForm.adapterMode"
                            v-model="userForm.company"
                        ></input-field>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form">
                        <div class="subject">{{ i18nMessages.dept }}</div>
                        <div class="input">
                            <input-field
                                normal
                                :disabled="userForm.adapterMode"
                                v-model="userForm.dept"
                            ></input-field>
                        </div>
                    </div>
                    <div class="form">
                        <div class="subject">{{ i18nMessages.jobTitle }}</div>
                        <div class="input">
                            <input-field
                                normal
                                :disabled="userForm.adapterMode"
                                v-model="userForm.jobTitle"
                            ></input-field>
                        </div>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18nMessages.cellphone }}</div>
                    <div class="input">
                        <input-field
                            normal
                            :disabled="userForm.adapterMode"
                            :validator="validatorCellphone"
                            v-model="userForm.cellphone"
                        ></input-field>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18nMessages.email }}</div>
                    <div class="input">
                        <input-field
                            normal
                            :disabled="userForm.adapterMode"
                            :validator="validatorEmail"
                            v-model="userForm.email"
                        ></input-field>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="left">{{ i18nMessages.changePassword }}</div>
            <div class="right">
                <div class="form">
                    <div class="subject">{{ i18nMessages.password }}</div>
                    <div class="input">
                        <password-input
                            normal
                            :disabled="userForm.adapterMode"
                            v-model="userForm.password"
                            autocomplete="new-password"
                        ></password-input>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">{{ i18nMessages.newPassword }}</div>
                    <div class="input">
                        <password-input
                            normal
                            :disabled="userForm.adapterMode"
                            v-model="userForm.newPassword"
                        ></password-input>
                    </div>
                </div>
                <div class="form">
                    <div class="subject">
                        {{ i18nMessages.confirmNewPassword }}
                    </div>
                    <div class="input">
                        <password-input
                            normal
                            :disabled="userForm.adapterMode"
                            v-model="userForm.confirmNewPassword"
                        ></password-input>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <btn
                class="primary"
                normal
                :loading="saveLoading"
                :items="[{ text: i18nMessages.saveChanges }]"
                @click="onClickSaveBtn"
            ></btn>
        </div>

        <alert-window
            :message="alertMessage"
            @cancel="() => (alertMessage = '')"
            v-if="alertMessage !== ''"
        ></alert-window>
    </div>
</template>

<script>
import Btn from '@vuejs/component/button/Btn';
import InputField from '@vuejs/component/Input/InputField';
import PasswordInput from '@entry/user/common/PasswordInput';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import { validCheckCellphone, validCheckEmail } from '@common/utility';
import { loadUserInfo } from '../basic/service';
import {
    loadPasswordPolicy,
    saveUserData,
    changeUserPassword,
} from './service';
import i18nMessages from './i18n';

export default {
    components: {
        Btn,
        InputField,
        PasswordInput,
        AlertWindow,
    },
    data() {
        return {
            userForm: {},
            saveLoading: false,
            alertMessage: '',
            i18nMessages,
        };
    },
    methods: {
        async onClickSaveBtn() {
            this.saveLoading = true;

            if (
                this.userForm.password === '' &&
                this.userForm.newPassword === '' &&
                this.userForm.confirmNewPassword === ''
            ) {
                await saveUserData(this.userForm);
                location.reload();
            } else {
                if (
                    this.userForm.newPassword !==
                    this.userForm.confirmNewPassword
                ) {
                    this.alertMessage = i18nMessages.M0105;
                } else {
                    const { data } = await changeUserPassword(
                        this.userForm.id,
                        this.userForm.password,
                        this.userForm.newPassword
                    );

                    if (data === 'M0116') {
                        await saveUserData(this.userForm);
                        location.reload();
                    } else if (data === 'M0104') {
                        const policy = await loadPasswordPolicy();
                        let msg = i18nMessages.M0104;
                        msg = msg.replace('%d', policy.data.passwordLength);
                        msg = msg.replace('%d', policy.data.minLowercase);
                        msg = msg.replace('%d', policy.data.minUppercase);
                        msg = msg.replace('%d', policy.data.minDigit);
                        msg = msg.replace('%d', policy.data.minSpecial);
                        this.alertMessage = msg;
                    } else {
                        this.alertMessage = i18nMessages[data];
                    }
                }
            }

            this.saveLoading = false;
        },
        async createUserInfo() {
            const { data } = await loadUserInfo();

            this.userForm = {
                ...data,
                newPassword: '',
                confirmNewPassword: '',
            };
        },
        validatorCellphone(value) {
            return validCheckCellphone(value);
        },
        validatorEmail(value) {
            return validCheckEmail(value);
        },
    },
    async created() {
        await this.createUserInfo();
    },
};
</script>

<style lang="scss" scoped>
@import '../basic/base.scss';

.app {
    .right {
        max-width: 480px;

        .form {
            margin-bottom: 16px;
            > .subject {
                margin-bottom: 8px;
            }
        }

        .form-group {
            display: flex;
            > .form {
                flex: 1;
                &:first-child {
                    margin-right: 16px;
                }
            }
        }
    }
}
</style>
