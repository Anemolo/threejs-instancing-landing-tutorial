<h1 align="center">DEMO-TITLE</h1>

<p align="center">
    <a href="https://offscreencanvas.com" target="_blank" rel="noopener noreferrer">
        <img width="25" src="./logo.png" alt="Offscreen Logo">
    </a>
    <a href="https://offscreencanvas.com" target="_blank" rel="noopener noreferrer">
        <img src="https://img.shields.io/badge/Learn%20More%20Webgl%20In%20The%20Newsletter-8A2BE2" alt="Subscribe Badge">
    </a>
    <a href="https://offscreencanvas.com" target="_blank" rel="noopener noreferrer">
        <img width="25" src="./logo.png" alt="Offscreen Logo">
    </a>
</p>

[![Demo Image](./logo.png)](https://offscreencanvas.com/renders/demo-title)

Demo for 
Description

More learning resources and similar demos in my newsletter issue. 

Article: [Link](https://offscreencanvas.com/issues/demo-title)

Demo: [Link](https://offscreencanvas.com/renders/demo-title)

New learning resources/demos/articles each week ( or so c: ) in the newsletter. Subscribe!

Next Article: [Grid Tile Patterns](https://offscreencanvas.com/issues/grid-tile-patterns/)

---

let ambient = new THREE.AmbientLight(0xffffff, .75)
let sun = new THREE.DirectionalLight(0xffffff, 2.0)
sun.position.set(0.5, 0.5, 0.5)

this.rendering.scene.add(sun)
this.rendering.scene.add(ambient)

---
let uniforms = {
  uTime: uTime,
  uColors: { value: [new THREE.Color("#FFD542"), new THREE.Color("#FF4141"), new THREE.Color("#B75AFF")]}
}
material.onBeforeCompile = (shader)=>{
      shader.vertexShader = shader.vertexShader.replace("void main() {", vertexHead)
      shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", vertexBody)
			shader.uniforms = {
        ...shader.uniforms, 
        ...uniforms,
      }
    }

---
let vertexHead = glsl`
      attribute vec4 aInstance;
			uniform float uTime;
      void main(){
      `
  let vertexBody = glsl`

      vec4 mvPosition = vec4( transformed, 1.0 );

      #ifdef USE_INSTANCING

      mvPosition = instanceMatrix * mvPosition;

      #endif

      mvPosition = modelViewMatrix * mvPosition;

      gl_Position = projectionMatrix * mvPosition;
      `;
---

shader.fragmentShader = fragmentHead + shader.fragmentShader
shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", colorFragment)

---

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

---
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
---

float between(float center, float range, float val){
      return smoothstep(center - range, center, val) * smoothstep(center + range, center, val); 
    }

---


transformed = rotate(transformed, normalize(vec3(0.2, 1., 0.4)), uTime * (1. * aInstance.z + 0.3)+   aInstance2.x);

---
## Installing & Running

```
yarn install
yarn dev
```

### Files && comments

| file | Description |
| --- | --- |
| demo.js | The meat of the demo |
| rendering.js | All the threeJS rendering |
| palettes.js | Offscreen canvas paletters, and default sin palette options. May be changed by the demo |

#### Details

These demos have colors managed already. So, `THREE.ColorManagement.enabled = false` is set by default on the `palettes.js` file 

### Controls

| keybind | Description |
| --- | --- |
| ArrowLeft/ArrowRight | Change between color palettes |


## License
This resource can be used freely if integrated or build upon in personal or commercial projects such as websites, web apps and web templates intended for sale. It is not allowed to take the resource "as-is" and sell it, redistribute, re-publish it, or sell "pluginized" versions of it. Free plugins built using this resource should have a visible mention and link to the original work. Always consider the licenses of all included libraries, scripts and images used.

## Social

Made for [Offscreen Canvas](https://offscreencanvas.com/)
By [Daniel Velasquez @Anemolito](https://twitter.com/Anemolito)

[Twitter](https://twitter.com/Anemolito) - [Portfolio](https://velasquezdaniel.com/) - [Github](https://github.com/Anemolo) - [Offscreen Canvas](https://offscreencanvas.com/)
