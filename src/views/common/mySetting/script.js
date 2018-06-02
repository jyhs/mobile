import {mapActions} from 'vuex';
import {Group, GroupTitle, XButton, XInput, XTextarea, Checker, CheckerItem} from 'vux';
import {AvatarBasePath, SmallImageBasePath} from '../../../constants/index';
import {isEmpty, toFormData} from '../../../util/common';

const ImageBasePath = {
    avatar: AvatarBasePath
};

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            avatarImgPath: '',
            user: {},
        };
    },

    components: {
        Group,
        GroupTitle,
        XButton,
        XInput,
        XTextarea,
        Checker,
        CheckerItem,
    },

    created() {
        this.initData();
    },

    mounted() {
        const ele = document.getElementById('loading');
        ele.style.display = 'none';
    },

    methods: {
        ...mapActions([
            'getUserById',
            'getUserAvatar',
            'uploadUserAvatar'
        ]),

        async initData() {
            const userEditing = (await this.getUserById({id: this.currentUserId}))[0];
            this.user = Object.assign({}, userEditing, {
                point: userEditing.point ? userEditing.point : '0',
                address: isEmpty(userEditing.address) ? '' : userEditing.address,
                contacts: isEmpty(userEditing.contacts) ? '' : userEditing.contacts,
                description: isEmpty(userEditing.description) ? '' : userEditing.description,
            });
            this.avatarImgPath = `${AvatarBasePath}?id=${this.currentUserId}&r=${Math.random()}`;
        },

        handleActions(item, actionType) {
            switch(actionType) {
                case 'return':
                    this.$router.back();
                    break;
                default:
                    break;
            }
        },

        async upload(e, which) {
            const file = (e.target || e.dataTransfer).files[0];
            if (!file) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: '请选择需要上传的图片'
                });
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: `上传图片不能超过2M`
                });
                return;
            }
            const fileType = file.type.substring(file.type.indexOf('/') + 1).toUpperCase();
            if (['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'].indexOf(fileType) === -1) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: `上传文件不是图片`
                });
                return;
            }

            this.$vux.loading.show({
                text: '努力加载中'
            });
            let result = {};
            if (which === 'avatar') {
                result = await this.uploadUserAvatar({
                    formData: toFormData({
                        img: file,
                        id: this.currentUserId
                    }),
                });
            } else {
                result = await this.uploadPayQrCode({
                    formData: toFormData({
                        img: file,
                        id: this.currentUserId,
                        pay_type: which === 'taobao' ? 'zfb' : 'wx'
                    }),
                });
            }
            this.$vux.loading.hide();

            if (result.status === 'ok') {
                this.avatarImgPath = `${AvatarBasePath}?id=${this.currentUserId}&r=${Math.random()}`;
                this.$vux.toast.show({
                    type: 'success',                    
                    text: `上传成功`
                });
            }
        }
    }
};