/**
Copyright (c) 2018 Torajiro Aida

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

import Globals from './Globals'
import { NativeModules } from 'react-native'

const LibcManager = NativeModules.LibcManager

class Memory {
  constructor (pid) {
    if (Globals.jailbroken) {
      const mytask = LibcManager.mach_task_self()
      const [ret, task] = LibcManager.task_for_pid(mytask, pid)
      if (ret !== 0) {
        throw new Error('task_for_pid error ' + ret)
      }
      this.task = task
    } else {
      const mytask = LibcManager.mach_task_self()
      this.task = mytask
    }
    console.log('task', this.task)
  }

  getRegionsTest () {
    [ret, address, mapsize, info] = LibcManager.mach_vm_region(this.task, 0)
    if (ret !== 1 && ret !== 0) {
      throw new Error('mach_vm_region error ' + ret)
    }
  }

  getRegions () {
    const regions = []
    let ret
    let address = 0
    let mapsize
    let info

    console.log('getregions');

    [ret, address, mapsize, info] = LibcManager.mach_vm_region(this.task, address)

    while (ret === 0) {
      regions.push([address, mapsize])

      address = address + mapsize; // TODO overflow condition

      // input: task address, output: ret region_size info
      [ret, address, mapsize, info] = LibcManager.mach_vm_region(this.task, address)
    }

    return regions
  }

  read (address, length) {
    // input: task address length, output: ret data datasize
    const [ret, data, datasize] = LibcManager.mach_vm_read_overwrite(this.task, address, length)
    if (ret !== 0) {
      throw new Error('mach_vm_read_overwrite error ' + ret)
    }
    return data
  }
}

module.exports = Memory
