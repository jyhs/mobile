<template>
    <div class="my-setting-container">
        <scroller :on-refresh="handleDataRefresh">
            <div class="content-wrap">
                <card>
                    <div class="header" slot="header">头像</div>
                    <div class="img-content" slot="content">
                        <label class="uploader-wrap">
                            <input type="file" ref="avatarToUpload" @change="upload('avatar')"/>
                            <i class="el-icon-coral-add"></i>
                            <img :src="avatarImgPath" v-if="avatarImgPath">
                        </label>
                    </div>
                </card>
            </div>
        </scroller>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import {Card} from 'vux';

    export default {
        data() {
            return {
                currentUserId: parseInt(window.localStorage.getItem('SeawaterLoginUserId')),
                avatarImgPath: ''
            };
        },

        components: {
            Card
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
            },

            handleDataRefresh(done) {
                this.initData();
                done();
            },

            upload() {}
        }
    };
</script>
<style lang="less">
    .my-setting-container {
        min-height: 100%;
        padding-bottom: 53px;
        background: #fff;
        .content-wrap {
            padding-bottom: 10px;
            .header {
                height: 43px;
                line-height: 43px;
                padding-left: 15px;
                background-color: #fff;
                color: #48576a;
                border-bottom: 1px solid #dfe6ec;
                font-size: 13px;
            }
            .img-content {
                margin-top: 10px;
                display: flex;
                justify-content: center;
            }
            .uploader-wrap {
                width: 148px;
                height: 148px;
                border-radius: 8px;
                border: 1px dashed #c0ccda;
                margin-bottom: 20px;
                overflow: hidden;
                display: inline-block;
                position: relative;
                &:hover {
                    border: 1px dashed #1d90e6;
                }
                input {
                    position: absolute;
                    left: -9999px;
                    top: -9999px;
                }
                .el-icon-coral-add {
                    font-size: 36px;
                    color: #8c939d;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
                .el-progress {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
                img {
                    width: 148px;
                    height: 148px;
                    z-index: 100;
                }
            }
        }
    }
</style>
