import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const root = document.getElementById("innovation-visual");
const canvas = document.getElementById("innovation-canvas");

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 0.15, 8.4);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const ambient = new THREE.HemisphereLight(0xfff7e8, 0x2d0610, 2.0);
scene.add(ambient);

const warmLight = new THREE.PointLight(0xffbd45, 22, 12, 2);
warmLight.position.set(0, 1.2, 2.5);
scene.add(warmLight);

const maroonLight = new THREE.PointLight(0x78001e, 12, 10, 2);
maroonLight.position.set(-2.4, 0.5, 1.5);
scene.add(maroonLight);

const innovationGroup = new THREE.Group();
innovationGroup.position.y = 0.18;
scene.add(innovationGroup);

/* ---------- Materials ---------- */

const gold = new THREE.Color(0xf3b83f);
const maroon = new THREE.Color(0x76001d);
const blue = new THREE.Color(0x6d8fbf);
const green = new THREE.Color(0x78935f);
const coral = new THREE.Color(0xd87959);

/* ---------- Holographic base ---------- */

const base = new THREE.Group();
base.position.y = -1.85;
innovationGroup.add(base);

function addTorus(radius, tube, color, opacity, y, scaleY = 1) {
  const geo = new THREE.TorusGeometry(radius, tube, 16, 128);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = y;
  mesh.scale.y = scaleY;
  base.add(mesh);
  return mesh;
}

const baseOuter = addTorus(1.95, .018, 0x76001d, .55, 0);
const baseGlow = addTorus(1.52, .045, 0xf3b83f, .72, .04, .62);
const baseInner = addTorus(1.05, .014, 0xd87959, .5, .08, .62);

const baseDiskGeo = new THREE.CylinderGeometry(1.72, 1.92, .12, 96);
const baseDiskMat = new THREE.MeshPhysicalMaterial({
  color: 0xf7eee5,
  roughness: .22,
  metalness: .18,
  transparent: true,
  opacity: .78
});
const baseDisk = new THREE.Mesh(baseDiskGeo, baseDiskMat);
baseDisk.position.y = -.06;
base.add(baseDisk);

const platformGeo = new THREE.CylinderGeometry(1.28, 1.52, .13, 96);
const platformMat = new THREE.MeshPhysicalMaterial({
  color: 0xfdf7ef,
  roughness: .16,
  metalness: .12,
  clearcoat: 1,
  clearcoatRoughness: .12
});
const platform = new THREE.Mesh(platformGeo, platformMat);
platform.position.y = .04;
base.add(platform);

/* Base radial tick marks */
const tickGroup = new THREE.Group();
base.add(tickGroup);

for (let i = 0; i < 72; i++) {
  const a = i / 72 * Math.PI * 2;
  const r1 = i % 6 === 0 ? 1.72 : 1.80;
  const r2 = 1.88;

  const points = [
    new THREE.Vector3(Math.cos(a) * r1, .03, Math.sin(a) * r1),
    new THREE.Vector3(Math.cos(a) * r2, .03, Math.sin(a) * r2)
  ];

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: i % 6 === 0 ? 0x76001d : 0xb78c79,
    transparent: true,
    opacity: i % 6 === 0 ? .48 : .18
  });

  tickGroup.add(new THREE.Line(geo, mat));
}

/* ---------- Lightbulb ---------- */

const bulbGroup = new THREE.Group();
bulbGroup.position.y = .75;
innovationGroup.add(bulbGroup);

/* Glass-like bulb silhouette */
const bulbProfile = [
  [0.00, 0.86],
  [0.24, 0.84],
  [0.47, 0.72],
  [0.61, 0.52],
  [0.64, 0.22],
  [0.57, -0.04],
  [0.42, -0.27],
  [0.30, -0.42],
  [0.30, -0.62],
  [0.22, -0.75]
];

const bulbCurve = new THREE.CatmullRomCurve3(
  bulbProfile.map(([r, y]) => new THREE.Vector3(r, y, 0))
);

const bulbPoints = bulbCurve.getPoints(80);
const bulbShape = new THREE.LatheGeometry(
  bulbPoints.map(p => new THREE.Vector2(p.x, p.y)),
  48
);

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xfff7e7,
  emissive: 0xf3b83f,
  emissiveIntensity: .55,
  roughness: .08,
  metalness: .02,
  transmission: .42,
  transparent: true,
  opacity: .58,
  side: THREE.DoubleSide
});

const bulbShell = new THREE.Mesh(bulbShape, glassMat);
bulbGroup.add(bulbShell);

