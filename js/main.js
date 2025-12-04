// js/main.js
gsap.registerPlugin(ScrollTrigger);

// intro
gsap.from(".title span", {
  y: 40,
  opacity: 0,
  duration: 0.9,
  stagger: 0.1,
  ease: "power3.out"
});

gsap.from(".hero-header img", {
  y: -20,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out"
});


// hero
const heroStackTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-stack",
    start: "top top",
    end: "+=160%",
    scrub: true,
    pin: true,
  }
});


heroStackTl.to(".hero", {
  scale: 0.34,
  borderRadius: "26px",
  boxShadow: "0 40px 110px rgba(0,0,0,0.9)",
  transformOrigin: "50% 50%",
  ease: "power2.inOut"
}, 0);


heroStackTl.to([".left", ".hero-header"], {
  opacity: 0,
  ease: "power1.out"
}, 0.05);


heroStackTl.fromTo(".section-frame",
  { opacity: 0 },
  { opacity: 1, ease: "power2.out" },
  0.3
);


heroStackTl.from(".outline-text", {
  opacity: 0,
  y: (i) => i === 0 ? -40 : 40,
  stagger: 0.15,
  ease: "power2.out"
}, 0.6);

heroStackTl.from(".frame-jumpman", {
  opacity: 0,
  y: 60,
  scale: 0.7,
  ease: "power3.out"
}, 1);


heroStackTl.to(".frame-overlay", {
  opacity: 1,
  ease: "power2.out"
}, 0.8);


// texto outline
document.querySelectorAll(".outline-text").forEach(el => {
  const base = el.textContent.trim();
  const repeated = (base + "   ").repeat(8);
  el.textContent = repeated;
});


gsap.to(".outline-text--top", {
  xPercent: -50,
  duration: 18,
  repeat: -1,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-stack",
    start: "top top",
  }
});

gsap.to(".outline-text--bottom", {
  xPercent: 50,
  duration: 18,
  repeat: -1,
  ease: "none",
  scrollTrigger: {
    trigger: ".hero-stack",
    start: "top top",
  }
});


/* SECCIÓN 3 */

const storyTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-story",
    start: "top 100%",
    end: "bottom 30%",
    scrub: true
  }
});

// titulo
storyTl.to(".story-title", {
  opacity: 1,
  y: 0,
  ease: "power2.out"
}, 0.45);


storyTl.to(".story-text", {
  opacity: 1,
  y: 0,
  ease: "power2.out"
}, 0.35);

// img izq
storyTl.to(".story-img--left", {
  opacity: 1,
  x: 0,
  ease: "power2.out"
}, 0.25);

// img drch
storyTl.to(".story-img--right", {
  opacity: 1,
  x: 0,
  ease: "power2.out"
}, 0.35);


/* SECCIÓN 4 */

gsap.utils.toArray(".history-card").forEach((card, i) => {
  gsap.to(card, {
    scrollTrigger:{
      trigger: card,
      start: "top 100%",
      end: "top 25%",
      scrub: true
    },
    opacity:1,
    y:0,
    ease:"power2.out"
  });
});


/* SECCION 5 */

const horizontalTrack = document.querySelector(".horizontal-track");
if (horizontalTrack) {
  const panels = gsap.utils.toArray(".h-panel");
  const totalPanels = panels.length;

  gsap.to(panels, {
    xPercent: -100 * (totalPanels - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".section-horizontal",
      pin: true,
      scrub: 1,
      snap: 1 / (totalPanels - 1),
      start: "top top",
      end: () => "+=" + window.innerWidth * (totalPanels - 1)
    }
  });
}

/* SECCION 6 */

const duelTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-duel",
    start: "top 70%",
    end: "top 10%",
    scrub: true
  }
});

// Kicker
duelTl.fromTo(".duel-kicker",
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, ease: "power2.out" },
  0
);

// img
duelTl.from(".duel-col--left img", {
  x: -120,
  opacity: 0,
  ease: "power2.out"
}, 0.3);

duelTl.from(".duel-col--right img", {
  x: 120,
  opacity: 0,
  ease: "power2.out"
}, 0.3);

// teext
duelTl.fromTo(".duel-col--left .duel-text",
  { opacity: 0, x: -40 },
  { opacity: 1, x: 0, ease: "power2.out" },
  0.6
);

// jordan
duelTl.fromTo(".duel-col--right .duel-text",
  { opacity: 0, x: 40 },
  { opacity: 1, x: 0, ease: "power2.out" },
  0.7
);


/* SECCIÓN 7 */

// animacion enrtada
gsap.to(".campaign-content", {
  scrollTrigger: {
    trigger: ".section-campaign",
    start: "top 50%",
    end: "top 5%",
    scrub: true
  },
  opacity: 1,
  y: 0,
  ease: "power2.out"
});

// Popup de vídeo
const campaignContent = document.querySelector(".campaign-content");
const campaignOverlay = document.getElementById("campaignVideo");
const campaignVideo   = campaignOverlay ? campaignOverlay.querySelector(".campaign-video") : null;
const campaignClose   = campaignOverlay ? campaignOverlay.querySelector(".campaign-video-close") : null;

let campaignHoverTimeout;

