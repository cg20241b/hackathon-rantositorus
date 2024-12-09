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

const lastAlphabet = "o"; // Last alphabet for display
const lastDigit = "4"; // Last digit for display
const ambientIntensity = 0.428; // Ambient light intensity

// Cube (Light Source) to move with camera
const cubeSize = 0.5;
const glowCube = new THREE.Mesh(
  new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
  new THREE.MeshBasicMaterial({ color: 0xffffff }) // White color for the cube
);
scene.add(glowCube);
const pointLightPosition = new THREE.Vector3(0, 0, 0); // Initial light position

// Shader material for Alphabet (Plastic-like appearance)
const alphabetShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ambientIntensity: { value: ambientIntensity },
    lightPosition: { value: pointLightPosition },
    baseColor: { value: new THREE.Color(0x073763) }, // Blue color for alphabet
    specularColor: { value: new THREE.Color(1, 1, 1) }, // White specular color for plastic
    shininess: { value: 30.0 }, // Medium shininess for plastic
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Calculate the normal and position for lighting calculations
      vNormal = normalize(normalMatrix * normal);
      vPosition = vec3(modelViewMatrix * vec4(position, 1.0)); // Position in view space
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
      // Calculate ambient light contribution (soft light)
      vec3 ambient = ambientIntensity * baseColor;

      // Diffuse lighting calculation (direct light intensity)
      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 normal = normalize(vNormal);
      float diff = max(dot(lightDir, normal), 0.0);
      vec3 diffuse = diff * baseColor;

      // Specular lighting (shiny reflection on the surface)
      vec3 viewDir = normalize(-vPosition); // Direction from the fragment to the camera
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      // Combine ambient, diffuse, and specular lighting
      gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
  `,
});

// Shader material for Digit (Metal-like appearance)
const digitShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    ambientIntensity: { value: ambientIntensity },
    lightPosition: { value: pointLightPosition },
    baseColor: { value: new THREE.Color(0x633307) }, // Brownish color for digit
    specularColor: { value: new THREE.Color(0.5, 0.3, 0.07) }, // Darker specular color for metal
    shininess: { value: 80.0 }, // High shininess for metal-like appearance
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Calculate the normal and position for lighting calculations
      vNormal = normalize(normalMatrix * normal);
      vPosition = vec3(modelViewMatrix * vec4(position, 1.0)); // Position in view space
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
      // Calculate ambient light contribution (soft light)
      vec3 ambient = ambientIntensity * baseColor;

      // Diffuse lighting calculation (direct light intensity)
      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 normal = normalize(vNormal);
      float diff = max(dot(lightDir, normal), 0.0);
      vec3 diffuse = diff * baseColor;

      // Specular lighting (shiny reflection on the surface)
      vec3 viewDir = normalize(-vPosition); // Direction from the fragment to the camera
      vec3 halfDir = normalize(lightDir + viewDir); // Halfway vector between light and view
      float spec = pow(max(dot(vNormal, halfDir), 0.0), shininess);
      vec3 specular = spec * specularColor;

      // Combine ambient, diffuse, and specular lighting
      gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    }
  `,
});

// Load font and create meshes for the alphabet and digit
const fontLoader = new FontLoader();
fontLoader.load(
  "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    // Create geometry for the alphabet
    const alphabetGeometry = new TextGeometry(lastAlphabet, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const alphabetMesh = new THREE.Mesh(
      alphabetGeometry,
      alphabetShaderMaterial
    );
    alphabetMesh.position.set(-3, 0, 0); // Position the alphabet
    scene.add(alphabetMesh);

    // Create geometry for the digit
    const digitGeometry = new TextGeometry(lastDigit, {
      font: font,
      size: 1,
      height: 0.2,
    });
    const digitMesh = new THREE.Mesh(digitGeometry, digitShaderMaterial);
    digitMesh.position.set(2, 0, 0); // Position the digit
    scene.add(digitMesh);
  }
);

// Handling user inputs for movement
const keys = { w: false, s: false, a: false, d: false };

// Keydown event listener for interactivity
document.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});

// Keyup event listener for interactivity
document.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

// Update the positions of the cube and camera based on user input
function update() {
  // Move the light (cube) upward or downward
  if (keys.w) glowCube.position.y += 0.05;
  if (keys.s) glowCube.position.y -= 0.05;

  // Move the camera left or right
  if (keys.a) camera.position.x -= 0.05;
  if (keys.d) camera.position.x += 0.05;

  // Update the light position to match the cube's position
  pointLightPosition.copy(glowCube.position);
}

// Animate the scene
function animate() {
  update();
  renderer.render(scene, camera);
}

// Start the animation loop
renderer.setAnimationLoop(animate);
