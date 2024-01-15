import "./style.css"
import { gsap } from "gsap"
import { Rendering } from "./rendering"
import * as THREE from "three";
import gui from 'lil-gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

class Demo2 {
  constructor() {
    this.rendering = new Rendering(document.querySelector("#canvas"))
    this.rendering.camera.position.z = 15
    this.controls = new OrbitControls(this.rendering.camera, this.rendering.canvas)
    this.uTime = new THREE.Uniform(0)
    this.init()
  }
  createInstancedGeometry(geometry) {
    let instances = 800;

    let instancedGeometry = new THREE.InstancedBufferGeometry()
    instancedGeometry.copy(geometry)
    instancedGeometry.instanceCount = instances

    let aInstance = new Float32Array(4 * instances)
    let aInstance2 = new Float32Array(4 * instances)

    for (let i = 0; i < instances; i++) {
      // Circle angle
      aInstance[i * 4 + 0] = Math.random() * Math.PI * 2
      // Torus tube angle
      aInstance[i * 4 + 1] = Math.random() * Math.PI * 2
      // Torus tube scale
      aInstance[i * 4 + 2] = Math.random() * 2
      // Scale
      aInstance[i * 4 + 3] = 0.2 + Math.random() * Math.random()

      // Rotation 
      aInstance2[i * 4 + 0] = Math.random() * Math.PI * 2

      aInstance2[i * 4 + 1] = Math.floor(Math.random() * 3)
    }

    instancedGeometry.setAttribute("aInstance", new THREE.InstancedBufferAttribute(aInstance, 4, false))
    instancedGeometry.setAttribute("aInstance2", new THREE.InstancedBufferAttribute(aInstance2, 4, false))

    return instancedGeometry
  }
  init() {
    let ambient = new THREE.AmbientLight(0xffffff, .75)
    let sun = new THREE.DirectionalLight(0xffffff, 2.0)
    sun.position.set(0.5, 0.5, 0.5)

    this.rendering.scene.add(sun)
    this.rendering.scene.add(ambient)

    let size = 0.1
    const box = new THREE.BoxGeometry(size, size, size)
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x202020,
      metalness: 0.4,
      roughness: 0.
    })
    let uniforms = {
      uTime: this.uTime,
      uColors: { value: [new THREE.Color("#FFD542"), new THREE.Color("#FF4141"), new THREE.Color("#B75AFF")] }
    }
    let vertexHead = glsl` 

  varying vec3 vColor;
  uniform float uTime;
  attribute vec4 aInstance;
  attribute vec4 aInstance2;
  uniform vec3 uColors[3];
  varying float vColorful;

mat4 rotationMatrix(vec3 axis, float angle) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float oc = 1.0 - c;
      
      return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
            0.0,                                0.0,                                0.0,                                1.0);
    }

    vec3 rotate(vec3 v, vec3 axis, float angle) {
      mat4 m = rotationMatrix(axis, angle);
      return (m * vec4(v, 1.0)).xyz;
    }
float between(float center, float range, float val){
      return smoothstep(center - range, center, val) * smoothstep(center + range, center, val); 
    }

  void main(){
`
    let vertexBody = glsl`
      float angle = aInstance.x + uTime;
      vec2 circlePos = vec2(
        cos(angle),
        sin(angle)
      ) * vec2(8., 8.);

      transformed = rotate(transformed, normalize(vec3(0.2, 0.4, 0.6)), aInstance2.x + uTime);
      float activation = between(PI * 1.5, PI * 0.5, mod(angle, PI * 2.) );

      float tubeAngle = aInstance.y;
      vec3 tubePosition = vec3(
        0.,
        cos(tubeAngle),
        sin(tubeAngle)
      ) * (aInstance.z + 4. - activation * 4.);

      tubePosition = rotate(tubePosition, vec3(0.,0.,-1.), angle + PI + 0.5);

      transformed *= aInstance.w * (activation * 2.5 + 1.);
      transformed.xy += circlePos;
      transformed += tubePosition;

      vec4 mvPosition = vec4( transformed, 1.0 );

      #ifdef USE_INSTANCING

      mvPosition = instanceMatrix * mvPosition;

      #endif

      mvPosition = modelViewMatrix * mvPosition;
      vColorful = activation;
      if(aInstance2.y == 2.) {
        vColor = mix(uColors[2], uColors[1], 1.-activation);
      } else if(aInstance2.y == 1.) {
        vColor = uColors[1];
      } else { 
        vColor = mix(uColors[0], uColors[1], position.x * 4.);
      }

      gl_Position = projectionMatrix * mvPosition;
      `;

    let fragmentHead = glsl`
  #define USE_COLOR
  varying float vColorful;

  `

    let colorFragment = glsl`
  #if defined( USE_COLOR_ALPHA )

    diffuseColor *= vColor;

  #elif defined( USE_COLOR )

    diffuseColor.rgb = mix(diffuseColor.rgb, vColor * (1. + max(vec3(0.), vColor - 0.5)), vColorful);
    // diffuseColor.rgb = vec3(vColorful);

  #endif
  `
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace("void main() {", vertexHead)
      shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", vertexBody)
      shader.fragmentShader = fragmentHead + shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", colorFragment)
      shader.uniforms = {
        ...shader.uniforms,
        ...uniforms,
      }
    }

    let parent = new THREE.Object3D()
    parent.position.y += 4.
    const mesh = new THREE.Mesh(this.createInstancedGeometry(box), mat)
    mesh.frustumCulled = false
    parent.add(mesh)
    const mesh2 = new THREE.Mesh(this.createInstancedGeometry(new THREE.TorusGeometry(0.1, 0.07)), mat)
    mesh2.frustumCulled = false
    parent.add(mesh2)

    this.rendering.scene.add(parent)
    this.addEvents()
  }
  addEvents() {
    gsap.ticker.add(this.tick)
  }
  tick = (time, delta) => {
    this.uTime.value += delta * 0.001 * 0.5;
    this.rendering.render()
  }
}


let demo = new Demo2()


