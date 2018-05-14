import {mapActions} from 'vuex';
import {AvatarBasePath} from '../../../constants/index';

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            carts: []
        };
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'getCartsByUserId',
            'deleteCartById'
        ]),

        async initData() {
            const result = await this.getCartsByUserId({
                page: 1,
                size: 1000,
                userId: this.currentUserId
            });
            this.carts = result.res || [];
            for (let cart of this.carts) {
                this.$set(cart, 'userAvatar', `${AvatarBasePath}?id=${cart.user_id}`);
            }
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'main':
                    window.sessionStorage.setItem('SeawaterTabActiveIndex', 2);
                    window.sessionStorage.setItem('SeawaterGroupTabActive', 'group');
                    this.$router.push('/');
                    break;
                case 'cartDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            cartId: item.id,
                            groupId: item.group_id
                        }
                    });
                    break;
                case 'return':
                    this.$router.push('/');
                    break;
                default:
                    break;
            }
        },

        handleDataRefresh(done) {
            this.initData();
            done();
        },

        handleFinishGroup(group) {
            this.$vux.confirm.show({
                title: '确认结束',
                content: '确定结束热团吗？',
                onConfirm: async () => {
                    const result = await this.finishGroupByIdAndUserId({
                        id: group.id,
                        user_id: this.currentUserId
                    });
                    if (result.status === 'ok') {
                        this.$vux.toast.show({
                            type: 'success',
                            text: `结束团单${group.name}成功`
                        });
                        this.initData();
                    }
                }
            });
        }
    }
};