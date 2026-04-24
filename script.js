// 🌌 SCENE
const scene = new THREE.Scene();

// 🎥 CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// 🎮 CAMERA CONTROL
let cameraAngleX = 0;
let cameraAngleY = -0.3;
let cameraRadius = 40;
let panOffset = new THREE.Vector3();

let isLeftDragging = false;
let isRightDragging = false;
let lastX = 0, lastY = 0;

document.addEventListener("mousedown", e=>{
    if(e.button===0) isLeftDragging=true;
    if(e.button===2) isRightDragging=true;
    lastX=e.clientX; lastY=e.clientY;
});

document.addEventListener("mouseup", e=>{
    if(e.button===0) isLeftDragging=false;
    if(e.button===2) isRightDragging=false;
});

document.addEventListener("mousemove", e=>{
    const dx=e.clientX-lastX;
    const dy=e.clientY-lastY;

    if(isLeftDragging){
        cameraAngleY += dx*0.005;
        cameraAngleX -= dy*0.005;
        cameraAngleX = Math.max(-Math.PI/2+0.1, Math.min(Math.PI/2-0.1, cameraAngleX));
    }

    if(isRightDragging){
        panOffset.x += dx*0.01;
        panOffset.y -= dy*0.01;
    }

    lastX=e.clientX; lastY=e.clientY;
});

document.addEventListener("contextmenu", e=>e.preventDefault());

document.addEventListener("wheel", e=>{
    cameraRadius += e.deltaY*0.05;
    cameraRadius = Math.max(10, Math.min(120, cameraRadius));
});

// 🎥 RENDERER
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ⭐ LABEL SYSTEM
const labelsDiv = document.createElement("div");
labelsDiv.style.position = "absolute";
labelsDiv.style.top = "0";
labelsDiv.style.left = "0";
labelsDiv.style.pointerEvents = "none";
labelsDiv.style.color = "white";
labelsDiv.style.fontFamily = "Arial";
labelsDiv.style.fontSize = "14px";
document.body.appendChild(labelsDiv);

const labels = {};

function addLabel(name, obj, size) {
    const div = document.createElement("div");
    div.innerText = name;
    div.style.position = "absolute";
    div.style.transform = "translate(-50%, -50%)";
    div.style.textShadow = "0 0 5px black";
    labelsDiv.appendChild(div);
    labels[name] = { el: div, obj, size };
}

// 💡 LIGHT
scene.add(new THREE.AmbientLight(0xffffff,0.3));
scene.add(new THREE.PointLight(0xffffff,2));

// 🌍 TEXTURES
const loader = new THREE.TextureLoader();

// 🪐 PLANET ORBITS
function createOrbit(r){
    const geo=new THREE.RingGeometry(r-0.02,r+0.02,128);
    const mat=new THREE.MeshBasicMaterial({
        color:0xffffff,
        side:THREE.DoubleSide,
        transparent:true,
        opacity:0.12
    });
    const ring=new THREE.Mesh(geo,mat);
    ring.rotation.x=-Math.PI/2;
    scene.add(ring);
}

// 🌙 MOON ORBITS
function createMoonOrbit(planet, distance, color=0x44ff44){
    const geo=new THREE.RingGeometry(distance-0.05,distance+0.05,64);
    const mat=new THREE.MeshBasicMaterial({
        color:color,
        side:THREE.DoubleSide,
        transparent:true,
        opacity:0.25
    });
    const ring=new THREE.Mesh(geo,mat);
    ring.rotation.x=-Math.PI/2;
    planet.add(ring);
}

// orbit rings
[6,8,11,14,18,23,28,32,38].forEach(createOrbit);

// 🪐 PLANETS
function createPlanet(size,texture,dist,speed){
    const mesh=new THREE.Mesh(
        new THREE.SphereGeometry(size,64,64),
        new THREE.MeshStandardMaterial({map:loader.load(texture)})
    );
    const pivot=new THREE.Object3D();
    scene.add(pivot);
    pivot.add(mesh);
    mesh.position.x=dist;
    return {mesh,pivot,speed};
}

// ☀️ SUN
const sun=new THREE.Mesh(
    new THREE.SphereGeometry(4,64,64),
    new THREE.MeshBasicMaterial({
        map:loader.load("https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/sun.jpg")
    })
);
scene.add(sun);

