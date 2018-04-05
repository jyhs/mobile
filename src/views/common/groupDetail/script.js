import {mapActions} from 'vuex';
import {Badge, Alert, Popover} from 'vux';
import {SmallImageBasePath} from '../../../constants/index'

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            group: {},
            groupCount: '',
            details: [],
            cart: {},
            detailsInCart: [],
            cartDetailIds: [],
            showTip: false,
            preDetail: {},
            imagePath: ''
        };
    },

    components: {
        Badge,
        Alert,
        Popover
    },

    async created() {
        const {id} = this.$route.params;

        this.$vux.loading.show({
            text: '努力加载中'
        });
        this.group = (await this.getGroupById({id}))[0] || {};
        this.groupCount = (await this.getCountById({id: this.group.id}))[0].sum || 0;
        this.details = await this.getDetailsByBillId({id: this.group.bill_id}) || [];
        this.cart = (await this.getCartUnderUserByGroupId({
            groupId: this.group.id,
            userId: this.currentUserId
        }))[0];
        this.$vux.loading.hide();

        if (this.alreadyHasCartUnderGroup()) {
            this.updateDetailsInCart();
        } else {
            this.addNewCartUnderGroup();
        }
    },

    methods: {
        ...mapActions([
            'getGroupById',
            'getCountById',
            'getDetailsByBillId',
            'getCartUnderUserByGroupId',
            'getDetailsByCartId',
            'addCart',
            'updateCartDetail',
            'getEncyImageById',
            'deleteDetailById'
        ]),

        async handleDataRefresh(done) {
            const {id} = this.$route.params;
            this.group = (await this.getGroupById({id}))[0] || {};
            done();
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'tip':
                    this.showTip = true;
                    break;
                case 'buyCart':
                    this.$router.push({
                        name: actionType,
                        params: {
                            groupId: this.group.id,
                            cartId: this.cart.id
                        }
                    });
                    break;
                default:
                    break;
            }
        },

        async handleDetailImageShow (detail) {
            if (!detail['material_id']) {
                this.preDetail = detail;
                this.imagePath = require('../../../assets/others/default_detail.svg');
                return;
            }
            if (detail.id === this.preDetail.id) {
                return;
            }

            this.preDetail = detail;
            this.imagePath = '';
            let result = {};
            try {
                result = await this.getEncyImageById({id: detail['material_id']});
            } catch (error) {
                console.error(error);
            }

            if (result.status === 'ok') {
                if (result.image) {
                    this.imagePath = `${SmallImageBasePath}${result.image}`;
                } else {
                    this.imagePath = require('../../../assets/others/default_detail.svg');
                }
            }
        },

        alreadyHasCartUnderGroup() {
            if (this.cart === undefined) {
                return false;
            }
            if (!this.cart) {
                return false;
            } else if (!this.cart.id) {
                return false;
            }

            return true;
        },

        async updateDetailsInCart() {
            const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUserId}_${this.group.id}`;
            const detailsInLocalStore = JSON.parse(window.localStorage.getItem(detailsInCartKey));
            if (detailsInLocalStore && detailsInLocalStore.length) {
                this.detailsInCart = detailsInLocalStore;
            } else {
                const result = (await this.getDetailsByCartId({
                    cartId: this.cart.id
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

            const cartDetailIds = this.getCartDetailsIds();
            this.details.map(item => {
                if (cartDetailIds.indexOf(item.id) === -1) {
                    this.$set(item, 'count', 0);
                }
            });
        },

        getCartDetailsIds() {
            this.cartDetailIds = this.detailsInCart.map(detail => {
                return detail.id;
            });
            return this.cartDetailIds;
        },

        async addNewCartUnderGroup() {
            try {
                const result = await this.addCart({
                    group_bill_id: this.group.id,
                    user_id: this.currentUserId,
                    status: 0
                });
                if (result.status === 'ok') {
                    this.cart = (await this.getCartUnderUserByGroupId({
                        groupId: this.group.id,
                        userId: this.currentUserId
                    }))[0];
                }
            } catch (error) {
                console.error(error);
            }
        },

        async handleCartDetail(detail) {
            const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUserId}_${this.group.id}`;
            if (this.cartDetailIds.includes(detail.id)) {
                const detailsInStore = JSON.parse(window.localStorage.getItem(detailsInCartKey)) || [];
                const idsInStore = detailsInStore.map(item => item.id);
                if (idsInStore.includes(detail.id)) {
                    window.localStorage.setItem(detailsInCartKey, JSON.stringify(detailsInStore.filter(item => item.id !== detail.id)));
                    for (let i = 0; i < this.detailsInCart.length; i++) {
                       if (this.detailsInCart[i].id === detail.id) {
                           this.detailsInCart.splice(i, 1);
                       }
                    }
                } else {
                    this.$vux.loading.show();
                    let result = {};
                    try {
                        result = await this.deleteDetailById({
                            cart_id: this.cart.id,
                            bill_detail_id: detail.id
                        });
                    } catch (error) {
                        console.error(error);
                    }
                    this.$vux.loading.hide();

                    if (result.status === 'ok') {
                        for (let i = 0; i < this.detailsInCart.length; i++) {
                            if (this.detailsInCart[i].id === detail.id) {
                                this.detailsInCart.splice(i, 1);
                            }
                        }
                    }
                }
            } else {
                const copyDetail = {...detail};
                copyDetail.groupId = this.group.id;
                copyDetail.count = 1;
                copyDetail.checked = true;
                this.detailsInCart.push(copyDetail);
                window.localStorage.setItem(detailsInCartKey,
                    JSON.stringify((JSON.parse(window.localStorage.getItem(detailsInCartKey)) || []).concat([copyDetail])));
                /*
                try {
                    await this.updateCartDetail({
                        cart_id: this.cart.id,
                        bill_detail_id: detail.id,
                        bill_detail_num: 1
                    });
                } catch (error) {
                    console.error(error);
                }
                */
            }
        },
    },

    watch: {
        'detailsInCart'() {
            this.getCartDetailsIds();
        }
    }
};