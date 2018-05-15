import {mapActions} from 'vuex';
import {XNumber, Group, XTextarea, XInput, Confirm} from 'vux';
import {compile} from '../../../util/data';
import {SmallImageBasePath} from '../../../constants/index';
import RegExp from '../../../constants/regExp';

export default {
    data() {
        return {
            max: 10000,
            currentUser: {},
            group: {},
            details: [],
            detailsInCart: [],
            totalCount: 0,
            phone: '',
            remark: '',
            currentItem: {},
            deleteConfirm: false
        };
    },

    components: {
        XNumber,
        Group,
        XTextarea,
        XInput,
        Confirm
    },

    async created() {
        const {groupId, cartId} = this.$route.params;
        this.$vux.loading.show({
            text: '努力加载中'
        });
        this.currentUser = (await this.getUserById({
            id: parseInt(window.localStorage.getItem('SeawaterLoginUserId'))
        }))[0];
        this.phone = this.currentUser.phone;

        this.group = (await this.getGroupById({id: groupId}))[0] || {};
        if (this.group.status === 0) {
            this.max = 0;
        }
        const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUser.id}_${this.group.id}`;

        this.details = await this.getDetailsByBillId({id: this.group.bill_id});

        const detailsInLocalStore = JSON.parse(window.localStorage.getItem(detailsInCartKey));
        if (detailsInLocalStore && detailsInLocalStore.length) {
            this.detailsInCart = detailsInLocalStore;
        } else {
            const result = (await this.getDetailsByCartId({
                cartId
            }))['res'];
            this.detailsInCart = this.details.filter(detail => {
                for (let item of result) {
                    if (detail.id === item.bill_detail_id) {
                        this.$set(detail, 'count', item['bill_detail_num']);
                        this.$set(detail, 'groupId', this.group.id);
                        return true;
                    }
                }
                return false;
            });
        }

        this.$vux.loading.hide();
    },

    methods: {
        ...mapActions([
            'getUserById',
            'getGroupById',
            'getDetailsByBillId',
            'getDetailsByCartId',
            'getEncyImageById',
            'updateCart',
            'updateCartDetail',
            'deleteDetailById'
        ]),

        handleDataRefresh(done) {
            done();
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'numberChange':
                    this.calculateCartCount();
                    break;
                case 'deleteConfirm':
                    this.currentItem = item;
                    this.deleteConfirm = true;
                    break;
                case 'groupDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: compile(this.group.id)
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

        async handleConfirmDelete() {
            const {cartId} = this.$route.params;
            let deleteIndex = -1;

            for (let i = 0; i < this.detailsInCart.length; i++) {
                if (this.detailsInCart[i].id === this.currentItem.id) {
                    deleteIndex = i;
                    break;
                }
            }
            if (deleteIndex !== -1) {
                this.$vux.loading.show({
                    text: '努力加载中'
                });
                let result = {};
                try {
                    result = await this.deleteDetailById({
                        cart_id: cartId,
                        bill_detail_id: this.currentItem.id
                    });
                } catch (error) {
                    console.error(error);
                }

                if (result.status === 'ok') {
                    this.detailsInCart.splice(deleteIndex, 1);
                    this.$vux.toast.show({
                        type: 'success',
                        text: `删除${this.currentItem.name}成功`
                    });
                }
                this.$vux.loading.hide();
            }
        },

        async handleSubmit() {
            if (!this.validSubmit()) {
                return;
            }
            const {cartId} = this.$route.params;
            let submitFlag = true;

            this.$vux.loading.show({
                text: '努力加载中'
            });
            const result = await this.updateCart({
                id: cartId,
                phone: this.phone,
                description: this.remark || undefined,
                sum: this.totalCount,
                status: 1
            });
            if (result.status) {
                for (let i = 0; i < this.detailsInCart.length; i++) {
                    try {
                        await this.updateCartDetail({
                            cart_id: cartId,
                            bill_detail_id: this.detailsInCart[i].id,
                            bill_detail_num: this.detailsInCart[i].count,
                            group_bill_id: this.group.id
                        });
                    } catch (error) {
                        console.error(error);
                        submitFlag = false;
                    }
                }
            } else {
                submitFlag = false;
            }
            this.$vux.loading.hide();

            if (submitFlag) {
                this.$vux.toast.show({
                    type: 'success',
                    text: '购买成功，准备分赃吧~~~'
                });
                this.$router.push({
                    name: 'myCarts'
                });
            }
        },

        async updateDetailsImg() {
            this.detailsInCart.map(async detail => {
                this.$set(detail, 'encyImage', `${SmallImageBasePath}?id=${detail.material_id}`);
            });
        },

        calculateCartCount() {
            this.$nextTick(() => {
                let cartCount = 0;
                for (let detail of this.detailsInCart) {
                    cartCount += detail.price * detail.count;
                }
                this.totalCount = cartCount;
                const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUser.id}_${this.group.id}`;
                window.localStorage.setItem(detailsInCartKey, JSON.stringify(this.detailsInCart));
            });
        },

        validSubmit() {
            if (!this.phone) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: '请填写联系电话'
                });
                return false;
            } else if (!RegExp.PhoneReg.test(this.phone)) {
                this.$vux.toast.show({
                    type: 'warn',
                    text: '请填写正确的联系电话'
                });
                return false;
            }
            return true;
        }
    },

    watch: {
        'detailsInCart'() {
            this.calculateCartCount();
            this.updateDetailsImg();
        }
    }
};