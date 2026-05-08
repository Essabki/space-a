
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// CAMERA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(0,0,50);


// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enablePan = true;
controls.screenSpacePanning = true;

controls.zoomToCursor = true;

controls.minDistance = 2;
controls.maxDistance = 150;

controls.target.set(0,0,0);


// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff,0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff,2,500);
scene.add(sunLight);


// TEXTURE LOADER
const loader = new THREE.TextureLoader();


// LABEL SYSTEM
const labelsDiv = document.createElement("div");

labelsDiv.style.position = "absolute";
labelsDiv.style.top = "0";
labelsDiv.style.left = "0";
labelsDiv.style.pointerEvents = "none";
labelsDiv.style.color = "white";
labelsDiv.style.fontFamily = "Arial";

document.body.appendChild(labelsDiv);

const labels = {};

function addLabel(name,obj,size){

    const div = document.createElement("div");

    div.innerText = name;

    div.style.position = "absolute";
    div.style.transform = "translate(-50%, -50%)";
    div.style.textShadow = "0 0 5px black";

    labelsDiv.appendChild(div);

    labels[name] = {
        el:div,
        obj,
        size
    };
}


// ORBITS
function createOrbit(radius){

    const geo = new THREE.RingGeometry(
        radius - 0.02,
        radius + 0.02,
        128
    );

    const mat = new THREE.MeshBasicMaterial({
        color:0xffffff,
        side:THREE.DoubleSide,
        transparent:true,
        opacity:0.15
    });

    const ring = new THREE.Mesh(geo,mat);

    ring.rotation.x = -Math.PI / 2;

    scene.add(ring);
}

[6,8,11,14,18,23,28,32,38].forEach(createOrbit);


// PLANET FUNCTION
function createPlanet(size,texture,dist,speed){

    const geometry = new THREE.SphereGeometry(size,64,64);

    const material = new THREE.MeshStandardMaterial({
        map: loader.load(texture)
    });

    const mesh = new THREE.Mesh(geometry,material);

    const pivot = new THREE.Object3D();

    scene.add(pivot);

    pivot.add(mesh);

    mesh.position.x = dist;

    return {
        mesh,
        pivot,
        speed
    };
}


// SUN
const sun = new THREE.Mesh(

    new THREE.SphereGeometry(4,64,64),

    new THREE.MeshBasicMaterial({
        map: loader.load(
            "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/sun.jpg"
        )
    })
);

scene.add(sun);


// PLANETS
const mercury = createPlanet(
    0.5,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/mercury.jpg",
    6,
    0.04
);

const venus = createPlanet(
    0.8,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/venus.jpg",
    8,
    0.03
);

const earth = createPlanet(
    1,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/earth.jpg",
    11,
    0.02
);

const mars = createPlanet(
    0.7,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/mars.jpg",
    14,
    0.018
);

const jupiter = createPlanet(
    2,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/jupiter.jpg",
    18,
    0.01
);

const saturn = createPlanet(
    1.7,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/saturn.jpg",
    23,
    0.008
);

const uranus = createPlanet(
    1.2,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/uranus.jpg",
    28,
    0.006
);

const neptune = createPlanet(
    1.2,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/neptune.jpg",
    32,
    0.005
);

const pluto = createPlanet(
    0.4,
    "https://raw.githubusercontent.com/Essabki/space-a/refs/heads/main/data/planet-3d/pluto/pic/plutomap2k.jpg",
    38,
    0.003
);

// ADD THIS after PLANETS

// 🌍 EARTH MOON
const earthMoon = createMoon(
    earth,
    0.3,
    1.5,
    0.05,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/moon.jpg"
);

createMoonOrbit(earth.mesh,1.5,0x44ff44);


// 🪐 JUPITER MOONS

const jm1 = createMoon(
    jupiter,
    0.3,
    3,
    0.04,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/ceres.jpg"
);

createMoonOrbit(jupiter.mesh,3,0xffaa00);


const jm2 = createMoon(
    jupiter,
    0.25,
    4,
    0.03,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/eris.jpg"
);

createMoonOrbit(jupiter.mesh,4,0xffaa00);


const jm3 = createMoon(
    jupiter,
    0.35,
    5,
    0.02,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/ceres.jpg"
);

createMoonOrbit(jupiter.mesh,5,0xffaa00);


const jm4 = createMoon(
    jupiter,
    0.28,
    2.5,
    0.035,
    "https://raw.githubusercontent.com/OZ-00MS/source/refs/heads/main/space%20a/planet/eris.jpg"
);

