import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Material, TextGeometry } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('./textures/matcaps/9 .png');

/**
 * Font
 */

const fontLoader = new THREE.FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new THREE.TextBufferGeometry('HackThisFall', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 6,
    bevelEnabled: true,
    bevelSize: 0.02,
    bevelThickness: 0.03,
    bevelOffset: 0,
    bevelSegment: 4,
  });
  // Difficult way to Move Text to Center
  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);
  //   textGeometry.translate(
  //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  // <----------------->
  // Easy Method to Move Text to Center
  textGeometry.center();
  // <------------------->

  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  const text = new THREE.Mesh(textGeometry, material);
  //   textMaterial.wireframe = true;

  scene.add(text);
  console.time('Donut');

  // Adding 100 Donuts
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    scene.add(donut);
    // Randomize Position
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    //  Randomize Scale
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
  }
  console.timeEnd('Donut');
});

// // Axes Helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
