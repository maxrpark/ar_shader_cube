import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

import { setARTestImage } from "./utils/helperFunctions.js";
// import guiDebugger from "./utils/GUIDebugger.js";
// const debugActive = window.location.hash === "#debug";

const USING_TEST_IMG = false;

if (USING_TEST_IMG) {
  setARTestImage("../assets/pandora.jpeg", () => start());
} else {
  document.addEventListener("DOMContentLoaded", () => start());
}

const start = async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: "../assets/targets/targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  // RENDERER
  renderer.outputColorSpace;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // SCENE

  const mesh = new THREE.Mesh(
    // new THREE.PlaneGeometry(1, 1),
    new THREE.BoxGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: `
                      varying vec2 vUvs;

                      void main (){
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                      vUvs = uv;
                      }
      `,
      fragmentShader: `
                      varying vec2 vUvs;
                      uniform vec2 resolution;
                      uniform float uTime;

                      vec3 RED_COLOR = vec3(1.0, 0.0, 0.0);
                      vec3 LIGHT_BLUE_COLOR = vec3(1.0, 2.0, 3.0);

                      vec3 color_1 = vec3(0.5, 0.5, 0.5);
                      vec3 color_2 = vec3(0.5, 0.5, 0.5);
                      vec3 color_3 = vec3(1.0, 1.0, 1.0);
                      vec3 color_4 = vec3(0.263,0.416,0.557);

                      float NUMBER_OF_ITERATIONS = 4.0;

                      //https://iquilezles.org/articles/palettes/
                      vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
                          return a + b*cos( 6.28318*(c*t+d) );
                      }


                      void main (){

                      vec2 coords = (vUvs - 0.5) * 2.0;
                      vec2 uv0 = coords;
                      vec3 finalColor = vec3(0.0);


                      for (float i = 0.0; i < NUMBER_OF_ITERATIONS; i++) {
                        coords = fract(coords * 1.5) - 0.5;

                        float d = length(coords) * exp(-length(uv0));

                        float t = length(uv0) + i * 0.4 + uTime * 0.4;

                        vec3 color = palette(t, color_1, color_2, color_3, color_4);

                        d = sin(d * 10.0 + uTime * 0.5 ) / 8.0;
                        d = abs(d);
                        // d = 0.01 / d;

                        d = pow(0.009 / d, 1.5);

                              
                      finalColor += color * d;
                        
                      }

                      // Calculate transparency based on luminance
                      float luminance = dot(finalColor.rgb, vec3(0.299, 0.587, 0.114));
                      float alpha = smoothstep(0.1, 0.9, luminance); // Adjust threshold as needed

                      // Output the final color with transparency
                      gl_FragColor = vec4(finalColor, alpha);
                      }   
      `,
      side: THREE.DoubleSide,

      uniforms: {
        uTime: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
    })
  );

  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(mesh);

  await mindarThree.start();

  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const elapsedTime = clock.getElapsedTime();

    //@ts-ignore
    mesh.material.uniforms.uTime.value = elapsedTime;

    mesh.rotation.x = elapsedTime * 0.2;
    mesh.rotation.y = elapsedTime * 0.2;

    renderer.render(scene, camera);
  });
};
