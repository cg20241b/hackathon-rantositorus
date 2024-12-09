import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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
const lastDigit = "4";

const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const alphabetGeometry = new TextGeometry(lastAlphabet, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const alphabetMaterial = new THREE.MeshBasicMaterial({ color: 0x073763 });
    const alphabetMesh = new THREE.Mesh(alphabetGeometry, alphabetMaterial);
    alphabetMesh.position.set(-2, 0, 0);
    scene.add(alphabetMesh);

    const digitGeometry = new TextGeometry(lastDigit, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const digitMaterial = new THREE.MeshBasicMaterial({ color: 0x633307 });
    const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
    digitMesh.position.set(2, 0, 0);
    scene.add(digitMesh);
  }
);

const cubeSize = 0.3;
const glowShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    glowColor: { value: new THREE.Color(0xffffff) },
    intensity: { value: 1.5 },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    uniform float intensity;
    varying vec3 vNormal;
    void main() {
      float brightness = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
      gl_FragColor = vec4(glowColor * brightness * intensity, 1.0);
    }
  `,
});
const glowCube = new THREE.Mesh(
  new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
  glowShaderMaterial
);
scene.add(glowCube);

const pointLight = new THREE.PointLight(0xffffff, 1, 10);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

function animate() {
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
