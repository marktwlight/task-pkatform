// getWithToken.js
import config from '@/config.js';
import {
	navigateTo
} from '@/utils/tab.js'
/**
 * 封装带Token的GET请求
 * @param {string} url - 接口地址（不含基础路径）
 * @param {Object} params - 请求参数
 * @param {Object} customHeader - 自定义请求头（可选）
 * @returns {Promise} 返回Promise对象
 */
export const get = (url, params = {}, customHeader = {}) => {
	// 获取本地存储的Token
	const token = uni.getStorageSync('token');

	// Token验证
	if (!token) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		});
		navigateTo({
			url: '/pages/login'
		});
		return Promise.reject('Missing token');
	}

	// 构造请求头
	const header = {
		'Authorization': `Bearer ${token}`,
		...customHeader
	};

	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + url,
			method: 'GET',
			data: params,
			header,
			success: (res) => {
				// Token过期处理（401状态码）
				if (res.statusCode === 401) {
					uni.clearStorageSync();
					uni.navigateTo({
						url: '/pages/login/login'
					});
					return reject('Token expired');
				}
				resolve(res.data);
			},
			fail: (err) => {
				uni.showToast({
					title: '网络请求失败',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
};