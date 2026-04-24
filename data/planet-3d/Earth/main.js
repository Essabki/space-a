//Earth
const container = document.getElementById('earth-container');
const planetContainer = document.getElementById('planet-container');

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let isAutoRotate = false;

// 🌍 Renderer
const earthRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
earthRenderer.setSize(container.clientWidth, container.clientHeight);
earthRenderer.setClearColor(0x000000, 0);
container.appendChild(earthRenderer.domElement);

// 🌍 Scene & Camera
const earthScene = new THREE.Scene();
const earthCamera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);
earthCamera.position.z = 2.8;

// 🌍 Earth
const geometry = new THREE.SphereGeometry(1.4, 64, 64);
const textureLoader = new THREE.TextureLoader();

const earthTexture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/earth.jpg"
);

// ✅ NO LIGHT MATERIAL (important change)
const material = new THREE.MeshBasicMaterial({
    map: earthTexture
});

const earth = new THREE.Mesh(geometry, material);
earthScene.add(earth);

// 🖱️ DRAG ROTATION
planetContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    earth.rotation.y += deltaX * 0.01;
    earth.rotation.x += deltaY * 0.01;

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 🖱️ SINGLE CLICK → TOGGLE AUTO ROTATE
planetContainer.addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
});

// 🔍 ZOOM (mouse wheel)
planetContainer.addEventListener('wheel', (event) => {
    event.preventDefault();

    earthCamera.position.z += event.deltaY * 0.002;
    earthCamera.position.z = Math.max(1.8, Math.min(5, earthCamera.position.z));
});

// 📏 Resize
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    earthRenderer.setSize(width, height);
    earthCamera.aspect = width / height;
    earthCamera.updateProjectionMatrix();
}
window.addEventListener('resize', handleResize);

// 🔄 Animation
function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotate) {
        earth.rotation.y += 0.005;
    }

    earthRenderer.render(earthScene, earthCamera);
}

handleResize();
animate();