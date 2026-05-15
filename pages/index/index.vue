<template>
	<div class="page-wrapper">
		<!-- 背景装饰 -->
		<div class="bg-orb bg-orb-1"></div>
		<div class="bg-orb bg-orb-2"></div>

		<div class="container">
			<!-- 页面标题 -->
			<h1 class="page-title">我的设备</h1>

			<!-- 设备列表 -->
			<div class="device-list">
				<div v-if="uniqueDevices.length>0">
					<div v-for="(device, index) in uniqueDevices" :key="device.id" class="device-card"
						:style="{ animationDelay: `${index * 80}ms` }" @click="handleDeviceClick(device)">
						<!-- 图标区域 -->
						<div class="device-icon-wrapper" :class="device.type">
							<!-- 制冷机：风扇图标-->
							<image v-if="device.type === 'cooler'" class="device-icon" style="width: 48px;height: 48px;"
								src="/static/icon/device-icon-1.svg"></image>

							<!-- 柴暖：暖气/锅炉图标 -->
							<image v-else="device.type === 'cooler'" class="device-icon"
								style="width: 48px;height: 48px;" src="/static/icon/device-icon-2.svg"></image>
						</div>

						<!-- 设备信息 -->
						<div class="device-info">
							<span class="device-name">{{ device.name }}</span>
							<span class="device-desc">{{ device.description }}</span>
						</div>

						<!-- 右侧箭头 -->
						<div class="device-arrow">
							<svg width="8" height="14" viewBox="0 0 8 14" fill="none">
								<path d="M1 1L7 7L1 13" stroke="#C0D4E8" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round" />
							</svg>
						</div>
					</div>
				</div>
				<div class="no-data" v-else>
					<image src="/static/icon/taken_mshk.svg" style="width: 320px;height: 240px;"></image>
					<text style="margin-top: 6px;opacity: 0.7;">暂无设备</text>
				</div>
			</div>

			<!-- 添加设备按钮 -->
			<div class="add-btn-wrapper">
				<button class="add-btn" @click="handleAddDevice">
					<span class="add-icon">+</span>
					<span>添加设备</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	import {
		useDevicesStore
	} from "@/store/blueTooth.js";
	
	
	const devicesStore = useDevicesStore();
	// 设备数据
	const uniqueDevices = computed(() => {
		// 方法1：使用 store 的 getter（推荐）
		return devicesStore.uniqueConnectedDevices
	})
	// 点击设备卡片
	const handleDeviceClick = (device) => {
		console.log('点击设备：', device.name)
		// 可在此跳转详情页，例如：router.push(`/device/${device.id}`)
		uni.navigateTo({
			url: "/pages/deviceDetail/deviceDetail"
		})
	}

	// 添加设备
	const handleAddDevice = () => {
		console.log('添加设备')
		// 可在此跳转添加设备页面
		uni.navigateTo({
			url: "/pages/addDevice/addDevice"
		})
	}
</script>

<style scoped>
	/* ===== 全局重置 ===== */
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ===== 页面外层 ===== */
	.page-wrapper {
		position: relative;
		min-height: 100vh;
		width: 100%;
		background: linear-gradient(160deg, #dff0ff 0%, #eaf6ff 40%, #f0f8ff 70%, #e2f0fb 100%);
		overflow: hidden;
		font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	}

	/* 背景装饰气泡 */
	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		pointer-events: none;
		z-index: 0;
	}

	.bg-orb-1 {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(79, 172, 254, 0.25) 0%, transparent 70%);
		top: -80px;
		right: -60px;
	}

	.bg-orb-2 {
		width: 250px;
		height: 250px;
		background: radial-gradient(circle, rgba(0, 210, 255, 0.18) 0%, transparent 70%);
		bottom: 80px;
		left: -60px;
	}

	/* ===== 主内容区 ===== */
	.container {
		position: relative;
		z-index: 1;
		max-width: 480px;
		margin: 0 auto;
		padding: 56px 20px 32px;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ===== 标题 ===== */
	.page-title {
		font-size: 26px;
		font-weight: 700;
		color: #1a2e44;
		letter-spacing: 0.5px;
		margin-bottom: 28px;
	}

	/* ===== 设备列表 ===== */
	.device-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
		flex: 1;
	}

	/* ===== 设备卡片 ===== */
	.device-card {
		display: flex;
		align-items: center;
		gap: 16px;
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-radius: 18px;
		padding: 18px 18px 18px 16px;
		box-shadow:
			0 2px 16px rgba(79, 172, 254, 0.1),
			0 1px 4px rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.9);
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease;

		/* 入场动画 */
		animation: slideUp 0.45s ease both;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(18px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.device-card:active {
		transform: scale(0.985);
		box-shadow:
			0 1px 8px rgba(79, 172, 254, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.04);
	}

	/* ===== 图标容器 ===== */
	.device-icon-wrapper {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
	}

	.device-icon-wrapper.heater {
		background: linear-gradient(135deg, #e8f5ff 0%, #d0eaff 100%);
		box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
	}

	.device-icon-wrapper.cooler {
		background: linear-gradient(135deg, #e0f7ff 0%, #c8eeff 100%);
		box-shadow: 0 2px 8px rgba(0, 210, 255, 0.2);
	}

	.device-icon {
		width: 36px;
		height: 36px;
	}

	/* ===== 设备信息 ===== */
	.device-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.device-name {
		font-size: 16px;
		font-weight: 600;
		color: #1a2e44;
		letter-spacing: 0.2px;
		line-height: 1.2;
	}

	.device-desc {
		font-size: 12px;
		color: #9ab4cc;
		font-weight: 400;
		line-height: 1.4;
	}

	/* ===== 右侧箭头 ===== */
	.device-arrow {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* ===== 添加设备按钮 ===== */
	.add-btn-wrapper {
		display: flex;
		justify-content: center;
		margin-top: 36px;
		padding-bottom: 20px;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 1.5px solid #4facfe;
		color: #3a9fe0;
		font-size: 15px;
		font-weight: 500;
		font-family: inherit;
		padding: 12px 36px;
		border-radius: 50px;
		cursor: pointer;
		letter-spacing: 0.5px;
		transition: all 0.2s ease;
		box-shadow: 0 2px 12px rgba(79, 172, 254, 0.15);
		backdrop-filter: blur(4px);
	}

	.add-btn:hover {
		background: rgba(79, 172, 254, 0.08);
		box-shadow: 0 4px 20px rgba(79, 172, 254, 0.25);
		transform: translateY(-1px);
	}

	.add-btn:active {
		transform: scale(0.97) translateY(0);
		box-shadow: 0 2px 8px rgba(79, 172, 254, 0.15);
	}

	.add-icon {
		font-size: 18px;
		line-height: 1;
		font-weight: 400;
		color: #4facfe;
	}
	
	.no-data{
		display: flex;
		flex-direction:column;
		justify-content: center;
		align-items: center;
		margin-top: 40px;
	}
</style>