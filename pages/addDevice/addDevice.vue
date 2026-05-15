<template>
	<div class="page-wrapper">
		<!-- 背景装饰 -->
		<div class="bg-orb bg-orb-1"></div>
		<div class="bg-orb bg-orb-2"></div>

		<!-- 顶部导航栏 -->
		<div class="scroll-area">
			<!-- 雷达扫描动画区域 -->
			<div class="radar-section">
				<div class="radar-container">
					<!-- 扫描波纹圈（从外到内） -->
					<div class="radar-ring ring-4"></div>
					<div class="radar-ring ring-3"></div>
					<div class="radar-ring ring-2"></div>
					<div class="radar-ring ring-1"></div>
					<!-- 旋转扫描扇形 -->
					<div class="radar-sweep"></div>
					<!-- 中心点 -->
					<div class="radar-center">
						<div class="center-dot"></div>
						<div class="center-pulse"></div>
					</div>
				</div>
				<p class="scanning-text">
					<span v-if="isScanning" class="scanning-dots-wrapper">
						正在搜索可用设备
						<span class="dot-ani">
							<span>.</span><span>.</span><span>.</span>
						</span>
					</span>
					<span v-else="isScanning" class="scanning-dots-wrapper" style="color: red;">
						已停止搜索
					</span>
				</p>
			</div>

			<!-- 发现设备数量 -->
			<div class="found-header">
				<span>已发现 <em>{{ deviceList.length || 0 }}</em> 个BLE设备</span>
			</div>

			<!-- 设备列表 -->
			<div class="device-list">
				<div v-for="(device, index) in deviceList" :key="device.deviceId" class="device-card"
					:style="{ animationDelay: `${index * 80}ms` }" @click="handleDeviceSelect(device)">
					<!-- 设备图标 -->
					<div class="device-icon-wrapper">
						<image src="/static/icon/device-icon-1.svg"></image>
					</div>

					<!-- 设备信息 -->
					<div class="device-info">
						<span class="device-name">{{ device.name }}</span>
						<span class="device-rssi">RSSI：{{ device.RSSI }}</span>
					</div>

					<!-- 齿轮设置按钮 -->
					<!-- <button class="gear-btn" @click.stop="handleDeviceSettings(device)">
						点击链接
					</button> -->
				</div>
			</div>

			<!-- 底部占位，避免按钮遮住内容 -->
			<div style="height: 100px;"></div>
		</div>

		<!-- 停止/开始搜索 悬浮按钮 -->
		<div class="bottom-bar">
			<button class="toggle-btn" :class="{ scanning: isScanning }" @click="handleToggleScan">
				<span v-if="isScanning">停止搜索</span>
				<span v-else>开始搜索</span>
			</button>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue';

	import {
		bluetoothAdapter,
		searchBluetooth,
		foundNewDevice
	} from "@/utils/bluetooth_tools.js";

	import {
		useDevicesStore
	} from "@/store/blueTooth.js"
	const connectedDevicesStore = useDevicesStore()
	// ===== 状态 =====
	const isScanning = ref(true)

	// 模拟发现的设备列表
	const deviceList = ref([])
	// 记录已连接的设备ID
	const connectedDeviceId = ref('')
	// ===== 定时模拟新设备出现 =====
	let scanTimer = null

	const startFakeScan = async () => {
		// scanTimer = setInterval(() => {
		// 	if (!isScanning.value) return
		// 	// 模拟偶尔发现新设备（演示用）
		// }, 3000)
		await initBluetooth()
		await searchDevice()
		await getNewDevice()
	}
	/**
	 * 初始化蓝牙
	 */
	const initBluetooth = async () => {
		try {
			const res = await bluetoothAdapter()
		} catch (errorCode) {
			console.log('蓝牙初始化失败:', errorCode) // 这里能拿到 error?.code
			if (errorCode == 10001) {
				uni.showToast({
					icon: "error",
					title: "设备蓝牙未开启",
					duration: 3000
				})
			}
		}
	}

	/**
	 * 搜索蓝牙设备
	 */
	const searchDevice = async () => {
		try {
			const res = await searchBluetooth()
			console.log("res:", res);
		} catch (err) {
			return;
		}
	}

	/**
	 * 搜索到新设备
	 */
	const getNewDevice = () => {
		uni.onBluetoothDeviceFound(({
			devices
		}) => {
			const deviceMap = new Map()

			// 现有设备加入 Map
			deviceList.value.forEach(device => {
				deviceMap.set(device.deviceId, device)
			})

			// 新设备加入或更新
			devices.forEach(device => {
				if (device.name) {
					deviceMap.set(device.deviceId, device)
				}
			})

			// 转换回数组
			deviceList.value = Array.from(deviceMap.values())
		})
	}

	/**
	 * 停止搜索
	 */
	const stopSearch = () => {
		uni.stopBluetoothDevicesDiscovery({
			success(res) {
				console.log(res)
			}
		})
	}

	/**
	 * 连接低功耗蓝牙设备
	 */
	const connectDevice = async (device) => {
		if (!device.deviceId) {
			uni.showToast({
				title: '设备ID无效',
				icon: 'none'
			})
			return
		}

		// 显示加载提示
		uni.showLoading({
			title: '连接中...',
			mask: true
		})

		try {
			// 1. 创建蓝牙连接
			await new Promise((resolve, reject) => {
				uni.createBLEConnection({
					deviceId: device.deviceId,
					timeout: 10000, // 10秒超时
					success: (res) => {
						console.log('连接成功', res)
						resolve(res)
					},
					fail: (err) => {
						console.error('连接失败', err)
						reject(err)
					}
				})
			})

			// 2. 连接成功后获取服务
			const services = await new Promise((resolve, reject) => {
				uni.getBLEDeviceServices({
					deviceId: device.deviceId,
					success: (res) => resolve(res.services),
					fail: reject
				})
			})

			console.log('获取到的服务列表', services)

			// 3. 通常需要找到特定服务（根据您的设备协议确定）
			// 这里假设使用第一个可用的服务，实际应根据设备文档选择
			if (services && services.length > 0) {
				// 可以过滤特定UUID，例如：
				// s.uuid.includes('FFF0') || s.uuid.includes('1800')
				const targetService = services.find(s => {}) || services[0]

				// 4. 获取特征值
				const characteristics = await new Promise((resolve, reject) => {
					uni.getBLEDeviceCharacteristics({
						deviceId: device.deviceId,
						serviceId: targetService.uuid,
						success: (res) => resolve(res.characteristics),
						fail: reject
					})
				})

				console.log('获取到的特征值', characteristics)

				// 5. 启用特征值通知（如果需要接收设备数据）
				const notifyChar = characteristics.find(c =>
					c.properties.notify || c.properties.indicate
				)

				if (notifyChar) {
					await new Promise((resolve, reject) => {
						uni.notifyBLECharacteristicValueChange({
							deviceId: device.deviceId,
							serviceId: targetService.uuid,
							characteristicId: notifyChar.uuid,
							state: true,
							success: resolve,
							fail: reject
						})
					})
					console.log('已启用通知')
				}

				// 保存连接的设备信息
				connectedDeviceId.value = device.deviceId

				uni.hideLoading()
				uni.showToast({
					title: `已连接 ${device.name}`,
					icon: 'success'
				})
				connectedDevicesStore.$state.connectedDevices.push({
					...device
				})

				// 可以跳转到设备控制页面
				// uni.navigateTo({ url: `/pages/device-control/index?deviceId=${device.deviceId}` })
				uni.redirectTo({ url: "/pages/index/index" })
			} else {
				throw new Error('未找到可用服务')
			}

		} catch (error) {
			uni.hideLoading()
			console.error('连接错误', error)
			uni.showToast({
				title: `连接失败: ${error.errMsg || '未知错误'}`,
				icon: 'none',
				duration: 2000
			})

			// 连接失败时关闭连接
			uni.closeBLEConnection({
				deviceId: device.deviceId
			})
		}
	}



	// ===== 事件处理 =====
	const handleBack = () => {
		console.log('返回上一页')
		// router.back()
		stopSearch()
	}

	const handleToggleScan = () => {
		isScanning.value = !isScanning.value
		if (isScanning.value) {
			startFakeScan()
		} else {
			stopSearch()
		}
	}

	const handleDeviceSelect = async (device) => {
		console.log('选中设备：', device.name)
		await connectDevice(device)
	}

	onMounted(() => {
		startFakeScan()
	})

	onUnmounted(() => {
		stopSearch()
	})
