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

// 🪐 MAKEMAKE
const geometry = new THREE.SphereGeometry(1.4, 64, 64);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/makemake.jpg"
);

// ✅ NO LIGHT MATERIAL
const material = new THREE.MeshBasicMaterial({
    map: texture
});

const makemake = new THREE.Mesh(geometry, material);
scene.add(makemake);

// 🖱️ DRAG CONTROL
planetContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;

    makemake.rotation.y += deltaX * 0.01;
    makemake.rotation.x += deltaY * 0.01;

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 🖱️ CLICK → AUTO ROTATE
planetContainer.addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
});

// 🔍 ZOOM
planetContainer.addEventListener('wheel', (event) => {
    event.preventDefault();

    camera.position.z += event.deltaY * 0.002;
    camera.position.z = Math.max(2.0, Math.min(5, camera.position.z));
});

// 📏 RESIZE
function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', handleResize);

// 🔄 ANIMATE
function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotate) {
        makemake.rotation.y += 0.004;
    }

    renderer.render(scene, camera);
}

handleResize();
animate();