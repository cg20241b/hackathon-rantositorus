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

camera.position.z = 7;

const lastAlphabet = "o";
const lastDigit = "4";
const ambientIntensity = 0.428;

// Cube (Light Source)
const cubeSize = 0.5;
const glowCube = new THREE.Mesh(
  new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
scene.add(glowCube);
const pointLightPosition = new THREE.Vector3(0, 0, 0);

const alphabetShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ambientIntensity: { value: ambientIntensity },
    lightPosition: { value: pointLightPosition },
    baseColor: { value: new THREE.Color(0x073763) },
    specularColor: { value: new THREE.Color(1, 1, 1) },
    shininess: { value: 30.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float ambientIntensity;
    uniform vec3 lightPosition;
    uniform vec3 baseColor;
    uniform vec3 specularColor;
    uniform float shininess;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 ambient = ambientIntensity * baseColor;

      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 normal = normalize(vNormal);
      float diff = max(dot(lightDir, normal), 0.0);
      vec3 diffuse = diff * baseColor;

      vec3 viewDir = normalize(-vPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
  `,
});

const digitShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ambientIntensity: { value: ambientIntensity },
    lightPosition: { value: pointLightPosition },
    baseColor: { value: new THREE.Color(0x633307) },
    specularColor: { value: new THREE.Color(0.5, 0.3, 0.07) },
    shininess: { value: 80.0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float ambientIntensity;
    uniform vec3 lightPosition;
    uniform vec3 baseColor;
    uniform vec3 specularColor;
    uniform float shininess;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 ambient = ambientIntensity * baseColor;

      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 normal = normalize(vNormal);
      float diff = max(dot(lightDir, normal), 0.0);
      vec3 diffuse = diff * baseColor;

      vec3 viewDir = normalize(-vPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
  `,
});

const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const alphabetGeometry = new TextGeometry(lastAlphabet, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const alphabetMesh = new THREE.Mesh(
      alphabetGeometry,
      alphabetShaderMaterial
    );
    alphabetMesh.position.set(-2, 0, 0);
    scene.add(alphabetMesh);

    const digitGeometry = new TextGeometry(lastDigit, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const digitMesh = new THREE.Mesh(digitGeometry, digitShaderMaterial);
    digitMesh.position.set(2, 0, 0);
    scene.add(digitMesh);
  }
);

const keys = { w: false, s: false, a: false, d: false };
document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

function update() {
  if (keys.w) glowCube.position.y += 0.05;
  if (keys.s) glowCube.position.y -= 0.05;

  if (keys.a) camera.position.x -= 0.05;
  if (keys.d) camera.position.x += 0.05;

  pointLightPosition.copy(glowCube.position);
}

function animate() {
  update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
