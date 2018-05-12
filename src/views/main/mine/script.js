import {mapActions} from 'vuex';
import {AvatarBasePath} from '../../../constants/index';

export default {
    data() {
        return {
            currentUser: {},
            avatarImgPath: ''
        }
    },

    async created() {
        const currentUserId = parseInt(window.localStorage.getItem('SeawaterLoginUserId'));
        this.currentUser = (await this.getUserById({
            id: currentUserId
        }))[0];
        this.avatarImgPath = `${AvatarBasePath}?id=${currentUserId}`;
    },

    methods: {
        ...mapActions([
            'getUserById',
            'getUserAvatar',
            'logout'
        ]),

        handleActions(actionType) {
            switch (actionType) {
                case 'myGroups':
                case 'myCarts':
                case 'mySetting':
                    this.$router.push({name: actionType});
                    break;
                default:
                    break;
            }
        },

        handleLogout(group) {
            this.$vux.confirm.show({
                title: '确定退出',
                content: '确定退出登录吗？',
                onConfirm: async () => {
                    const result = await this.logout({
                        id: this.currentUser.id
                    });
                    if (result.status === 'ok') {
                        this.$vux.toast.show({
                            type: 'success',
                            message: `退出登录成功`
                        });
                        window.localStorage.clear();
                        window.sessionStorage.clear();
                        this.$router.push('/user/login/register');
                    }
                }
            });
        }
    }
}
