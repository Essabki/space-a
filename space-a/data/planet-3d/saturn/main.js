// Saturn - MORE STARS IN RINGS (30,000 total!)
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
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/saturn.jpg"
);

const saturnMaterial = new THREE.MeshStandardMaterial({
    map: saturnTexture,
    roughness: 0.6,
    metalness: 0.1
});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// ======================================
// 3 SUPER DENSE BROWN RINGS - 30,000 STARS!
// ======================================

const starRingGeometry = new THREE.BufferGeometry();
const totalStars = 30000; // DOUBLE the stars!
const starPositions = new Float32Array(totalStars * 3);

for (let i = 0; i < totalStars; i++) {
    const ringNum = Math.floor(i / 10000); // 3 rings, 10k stars each!
    
    let innerRadius, outerRadius;
    if (ringNum === 0) { // RING 1
        innerRadius = 1.42;
        outerRadius = 1.75;
    } else if (ringNum === 1) { // RING 2 MAIN
        innerRadius = 1.85;
        outerRadius = 2.35;
    } else { // RING 3
        innerRadius = 2.45;
        outerRadius = 2.95;
    }
    
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    const angle = Math.random() * Math.PI * 2;
    
    starPositions[i * 3] = Math.cos(angle) * radius;
    starPositions[i * 3 + 1] = 0; // Straight
    starPositions[i * 3 + 2] = Math.sin(angle) * radius;
}

starRingGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

const starRings = new THREE.Points(starRingGeometry, new THREE.PointsMaterial({
    color: 0xD2B48C,  // Brown
    size: 0.012,       // Slightly smaller for density
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
}));
saturn.add(starRings);

// 💡 Lighting
const ambientLight = new THREE.AmbientLight(0x88aaff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
pointLight.position.set(-5, -3, -5);
scene.add(pointLight);

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
    console.log(isAutoRotate ? '🪐 Auto-rotate ON' : '🪐 Auto-rotate OFF');
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