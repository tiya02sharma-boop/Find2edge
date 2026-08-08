/**
 * Fin2Edge Luxury Video Onboarding Controller
 * Manages full-screen video playback, particle canvas ambient background,
 * 1-2s post-video freeze, "Swipe Up to Enter" overlay, multi-gesture triggers,
 * and 60fps parallax reveal into Fin2Edge platform.
 */

const STORAGE_KEY = "fin2edge_intro_seen";

export function initFin2EdgeIntro() {
  const overlay = document.getElementById("fin2edgeIntroOverlay");
  if (!overlay) return;

  const video = document.getElementById("introVideo");
  const fallbackCanvas = document.getElementById("introCanvasFallback");
  const particlesCanvas = document.getElementById("introParticlesCanvas");
  const skipBtn = document.getElementById("btnSkipIntro");
  const soundBtn = document.getElementById("btnIntroSound");
  const enterOverlay = document.getElementById("introEnterOverlay");
  const arrowTrigger = document.getElementById("introArrowTrigger");
  const enterBtn = document.getElementById("btnEnterFin2Edge");
  const replayBtn = document.getElementById("btnReplayIntro");

  // Always play intro experience every time user visits/reloads the site
  localStorage.removeItem(STORAGE_KEY);

  // Show intro & disable body scrolling
  document.body.classList.add("intro-active");
  overlay.style.display = "flex";

  let isOverlayActive = false;
  let isTransitioning = false;
  let particleAnimId = null;
  let fallbackAnimId = null;

  function enableVideoSound() {
    if (!video) return;
    video.muted = false;
    video.volume = 0.8;
    video.play().then(() => {
      if (soundBtn) soundBtn.hidden = true;
    }).catch(() => {
      if (soundBtn) soundBtn.textContent = 'Tap to enable sound';
    });
  }

  // Initialize Particle Canvas Background
  initAmbientParticles(particlesCanvas);

  // Play Video or Canvas Fallback
  let isVideoPlaying = false;
  if (video) {
    // Start with sound when the browser permits it. Browsers that require a
    // gesture continue the video muted and let the visible sound button unmute it.
    video.muted = false;
    video.volume = 0.8;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isVideoPlaying = true;
          if (fallbackCanvas) fallbackCanvas.style.display = "none";
        })
        .catch(() => {
          video.muted = true;
          video.play().then(() => {
            isVideoPlaying = true;
            if (fallbackCanvas) fallbackCanvas.style.display = "none";
          }).catch(() => startCanvasFallback());
        });
    }

    video.addEventListener("ended", () => {
      onVideoFinished();
    });

    video.addEventListener("error", () => {
      startCanvasFallback();
    });
  } else {
    startCanvasFallback();
  }

  if (soundBtn) soundBtn.addEventListener("click", enableVideoSound);

  function startCanvasFallback() {
    if (isVideoPlaying) return;
    if (fallbackCanvas) {
      fallbackCanvas.style.display = "block";
      renderProceduralVideo(fallbackCanvas, () => {
        onVideoFinished();
      });
    } else {
      setTimeout(onVideoFinished, 1000);
    }
  }

  // After Video Ends (or Skip Intro)
  function onVideoFinished() {
    if (isOverlayActive || isTransitioning) return;

    // Freeze on final frame for 1.2 seconds as requested (1-2s freeze)
    setTimeout(() => {
      if (enterOverlay) {
        enterOverlay.classList.add("active");
        isOverlayActive = true;
      }
    }, 1200);
  }

  // Skip Intro Button
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      if (video) video.pause();
      if (fallbackAnimId) cancelAnimationFrame(fallbackAnimId);
      
      if (!isOverlayActive) {
        // Show swipe overlay immediately
        if (enterOverlay) enterOverlay.classList.add("active");
        isOverlayActive = true;
      } else {
        // Double skip triggers enter transition
        triggerWorldReveal();
      }
    });
  }

  // Enter triggers:
  // 1. Click on Arrow Trigger or Enter Button
  if (arrowTrigger) arrowTrigger.addEventListener("click", triggerWorldReveal);
  if (enterBtn) enterBtn.addEventListener("click", triggerWorldReveal);

  // 2. Mouse Wheel Scroll (Desktop)
  window.addEventListener("wheel", handleWheel, { passive: false });
  function handleWheel(e) {
    if (!isOverlayActive || isTransitioning) return;
    if (e.deltaY > 15 || e.deltaY < -15) {
      e.preventDefault();
      triggerWorldReveal();
    }
  }

  // 3. Up Arrow / Down Arrow / Space / Enter Keys (Desktop)
  window.addEventListener("keydown", handleKeyDown);
  function handleKeyDown(e) {
    if (!isOverlayActive || isTransitioning) return;
    if (["ArrowUp", "ArrowDown", "Space", "Enter", "PageUp", "PageDown"].includes(e.code) || e.key === "ArrowUp") {
      e.preventDefault();
      triggerWorldReveal();
    }
  }

  // 4. Mouse Drag Upward (Desktop) & Touch Swipe Upward (Mobile)
  let startY = 0;
  let isDragging = false;

  window.addEventListener("touchstart", (e) => {
    if (!isOverlayActive || isTransitioning) return;
    if (e.touches && e.touches.length > 0) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || !isOverlayActive || isTransitioning) return;
    if (e.touches && e.touches.length > 0) {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      if (deltaY > 40) { // Dragged upward by >40px
        isDragging = false;
        triggerWorldReveal();
      }
    }
  }, { passive: true });

  window.addEventListener("mousedown", (e) => {
    if (!isOverlayActive || isTransitioning) return;
    startY = e.clientY;
    isDragging = true;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging || !isOverlayActive || isTransitioning) return;
    const deltaY = startY - e.clientY;
    if (deltaY > 50) { // Mouse dragged upward by >50px
      isDragging = false;
      triggerWorldReveal();
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // World Reveal Transition Function
  function triggerWorldReveal() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Save to localStorage so returning visits skip intro
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      console.warn("LocalStorage access failed:", e);
    }

    // Add transitioning class for main site reveal scaling
    document.body.classList.add("intro-transitioning");

    // Animate overlay upward smoothly
    overlay.classList.add("dismissed");

    // Remove body scroll lock & hide overlay after 1.1s transition
    setTimeout(() => {
      overlay.style.display = "none";
      document.body.classList.remove("intro-active", "intro-transitioning");
      if (particleAnimId) cancelAnimationFrame(particleAnimId);
      
      // Refresh GSAP ScrollTrigger if available
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 1100);
  }

  // Replay Intro Handler
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.hash = "intro";
      window.location.reload();
    });
  }

  window.resetFin2EdgeIntro = function() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.hash = "intro";
    window.location.reload();
  };

  // --- Ambient Gold Particles Generator ---
  function initAmbientParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.3 ? "rgba(201, 162, 77, " : "rgba(245, 224, 163, ",
        alpha: Math.random() * 0.6 + 0.2,
        speedY: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.max(0, Math.min(1, p.alpha)) + ")";
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = "#c9a24d";
        ctx.fill();
      }
      particleAnimId = requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // --- Procedural Cinematic Canvas Fallback ---
  function renderProceduralVideo(canvas, onComplete) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let startTime = performance.now();
    const duration = 5200; // 5.2s video duration

    function drawFrame(now) {
      let elapsed = now - startTime;
      let progress = Math.min(1, elapsed / duration);

      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw expanding golden glow rings
      let ringRadius = (progress * width * 0.4) % (width * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 162, 77, ${0.4 * (1 - progress)})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Financial Wave Chart Line
      ctx.beginPath();
      ctx.moveTo(0, cy + 50);
      for (let x = 0; x < width; x += 15) {
        let waveY = cy + Math.sin(x * 0.008 + elapsed * 0.003) * 40 * Math.sin(progress * Math.PI);
        ctx.lineTo(x, waveY);
      }
      ctx.strokeStyle = `rgba(245, 224, 163, ${0.5 * Math.sin(progress * Math.PI)})`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#c9a24d";
      ctx.stroke();

      // Brand Title Fade in
      let textAlpha = Math.sin(progress * Math.PI);
      ctx.font = "italic 400 48px Fraunces, Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(243, 239, 228, ${textAlpha})`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(201, 162, 77, 0.6)";
      ctx.fillText("Fin2edge", cx, cy - 10);

      ctx.font = "500 13px 'Fraunces', sans-serif";
      ctx.fillStyle = `rgba(201, 162, 77, ${textAlpha * 0.8})`;
      ctx.fillText("PRIVATE WEALTH DESK", cx, cy + 30);

      if (progress < 1) {
        fallbackAnimId = requestAnimationFrame(drawFrame);
      } else {
        onComplete();
      }
    }
    fallbackAnimId = requestAnimationFrame(drawFrame);
  }
}