if (campaignContent && campaignOverlay && campaignVideo && campaignClose) {
  // hover en texto
  campaignContent.addEventListener("mouseenter", () => {
    // 2seg
    campaignHoverTimeout = setTimeout(() => {
      campaignOverlay.classList.add("is-open");

      // resetea video
      campaignVideo.currentTime = 0;
      const playPromise = campaignVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
        });
      }
    }, 2000);
  });

  // no abrir 2seg antes
  campaignContent.addEventListener("mouseleave", () => {
    clearTimeout(campaignHoverTimeout);
  });

  function closeCampaignVideo() {
    campaignOverlay.classList.remove("is-open");
    campaignVideo.pause();
  }

  // cerrar video
  campaignClose.addEventListener("click", closeCampaignVideo);

  campaignOverlay.addEventListener("click", (e) => {
    if (e.target === campaignOverlay) {
      closeCampaignVideo();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && campaignOverlay.classList.contains("is-open")) {
      closeCampaignVideo();
    }
  });
}


/* SECCION 8 */

const shoeCards = document.querySelectorAll(".shoe-card");

shoeCards.forEach((card) => {
  const hoverImg = card.querySelector(".shoe-hover-img");
  if (!hoverImg) return;

  // img sigue cursor 
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hoverImg.style.left = `${x}px`;
    hoverImg.style.top = `${y}px`;
  });

  card.addEventListener("mouseenter", () => {
    hoverImg.style.opacity = 1;
  });

  card.addEventListener("mouseleave", () => {
    hoverImg.style.opacity = 0;
  });
});

// animacion entrada
gsap.utils.toArray(".shoe-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%",
      end: "top 60%",
      scrub: true
    },
    opacity: 0,
    y: 40,
    ease: "power2.out"
  });

  
});


/* SECCION 9 */
let fanSpacing = window.innerWidth <= 600
  ? 45        // responsive abanico móvil
  : window.innerWidth <= 1024
  ? 60        // responsive abanico tablet
  : 90;       // responsive abanico desktop

const fanCards = gsap.utils.toArray(".fan-card");

if (fanCards.length) {
  const middleIndex = (fanCards.length - 1) / 2;
  const basePositions = [];

  // posicion inical
  function positionFanCards() {
    fanCards.forEach((card, i) => {
      const offset = i - middleIndex;
      const x = offset * fanSpacing;
      const y = Math.abs(offset) * 20;
      const rot = offset * 10;
      const z = 10 - Math.abs(offset);

      basePositions[i] = { x, y, rot, z };

      gsap.set(card, {
        x,
        y,
        rotation: rot,
        scale: 1,
        zIndex: z,
        opacity: 0
      });
    });
  }

  positionFanCards();

  // animacion entrada
  const fanTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-fan",
      start: "top 80%",
      end:   "top 40%",
      scrub: true
    }
  });

  fanTl.to(".fan-title", {
    opacity: 1,
    y: 0,
    ease: "power2.out"
  }, 0);

  fanTl.to(".fan-subtitle", {
    opacity: 1,
    y: 0,
    ease: "power2.out"
  }, 0.1);

  fanTl.to(".fan-card", {
    opacity: 1,
    ease: "power2.out",
    stagger: 0.05
  }, 0.2);


  // hover img
  function fanHover(index) {
    fanCards.forEach((card, i) => {
      const base = basePositions[i];
      const rel = i - index;

      const isActive = i === index;
      const isNeighbour = Math.abs(rel) === 1;

      let y = base.y;
      let rot = base.rot;
      let scale = 1;
      let zIndex = base.z;

      // subir carta
      if (isActive) {
        y = base.y - 80;
        rot = base.rot * 0.5;
        scale = 1.08;
        zIndex = 50;
      } else if (isNeighbour) {
        y = base.y + 20;
        rot = base.rot + rel * 4;
        scale = 0.96;
        zIndex = 30 - Math.abs(rel);
      } else {
        y = base.y + 35;
        rot = base.rot;
        scale = 0.9;
        zIndex = 20 - Math.abs(rel);
      }

      gsap.to(card, {
        x: base.x,
        y,
        rotation: rot,
        scale,
        zIndex,
        duration: 0.35,
        ease: "power3.out"
      });
    });
  }

  function fanReset() {
    fanCards.forEach((card, i) => {
      const base = basePositions[i];
      gsap.to(card, {
        x: base.x,
        y: base.y,
        rotation: base.rot,
        scale: 1,
        zIndex: base.z,
        duration: 0.4,
        ease: "power3.out"
      });
    });
  }

  fanCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => fanHover(index));
  });

  const fanStack = document.querySelector(".fan-stack");
  fanStack.addEventListener("mouseleave", fanReset);

  // modal
  const fanModal        = document.getElementById("fan-modal");
  const fanModalImg     = fanModal.querySelector(".fan-modal-img");
  const fanModalCaption = fanModal.querySelector(".fan-modal-caption");
  const fanModalClose   = fanModal.querySelector(".fan-modal-close");

  function openFanModal(src, alt, title) {
    fanModalImg.src = src;
    fanModalImg.alt = alt || "";
    fanModalCaption.textContent = title || alt || "";
    fanModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeFanModal() {
    fanModal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  fanCards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.dataset.title;
      openFanModal(img.src, img.alt, title);
    });
  });

  fanModalClose.addEventListener("click", closeFanModal);
  fanModal.addEventListener("click", (e) => {
    if (e.target === fanModal) closeFanModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && fanModal.classList.contains("is-open")) {
      closeFanModal();
    }
  });
}
