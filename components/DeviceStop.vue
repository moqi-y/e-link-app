<template>
	<div class="page-wrapper">

		<!-- 云朵装饰层 -->
		<div class="cloud-layer">
			<div class="cloud cloud-tl">
				<image src="/static/icon/cloud-4.svg" style="width: 90px;height: 52px;"></image>
			</div>
			<div class="cloud cloud-tr">
				<image src="/static/icon/cloud-5.svg" style="width: 70px;height: 42px;"></image>
			</div>
			<div class="cloud cloud-ml">
				<image src="/static/icon/cloud-6.svg" style="width: 58px;height: 34px;"></image>
			</div>
		</div>

		<!-- 主要内容区 -->
		<div class="main-content">

			<!-- 警告图标 + 树形装饰 -->
			<div class="scene">
				<!-- 八边形警告图标 -->
				<div class="warning-icon-wrapper">
					<div class="warning-glow"></div>
					<div class="warning-icon">
						<image src="/static/icon/warning.png" style="width: 110px;height: 110px;"></image>
					</div>
				</div>
				
			</div>

			<!-- 状态文字 -->
			<p class="status-text">设备已关机</p>

			<!-- 电源按钮 -->
			<button class="power-btn" :class="{ powering: isPowering }" @click="handlePowerOn" :disabled="isPowering">
				<image src="/static/icon/power-on.svg" style="width: 28px; height: 28px;"></image>
			</button>

		</div>

		<!-- 开机过渡遮罩 -->
		<Transition name="power-fade">
			<div v-if="isPowering" class="power-mask">
				<div class="power-ripple"></div>
				<p class="power-label">正在开机…</p>
			</div>
		</Transition>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const isPowering = ref(false)

	const handlePowerOn = async () => {
		if (isPowering.value) return
		isPowering.value = true

		// 模拟开机操作，2.5s 后重置（实际可替换为真实指令）
		await new Promise(resolve => setTimeout(resolve, 2500))
		isPowering.value = false

		// 开机成功后跳转，例如：
		// router.push('/device/dashboard')
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
		background: linear-gradient(175deg, #ddeeff 0%, #eef6ff 30%, #f5faff 60%, #ffffff 100%);
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
		top: 12px;
		left: -10px;
		width: 130px;
		animation: cloudDrift 7s ease-in-out infinite alternate;
	}

	.cloud-tr {
		top: 6px;
		right: -6px;
		width: 100px;
		animation: cloudDrift 9s ease-in-out infinite alternate-reverse;
	}

	.cloud-ml {
		top: 68px;
		left: 20px;
		width: 80px;
		opacity: 0.7;
		animation: cloudDrift 11s ease-in-out infinite alternate;
	}

	@keyframes cloudDrift {
		from {
			transform: translateX(0px);
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
		gap: 0;
	}

	/* ===== 场景（图标 + 树） ===== */
	.scene {
		position: relative;
		width: 260px;
		height: 160px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		margin-bottom: 20px;
	}

	/* ===== 树形装饰 ===== */
	.tree {
		position: absolute;
		bottom: 0;
		animation: treeSway 4s ease-in-out infinite alternate;
	}

	.tree-ll {
		left: 16px;
		width: 22px;
		animation-delay: 0s;
	}

	.tree-lm {
		left: 46px;
		width: 16px;
		animation-delay: 0.5s;
		bottom: 0;
	}

	.tree-rm {
		right: 44px;
		width: 16px;
		animation-delay: 1s;
	}

	.tree-rl {
		right: 14px;
		width: 24px;
		animation-delay: 0.3s;
	}

	@keyframes treeSway {
		from {
			transform: rotate(-1.5deg);
			transform-origin: bottom center;
		}

		to {
			transform: rotate(1.5deg);
			transform-origin: bottom center;
		}
	}

	/* ===== 八边形警告图标 ===== */
	.warning-icon-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		margin-bottom: 8px;
	}

	.warning-glow {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(79, 172, 254, .30) 0%, transparent 70%);
		animation: glowPulse 2.5s ease-in-out infinite;
	}

	@keyframes glowPulse {

		0%,
		100% {
			transform: scale(1);
			opacity: 0.7;
		}

		50% {
			transform: scale(1.2);
			opacity: 1;
		}
	}

	.warning-icon {
		width: 100px;
		height: 100px;
		animation: iconFloat 3.5s ease-in-out infinite;
		filter: drop-shadow(0 8px 20px rgba(45, 143, 212, .35));
	}

	@keyframes iconFloat {

		0%,
		100% {
			transform: translateY(0px);
		}

		50% {
			transform: translateY(-8px);
		}
	}

	/* ===== 状态文字 ===== */
	.status-text {
		font-size: 15px;
		color: #7aaec8;
		letter-spacing: 1.5px;
		font-weight: 400;
		margin-bottom: 64px;
		animation: fadeIn 0.8s ease both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ===== 电源按钮 ===== */
	.power-btn {
		width: 68px;
		height: 68px;
		border-radius: 50%;
		border: 1.8px solid rgba(180, 215, 235, 0.7);
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow:
			0 4px 20px rgba(79, 172, 254, .14),
			0 1px 4px rgba(0, 0, 0, .05),
			inset 0 1px 2px rgba(255, 255, 255, 0.9);
		transition: all 0.25s ease;
		animation: fadeIn 1s 0.2s ease both;
	}

	.power-btn:hover:not(:disabled) {
		box-shadow:
			0 6px 28px rgba(79, 172, 254, .28),
			0 2px 6px rgba(0, 0, 0, .06),
			inset 0 1px 2px rgba(255, 255, 255, 0.9);
		transform: scale(1.06);
	}

	.power-btn:active:not(:disabled) {
		transform: scale(0.95);
		box-shadow: 0 2px 10px rgba(79, 172, 254, .15);
	}

	.power-btn.powering {
		animation: powerSpin 1.2s linear infinite;
		border-color: #4facfe;
		box-shadow: 0 0 0 4px rgba(79, 172, 254, .15), 0 4px 20px rgba(79, 172, 254, .25);
	}

	@keyframes powerSpin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.power-btn:disabled {
		cursor: not-allowed;
	}

	/* ===== 开机过渡遮罩 ===== */
	.power-mask {
		position: fixed;
		inset: 0;
		background: rgba(220, 242, 255, 0.55);
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
		border: 3px solid #4facfe;
		animation: rippleOut 1.2s ease-out infinite;
	}

	@keyframes rippleOut {
		0% {
			transform: scale(0.6);
			opacity: 1;
		}

		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}

	.power-label {
		font-size: 15px;
		color: #3a8ccc;
		letter-spacing: 1px;
		font-weight: 500;
	}

	/* ===== 过渡动画 ===== */
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