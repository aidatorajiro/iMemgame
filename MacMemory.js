/**
Copyright (c) 2018 Torajiro Aida

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

import { NativeModules } from 'react-native';

const LibcManager = NativeModules.LibcManager

class Memory {
  constructor (pid) {
    let mytask = LibcManager.mach_task_self()
    this.task = mytask
    console.log("task", mytask)
    /*TODO
    let ret = LibcManager.task_for_pid(mytask, pid, taskRef)
    if (ret !== 0) {
      throw new Error('task_for_pid error ' + ret)
    }

    this.task = taskRef.deref()
    this.task = 0
    */
  }

  getRegions () {
    let regions = []
    let address = 0
    let mapsize = 0

    while (true) {
      // input: task address, output: ret region_size info
      [ret, mapsize, info] = LibcManager.mach_vm_region(this.task, address)
      if (ret === 1) {
        break
      }
      if (ret !== 0) {
        throw new Error('mach_vm_region error ' + ret)
      }

      console.log("address", address)

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
