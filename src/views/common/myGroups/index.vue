<template>
    <div class="my-group-container">
        <scroller :on-refresh="handleDataRefresh">
            <div class="block">
                <div class="no-tips" v-if="groups.length===0">
                    空空如也，<a href="javascript: void(0);" @click="handleActions(null, 'main')">去开一个</a>？
                </div>
                <div class="block-content" v-else v-for="group in groups" :key="group.id"
                     @click="handleActions(group, 'groupDetail')">
                    <div class="content-main group-content-main">
                        <div class="avatar">
                            <img :src="group.userAvatar" alt="同省商家头像">
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
                                <icon class="el-icon-coral-empty f18" v-if="group.status===1"
                                      @click.stop="handleFinishGroup(group)"></icon>
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
        </scroller>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import {AvatarBasePath} from '../../../constants/index';

    export default {
        data() {
            return {
                currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
                groups: []
            };
        },

        created() {
            this.initData();
        },

        methods: {
            ...mapActions([
                'getGroupList',
                'finishGroupByIdAndUserId'
            ]),

            async initData() {
                const result = await this.getGroupList({
                    page: 1,
                    size: 1000,
                    userId: this.currentUserId
                });
                this.groups = result.res || [];
                for (let group of this.groups) {
                    this.$set(group, 'userAvatar', `${AvatarBasePath}?id=${group.user_id}`);
                }
            },

            handleActions(item, actionType) {
                switch (actionType) {
                    case 'main':
                        window.sessionStorage.setItem('SeawaterTabActiveIndex', 2);
                        window.sessionStorage.setItem('SeawaterGroupTabActive', 'bill');
                        this.$router.push('/');
                        break;
                    case 'groupDetail':
                        this.$router.push({
                            name: actionType,
                            params: {
                                id: item.id
                            }
                        });
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
                    title: '确定结束',
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
</script>
<style lang="less">
    .my-group-container {
        .block {
            width: 100%;
            .no-tips {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                margin-top: 200px;
                font-size: 18px;
                a {
                    color: #00b0ff;
                }
            }
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
                            border-radius: 5px;
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
            }
        }
    }
</style>
