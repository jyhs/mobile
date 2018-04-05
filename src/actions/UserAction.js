import UserService from '../services/UserService';

/**
 * 注册
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function register ({commit}, params) {
    const response = await UserService.register(params);
    return response.data;
}

/**
 * 登录
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function login ({commit}, params) {
    const response = await UserService.login(params);
    return response.data;
}

/**
 * 登出
 * @param commit
 * @param params
 * @returns {Promise.<*|{type, alias, describe}|{}>}
 */
export async function logout({commit}, params) {
    const response = await UserService.logout(params);
    return response.data;
}

/**
 * 通过id获取用户
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserById({commit}, params) {
    const response = await UserService.getUserById(params);
    return response.data;
}

/**
 * 获取用户头像路径
 * @param commit
 * @param params
 * @returns {Promise.<{}>}
 */
export async function getUserAvatar({commit}, params) {
    const response = await UserService.getUserAvatar(params);
    return response.data;
}
