<template>
    <div class="buy-cart-container">
        <scroller :on-refresh="handleDataRefresh">
            <div style="height: 100%; padding-bottom: 100%">
                <div class="group-name">
                    <span @click="handleActions({}, 'return')">
                        <icon class="el-icon-coral-return f20">
                            <span class="f16">回首页</span>
                        </icon>
                    </span>
                    <span class="f16">{{group.name}}</span>
                    <span @click="handleActions({}, 'groupDetail')">
                        <icon class="el-icon-coral-enter f20">
                            <span class="f16">去购物</span>
                        </icon>
                    </span>
                </div>
                <div class="block">
                    <div class="block-content m-b-10" v-for="item in detailsInCart">
                        <div class="img-container">
                            <img :src="item.encyImage" alt="生物图片">
                        </div>
                        <div class="info">
                            <span class="name f15">{{item.name}}</span>
                            <div>
                                <span class="size f12">{{item.size}}</span>
                                <span class="price f14">￥{{item.price}}</span>
                            </div>
                            <div class="count-container">
                                <x-number
                                    v-model="item.count" :min="1" :max="max" width="40px"
                                    @on-change="handleActions({}, 'numberChange')">
                                </x-number>
                                <span @click.stop="handleActions(item, 'deleteConfirm')">
                                    <icon class="el-icon-coral-empty f18"></icon>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="total-count">
                    <span class="title f16">共计：</span>
                    <span class="count f16">￥{{totalCount}}</span>
                </div>
                <div>
                    <group>
                        <x-input placeholder="联系电话" is-type="china-mobile"
                                 v-model="phone" :readonly="group.status===0">
                        </x-input>
                        <x-textarea
                            :max="200" name="description" placeholder="备注"
                            v-model="remark" :readonly="group.status===0">
                        </x-textarea>
                    </group>
                </div>
                <div class="submit" v-if="group.status===1">
                    <button class="btn btn-full f15" @click="handleSubmit">确认购买</button>
                </div>
                <div class="submit" v-else>
                    <button class="btn btn-full btn-disabled f15">确认购买</button>
                </div>
            </div>
        </scroller>
        <confirm v-model="deleteConfirm" :title="`删除${currentItem.name}`"
                 @on-confirm="handleConfirmDelete">
            <p style="text-align:center;">亲，确认咩？</p>
        </confirm>
    </div>
</template>
<script>
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
</script>
<style lang="less">
    .buy-cart-container {
        min-height: 100%;
        padding-bottom: 50%;
        .group-name {
            padding: 0 0.1rem;
            height: 0.4rem;
            line-height: 0.4rem;
            display: flex;
            justify-content: space-between;
        }
        .block {
            padding-left: 0.1rem;
            padding-right: 0.1rem;
            .block-content {
                height: 1.2rem;
                background-color: #fff;
                box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
                border-radius: 4px;
                padding: 0.1rem;
                box-sizing: border-box;
                display: flex;
                flex-direction: row;
                align-items: center;
                .weui-cell {
                    padding: 0;
                }
                .weui-cell:before {
                    border: none;
                }
                .vux-number-input {
                    font-size: 15px;
                }
                .img-container {
                    width: 1.25rem;
                    height: 0.9rem;
                    border-radius: 0.05rem;
                    overflow: hidden;
                    img {
                        width: 1.25rem;
                        height: 0.9rem;
                        vertical-align: middle;
                    }
                }
                .info {
                    flex: 1;
                    height: 100%;
                    margin-left: 0.2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .name {
                        color: #4a4a4a;
                        line-height: 30px;
                    }
                    div {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        .size {
                            color: #8a8a8a;
                            line-height: 20px;
                        }
                        .price {
                            color: #ff9f00;
                            line-height: 20px;
                        }
                    }
                }
            }
        }
        .total-count {
            padding-left: 0.25rem;
            height: 0.4rem;
            line-height: 0.4rem;
            text-align: left;
            .title {
                color: #4a4a4a;
            }
            .count {
                color: #ee753c;
            }
        }
        .submit {
            margin-top: 0.24rem;
            padding: 0.1rem;
            .btn {
                background-color: #ff9f00;
                height: 0.43rem;
                color: #fff;
            }
            .btn-disabled {
                background-color: #999;
            }
        }
    }
</style>
