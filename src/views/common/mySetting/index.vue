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
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
