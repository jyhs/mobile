import {mapActions} from 'vuex';
import {AvatarBasePath} from '../../../constants/index';

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            cartList: undefined,
            groupName: ''
        };
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
            'getCartByGroupIdAndUserId',
            'deleteCartById'
        ]),

        async initData() {
            const {groupId, userId} = this.$route.params;
            const {name} = this.$route.query;

            this.groupName = name;
            this.cartList = await this.getCartByGroupIdAndUserId({
                groupId,
                userId
            });
            for (let cart of this.cartList) {
                this.$set(cart, 'userAvatar', `${AvatarBasePath}?id=${cart.user_id}`);
            }
        },


        handleActions(item, actionType) {
            switch (actionType) {
                case 'return':
                    this.$router.push('/');
                    break;
                case 'delete':
                    this.handleDeleteCart(item);
                    break;
                default:
                    break;
            }
        },

        handleDataRefresh(done) {
            this.initData();
            done();
        },

        handleDeleteCart(cart) {
            this.$vux.confirm.show({
                title: '确定删除',
                content: '确定删除该购物车吗？',
                onConfirm: async () => {
                    const result = await this.deleteCartById({
                        id: cart.id,
                    });
                    if (result.status === 'ok') {
                        this.$vux.toast.show({
                            type: 'success',
                            text: `删除成功`
                        });
                        this.initData();
                    }
                }
            });
        },

        mapDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
            const day =  date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : (date.getDate() + 1);
            return `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }
    }
};