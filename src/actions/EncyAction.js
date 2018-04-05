import EncyService from '../services/EncyService';

/**
 * 获取分类
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getCategories({commit}) {
    const response = await EncyService.getCategories();
    return response.data || {};
}

/**
 * 获取小类通过分类id
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getTypesByCategoryCode({commit}, params) {
    const response = await EncyService.getTypesByCategoryCode(params);
    return response.data || {};
}

/**
 * 获取兼容性
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getCompatibilities({commit}) {
    const response = await EncyService.getCompatibilities();
    return response.data || {};
}

/**
 * 获取饲养难度
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getLevels({commit}) {
    const response = await EncyService.getLevels();
    return response.data || {};
}

/**
 * 通过id获取生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyById({commit}, params) {
    const response = await EncyService.getEncyById(params);
    return response.data || {};
}

/**
 * 获取生物资料
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyList({commit}, params) {
    const response = await EncyService.getEncyList(params);
    return response.data || {};
}

/**
 * 随机获取生物
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyRandomList({commit}, params) {
    const response = await EncyService.getEncyRandomList(params);
    return response.data || {};
}

/**
 * 获取生物对应的图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getImagesByEncyId({commit}, params) {
    const response = await EncyService.getImagesByEncyId(params);
    return response.data || {};
}

/**
 * 获取一张图片
 * @param commit
 * @returns {Promise.<{}>}
 */
export async function getEncyRandomImage({commit}) {
    const response = await EncyService.getEncyRandomImage();
    return response.data || {};
}

/**
 * 获取某生物的一张图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyImageById({commit}, params) {
    const response = await EncyService.getEncyImageById(params);
    return response.data || {};
}

/**
 * 获取某生物的所有图片
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getEncyImagesById({commit}, params) {
    const response = await EncyService.getEncyImagesById(params);
    return response.data || {};
}