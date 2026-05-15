/**
 * 初始化蓝牙模块
 */
export const bluetoothAdapter = () => {
	return new Promise((resolve, reject) => {
		uni.openBluetoothAdapter({
			success(res) {
				resolve(res)
			},
			fail(error) {
				// errCode=10001
				reject(error?.code)
			}
		})
	})
}


/**
 * 开始搜寻附近的蓝牙外围设备
 */

export const searchBluetooth = () => {
	return new Promise((resolve, reject) => {
		uni.startBluetoothDevicesDiscovery({
			// services: ['FEE7'],要搜索的蓝牙设备主 service 的 uuid 列表
			success(res) {
				console.log(res)
				resolve(res)
			}
		})
	})
}

/**
 * 监听寻找到新设备的事件
 */
export const foundNewDevice = () => {
	return new Promise((resolve, reject) => {
		
	})
}


/**
 * ArrayBuffer转16进度字符串示例
 * @param {Object} buffer
 */
export function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}