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
camera.position.z = 3.5;

// 🪐 SATURN PLANET
const saturnGeometry = new THREE.SphereGeometry(1.4, 64, 64);
const textureLoader = new THREE.TextureLoader();
const saturnTexture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/saturn.jpg"
);

const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// 🪐 BENI FATEH RINGS WITH 0xDEB887
const saturnRings = [];

// RING C - Darker version
const ringCGeo = new THREE.RingGeometry(1.48, 1.62, 64);
const ringCMat = new THREE.MeshBasicMaterial({
    color: 0xE8D5B7,  // Darker burlywood
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
});
const ringC = new THREE.Mesh(ringCGeo, ringCMat);
ringC.rotation.x = Math.PI * 0.5;
saturn.add(ringC);
saturnRings.push(ringC);

// RING B - 0xDEB887 (Beni Fateh main!)
const ringBGeo = new THREE.RingGeometry(1.68, 2.12, 128);
const ringBMat = new THREE.MeshBasicMaterial({
    color: 0xDEB887,  // ✅ YOUR COLOR - Burlywood
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
});
const ringB = new THREE.Mesh(ringBGeo, ringBMat);
ringB.rotation.x = Math.PI * 0.5;
saturn.add(ringB);
saturnRings.push(ringB);

// RING A - Lighter version
const ringAGeo = new THREE.RingGeometry(2.22, 2.72, 96);
const ringAMat = new THREE.MeshBasicMaterial({
    color: 0xE8D5B7,  // Lighter burlywood
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55
});
const ringA = new THREE.Mesh(ringAGeo, ringAMat);
ringA.rotation.x = Math.PI * 0.5;
saturn.add(ringA);
saturnRings.push(ringA);

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

    saturn.rotation.y += deltaX * 0.01;
    saturn.rotation.x += deltaY * 0.01;

    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 🖱️ AUTO ROTATE
planetContainer.addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
});

// 🔍 ZOOM
planetContainer.addEventListener('wheel', (event) => {
    event.preventDefault();
    camera.position.z += event.deltaY * 0.002;
    camera.position.z = Math.max(2.5, Math.min(6, camera.position.z));
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

// 🔄 ANIMATION
function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotate) {
        saturn.rotation.y += 0.004;
    }

    const time = Date.now() * 0.0003;
    saturnRings[0].rotation.z = time * 0.8;
    saturnRings[1].rotation.z = time * 0.6;
    saturnRings[2].rotation.z = time * 0.4;

    renderer.render(scene, camera);
}

handleResize();
animate();