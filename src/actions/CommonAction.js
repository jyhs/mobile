import * as TYPES from '../constants/types';
import CommonService from '../services/CommonService';

/**
 * 保存当前所在省
 * @param commit
 * @param curProvince
 */
export function updateGroupsInCurProvince({commit}, groups) {
    commit(TYPES.GROUPS_IN_CUR_PROVINCE, groups);
}

/**
 * 发送短信验证码
 * @param commit
 * @param params
 * @returns {Promise.<void>}
 */
export async function sendVerification({commit}, params) {
    const response = await CommonService.sendVerification(params);
    return response.data;
}

/**
 * 获取省份
 * @param commit
 * @returns {Promise.<Array>}
 */
export async function getProvinces({commit}) {
    const response = await CommonService.getProvinces();
    const data = [];
    for (let province of response.data) {
        data.push({
            name: province.name,
            value: province.code
        });
    }
    return data;
}

/**
 * 获取城市
 * @returns {Promise<Array>}
 */
export async function getCities () {
    const citiesObj = await CommonService.getCities();
    const citiesArr = [];

    for (let key of Reflect.ownKeys(citiesObj.data)) {
        citiesArr.push({
            key,
            value: citiesObj.data[key]
        });
    }

    return citiesArr;
}

/**
 * 获取某个省份的所有城市
 * @param commit
 * @param params
 * @returns {Promise.<Array>}
 */
export async function getCitiesInProvinces({commit}, params) {
    const citiesObj = await CommonService.getCitiesInProvinces(params);
    const citiesArr = [];

    for (let item of citiesObj.data.res) {
        citiesArr.push({
            name: item.mark,
            value: item.name
        });
    }

    return citiesArr;
}

export async function getChinaCities({commit}) {
    const response = await CommonService.getChinaCities();
    return response.data;
}

export async function getTypes() {
    const response = await CommonService.getTypes();
    return response.data || {};
}

export async function getMe() {
    const response = await CommonService.getMe();
    return response.data || {};
}

export function loadingShow({commit}, loadingShow) {
    commit(TYPES.LOADING, loadingShow);
}

/**
 * 获取本地QQ群
 * @param commit
 * @param params
 * @returns {Promise.<Array>}
 */
export async function getLocalContacts({commit}, params) {
    const response = await CommonService.getLocalContacts(params);
    return response.data || [];
}
