// Works on GitHub Pages (NO paid GSAP plugins)

const messages = [
  "Merry Jesusmas",
  "Happy Holidays",
  "Wish You Joy and Peace",
  "Tối lq k ae?",
  "Have a Magical Christmas",
  "Bí béo vãi l"
];

let msgIndex = 0;
let charIndex = 0;
const speed = 90;

function typeWriter() {
  const typeArea = document.getElementById("typewriter");
  if (!typeArea) return;

  if (charIndex < messages[msgIndex].length) {
    typeArea.innerHTML += messages[msgIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, 1500);
  }
}

function eraseText() {
  const typeArea = document.getElementById("typewriter");
  if (!typeArea) return;

  if (charIndex > 0) {
    typeArea.innerHTML = messages[msgIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, 40);
  } else {
    msgIndex = (msgIndex + 1) % messages.length;
    setTimeout(typeWriter, 300);
  }
}

// ---- SVG reveal (DrawSVG replacement) ----
function dashReveal(selector, duration, delay = 0) {
  const els = document.querySelectorAll(selector);
  els.forEach((el) => {
    if (!el || typeof el.getTotalLength !== "function") return;

    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    el.style.stroke = "#FFF";

    gsap.to(el, {
      strokeDashoffset: 0,
      duration,
      delay,
      ease: "none"
    });
  });
}

// ---- Particles (Physics2D replacement) ----
const particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE', '#A2CBDC', '#B74551', '#5DBA72', '#910B28', '#446D39'];
const particleTypeArray = ['#star', '#circ', '#cross', '#heart'];
const particlePool = [];
let particleCount = 0;
const numParticles = 140;

function createParticles() {
  const mainSVG = document.querySelector('.mainSVG');
  if (!mainSVG) return;

  for (let i = 0; i < numParticles; i++) {
    const ref = document.querySelector(particleTypeArray[i % particleTypeArray.length]);
    if (!ref) continue;

    const p = ref.cloneNode(true);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', 'particle');
    mainSVG.appendChild(p);

    gsap.set(p, { x: -9999, y: -9999, scale: 1, transformOrigin: '50% 50%', opacity: 0 });
    particlePool.push(p);
  }
}

function flicker(p) {
  gsap.killTweensOf(p, { opacity: true });
  gsap.to(p, { opacity: () => Math.random(), duration: 0.08, repeat: -1, yoyo: true });
}

function playParticle() {
  const pContainer = document.querySelector('.pContainer');
  if (!pContainer || particlePool.length === 0) return;

  const p = particlePool[particleCount];
  particleCount = (particleCount + 1) % particlePool.length;

  const x0 = gsap.getProperty(pContainer, 'x');
  const y0 = gsap.getProperty(pContainer, 'y');

  gsap.set(p, {
    x: x0,
    y: y0,
    opacity: 1,
    scale: gsap.utils.random(0.6, 2.2),
    rotation: gsap.utils.random(0, 360)
  });

  flicker(p);

  gsap.to(p, {
    duration: gsap.utils.random(0.8, 2.2),
    x: x0 + gsap.utils.random(-120, 120),
    y: y0 + gsap.utils.random(-80, 220),
    rotation: "+=" + gsap.utils.random(-180, 180),
    scale: 0,
    opacity: 0,
    ease: "power1.out",
    onComplete: () => {
      gsap.killTweensOf(p);
      gsap.set(p, { x: -9999, y: -9999, opacity: 0 });
    }
  });
}

// ---- Star + sparkle move along tree path (MotionPathPlugin is free) ----
function drawStarMotion() {
  const pContainer = document.querySelector('.pContainer');
  const sparkle = document.querySelector('.sparkle');
  if (!pContainer || !sparkle) return;

  gsap.set('svg', { visibility: 'visible' });
  gsap.set(sparkle, { transformOrigin: '50% 50%', y: -100 });

  const tl = gsap.timeline();

  // go up the tree
  tl.to([pContainer, sparkle], {
    duration: 6,
    motionPath: { path: '.treePath', autoRotate: false },
    ease: 'none',
    onUpdate: playParticle
  });

  // go to bottom start
  tl.to([pContainer, sparkle], {
    duration: 0.8,
    ease: 'power1.inOut',
    onStart: () => { /* pause particles a bit */ },
    motionPath: { path: [{x: 0, y: 0}, {x: 0, y: 0}] } // noop
  });

  // slide along bottom
  tl.to([pContainer, sparkle], {
    duration: 2,
    motionPath: { path: '.treeBottomPath', autoRotate: false },
    ease: 'none',
    onUpdate: playParticle
  }, '-=0.6');

  return tl;
}

// ---- Snowflakes ----
function createSnowflake() {
  const snow = document.createElement("div");
  snow.classList.add("snowflake");
  snow.textContent = "❄";
  snow.style.left = Math.random() * window.innerWidth + "px";
  snow.style.fontSize = (Math.random() * 15 + 10) + "px";
  snow.style.animationDuration = (Math.random() * 5 + 5) + "s";
  snow.style.opacity = String(Math.random());
  document.body.appendChild(snow);
  setTimeout(() => snow.remove(), 10000);
}

// ---- Music ----
function setupMusic() {
  const bgm = document.getElementById("bgm");
  const santa = document.querySelector(".santa-claus");
  if (!bgm) return;

  const tryPlay = () => {
    try {
      bgm.currentTime = 0;
      const p = bgm.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {}
  };

  // Autoplay usually blocked -> start on first user gesture
  const enable = () => {
    tryPlay();
    document.removeEventListener("click", enable);
    document.removeEventListener("touchstart", enable);
  };
  document.addEventListener("click", enable, { once: true });
  document.addEventListener("touchstart", enable, { once: true });

  if (santa) santa.addEventListener("click", tryPlay);
}

document.addEventListener("DOMContentLoaded", () => {
  // typewriter delay
  setTimeout(typeWriter, 6000);

  // reveal masks so tree appears "where it is drawn"
  dashReveal('.treePath', 6, 0);
  dashReveal('.treePotPath', 1.2, 7.4);
  dashReveal('.treeBottomPath', 2, 5.2);

  // particles + star motion
  createParticles();
  drawStarMotion();

  // snow
  setInterval(createSnowflake, 150);

  // music
  setupMusic();
});
