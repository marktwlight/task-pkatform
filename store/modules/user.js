import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';

export const useUserStore = defineStore('user', ()=>{
	// 其他配置...
	const userInfo = ref({
		id: null,
		name: '游客',
		avatar: 'https://via.placeholder.com/150',
		email: ''
	});
	
	return {
		userInfo
	}
})