/* Wireframe hologram shell */
const wireGeo = new THREE.WireframeGeometry(bulbShape);
const wireMat = new THREE.LineBasicMaterial({
  color: 0xf3b83f,
  transparent: true,
  opacity: .42,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const bulbWire = new THREE.LineSegments(wireGeo, wireMat);
bulbGroup.add(bulbWire);

/* Bulb glow */
const glowGeo = new THREE.SphereGeometry(.62, 32, 32);
const glowMat = new THREE.MeshBasicMaterial({
  color: 0xf3b83f,
  transparent: true,
  opacity: .10,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const bulbGlow = new THREE.Mesh(glowGeo, glowMat);
bulbGlow.scale.set(1, 1.18, 1);
bulbGroup.add(bulbGlow);

/* Filament */
const filament = new THREE.Group();
filament.position.y = .12;
bulbGroup.add(filament);

const filamentMat = new THREE.MeshBasicMaterial({
  color: 0x76001d,
  transparent: true,
  opacity: .9
});

function filamentLine(points) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 24, .014, 8, false);
  const mesh = new THREE.Mesh(geo, filamentMat);
  filament.add(mesh);
  return mesh;
}

filamentLine([
  new THREE.Vector3(-.18, -.18, 0),
  new THREE.Vector3(-.11, .04, 0),
  new THREE.Vector3(0, .18, 0),
  new THREE.Vector3(.11, .04, 0),
  new THREE.Vector3(.18, -.18, 0)
]);

/* Bulb neck / screw */
const neck = new THREE.Group();
neck.position.y = -.69;
bulbGroup.add(neck);

const neckMat = new THREE.MeshPhysicalMaterial({
  color: 0xf1e2d3,
  roughness: .3,
  metalness: .42
});

for (let i = 0; i < 5; i++) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(.27, .035, 12, 64),
    neckMat
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = i * -.105;
  ring.scale.x = 1.05;
  neck.add(ring);
}

const neckCore = new THREE.Mesh(
  new THREE.CylinderGeometry(.22, .25, .55, 48),
  neckMat
);
neckCore.position.y = -.21;
neck.add(neckCore);

/* ---------- Orbiting IDEA nodes ---------- */

const orbitGroup = new THREE.Group();
orbitGroup.position.y = .25;
innovationGroup.add(orbitGroup);

const orbitData = [
  { name: "IIC", color: 0xf3b83f, radius: 1.62, speed: .36, phase: 0 },
  { name: "IPR", color: 0xd87959, radius: 1.78, speed: -.29, phase: 1.55 },
  { name: "E-CELL", color: 0x6d8fbf, radius: 1.62, speed: .25, phase: 3.15 },
  { name: "TBI", color: 0x78935f, radius: 1.78, speed: -.32, phase: 4.72 }
];

const nodes = [];

for (const item of orbitData) {
  const holder = new THREE.Group();
  orbitGroup.add(holder);

  const node = new THREE.Mesh(
    new THREE.SphereGeometry(.10, 24, 24),
    new THREE.MeshStandardMaterial({
      color: item.color,
      emissive: item.color,
      emissiveIntensity: .75,
      roughness: .18,
      metalness: .15
    })
  );

  holder.add(node);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(.19, 20, 20),
    new THREE.MeshBasicMaterial({
      color: item.color,
      transparent: true,
      opacity: .10,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  holder.add(halo);

  nodes.push({ holder, item });
}

/* ---------- Rising idea particles ---------- */

const particleCount = 850;
const positions = new Float32Array(particleCount * 3);
const particleSizes = new Float32Array(particleCount);
const particleColors = new Float32Array(particleCount * 3);
const particleMeta = new Float32Array(particleCount * 3);

const palette = [gold, maroon, coral, blue, green];

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  const height = Math.random();
  const spread = .10 + height * .48;

  positions[i3] = (Math.random() - .5) * spread;
  positions[i3 + 1] = -.25 + height * 2.15;
  positions[i3 + 2] = (Math.random() - .5) * spread;

  particleSizes[i] = .018 + Math.random() * .045;

  const c = palette[Math.floor(Math.random() * palette.length)];
  particleColors[i3] = c.r;
  particleColors[i3 + 1] = c.g;
  particleColors[i3 + 2] = c.b;

  particleMeta[i * 3] = Math.random() * Math.PI * 2;
  particleMeta[i * 3 + 1] = .25 + Math.random() * .8;
  particleMeta[i * 3 + 2] = Math.random();
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute("aSize", new THREE.BufferAttribute(particleSizes, 1));
particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  uniforms: {
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }
  },
  vertexShader: `
    attribute float aSize;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * 190.0 * uPixelRatio / max(1.0, -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      vec2 uv = gl_PointCoord - vec2(.5);
      float d = length(uv);
      float alpha = smoothstep(.5, .02, d);
      alpha *= .78;

      gl_FragColor = vec4(vColor, alpha);
    }
  `
});