createMoonOrbit(jupiter.mesh,2.5,0xffaa00);

// 🪐 SATURN 3 RINGS

const saturnRings = [];

function createSaturnRing(inner, outer, opacity, color){

    const geo = new THREE.RingGeometry(inner, outer, 128);

    const mat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity
    });

    const ring = new THREE.Mesh(geo, mat);

    ring.rotation.x = Math.PI / 2.2;

    saturn.mesh.add(ring);

    saturnRings.push(ring);

    return ring;
}


// INNER RING
createSaturnRing(
    2.5,
    3.1,
    0.65,
    0xcccccc
);


// MIDDLE RING
createSaturnRing(
    3.4,
    4.0,
    0.55,
    0xbbbbbb
);


// OUTER RING
createSaturnRing(
    4.3,
    5.0,
    0.45,
    0xdddddd
);




// 🌙 MOON ORBITS
function createMoonOrbit(planet, distance, color=0x44ff44){

    const geo = new THREE.RingGeometry(
        distance - 0.03,
        distance + 0.03,
        64
    );

    const mat = new THREE.MeshBasicMaterial({
        color:color,
        side:THREE.DoubleSide,
        transparent:true,
        opacity:0.25
    });

    const ring = new THREE.Mesh(geo,mat);

    ring.rotation.x = -Math.PI / 2;

    planet.add(ring);
}

// 🌙 CREATE MOON
function createMoon(planet,size,dist,speed,texture){

    const moon = new THREE.Mesh(

        new THREE.SphereGeometry(size,32,32),

        new THREE.MeshStandardMaterial({
            map: loader.load(texture)
        })
    );

    const pivot = new THREE.Object3D();

    planet.mesh.add(pivot);

    pivot.add(moon);

    moon.position.x = dist;

    return {
        moon,
        pivot,
        speed
    };
}

function updateMoon(moonObj){

    moonObj.pivot.rotation.y += moonObj.speed;
}


// LABELS
addLabel("Sun",sun,4);
addLabel("Mercury",mercury.mesh,0.5);
addLabel("Venus",venus.mesh,0.8);
addLabel("Earth",earth.mesh,1);
addLabel("Mars",mars.mesh,0.7);
addLabel("Jupiter",jupiter.mesh,2);
addLabel("Saturn",saturn.mesh,1.7);
addLabel("Uranus",uranus.mesh,1.2);
addLabel("Neptune",neptune.mesh,1.2);
addLabel("Pluto",pluto.mesh,0.4);

// ADD THIS after LABELS

let paused = false;

const pauseBtn = document.getElementById("pauseBtn");

pauseBtn.addEventListener("click", ()=>{

    paused = !paused;

    pauseBtn.innerHTML = paused ? "▶" : "⏸";
});


// ANIMATE
// REPLACE your animate() with this

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    if(!paused){

        sun.rotation.y += 0.002;

        mercury.pivot.rotation.y += mercury.speed;
        venus.pivot.rotation.y += venus.speed;
        earth.pivot.rotation.y += earth.speed;
        mars.pivot.rotation.y += mars.speed;
        jupiter.pivot.rotation.y += jupiter.speed;
        saturn.pivot.rotation.y += saturn.speed;
        uranus.pivot.rotation.y += uranus.speed;
        neptune.pivot.rotation.y += neptune.speed;
        pluto.pivot.rotation.y += pluto.speed;

        mercury.mesh.rotation.y += 0.01;
        venus.mesh.rotation.y += 0.01;
        earth.mesh.rotation.y += 0.01;
        mars.mesh.rotation.y += 0.01;

        saturnRings.forEach((ring, index)=>{

    ring.rotation.z += 0.0005 + index * 0.0002;

});

        // 🌙 MOONS
        updateMoon(earthMoon);

        updateMoon(jm1);
        updateMoon(jm2);
        updateMoon(jm3);
        updateMoon(jm4);
    }

    // LABEL UPDATE
    for(let key in labels){

        const {el,obj,size} = labels[key];

        const pos = new THREE.Vector3();

        obj.getWorldPosition(pos);

        pos.y += size + 1;

        pos.project(camera);

        el.style.left =
            (pos.x * 0.5 + 0.5) * window.innerWidth + "px";

        el.style.top =
            (-pos.y * 0.5 + 0.5) * window.innerHeight + "px";
    }

    renderer.render(scene,camera);
}
animate();
// RESIZE
window.addEventListener('resize',()=>{

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);
});
