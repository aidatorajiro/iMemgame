/**
Copyright (c) 2018 Torajiro Aida

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

import Globals from './Globals'
import { NativeModules } from 'react-native';

const LibcManager = NativeModules.LibcManager

class Memory {
  constructor (pid) {
    if (Globals.jailbroken) {
      let mytask = LibcManager.mach_task_self()
      let [ret, task] = LibcManager.task_for_pid(mytask, pid)
      if (ret !== 0) {
        throw new Error('task_for_pid error ' + ret)
      }
      this.task = task
    } else {
      let mytask = LibcManager.mach_task_self()
      this.task = mytask
    }
    console.log("task", this.task)
  }

  getRegionsTest () {
    [ret, mapsize, info] = LibcManager.mach_vm_region(this.task, 0)
    if (ret !== 1 && ret !== 0) {
      throw new Error('mach_vm_region error ' + ret)
    }
  }

  getRegions () {
    let regions = []
    let address = 0
    let mapsize = 0

    console.log("getregions")

    while (true) {
      // input: task address, output: ret region_size info
      [ret, mapsize, info] = LibcManager.mach_vm_region(this.task, address)
      if (ret === 1) {
        break
      }
      if (ret !== 0) {
        throw new Error('mach_vm_region error ' + ret)
      }

      regions.push([address, mapsize])

      address = address + mapsize // TODO overflow condition
    }

    return regions
  }

  read (address, length) {
    // input: task address length, output: ret data datasize
    let [ret, data, datasize] = LibcManager.mach_vm_read_overwrite(this.task, address, length)
    if (ret !== 0) {
      throw new Error('mach_vm_read_overwrite error ' + ret)
    }
    return data
  }
}

module.exports = Memory
