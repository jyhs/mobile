<template>
    <div class="group-tab-container">
        <scroller :on-refresh="handleDataRefresh">
            <div class="button-tab" v-model="active">
                <button-tab :height="35">
                    <button-tab-item :selected="active==='group'" @on-item-click="handleTabItemChange('group')">
                        同省热团
                    </button-tab-item>
                    <button-tab-item :selected="active==='bill'" @on-item-click="handleTabItemChange('bill')">
                        最新出单
                    </button-tab-item>
                </button-tab>
            </div>
            <div class="block" v-if="active==='group'">
                <div class="block-content"
                     v-for="group in (groupsInCurProvince.length ? groupsInCurProvince : groups)"
                     :key="group.id" @click="handleActions(group, 'groupDetail')"
                >
                    <div class="content-main group-content-main">
                        <div class="avatar">
                            <img src="../../../assets/others/tuan_image.png" alt="同省商家头像">
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span v-if="group.status===1" class="group-status f11">热团中</span>
                                <span class="group-status group-status-disabled f11" v-else>已结束</span>
                                <span v-if="group.status===1">
                                    <icon class="el-icon-coral-naozhong f12"></icon>
                                    <span class="f12 c999">{{group.end_date}}结束</span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="group-name f15">{{group.name}}</span>
                            </div>
                            <div class="info-item">
                                <span>
                                    <icon class="el-icon-coral-people f12 c999"></icon>
                                    <span class="f12 c999">{{group.supplierName}}</span>
                                </span>
                                <span>
                                    <icon class="el-icon-coral-coordinates f12 c999"></icon>
                                    <span class="f12 c999">{{group.city}}</span>
                                </span>
                                <span>
                                    <icon class="el-icon-coral-caiwu-xianxing f12"></icon>
                                    <span class="f12 c999">{{group.sum}}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block" v-else>
                <div class="block-content">
                    <div class="content-main bill-content-main" v-for="item in bills" :key="item.id"
                         @click="handleActions(item, 'billDetail')">
                        <div class="bill-first-word" :style="{'background-color': billFirstWordColor[item.id%5]}">
                            <span class="f13">{{item.name[0]}}</span>
                        </div>
                        <div class="info">
                            <span class="bill-name f15">{{item.name}}</span>
                            <span class="upload-time f13">{{item.contacts}}上传于{{item.upload_date.split('T')[0]}}</span>
                        </div>
                        <div class="open-btn" v-if="item.status===1" @click.stop="handleActions(item, 'groupAdd')">
                            <span class="f13">我要开团</span>
                        </div>
                        <div class="open-btn open-btn-disabled" @click.stop="handleActions(item, 'tip')" v-else>
                            <span class="f13">我要开团</span>
                        </div>
                    </div>
                </div>
            </div>
        </scroller>
        <alert v-model="showTip" title="亲，" :content="`${currentItem.name}已结束，逛逛其他的吧~~~`"></alert>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {ButtonTab, ButtonTabItem, Alert} from 'vux';

    export default {
        data() {
            return {
                billFirstWordColor: ['#ee735c', '#d4e5e0', '#f5a623', '#64c708', '#84daef'],
                active: window.sessionStorage.getItem('SeawaterGroupTabActive') || 'group',
                curProvince: [window.localStorage.getItem('SeawaterCurProvince') || 'sh'],
                groups: [],
                bills: [],
                currentItem: {},
                showTip: false
            };
        },

        components: {
            ButtonTab,
            ButtonTabItem,
            Alert
        },

        computed: {
            ...mapGetters([
                'groupsInCurProvince'
            ])
        },

        async created() {
            const response = await this.getGroupList({
                page: 1,
                size: 10,
                province: this.curProvince[0]
            });
            this.groups = response.res;
            this.bills = (await this.getBillList({page: 1, size: 1000}))['bills'] || [];
        },

        methods: {
            ...mapActions([
                'getGroupList',
                'getBillList'
            ]),

            async handleDataRefresh(done) {
                const response = await this.getGroupList({
                    page: 1,
                    size: 10,
                    province: this.curProvince[0]
                });
                this.groups = response.res;
                this.bills = (await this.getBillList({page: 1, size: 10}))['bills'] || [];
                done();
            },

            handleTabItemChange(name) {
                this.active = name;
                window.sessionStorage.setItem('SeawaterGroupTabActive', name);
            },

            handleActions(item, actionType) {
                switch (actionType) {
                    case 'groupDetail':
                    case 'billDetail':
                    case 'groupAdd':
                        this.$router.push({
                            name: actionType,
                            params: {
                                id: item.id
                            }
                        });
                        break;
                    case 'tip':
                        this.currentItem = item;
                        this.$nextTick(() => {
                            this.showTip = true;
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>
<style lang="less">
    .group-tab-container {
        min-height: 100%;
        padding-bottom: 63px;
        .button-tab {
            padding: 0.1rem 0.1rem 0;
            .vux-button-group > a {
                color: #ccc;
                box-shadow: 0 0 6px 0 rgba(0,0,0,0.06);
                border-radius: 4px;
            }
            .vux-button-group > a {
                background-color: #fafafa;
            }
            .vux-button-group > a.vux-button-group-current {
                background-color: #fff;
                color: #28b1ea;
                font-size: 14px;
            }
            .vux-button-group > a.vux-button-tab-item-first:after {
                border: none;
            }
            .vux-button-group > a.vux-button-tab-item-last:after {
                border: none;
            }
        }
        .block {
            width: 100%;
            .block-content {
                width: 100%;
                padding: 0.1rem 0.1rem 0 0.1rem;
                box-sizing: border-box;
                .content-main {
                    background: #fff;
                    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
                    border-radius: 4px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .group-content-main {
                    height: 1.06rem;
                    .avatar {
                        padding: 0 0.1rem;
                        img {
                            width: 0.82rem;
                            height: 0.86rem;
                            vertical-align: middle;
                        }
                    }
                    .info {
                        flex: 1;
                        height: 100%;
                        box-sizing: border-box;
                        padding: 0.1rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .info-item {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            .group-status {
                                display: inline-block;
                                height: 0.18rem;
                                line-height: 0.18rem;
                                text-align: center;
                                padding: 0.01rem 0.08rem;
                                background-color: #64c708;
                                border-radius: 0.09rem;
                                color: #fff;
                                opacity: 0.9;
                            }
                            .group-status-disabled {
                                background-color: #bcbcbc;
                            }
                            .el-icon-coral-naozhong {
                                color: #f5a623;
                            }
                            .group-name {
                                color: #000;
                                font-weight: 300;
                                line-height: 0.2rem;
                            }
                            .el-icon-coral-caiwu-xianxing {
                                color: #d0021b;
                            }
                        }
                    }
                }
                .bill-content-main {
                    height: 0.7rem;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .bill-first-word {
                        width: 0.42rem;
                        height: 0.42rem;
                        margin: 0.1rem;
                        line-height: 0.42rem;
                        background-color: #d4e5e0;
                        text-align: center;
                        border-radius: 50%;
                        span {
                            color: #fff;
                        }
                    }
                    .info {
                        flex: 1;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .bill-name {
                            color: #000;
                            line-height: 20px;
                        }
                        .upload-time {
                            color: #9b9b9b;
                            line-height: 16px;
                        }
                    }
                    .open-btn {
                        width: 0.76rem;
                        height: 0.28rem;
                        line-height: 0.28rem;
                        text-align: center;
                        background-color: #84daef;
                        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
                        border-radius: 4px;
                        margin: 0.1rem;
                        span {
                            color: #fff;
                        }
                    }
                    .open-btn-disabled {
                        background-color: #ccc;
                    }
                }
                .ency-content-main {
                    height: 0.88rem;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .pic {
                        margin: 0.1rem;
                        img {
                            width: 0.88rem;
                            height: 0.64rem;
                        }
                    }
                    .info {
                        flex: 1;
                        height: 100%;
                        box-sizing: border-box;
                        padding: 0.1rem 0.1rem 0.1rem 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .name-price {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            .ency-price {
                                .price-title {
                                    color: #cbcbcb;
                                }
                                .price-text {
                                    color: #f5a623;
                                }
                            }
                        }
                        .ency-category {
                            line-height: 15px;
                            span {
                                color: #898989;
                            }
                        }
                        .others {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            .actions {
                                display: flex;
                                flex-direction: row;
                                .action {
                                    margin-left: 0.05rem;
                                    span {
                                        color: #9b9b9b;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
