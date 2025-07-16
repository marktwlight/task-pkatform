// src/i18n/index.js
import {
	createI18n
} from 'vue-i18n'

// 1. 导入语言文件（建议使用动态导入优化）
// src/i18n/index.js
import en from './locales/en-US.json'
import zh from './locales/zh-CN.json'

const messages = {
  'en': en,
  'zh': zh
}

// 2. 语言代码映射表（处理多平台兼容）
const languageMap = {
	// 中文变体
	'zh-cn': 'zh',
	'zh-hans': 'zh',
	'zh-hans-cn': 'zh',
	'zh_CN': 'zh',
	'zh-HK': 'zh',
	'zh-TW': 'zh',
	// 英文变体
	'en-us': 'en',
	'en-gb': 'en',
	'en_AU': 'en',
	'en_CA': 'en'
}

// 3. 获取系统语言（兼容多平台）
function getSystemLanguage() {
	try {
		// 处理小程序环境
		if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
			const systemInfo = uni.getSystemInfoSync()
			const rawLang = systemInfo.language || 'en'
			return normalizeLanguageCode(rawLang)
		}

		// 处理H5环境
		if (typeof navigator !== 'undefined') {
			const rawLang = (navigator.language || 'en').toLowerCase()
			return normalizeLanguageCode(rawLang)
		}
	} catch (e) {
		console.error('获取系统语言失败:', e)
	}
	return 'en' // 默认回退
}

// 4. 标准化语言代码
function normalizeLanguageCode(lang) {
	if (!lang) return 'en'

	// 统一转为小写并替换下划线
	const normalized = lang.toLowerCase().replace(/_/g, '-')

	// 优先检查映射表
	if (languageMap[normalized]) {
		return languageMap[normalized]
	}

	// 通用处理（如 'fr'、'es' 等未来可能支持的语言）
	return normalized.split('-')[0] // 取主语言代码
}

// 5. 获取最终语言（优先顺序：存储值 > 系统语言 > 默认）
function getInitialLocale() {
	try {
		// 尝试从存储读取
		const storedLang = uni.getStorageSync('i18n_locale')
		if (storedLang && messages[storedLang]) {
			return storedLang
		}

		// 获取系统语言并验证是否支持
		const systemLang = getSystemLanguage()
		if (messages[systemLang]) {
			return systemLang
		}
	} catch (e) {
		console.error('初始化语言失败:', e)
	}

	return 'en' // 最终回退
}

// 6. 创建i18n实例
const i18n = createI18n({
	legacy: false, // 必须设置为false以使用Vue3的组合式API
	locale: getInitialLocale(),
	fallbackLocale: 'en',
	silentTranslationWarn: true, // 生产环境可改为false
	messages,

	// 自定义缺失翻译处理
	missing(locale, key) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(`[i18n] 缺少翻译: ${locale}.${key}`)
		}
		return key // 直接返回key作为兜底
	}
})

// 7. 提供语言切换方法（可挂载到全局）
function changeLanguage(lang) {
	if (!messages[lang]) {
		console.error(`不支持的语言: ${lang}`)
		return false
	}

	i18n.global.locale.value = lang
	try {
		uni.setStorageSync('i18n_locale', lang)
	} catch (e) {
		console.error('存储语言偏好失败:', e)
	}

	// 更新页面标题等全局文本
	if (typeof document !== 'undefined') {
		document.documentElement.lang = lang
	}

	return true
}

// 8. 导出安装方法（供main.js使用）
export function setupI18n(app) {
	app.use(i18n)

	// 挂载到全局（可选）
	app.config.globalProperties.$changeLanguage = changeLanguage
	app.config.globalProperties.$i18n = i18n.global
}

// 导出常用方法
export {
	i18n,
	changeLanguage
}