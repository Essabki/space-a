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
camera.position.z = 3.2;

// 🪐 SATURN PLANET
const saturnGeometry = new THREE.SphereGeometry(1.4, 64, 64);

const textureLoader = new THREE.TextureLoader();
const saturnTexture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/ceres.jpg"
);

// ✅ NO LIGHT MATERIAL (important change)
const saturnMaterial = new THREE.MeshBasicMaterial({
    map: saturnTexture
});

const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// 🖱️ FULL MOUSE CONTROL
planetContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    saturn.rotation.y += deltaX * 0.01;
    saturn.rotation.x += deltaY * 0.01;

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

planetContainer.addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
});

planetContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    camera.position.z += event.deltaY * 0.002;
    camera.position.z = Math.max(2.0, Math.min(5, camera.position.z));
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
        saturn.rotation.y += 0.004;
    }

    renderer.render(scene, camera);
}

handleResize();
animate();