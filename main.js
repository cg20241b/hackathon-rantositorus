import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const lastAlphabet = "o";
const lastDigit = "8";

const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const alphabetGeometry = new TextGeometry(lastAlphabet, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const alphabetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const alphabetMesh = new THREE.Mesh(alphabetGeometry, alphabetMaterial);
    alphabetMesh.position.set(-2, 0, 0);
    scene.add(alphabetMesh);

    const digitGeometry = new TextGeometry(lastDigit, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const digitMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
    digitMesh.position.set(2, 0, 0);
    scene.add(digitMesh);
  }
);

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
