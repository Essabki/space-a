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

// 🪐 SATURN PLANET (NO LIGHT DEPENDENCY)
const saturnGeometry = new THREE.SphereGeometry(1.4, 64, 64);

const textureLoader = new THREE.TextureLoader();
const saturnTexture = textureLoader.load(
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/saturn.jpg"
);

// ✅ changed to BasicMaterial (no lights needed)
const saturnMaterial = new THREE.MeshBasicMaterial({
    map: saturnTexture
});

const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// ======================================
// 🪐 3 SUPER DENSE RINGS (30,000 STARS)
// ======================================

const starRingGeometry = new THREE.BufferGeometry();
const totalStars = 30000;
const starPositions = new Float32Array(totalStars * 3);

for (let i = 0; i < totalStars; i++) {
    const ringNum = Math.floor(i / 10000);

    let innerRadius, outerRadius;

    if (ringNum === 0) {
        innerRadius = 1.42;
        outerRadius = 1.75;
    } else if (ringNum === 1) {
        innerRadius = 1.85;
        outerRadius = 2.35;
    } else {
        innerRadius = 2.45;
        outerRadius = 2.95;
    }

    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;

    starPositions[i * 3] = Math.cos(angle) * radius;
    starPositions[i * 3 + 1] = 0;
    starPositions[i * 3 + 2] = Math.sin(angle) * radius;
}

starRingGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3)
);

const starRings = new THREE.Points(
    starRingGeometry,
    new THREE.PointsMaterial({
        color: 0xD2B48C,
        size: 0.012,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true
    })
);

saturn.add(starRings);

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

// 🔄 ANIMATION
function animate() {
    requestAnimationFrame(animate);

    if (isAutoRotate) {
        saturn.rotation.y += 0.004;
    }

    renderer.render(scene, camera);
}

handleResize();
animate();