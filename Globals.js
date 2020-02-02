/**
Copyright (c) 2018 Torajiro Aida

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

let Globals = {
  locked: false,
  lock: () => {Globals.locked = true},
  unlock: () => {setTimeout(() => {Globals.locked = false}, 100)},
  edge_size: 60,
  delta: undefined,
  scene: undefined,
  camera: undefined,
  renderer: undefined,
  game: undefined,
  processSelect: undefined,
  processView: undefined,
  character: undefined,
  footprints: undefined,
  onLayout: [(ev) => {
    Globals.width = ev.nativeEvent.layout.width + Globals.edge_size
    Globals.height = ev.nativeEvent.layout.height + Globals.edge_size
  }],
  onResize: [],
  onClick: [],
  width: undefined,
  height: undefined
}

module.exports = Globals;