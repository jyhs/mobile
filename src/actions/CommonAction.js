import * as TYPES from '../constants/types';
import CommonService from '../services/CommonService';

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
    for (let key of Object.keys(response.data)) {
        data.push({
            name: response.data[key],
            value: key
        });
    }
    return data;
}

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
