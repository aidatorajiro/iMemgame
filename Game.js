/**
Copyright (c) 2018 Torajiro Aida

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/

import { PixelRatio } from 'react-native'

const THREE = require('three')

const ProcessView = require('./ProcessView')
const ProcessSelect = require('./ProcessSelect')
const Character = require('./Character')
const Footprints = require('./Footprints')

const Globals = require('./Globals.js')

class Game {
  init () {
    // camera / scene / renderer preparation
    Globals.camera = new THREE.OrthographicCamera(Globals.width / -2, Globals.width / 2, Globals.height / 2, Globals.height / -2, 1, 2000)
    Globals.camera.position.z = 500

    Globals.scene = new THREE.Scene()

    window.addEventListener = () => { }

    Globals.renderer = new THREE.WebGLRenderer({
      canvas: {
        width: Globals.width,
        height: Globals.height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      antialias: true,
      context: Globals.gl
    })

    Globals.renderer.setSize(Globals.width, Globals.height)
    Globals.renderer.setPixelRatio(PixelRatio.get())

    // construct objects
    Globals.footprints = new Footprints()
    Globals.character = new Character()
    Globals.processSelect = new ProcessSelect()

    // call animate func
    requestAnimationFrame((time) => {
      // event handlers
      Globals.onLayout.push((ev) => {
        this.resize()
      })

      Globals.onClick.push(function (ev) {
        if (Globals.locked === true) { return }
        Globals.character.onClick(new THREE.Vector2(ev.nativeEvent.locationX, ev.nativeEvent.locationY))
      })

      this.last_time = 0
      this.animate(time)
    })
  }

  resize () {
    Globals.renderer.setSize(Globals.width, Globals.height)
    Globals.camera.left = Globals.width / -2
    Globals.camera.right = Globals.width / 2
    Globals.camera.top = Globals.height / 2
    Globals.camera.bottom = Globals.height / -2
    Globals.camera.updateProjectionMatrix()
  }

  animate (time) {
    Globals.delta = time - this.last_time
    this.last_time = time

    Globals.renderer.render(Globals.scene, Globals.camera)

    Globals.camera.position.x = Globals.character.coordinate.x
    Globals.camera.position.y = Globals.character.coordinate.y
    Globals.footprints.update()
    Globals.character.update()

    if (Globals.processSelect.finished === false) {
      Globals.processSelect.update()
    }

    if (Globals.processSelect.selected === true) {
      if (Globals.processView === undefined) {
        Globals.processView = new ProcessView(Globals.processSelect.pid)
      }
      Globals.processView.update()
    }

    Globals.gl.endFrameEXP()

    requestAnimationFrame((time) => { this.animate(time) })
  }
}

module.exports = Game
