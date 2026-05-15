<template>
	<div class="page-wrapper">

		<!-- 云朵装饰层 -->
		<div class="cloud-layer">
			<div class="cloud cloud-tl">
				<image src="/static/icon/cloud-1.svg" style="width: 100px;height: 56px;"></image>
			</div>
			<div class="cloud cloud-tr">
				<image src="/static/icon/cloud-2.svg" style="width: 76px;height: 46px;"></image>
			</div>
			<div class="cloud cloud-ml">
				<image src="/static/icon/cloud-3.svg" style="width: 64px;height: 36px;"></image>
			</div>
		</div>

		<!-- 主内容区 -->
		<div class="main-content">

			<!-- 场景：齿轮 + 树形装饰 -->
			<div class="scene">
				<!-- 中央齿轮图标 -->
				<div class="gear-wrapper">
					<div class="gear-glow"></div>
					<div class="gear-icon">
						<image src="/static/icon/alarm-warning-line.png" style="width: 120px;height: 120px;"></image>
					</div>
				</div>
			</div>

			<!-- 故障文字区域 -->
			<div class="status-block">
				<p class="status-title">设备故障请关机-E12</p>
				<p class="status-sub">
					<span class="sub-icon">
						
					</span>
					电机查看错误码说明
				</p>
			</div>

			<!-- 电源按钮 -->
			<button class="power-btn" :class="{ powering: isPowering }" @click="handlePowerOff" :disabled="isPowering">
				<image mode="aspectFill" src="/static/icon/power-off.svg" style="width: 28px;height: 28px;"></image>
			</button>
		</div>

		<!-- 关机过渡遮罩 -->
		<Transition name="power-fade">
			<div v-if="isPowering" class="power-mask">
				<div class="power-ripple"></div>
				<p class="power-label">正在关机…</p>
			</div>
		</Transition>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const isPowering = ref(false)

	const handlePowerOff = async () => {
		if (isPowering.value) return
		isPowering.value = true

		// 模拟关机指令，2.5s 后重置（替换为真实蓝牙/网络指令）
		await new Promise(resolve => setTimeout(resolve, 2500))
		isPowering.value = false

		// 关机成功后跳转，例如：
		// router.push('/device/off')
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* ===== 页面背景 ===== */
	.page-wrapper {
		position: relative;
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(175deg, #ffe0e0 0%, #fff0f0 30%, #fff7f7 60%, #ffffff 100%);
		font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* ===== 云层 ===== */
	.cloud-layer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 180px;
		pointer-events: none;
		z-index: 0;
	}

	.cloud {
		position: absolute;
	}

	.cloud-tl {
		top: 10px;
		left: -12px;
		width: 140px;
		animation: cloudDrift 7s ease-in-out infinite alternate;
	}

	.cloud-tr {
		top: 4px;
		right: -8px;
		width: 108px;
		animation: cloudDrift 9s ease-in-out infinite alternate-reverse;
	}

	.cloud-ml {
		top: 70px;
		left: 16px;
		width: 88px;
		opacity: 0.65;
		animation: cloudDrift 11s ease-in-out infinite alternate;
	}

	@keyframes cloudDrift {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(12px);
		}
	}

	/* ===== 主内容 ===== */
	.main-content {
		position: relative;
		z-index: 1;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 32px;
	}

	/* ===== 场景容器 ===== */
	.scene {
		position: relative;
		width: 280px;
		height: 170px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		margin-bottom: 22px;
	}

	/* ===== 树形装饰 ===== */
	.tree {
		position: absolute;
		bottom: 0;
		animation: treeSway 4s ease-in-out infinite alternate;
	}

	.tree-ll {
		left: 10px;
		width: 20px;
		animation-delay: 0s;
	}

	.tree-lm {
		left: 40px;
		width: 14px;
		animation-delay: 0.6s;
	}

	.tree-rm {
		right: 38px;
		width: 14px;
		animation-delay: 1.1s;
	}

	.tree-rl {
		right: 8px;
		width: 22px;
		animation-delay: 0.3s;
	}

	@keyframes treeSway {
		from {
			transform-origin: bottom center;
			transform: rotate(-1.5deg);
		}

		to {
			transform-origin: bottom center;
			transform: rotate(1.5deg);
		}
	}

	/* ===== 齿轮图标 ===== */
	.gear-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		margin-bottom: 10px;
	}

	.gear-glow {
		position: absolute;
		width: 130px;
		height: 130px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(224, 80, 80, .28) 0%, transparent 70%);
		animation: glowPulse 2.6s ease-in-out infinite;
	}

	@keyframes glowPulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 0.7;
		}

		50% {
			transform: scale(1.18);
			opacity: 1;
		}
	}

	.gear-icon {
		width: 110px;
		height: 110px;
		/* animation: gearRotate 12s linear infinite; */
		/* filter: drop-shadow(0 8px 18px rgba(192, 48, 48, .38)); */
		transform-origin: center center;
		/* 或者 50% 50% */
	}

	/* 故障状态：齿轮缓慢旋转并抖动 */
	@keyframes gearRotate {
		0% {
			transform: rotate(0deg);
		}

		48% {
			transform: rotate(174deg);
		}

		50% {
			transform: rotate(172deg);
		}

		/* 轻微抖动 */
		52% {
			transform: rotate(176deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	/* ===== 故障文字块 ===== */
	.status-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		margin-bottom: 60px;
		animation: fadeInUp 0.7s ease both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.status-title {
		font-size: 16px;
		font-weight: 700;
		color: #c03030;
		letter-spacing: 0.5px;
	}

	.status-sub {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 13px;
		color: #d45555;
		font-weight: 400;
		letter-spacing: 0.3px;
	}

	.sub-icon {
		display: flex;
		align-items: center;
	}

	/* ===== 电源按钮 ===== */
	.power-btn {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		border: 1.8px solid rgba(220, 160, 160, 0.6);
		background: rgba(255, 255, 255, 0.88);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow:
			0 4px 20px rgba(224, 96, 96, .18),
			0 1px 4px rgba(0, 0, 0, .05),
			inset 0 1px 2px rgba(255, 255, 255, 0.9);
		transition: all 0.25s ease;
		animation: fadeInUp 0.9s 0.2s ease both;
	}

	.power-btn:hover:not(:disabled) {
		box-shadow:
			0 6px 28px rgba(224, 96, 96, .32),
			0 2px 6px rgba(0, 0, 0, .07),
			inset 0 1px 2px rgba(255, 255, 255, 0.9);
		transform: scale(1.07);
	}

	.power-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow: 0 2px 10px rgba(224, 96, 96, .18);
	}

	.power-btn.powering {
		animation: powerSpin 1.2s linear infinite;
		border-color: #e06060;
		box-shadow: 0 0 0 4px rgba(224, 96, 96, .15), 0 4px 20px rgba(224, 96, 96, .28);
	}

	@keyframes powerSpin {
		to {
			transform: rotate(360deg);
		}
	}

	.power-btn:disabled {
		cursor: not-allowed;
	}

	/* ===== 关机遮罩 ===== */
	.power-mask {
		position: fixed;
		inset: 0;
		background: rgba(255, 235, 235, .55);
		backdrop-filter: blur(6px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		z-index: 50;
	}

	.power-ripple {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 3px solid #e06060;
		animation: rippleOut 1.2s ease-out infinite;
	}

	@keyframes rippleOut {
		0% {
			transform: scale(0.6);
			opacity: 1;
		}

		100% {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	.power-label {
		font-size: 15px;
		color: #c03030;
		letter-spacing: 1px;
		font-weight: 500;
	}

	/* ===== 遮罩过渡 ===== */
	.power-fade-enter-active,
	.power-fade-leave-active {
		transition: opacity 0.35s ease;
	}

	.power-fade-enter-from,
	.power-fade-leave-to {
		opacity: 0;
	}
	uni-button:after{
		border: none !important;
	}
</style>