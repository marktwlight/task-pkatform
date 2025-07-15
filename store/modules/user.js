import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';

export const useUserStore = defineStore('user', {
	// 其他配置...
	state: () => ({
		id: null,
		name: '游客',
		avatar: 'https://via.placeholder.com/150',
		isLoggedIn: false
	}),
})