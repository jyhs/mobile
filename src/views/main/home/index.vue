<template>
    <div class="home-container">
        <scroller :on-refresh="handleDataRefresh">
            <swiper loop auto :list="list" :aspect-ratio="306/750"></swiper>
            <div class="city-selector">
                <span @click="handleShowProvinces">
                    <icon class="el-icon-coral-coordinates f15"></icon>
                    <span class="city-name f13" v-text="curProvinceName"></span>
                    <icon class="el-icon-coral-biaotou-daoxu f20 c999 m-r-4"></icon>
                </span>
            </div>
            <div class="tab-icons">
                <div class="tab-icon" @click="handleActions({}, 'cityComm')">
                    <img src="../../../assets/tabIcon/gdzz.png" alt="各地交流">
                    <span class="f12">各地交流</span>
                </div>
                <div class="tab-icon" @click="handleActions({}, 'fishStores')">
                    <img src="../../../assets/tabIcon/ydlb.png" alt="鱼店列表">
                    <span class="f12">鱼店列表</span>
                </div>
                <div class="tab-icon" @click="handleActions({}, 'coopStores')">
                    <img src="../../../assets/tabIcon/hzsj.png" alt="合作商家">
                    <span class="f12">合作商家</span>
                </div>
                <div class="tab-icon" @click="handleActions({}, 'groupHelp')">
                    <img src="../../../assets/tabIcon/tggz.png" alt="团购规则">
                    <span class="f12">团购帮助</span>
                </div>
            </div>
            <div class="block">
                <div class="block-title">
                    <span class="rect"></span>
                    <span class="title-text f16">同省团购</span>
                </div>
                <div class="has-no-active" v-if="!hasActiveGroup">
                    <span class="f13">亲，热团都结束了哟，摆架去
                        <span class="link" @click="handleActions({}, 'toGroupTab')">团购</span>
                        看看？
                    </span>
                </div>
                <load-more tip="努力加载中" v-if="!groups"></load-more>
                <div 
                    class="block-content" 
                    v-for="group in ((groups || []).filter(item => item.userType!=='lss') || [])" 
                    v-if="group.status===1" 
                    :key="group.id"
                    @click="handleActions(group, 'groupDetail')"
                >
                    <div class="content-main group-content-main">
                        <div class="avatar">
                            <img :src="group.userAvatar || require('../../../assets/others/default_avatar.svg')" alt="同省商家头像">
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span v-if="group.status===1" class="group-status f11">热团中</span>
                                <span class="group-status group-status-disabled f11" v-else>已结束</span>
                                <span v-if="group.status===1">
                                    <icon class="el-icon-coral-naozhong f12"></icon>
                                    <!--
                                        <span class="f12 c999">{{mapTimeInterval(group.interval)}}后结束</span>
                                    -->
                                    <span class="f12 c999">{{group.end_date}}结束</span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="group-name f15">{{group.name}}</span>
                            </div>
                            <div class="info-item">
                                <span>
                                    <icon class="el-icon-coral-people f12 c999"></icon>
                                    <span class="f12 c999">{{group.contacts}}</span>
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
            <div class="block m-t-10" v-if="hasActiveLingShow">
                <div class="block-title">
                    <span class="rect"></span>
                    <span class="title-text f16">同省零售</span>
                </div>
                <load-more tip="努力加载中" v-if="!groups"></load-more>
                <div 
                    class="block-content" 
                    v-for="group in ((groups || []).filter(item => item.userType==='lss') || [])" 
                    v-if="group.status===1" 
                    :key="group.id"
                    @click="handleActions(group, 'groupDetail')"
                >
                    <div class="content-main group-content-main">
                        <div class="avatar">
                            <img :src="group.userAvatar || require('../../../assets/others/default_avatar.svg')" alt="同省商家头像">
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span v-if="group.status===1" class="group-status f11">热团中</span>
                                <span class="group-status group-status-disabled f11" v-else>已结束</span>
                                <span v-if="group.status===1">
                                    <icon class="el-icon-coral-naozhong f12"></icon>
                                    <!--
                                        <span class="f12 c999">{{mapTimeInterval(group.interval)}}后结束</span>
                                    -->
                                    <span class="f12 c999">{{group.end_date}}结束</span>
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="group-name f15">{{group.name}}</span>
                            </div>
                            <div class="info-item">
                                <span>
                                    <icon class="el-icon-coral-people f12 c999"></icon>
                                    <span class="f12 c999">{{group.contacts}}</span>
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
            <div class="block m-t-10">
                <div class="block-title">
                    <span class="rect"></span>
                    <span class="title-text f16">生物百科</span>
                </div>
                <load-more tip="努力加载中" v-if="encyList.length === 0"></load-more>
                <div class="block-content" v-for="item in encyList" :key="item.id"
                     @click="handleActions(item, 'encyDetail')">
                    <div class="content-main ency-content-main">
                        <div class="pic">
                            <img :src="item.encyImage" alt="生物图片">
                        </div>
                        <div class="info">
                            <div class="name-price">
                                <span class="ency-name f15">{{item.name}}</span>
                                <span class="ency-price">
                                    <span class="price-title f12">团购指导价:</span><span class="price-text f12">￥{{item.price}}</span>
                                </span>
                            </div>
                            <div class="tags">
                                <div class="tag" v-for="i in item.tag.trim().split(',')" :key="i">
                                    <span class="f10">{{i}}</span>
                                </div>
                            </div>
                            <div class="others">
                                <rater :value="mapLevel(item.level)" :font-size="10" disabled></rater>
                                <div class="actions">
                                    <!--
                                    <div class="action">
                                        <icon class="el-icon-coral-share f12"></icon>
                                        <span class="f12">分享</span>
                                    </div>
                                    <div class="action">
                                        <icon class="el-icon-coral-message f12"></icon>
                                        <span class="f12">评论</span>
                                    </div>
                                    -->
                                    <div class="action" @click.stop="handleActions(item, 'focus')">
                                        <icon class="el-icon-coral-like_fill f16" :class="{focused: item.isFocused}"></icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--
            <div class="block m-t-10">
                <div class="block-title">
                    <span class="rect"></span>
                    <span class="title-text f16">最新出单</span>
                </div>
                <div class="has-no-active" v-if="!hasActiveBill">
                    <span class="f13">亲，暂时没有可用的出单哟！</span>
                </div>
                <load-more tip="努力加载中" v-if="!bills"></load-more>
                <div class="block-content" v-for="item in (bills || [])" v-if="item.status===1" :key="item.id"
                     @click="handleActions(item, 'billDetail')">
                    <div class="content-main bill-content-main">
                        <div class="bill-first-word" :style="{'background-color': billFirstWordColor[item.id%5]}">
                            <span class="f13">{{item.name[0]}}</span>
                        </div>
                        <div class="info">
                            <span class="bill-name f15">{{item.name}}</span>
                            <span class="upload-time f10">{{item.contacts}}上传于{{item.upload_date.split('T')[0]}}</span>
                        </div>
                        <div class="open-btn" @click.stop="handleActions(item, 'groupAdd')">
                            <span class="f13">我要开团</span>
                        </div>
                    </div>
                  </div>
            </div>
            -->
        </scroller>
        <group>
            <popup-picker
                    :show.sync="showProvincesPicker" :show-cell="false" :data="provinces"
                    :columns="2" @on-change="handleProvinceChange" v-model="curProvince">
            </popup-picker>
        </group>
    </div>
</template>
<script src="./script.js"></script>
<style lang="less" src="./style.less"></style>
