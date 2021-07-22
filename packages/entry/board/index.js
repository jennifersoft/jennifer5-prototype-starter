import Vue from 'vue';
import _ from '@library/lodash';
import { i18n } from '@common/utility';
import { ClientUtilities } from '@common/legacy/ClientUtilities';
import { UIManager } from '@common/legacy/UIManager';
import store from '@vuejs/vuex/store';
import { ariesuser } from '@common/base';
import { state } from './store/state';
import { mutations } from './store/mutations';
import { actions } from './store/actions';
import AlertWindow from '@vuejs/component/window/AlertWindow';
import SearchBar from './component/searchBar';
import TalkList from './component/talkList';
import TalkContents from './component/talkContents';
import TalkWindow from '@vuejs/component/window/Window';
import SvgIcon from '@vuejs/component/icon/SvgIcon';
import LoadingIndicator from '@vuejs/component/Loading/LoadingIndicator';
import {
    STORE_NAMESPACE,
    mapState,
    mapMutations,
    mapActions,
    IMAGE_EXTS,
} from './constant';
import messages from '@vuejs/component/messages';
import '@layout/base.js';
import './index.scss';

const MB_SIZE = 1024 * 1024;
const MAX_UPLOAD_FILE_SIZE = 3;
const MAX_TOTAL_UPLOAD_FILE_SIZE = 10;

store.registerModule(STORE_NAMESPACE, {
    namespaced: true,
    state,
    mutations,
    actions,
});

