import "./style.css"
import { gsap } from "gsap"
import { Rendering } from "./rendering"
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

class Demo {
  constructor(){
    this.rendering = new Rendering(document.querySelector("#canvas") )
    this.controls = new OrbitControls(this.rendering.camera, this.rendering.canvas)

    this.uTime = new THREE.Uniform(0)
    this.init()
  }
  init(){
    const box = new THREE.BoxGeometry()
    const mat = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(box, mat)

    this.rendering.scene.add(mesh)

    this.addEvents()
  }
  addEvents(){
    gsap.ticker.add(this.tick)
  }
  tick = (time, delta)=>{
    this.uTime.value += delta * 0.001 * 0.5;
    this.rendering.render()
  }
}

let demo = new Demo()