// planets
const mercury=createPlanet(0.5,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/mercury.jpg",6,0.04);
const venus=createPlanet(0.8,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/venus.jpg",8,0.03);
const earth=createPlanet(1,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/earth.jpg",11,0.02);
const mars=createPlanet(0.7,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/mars.jpg",14,0.018);
const jupiter=createPlanet(2,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/jupiter.jpg",18,0.01);
const saturn=createPlanet(1.7,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/saturn.jpg",23,0.008);
const uranus=createPlanet(1.2,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/uranus.jpg",28,0.006);
const neptune=createPlanet(1.2,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/neptune.jpg",32,0.005);
const pluto=createPlanet(0.4,"https://raw.githubusercontent.com/Essabki/space-a/refs/heads/main/space-a/data/planet-info/pic/plutomap2k.jpg",38,0.003);

// 🌙 MOONS
function createMoon(planet,size,dist,speed,texture){
    const moon=new THREE.Mesh(
        new THREE.SphereGeometry(size,32,32),
        new THREE.MeshStandardMaterial({map:loader.load(texture)})
    );
    const pivot=new THREE.Object3D();
    planet.mesh.add(pivot);
    pivot.add(moon);
    moon.position.x=dist;
    return {pivot,speed};
}

function updateMoon(m){ m.pivot.rotation.y+=m.speed; }

// 🌍 Earth moon + orbit
const earthMoon=createMoon(earth,0.3,1.5,0.05,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/moon.jpg");
createMoonOrbit(earth.mesh,1.5,0x44ff44);

// 🪐 Jupiter moons (4) + orbits
const jm1=createMoon(jupiter,0.3,3,0.04,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/ceres.jpg");
createMoonOrbit(jupiter.mesh,3,0xffaa00);

const jm2=createMoon(jupiter,0.25,4,0.03,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/eris.jpg");
createMoonOrbit(jupiter.mesh,4,0xffaa00);

const jm3=createMoon(jupiter,0.35,5,0.02,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/ceres.jpg");
createMoonOrbit(jupiter.mesh,5,0xffaa00);

const jm4=createMoon(jupiter,0.28,2.5,0.035,"https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/eris.jpg");
createMoonOrbit(jupiter.mesh,2.5,0xffaa00);

// 🪐 SATURN RINGS - REALISTIC 3-RING SYSTEM (A, B, C + Cassini Division)
const saturnRings = [];

// RING C (outer thin ring)
const ringCGeo = new THREE.RingGeometry(2.3, 2.7, 64);
const ringCMat = new THREE.MeshBasicMaterial({
    color: 0xddddee,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.4
});
const ringC = new THREE.Mesh(ringCGeo, ringCMat);
ringC.rotation.x = Math.PI / 2.2;
saturn.mesh.add(ringC);
saturnRings.push(ringC);

// RING B (brightest, thickest ring)
const ringBGeo = new THREE.RingGeometry(2.8, 4.2, 128);
const ringBMat = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.7
});
const ringB = new THREE.Mesh(ringBGeo, ringBMat);
ringB.rotation.x = Math.PI / 2.2;
saturn.mesh.add(ringB);
saturnRings.push(ringB);

// RING A (outer bright ring)
const ringAGeo = new THREE.RingGeometry(4.3, 5.2, 96);
const ringAMat = new THREE.MeshBasicMaterial({
    color: 0xbbbbcc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55
});
const ringA = new THREE.Mesh(ringAGeo, ringAMat);
ringA.rotation.x = Math.PI / 2.2;
saturn.mesh.add(ringA);
saturnRings.push(ringA);

// Animate rings
function updateSaturnRings() {
    saturnRings.forEach((ring, index) => {
        ring.rotation.z += 0.0005 + index * 0.0002;
    });
}

// 🏷️ LABELS
addLabel("Sun", sun, 4);
addLabel("Mercury", mercury.mesh, 0.5);
addLabel("Venus", venus.mesh, 0.8);
addLabel("Earth", earth.mesh, 1);
addLabel("Mars", mars.mesh, 0.7);
addLabel("Jupiter", jupiter.mesh, 2);
addLabel("Saturn", saturn.mesh, 1.7);
addLabel("Uranus", uranus.mesh, 1.2);
addLabel("Neptune", neptune.mesh, 1.2);
addLabel("Pluto", pluto.mesh, 0.4);

// 🔄 ANIMATE
function animate(){
    requestAnimationFrame(animate);

    const x=cameraRadius*Math.cos(cameraAngleY)*Math.cos(cameraAngleX);
    const y=cameraRadius*Math.sin(cameraAngleX);
    const z=cameraRadius*Math.sin(cameraAngleY)*Math.cos(cameraAngleX);

    camera.position.set(x+panOffset.x,y+panOffset.y,z+panOffset.z);
    camera.lookAt(0,0,0);

    sun.rotation.y+=0.002;

    // ORBIT ROTATION
    mercury.pivot.rotation.y+=mercury.speed;
    venus.pivot.rotation.y+=venus.speed;
    earth.pivot.rotation.y+=earth.speed;
    mars.pivot.rotation.y+=mars.speed;
    jupiter.pivot.rotation.y+=jupiter.speed;
    saturn.pivot.rotation.y+=saturn.speed;
    uranus.pivot.rotation.y+=uranus.speed;
    neptune.pivot.rotation.y+=neptune.speed;
    pluto.pivot.rotation.y+=pluto.speed;

    // SELF-ROTATION
    mercury.mesh.rotation.y += 0.015;
    venus.mesh.rotation.y += 0.012;
    earth.mesh.rotation.y += 0.01;
    mars.mesh.rotation.y += 0.009;
    jupiter.mesh.rotation.y += 0.007;
    saturn.mesh.rotation.y += 0.006;
    uranus.mesh.rotation.y += 0.004;
    neptune.mesh.rotation.y += 0.0035;
    pluto.mesh.rotation.y += 0.002;

    // MOONS
    updateMoon(earthMoon);
    updateMoon(jm1);
    updateMoon(jm2);
    updateMoon(jm3);
    updateMoon(jm4);

    // 🔥 SATURN RINGS
    updateSaturnRings();

    // 🏷️ UPDATE LABELS
    for (let key in labels) {
        const { el, obj, size } = labels[key];
        const pos = new THREE.Vector3();
        obj.getWorldPosition(pos);

        pos.y += size + 1.5;
        pos.project(camera);

        el.style.left = (pos.x * 0.5 + 0.5) * window.innerWidth + "px";
        el.style.top = (-pos.y * 0.5 + 0.5) * window.innerHeight + "px";
    }

    renderer.render(scene,camera);
}
animate();

// 📱 RESIZE
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});