</script>

<style scoped>
	/* ===== 全局重置 ===== */
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ===== 页面容器 ===== */
	.page-wrapper {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(160deg, #dff0ff 0%, #eaf6ff 40%, #f2f9ff 70%, #e2f0fb 100%);
		font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* 背景装饰气泡 */
	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
		pointer-events: none;
		z-index: 0;
	}

	.bg-orb-1 {
		width: 280px;
		height: 280px;
		background: radial-gradient(circle, rgba(79, 172, 254, .22) 0%, transparent 70%);
		top: -60px;
		right: -50px;
	}

	.bg-orb-2 {
		width: 220px;
		height: 220px;
		background: radial-gradient(circle, rgba(0, 210, 255, .15) 0%, transparent 70%);
		bottom: 100px;
		left: -50px;
	}

	/* ===== 导航栏 ===== */
	/* .nav-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 52px 18px 12px;
 }*/

	.back-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 17px;
		font-weight: 600;
		color: #1a2e44;
		letter-spacing: 0.2px;
		padding: 0;
	}

	.nav-actions {
		display: flex;
		gap: 10px;
	}

	.icon-btn {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 1px 6px rgba(0, 0, 0, .06);
	}

	/* ===== 滚动区域 ===== */
	.scroll-area {
		position: relative;
		z-index: 1;
		flex: 1;
		overflow-y: auto;
		padding: 0 18px;
	}

	/* ===== 雷达扫描区域 ===== */
	.radar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 28px 0 24px;
	}

	.radar-container {
		position: relative;
		width: 200px;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 同心圆波纹 */
	.radar-ring {
		position: absolute;
		border-radius: 50%;
		border: 1.5px solid rgba(79, 172, 254, 0.3);
		animation: ringPulse 2.8s ease-in-out infinite;
	}

	.ring-4 {
		width: 200px;
		height: 200px;
		animation-delay: 0s;
		background: rgba(79, 172, 254, .04);
	}

	.ring-3 {
		width: 150px;
		height: 150px;
		animation-delay: 0.2s;
		background: rgba(79, 172, 254, .06);
	}

	.ring-2 {
		width: 104px;
		height: 104px;
		animation-delay: 0.4s;
		background: rgba(79, 172, 254, .09);
	}

	.ring-1 {
		width: 64px;
		height: 64px;
		animation-delay: 0.6s;
		background: rgba(79, 172, 254, .14);
	}

	@keyframes ringPulse {

		0%,
		100% {
			opacity: 0.55;
			transform: scale(1);
		}

		50% {
			opacity: 1;
			transform: scale(1.04);
		}
	}

	/* 旋转扫描扇形 */
	.radar-sweep {
		position: absolute;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background: conic-gradient(rgba(79, 172, 254, 0) 0deg,
				rgba(79, 172, 254, 0) 270deg,
				rgba(79, 172, 254, 0.25) 360deg);
		animation: sweep 2.4s linear infinite;
	}

	@keyframes sweep {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	/* 中心点 */
	.radar-center {
		position: relative;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.center-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: linear-gradient(135deg, #4facfe, #00d2ff);
		box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
		z-index: 2;
	}

	.center-pulse {
		position: absolute;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: rgba(79, 172, 254, 0.5);
		animation: centerPulse 1.8s ease-out infinite;
	}

	@keyframes centerPulse {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}

		100% {
			transform: scale(3.5);
			opacity: 0;
		}
	}

	/* 搜索文字 */
	.scanning-text {
		margin-top: 20px;
		font-size: 14px;
		color: #6e90aa;
		letter-spacing: 0.3px;
	}

	.dot-ani span {
		display: inline-block;
		animation: dotBlink 1.4s infinite;
		font-size: 16px;
		line-height: 1;
	}

	.dot-ani span:nth-child(1) {
		animation-delay: 0s;
	}

	.dot-ani span:nth-child(2) {
		animation-delay: 0.25s;
	}

	.dot-ani span:nth-child(3) {
		animation-delay: 0.5s;
	}

	@keyframes dotBlink {

		0%,
		80%,
		100% {
			opacity: 0.2;
			transform: translateY(0);
		}

		40% {
			opacity: 1;
			transform: translateY(-3px);
		}
	}

	/* ===== 发现设备数量标题 ===== */
	.found-header {
		font-size: 14px;
		color: #4a6a80;
		font-weight: 500;
		padding: 4px 2px 14px;
		border-bottom: 1px solid rgba(79, 172, 254, 0.12);
		margin-bottom: 12px;
	}

	.found-header em {
		font-style: normal;
		color: #4facfe;
		font-weight: 700;
	}

	/* ===== 设备列表 ===== */
	.device-list {
		height: 246px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	/* ===== 设备卡片 ===== */
	.device-card {
		display: flex;
		align-items: center;
		gap: 14px;
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 16px;
		padding: 16px 14px;
		box-shadow: 0 2px 14px rgba(79, 172, 254, .10), 0 1px 4px rgba(0, 0, 0, .04);
		border: 1px solid rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: transform 0.18s ease, box-shadow 0.18s ease;
		animation: slideUp 0.4s ease both;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.device-card:active {
		transform: scale(0.985);
		box-shadow: 0 1px 6px rgba(79, 172, 254, .08);
	}

	/* ===== 图标 ===== */
	.device-icon-wrapper {
		width: 48px;
		height: 48px;
		border-radius: 13px;
		background: linear-gradient(135deg, #e8f5ff, #d0eaff);
		box-shadow: 0 2px 8px rgba(79, 172, 254, .2);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.device-icon {
		width: 34px;
		height: 34px;
	}

	/* ===== 设备信息 ===== */
	.device-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.device-name {
		font-size: 15px;
		font-weight: 600;
		color: #1a2e44;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.device-rssi {
		font-size: 12px;
		color: #9ab4cc;
	}

	/* ===== 齿轮按钮 ===== */
	.gear-btn {
		width: 64px;
		height: 24px;
		font-size: 12px;
		opacity: 0.6;
		background: rgba(79, 172, 254, .07);
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
		transition: background 0.2s;
	}

	.gear-btn:hover {
		background: rgba(79, 172, 254, .16);
	}

	.gear-btn:active {
		background: rgba(79, 172, 254, .25);
	}

	/* ===== 底部悬浮按钮 ===== */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		justify-content: center;
		padding: 16px 32px 36px;
		background: linear-gradient(to top, rgba(234, 246, 255, .95) 60%, transparent);
		backdrop-filter: blur(4px);
	}

	.toggle-btn {
		width: 100%;
		max-width: 340px;
		padding: 15px 0;
		border: none;
		border-radius: 50px;
		font-size: 16px;
		font-weight: 600;
		font-family: inherit;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all 0.25s ease;
		background: linear-gradient(135deg, #4facfe 0%, #00d2ff 100%);
		color: #fff;
		box-shadow: 0 6px 24px rgba(79, 172, 254, .45);
	}

	.toggle-btn:not(.scanning) {
		background: linear-gradient(135deg, #43c97a 0%, #00d2a4 100%);
		box-shadow: 0 6px 24px rgba(67, 201, 122, .38);
	}

	.toggle-btn:active {
		transform: scale(0.97);
		box-shadow: 0 3px 12px rgba(79, 172, 254, .3);
	}
</style>