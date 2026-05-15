// store/blueTooth.js
import { defineStore } from 'pinia'

export const useDevicesStore = defineStore('devices', {
  state: () => {
    return {
      connectedDevices: [], // 存储已连接的设备对象
    }
  },
  
  // 添加 getters 用于获取去重后的设备列表
  getters: {
    // 按 deviceId 去重
    uniqueConnectedDevices: (state) => {
      const map = new Map()
      state.connectedDevices.forEach(device => {
        if (device.deviceId && !map.has(device.deviceId)) {
          map.set(device.deviceId, device)
        }
      })
      return Array.from(map.values())
    },
    
    // 获取连接数量
    connectedCount: (state) => {
      const unique = new Set(state.connectedDevices.map(d => d.deviceId))
      return unique.size
    }
  },
  
  // 添加 actions 管理设备
  actions: {
    // 添加设备（自动去重）
    addDevice(device) {
      if (!device || !device.deviceId) return
      
      // 检查是否已存在
      const exists = this.connectedDevices.some(d => d.deviceId === device.deviceId)
      if (!exists) {
        this.connectedDevices.push(device)
        console.log('设备已添加:', device.name)
      } else {
        console.log('设备已存在:', device.name)
      }
    },
    
    // 批量添加设备
    addDevices(devices) {
      devices.forEach(device => {
        this.addDevice(device)
      })
    },
    
    // 移除设备
    removeDevice(deviceId) {
      const index = this.connectedDevices.findIndex(d => d.deviceId === deviceId)
      if (index !== -1) {
        const removed = this.connectedDevices.splice(index, 1)[0]
        console.log('设备已移除:', removed.name)
        return removed
      }
      return null
    },
    
    // 清空所有设备
    clearDevices() {
      this.connectedDevices = []
    },
    
    // 更新设备信息
    updateDevice(deviceId, newInfo) {
      const index = this.connectedDevices.findIndex(d => d.deviceId === deviceId)
      if (index !== -1) {
        this.connectedDevices[index] = { ...this.connectedDevices[index], ...newInfo }
      }
    }
  }
})