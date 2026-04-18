const container = document.getElementById('earth-container');
const planetContainer = document.getElementById('planet-container');

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let isAutoRotate = false;

// 🌍 Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// 🌍 Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);
camera.position.z = 4; // Slightly farther for ellipsoid view

// 🪐 HAUMEA (real triaxial ellipsoid shape)
const haumeaGeometry = new THREE.SphereGeometry(0.8, 64, 64); // base sphere
const textureLoader = new THREE.TextureLoader();
const haumeaTexture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/haumea.jpg"
);

const haumeaMaterial = new THREE.MeshStandardMaterial({
    map: haumeaTexture,
    roughness: 0.6,
    metalness: 0.1
});
const haumea = new THREE.Mesh(haumeaGeometry, haumeaMaterial);

// **REAL HAUMEA SHAPE** - Triaxial ellipsoid (not spherical)
// Real Haumea dimensions: ~2320km × 1660km × 1280km
// Scale ratios: X=1.7, Y=0.7, Z=0.7 (elongated along X-axis)
haumea.scale.set(1.7, 0.7, 0.7); // This makes it the real rugby-ball shape!

scene.add(haumea);

// 💡 Lighting (optimized for Haumea)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Softer ambient
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(-5, -3, -5);
scene.add(pointLight);

// 🖱️ FULL MOUSE CONTROL (updated for haumea)
planetContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;
    
    haumea.rotation.y += deltaX * 0.01;
    haumea.rotation.x += deltaY * 0.01;
    
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

planetContainer.addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
    console.log(isAutoRotate ? '🪐 Haumea Auto-rotate ON' : '🪐 Haumea Auto-rotate OFF');
});

planetContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    camera.position.z += event.deltaY * 0.002;
    camera.position.z = Math.max(2.5, Math.min(6, camera.position.z)); // Adjusted zoom limits
});

function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', handleResize);

function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotate) {
        haumea.rotation.y += 0.008; // Faster rotation (Haumea spins very fast!)
    }

    renderer.render(scene, camera);
}

handleResize();
animate();