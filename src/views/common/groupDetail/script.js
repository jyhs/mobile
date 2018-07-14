import {mapActions} from 'vuex';
import {Search, Badge, Alert, Popover, Tab, TabItem, LoadMore, Confirm} from 'vux';
import {unCompile} from '../../../util/data';
import {SmallImageBasePath} from '../../../constants/index'

export default {
    data() {
        return {
            currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
            activeTab: 'hy',
            group: {},
            groupCount: '',
            allDetails: [],
            details: undefined,
            cart: {},
            detailsInCart: [],
            detailsInCartMap: {},
            cartDetailIds: [],
            totalPrice: 0,
            totalFreight: 0,
            showTip: false,
            preDetail: {},
            imagePath: '',
            isSearching: false,
            searchText: '',
            searchTimer: null,
            scrollUp: false,
            currentItem: {},
            deleteConfirm: false,
        };
    },

    components: {
        Search,
        Badge,
        Alert,
        Popover,
        Tab,
        TabItem, 
        LoadMore,
        Confirm
    },

    async activated() {
        const {id} = this.$route.params;
        const groupId = unCompile(id);

        this.group = (await this.getGroupById({id: groupId}))[0] || {};
        this.groupCount = (await this.getCountById({id: groupId}))[0].sum || 0;
        await this.initDetailsByType(this.activeTab);
        this.cart = (await this.getCartUnderUserByGroupId({
            groupId: this.group.id,
            userId: this.currentUserId
        }))[0];

        if (this.alreadyHasCartUnderGroup()) {
            this.updateDetailsInCart();
        } else {
            this.addNewCartUnderGroup();
        }
    },

    deactivated() {
        this.group = {};
        this.details = undefined;
        this.cartDetailIds = [];
        this.detailsInCart = [];
        this.totalPrice = 0;
        this.totalFreight = 0;
    },

    mounted() {
        const ele = document.getElementById('loading');
        const groupDetailContainer = document.getElementById('group-detail-container');
        ele.style.display = 'none';
        let startPageY = 0;
        groupDetailContainer.ontouchstart = (e) => {
            startPageY = e.touches[0].pageY;
            //console.log(startPageY);
        };
        groupDetailContainer.ontouchmove = (e) => {
            if (startPageY - e.touches[0].pageY > 10) {
                this.scrollUp = true;
                //console.log('1', this.scrollUp);
            }
        }
    },

    methods: {
        ...mapActions([
            'getGroupById',
            'getCountById',
            'getCartUnderUserByGroupId',
            'getDetailsByCartId',
            'addCart',
            'deleteDetailById',
            'getDetailsByBillId',
            'getBillDetailsById',
            'getBillShanhuDetailsById',
            'getBillUndefinedDetailsById',
            'updateCartAndDetail',
            'updateCart'
        ]),

        async initDetailsByType(type) {
            this.allDetails = await this.getDetailsByBillId({
                id: this.group.bill_id
            }) || [];
            if (type === 'sh') {
                this.details = await this.getBillShanhuDetailsById({
                    id: this.group.bill_id
                }) || [];
            } else if (type === 'wfl') {
                this.details = await this.getBillUndefinedDetailsById({
                    id: this.group.bill_id
                }) || [];
            } else {
                this.details = await this.getBillDetailsById({
                    id: this.group.bill_id,
                    category: type
                }) || [];
            }
            for (let ency of this.details) {
                this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.material_id || 0}`);
            }
            return this.allDetails;
        },

        async handleDataRefresh(done) {
            const {id} = this.$route.params;
            const groupId = unCompile(id);
            this.group = (await this.getGroupById({id: groupId}))[0] || {};
            done();
        },

        async handleTabItemClick (type) {
            this.activeTab = type;
            this.initDetailsByType(type);
        },

        handleSearchChange() {
            if (this.searchText) {
                window.clearTimeout(this.searchTimer);
                this.searchTimer = setTimeout(async () => {
                    this.details = await this.getDetailsByBillId({
                        id: this.group.bill_id,
                        name: this.searchText
                    });
                    for (let ency of this.details) {
                        this.$set(ency, 'encyImage', `${SmallImageBasePath}?id=${ency.material_id || 0}`);
                    }
                }, 500);
            }
        },

        handleActions(item, actionType) {
            switch (actionType) {
                case 'cartDetail':
                    if (this.detailsInCart.length) {
                        this.$router.push({
                            name: actionType,
                            params: {
                                groupId: this.group.id,
                                cartId: this.cart.id
                            }
                        });
                    } else {
                        this.showTip = true;
                    }
                    break;
                case 'encyDetail':
                    const materialId = item['material_id'];
                    if (materialId) {
                        this.$router.push({
                            name: actionType,
                            params: {
                                id: materialId,
                            }
                        });
                    } else {
                        this.$vux.toast.text('Sorry,没有匹配的生物')
                    }
                    break;
                case 'return':
                    this.$router.push('/');
                    break;
                case 'search':
                    this.isSearching = true;
                    this.searchText = '';
                    this.$nextTick(() => {
                        this.$refs.encySearch.setFocus();
                        this.details = [];
                    });
                    break;
                case 'encySearchCancel':
                    this.isSearching = false;
                    this.$nextTick(() => {
                        this.initDetailsByType(this.activeTab);
                    });
                    break;
                default:
                    break;
            }
        },

        async handleDetailImageShow (detail) {
            const materialId = detail['material_id'] || 0;
            if (!detail['material_id']) {
                this.preDetail = detail;
                this.imagePath = `${SmallImageBasePath}?id=${materialId}`;
                return;
            }
            if (detail.id === this.preDetail.id) {
                return;
            }

            this.preDetail = detail;
            this.imagePath = `${SmallImageBasePath}?id=${materialId}`;
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
            const result = (await this.getDetailsByCartId({
                cartId: this.cart.id
            }))['res'];
            this.detailsInCart = this.allDetails.filter(detail => {
                for (let item of result) {
                    if (detail.id === item.bill_detail_id) {
                        this.$set(detail, 'count', item['bill_detail_num']);
                        this.$set(detail, 'groupId', this.group.id);
                        return true;
                    }
                }
                return false;
            });

            const cartDetailIds = this.detailsInCart.map(detail => {
                return detail.id;
            });
            this.details && this.details.map(item => {
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

        calculateCartCount() {
            let totalPrice = 0;
            for (let detail of this.detailsInCart) {
                totalPrice += detail.count * detail.price;
            }
            this.totalPrice = totalPrice;
            return totalPrice;
        },

        calculateCartFreight() {
            let totalFreight = 0;
            for (let detail of this.detailsInCart) {
                const {price, count} = detail;
                if (this.group.top_freight) {
                    totalFreight += Math.min(price * this.group.freight, this.group.top_freight) * count;
                } else {
                    totalFreight += (count * price) * this.group.freight;
                }
            }
            this.totalFreight = Math.round(totalFreight * 100) / 100;
            return this.totalFreight;
        },

        generateDetailsInCartMap() {
            const detailsInCartMap = {};

            for (let detail of this.detailsInCart) {
                detailsInCartMap[detail.id] = detail.count;
            }
            this.detailsInCartMap = detailsInCartMap;
        },

        async addNewCartUnderGroup() {
            try {
                const result = await this.addCart({
                    group_bill_id: this.group.id,
                    user_id: this.currentUserId,
                    status: 1
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

        deleteConfirmFun(item) {
            this.currentItem = item;
            this.deleteConfirm = true;
        },

        async handleConfirmDelete() {
            let deleteIndex = -1;

            for (let i = 0; i < this.detailsInCart.length; i++) {
                if (this.detailsInCart[i].id === this.currentItem.id) {
                    deleteIndex = i;
                    break;
                }
            }
            if (deleteIndex !== -1) {
                this.$vux.loading.show('努力加载中');
                const result = await this.deleteDetailById({
                    cart_id: this.cart.id,
                    bill_detail_id: this.currentItem.id
                });
                
                if (result.status === 'ok') {
                    this.detailsInCart.splice(deleteIndex, 1);
                    this.$nextTick(async () => {
                        await this.updateCart({
                            id: this.cart.id,
                            phone: this.cart.phone,
                            description: this.cart.remark || undefined,
                            sum: this.calculateCartCount(),
                            freight: this.calculateCartFreight(),
                            status: 1
                        });
                    });
                    const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUserId}_${this.group.id}`;
                    window.sessionStorage.setItem(detailsInCartKey, JSON.stringify(this.detailsInCart));
                }
                this.$vux.loading.hide();
            }
        },

        async handleCartDetail(detail) {
            const detailsInCartKey = `SeawaterDetailsToCart_${this.currentUserId}_${this.group.id}`;
            if (this.cartDetailIds.includes(detail.id)) {
                const detailsInStore = JSON.parse(window.sessionStorage.getItem(detailsInCartKey)) || [];
                const idsInStore = detailsInStore.map(item => item.id);
                if (idsInStore.includes(detail.id)) {
                    window.sessionStorage.setItem(detailsInCartKey, JSON.stringify(detailsInStore.filter(item => item.id !== detail.id)));
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
                this.$nextTick(async () => {
                    const totalCount = this.calculateCartCount();
                    const totalFreight = this.calculateCartFreight();
                    const response = await this.updateCartAndDetail({
                        cart_id: this.cart.id,
                        bill_detail_id: detail.id,
                        bill_detail_num: 1,
                        group_bill_id: this.group.id,
                        org_bill_detail_num: 1,
                        sum: totalCount,
                        freight: totalFreight,
                    });

                    if (response.status === 'ok') {
                        window.sessionStorage.setItem(
                            detailsInCartKey,
                            JSON.stringify((JSON.parse(window.sessionStorage.getItem(detailsInCartKey)) || []
                        ).concat([copyDetail])));
                        this.$vux.toast.text('加入购物车成功');
                    }
                });
            }
        },
    },

    watch: {
        'detailsInCart'() {
            this.getCartDetailsIds();
            this.calculateCartCount();
            this.calculateCartFreight();
            this.generateDetailsInCartMap();
        }
    }
};