new Vue({
    el: '#app',
    store,
    components: {
        AlertWindow,
        SearchBar,
        TalkList,
        TalkContents,
        TalkWindow,
        SvgIcon,
        LoadingIndicator,
    },
    provide: {
        i18n: {
            templateNavi: i18n.get('ui.navi.template'),
            reportNavi: i18n.get('ui.navi.report'),
            boardNavi: i18n.get('ui.navi.board'),
            talk: i18n.get('ui.navi.board'),
            newTalk: i18n.get('ui.label.board.write'),
            modify: i18n.get('ui.button.modify'),
            delete: i18n.get('ui.button.delete'),
            add: i18n.get('ui.button.add'),
            bookmark: i18n.get('ui.label.bookmark'),
            help: i18n.get('ui.label.help'),
            M0615: i18n.get('M0615'),
            M0368: i18n.get('M0368'),
            M0270: i18n.get('M0270'),
        },
        loginId: ariesuser.userId,
        language: ariesuser.language,
    },
    computed: {
        ...mapState({
            search: state => state.search,
            articles: state => state.list,
        }),
    },
    data() {
        return {
            messages,
            formStyles: {
                display: 'none',
                left: `${window.innerWidth / 2 - 400}px`,
                top: '155px',
                width: '800px',
                height: '508px',
            },
            formSubject: '',
            formContent: '',
            formFiles: [],

            originContent: '',
            contentReadOnly: false,

            alertMessage: '',
            isLoading: true,
        };
    },
    methods: {
        ...mapMutations({
            updateArticle: 'updateArticle',
        }),
        ...mapActions({
            loadFirstArticle: 'loadFirstArticle',
            loadArticles: 'loadArticles',
            saveArticle: 'saveArticle',
            searchArticles: 'searchArticles',
            uploadFile: 'uploadFile',
            deleteFiles: 'deleteFiles',
            changeFavorite: 'changeFavorite',
        }),
        onClickFormShow(data) {
            if (data != null) {
                this.formKey = data.article.key;
                this.formSubject = _.unescape(data.article.title);
                this.formContent = _.unescape(
                    data.article.description.split('<br />').join('\n')
                );
                this.formFiles = data.files.map(file => {
                    return {
                        originalName: file.name,
                        size: file.size,
                        fileKey: file.key,
                        ext: file.extension,
                        contentType: file.contentType,
                    };
                });

                // 길이가 4000이 넘어서 짤린 경우, 관련 데이터
                this.originContent = data.article.description;
                this.contentReadOnly = this.originContent.length == 4000;
            } else {
                this.formKey = null;
                this.formSubject = '';
                this.formContent = '';
                this.formFiles = [];
            }

            this.$set(this.formStyles, 'display', 'block');
        },
        onCancelFormLayer() {
            // 새 토크를 작성할 때, 파일 업로드를 했다면 다시 삭제하기
            if (this.formKey == null && this.formFiles.length > 0)
                this.deleteFiles(this.formFiles.map(file => file.fileKey));
            this.$set(this.formStyles, 'display', 'none');
        },
        onApplyFormLayer() {
            if (this.formSubject == '') {
                this.alertMessage = i18n.get('M0273');
                return;
            }

            this.saveArticle({
                key: this.formKey,
                title: this.formSubject,
                description: this.contentReadOnly
                    ? this.originContent
                    : this.formContent.split('\n').join('<br />'),
                files: JSON.stringify(this.formFiles),
            })
                .then(() => {
                    if (this.formKey == null) location.href = '/report/board';
                    else this.onCancelFormLayer();
                })
                .catch(e => {
                    if (e === 'xss') this.alertMessage = i18n.get('M0619');
                });
        },
        onDeleteUploadFile(key) {
            this.deleteFiles([key]).then(() => {
                this.formFiles = this.formFiles.filter(
                    file => file.fileKey != key
                );
            });
        },
        onChangeFavorite(status) {
            this.changeFavorite(status === 'focus').then(res => {
                if (res) location.reload();
                else this.alertMessage = i18n.get('M0483');
            });
        },
        getUploadedFileSize() {
            let total = 0;
            this.formFiles.forEach(file => {
                total += parseInt(file.size);
            });
            return total;
        },
        checkUploadFiles(files) {
            let checkCount = 0;
            let fileSizeSum = 0;
            let existNotAllowFile = false;

            for (let i = 0, len = files.length; i < len; i++) {
                let file = files[i];
                let size = +file.size;
                let tokens = file.name.split('.');
                let extension = tokens[tokens.length - 1];

                if (!IMAGE_EXTS.includes(extension.toLowerCase())) {
                    existNotAllowFile = true;
                    break;
                }

                if (size > MAX_UPLOAD_FILE_SIZE * MB_SIZE) {
                    checkCount++;
                    break;
                }

                fileSizeSum += size;
            }

            if (existNotAllowFile) {
                this.alertMessage = i18n.get('M0169');
                return false;
            }

            if (checkCount > 0) {
                this.alertMessage = i18n.get('M0369', [MAX_UPLOAD_FILE_SIZE]); // 개별 파일은 3MB 를 넘을 수 없습니다.
                return false;
            }

            let total = this.getUploadedFileSize() + fileSizeSum;
            if (total > MAX_TOTAL_UPLOAD_FILE_SIZE * MB_SIZE) {
                this.alertMessage = i18n.get('M0370', [
                    MAX_TOTAL_UPLOAD_FILE_SIZE,
                ]); // 전체 파일 사이즈는 10MB 를 넘길 수 없습니다.
                return false;
            }

            return true;
        },
        addUploadFiles(files) {
            if (this.checkUploadFiles(files)) {
                for (let i = 0; i < files.length; i++) {
                    this.uploadFile(files[i]).then(data => {
                        this.formFiles.push(data);
                    });
                }
            }
        },
        setContentEvents() {
            // TODO: 구조가 마음에 들지 않는다. 기존의 토크 게시물 때문에 유지한다.
            $('body').on('click', '.profile-popup-view', function() {
                const sid = $(this).data('profile-sid');
                const txid = $(this).data('profile-txid');
                const etime = $(this).data('profile-etime');

                UIManager.getXViewPointList(
                    sid,
                    [txid],
                    etime - ClientUtilities.ONE_MINUTE,
                    etime + ClientUtilities.ONE_MINUTE,
                    txid,
                    null,
                    null
                );
            });
        },
    },
    created() {
        if (location.search === '') {
            this.loadFirstArticle().then(res => {
                if (res) {
                    this.loadArticles({ page: 0, key: res.key }).then(() => {
                        this.isLoading = false;
                    });
                } else {
                    this.isLoading = false;
                }
            });
        } else {
            let data = { page: 0, key: '', search: '' };
            location.search
                .substr(1)
                .split('&')
                .forEach(item => {
                    let tokens = item.split('=');
                    data[tokens[0]] = tokens[1];
                });

            data.search = decodeURIComponent(data.search);

            if (data.search !== '')
                this.searchArticles(data).then(() => {
                    this.isLoading = false;
                });
            else
                this.loadArticles(data).then(() => {
                    this.isLoading = false;
                });
        }
    },
    mounted() {
        this.$refs.uploader.addEventListener('change', e => {
            this.addUploadFiles(e.target.files);
        });

        this.$refs.dragUploader.addEventListener('dragover', e => {
            e.preventDefault();
            e.currentTarget.classList.add('dragover');
        });

        this.$refs.dragUploader.addEventListener('drop', e => {
            e.preventDefault();
            e.currentTarget.classList.remove('dragover');
            this.addUploadFiles(e.dataTransfer.files);
        });

        this.$refs.dragUploader.style.opacity = 1;

        this.setContentEvents();
    },
});