const particles = new THREE.Points(particleGeo, particleMat);
particles.position.y = -.7;
innovationGroup.add(particles);

/* ---------- Fine digital grid ---------- */

const gridGroup = new THREE.Group();
gridGroup.position.y = -1.62;
innovationGroup.add(gridGroup);

for (let i = -5; i <= 5; i++) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(i * .38, 0, -1.55),
    new THREE.Vector3(i * .38, 0, 1.55)
  ]);

  const mat = new THREE.LineBasicMaterial({
    color: 0x76001d,
    transparent: true,
    opacity: .035
  });

  gridGroup.add(new THREE.Line(geo, mat));
}

for (let i = -4; i <= 4; i++) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.9, 0, i * .38),
    new THREE.Vector3(1.9, 0, i * .38)
  ]);

  const mat = new THREE.LineBasicMaterial({
    color: 0x76001d,
    transparent: true,
    opacity: .035
  });

  gridGroup.add(new THREE.Line(geo, mat));
}

/* ---------- Interaction ---------- */

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

function setPointer(clientX, clientY) {
  const rect = root.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  const y = (clientY - rect.top) / rect.height;

  targetX = (x - .5) * 2;
  targetY = (y - .5) * 2;
}

root.addEventListener("pointermove", (e) => {
  setPointer(e.clientX, e.clientY);
}, { passive: true });

root.addEventListener("pointerleave", () => {
  targetX = 0;
  targetY = 0;
}, { passive: true });

/* ---------- Resize ---------- */

function resize() {
  const width = Math.max(1, root.clientWidth);
  const height = Math.max(1, root.clientHeight);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  particleMat.uniforms.uPixelRatio.value =
    Math.min(window.devicePixelRatio || 1, 2);
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(root);
resize();

/* ---------- Animation ---------- */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  const motion = prefersReducedMotion ? 0 : 1;

  currentX += (targetX - currentX) * .035;
  currentY += (targetY - currentY) * .035;

  innovationGroup.rotation.y = currentX * .13;
  innovationGroup.rotation.x = -currentY * .055;

  if (motion) {
    bulbGroup.position.y = .75 + Math.sin(t * 1.15) * .055;
    bulbGroup.rotation.y = Math.sin(t * .35) * .08;

    bulbGlow.scale.setScalar(
      1 + Math.sin(t * 2.2) * .035
    );

    baseOuter.rotation.z = t * .06;
    baseGlow.rotation.z = -t * .11;
    baseInner.rotation.z = t * .17;

    platform.rotation.y = t * .035;
    tickGroup.rotation.y = -t * .03;

    orbitGroup.rotation.y = t * .11;

    nodes.forEach(({ holder, item }, index) => {
      const angle = item.phase + t * item.speed;
      const y = Math.sin(t * .9 + index * 1.7) * .16;

      holder.position.set(
        Math.cos(angle) * item.radius,
        y,
        Math.sin(angle) * item.radius
      );
    });

    const pos = particleGeo.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const seed = particleMeta[i * 3];
      const speed = particleMeta[i * 3 + 1];
      const phase = particleMeta[i * 3 + 2];

      pos[i3] += Math.sin(t * .7 + seed) * .0008;
      pos[i3 + 2] += Math.cos(t * .55 + seed) * .0007;

      pos[i3 + 1] += .0016 * speed;

      if (pos[i3 + 1] > 1.95) {
        pos[i3 + 1] = -.35 - phase * .15;
        pos[i3] = (Math.random() - .5) * .12;
        pos[i3 + 2] = (Math.random() - .5) * .12;
      }
    }

    particleGeo.attributes.position.needsUpdate = true;
  } else {
    nodes.forEach(({ holder, item }) => {
      const angle = item.phase;
      holder.position.set(
        Math.cos(angle) * item.radius,
        0,
        Math.sin(angle) * item.radius
      );
    });
  }

  camera.position.x += (currentX * .28 - camera.position.x) * .02;
  camera.position.y += (-currentY * .18 + .15 - camera.position.y) * .02;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();
