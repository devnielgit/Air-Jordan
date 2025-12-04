// js/model.js zapatilla

const container = document.getElementById('three-container');

// escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.set(0.8, 1.4, 3.0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMappingExposure = 0.8;

container.appendChild(renderer.domElement);

// ilum
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
keyLight.position.set(2.5, 3.5, 4);
keyLight.castShadow = true;

keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.bias = -0.001;
keyLight.shadow.radius = 8;

scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(-3, 1, -2);
scene.add(rimLight);

// suelo sombra
const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.18 });

const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = -0.55;
shadowPlane.receiveShadow = true;

scene.add(shadowPlane);

// modelo
const MODEL_PATH = 'assets/models/airjordan1.glb';
const loader = new THREE.GLTFLoader();

let model;

// rotacion
let hoverTargetRotation = { x: 0, y: 0 };
let baseHoverRotation = { x: 0, y: 0 };

// responsive modelo
function updateModelResponsive() {
  if (!model) return;

  const w = window.innerWidth;

  if (w <= 600) { // movil
    model.scale.set(4.2, 4.2, 4.2);
    model.position.set(0.85, 0.2, 0.3);
    model.rotation.set(0.15, -0.55, 0.10);

  } else if (w <= 1024) { // tablet
    model.scale.set(5.2, 5.2, 5.2);
    model.position.set(1.2, 0.22, 0.25);
    model.rotation.set(0.15, -0.55, 0.10);

  } else { // desktop
    model.scale.set(6.0, 6.0, 6.0);
    model.position.set(1.35, 0.25, 0.25);
    model.rotation.set(0.15, -0.55, 0.10);
  }

  // rotaciones
  baseHoverRotation.x = model.rotation.x;
  baseHoverRotation.y = model.rotation.y;
  hoverTargetRotation.x = model.rotation.x;
  hoverTargetRotation.y = model.rotation.y;
}

window.addEventListener('resize', updateModelResponsive);

loader.load(
  MODEL_PATH,
  (gltf) => {
    model = gltf.scene;

    // init position
    model.scale.set(6.0, 6.0, 6.0);
    model.position.set(1.35, 0.15, 0.25);

    // rotacion
    model.rotation.set(
      0.15,
      -0.55,
      0.10
    );

    // rotaciones hover
    baseHoverRotation.x = model.rotation.x;
    baseHoverRotation.y = model.rotation.y;
    hoverTargetRotation.x = model.rotation.x;
    hoverTargetRotation.y = model.rotation.y;

    scene.add(model);

    // responsive ancho
    updateModelResponsive();

    camera.position.set(1.1, 1.5, 3.1);
    camera.lookAt(0.6, 0.5, 0.0);

    console.log('✅ Modelo cargado correctamente:', MODEL_PATH);

    // animacion caida zapas
    const startY = model.position.y + 2;
    model.position.y = startY;

    gsap.to(model.position, {
      y: startY - 2,
      duration: 1.4,
      ease: "bounce.out"
    });
  },
  undefined,
  (error) => console.error('❌ Error al cargar el modelo:', error)
);


// movimiento zapatillas

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function getClientPos(evt) {
  if (evt.touches && evt.touches[0]) {
    return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  }
  return { x: evt.clientX, y: evt.clientY };
}

function onPointerDown(event) {
  const pos = getClientPos(event);
  const screenMid = window.innerWidth / 2;

  // solo en mitad derecha
  if (pos.x < screenMid) return;

  isDragging = true;
  renderer.domElement.style.cursor = 'grabbing';

  previousMousePosition.x = pos.x;
  previousMousePosition.y = pos.y;
}

function onPointerUp() {
  isDragging = false;

  if (model) {
    baseHoverRotation.x = model.rotation.x;
    baseHoverRotation.y = model.rotation.y;
    hoverTargetRotation.x = model.rotation.x;
    hoverTargetRotation.y = model.rotation.y;
  }
}

function onPointerMove(event) {
  if (!isDragging || !model) return;

  const pos = getClientPos(event);
  const deltaMove = {
    x: pos.x - previousMousePosition.x,
    y: pos.y - previousMousePosition.y
  };

  const ROT_SPEED = 0.01;

  model.rotation.y += deltaMove.x * ROT_SPEED;
  model.rotation.x += deltaMove.y * ROT_SPEED;

  previousMousePosition.x = pos.x;
  previousMousePosition.y = pos.y;
}

// eventos mouse
renderer.domElement.addEventListener('mousedown', onPointerDown);
renderer.domElement.addEventListener('mouseup', onPointerUp);
renderer.domElement.addEventListener('mouseleave', onPointerUp);
renderer.domElement.addEventListener('mousemove', onPointerMove);

// eventos touch
renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: true });
renderer.domElement.addEventListener('touchend', onPointerUp, { passive: true });
renderer.domElement.addEventListener('touchcancel', onPointerUp, { passive: true });
renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: true });


// cursor
renderer.domElement.addEventListener('mousemove', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const screenMidX = window.innerWidth / 2;
  const screenMidY = window.innerHeight / 2;

  if (!model) return;

  // cursor visual
  if (isDragging) {
    renderer.domElement.style.cursor = 'grabbing';
  } else {
    renderer.domElement.style.cursor = (x >= screenMidX) ? 'grab' : 'default';
  }

  if (!isDragging && x >= screenMidX) {
    const nx = (x - screenMidX) / window.innerWidth;
    const ny = (y - screenMidY) / window.innerHeight;

    const MAX_HOVER_ROT_Y = 1;
    const MAX_HOVER_ROT_X = 0.5;

    hoverTargetRotation.y = baseHoverRotation.y + nx * MAX_HOVER_ROT_Y;
    hoverTargetRotation.x = baseHoverRotation.x + ny * MAX_HOVER_ROT_X;
  }
});


// resize
function onResize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

function animate() {
  requestAnimationFrame(animate);

  // rotación suave
  if (model && !isDragging) {
    const LERP_SPEED = 0.3;

    model.rotation.y += (hoverTargetRotation.y - model.rotation.y) * LERP_SPEED;
    model.rotation.x += (hoverTargetRotation.x - model.rotation.x) * LERP_SPEED;
  }

  renderer.render(scene, camera);
}
animate();
