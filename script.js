// All features use vanilla JavaScript so the site can run on GitHub Pages.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const pageSections = document.querySelectorAll("main > section[id]");

  setupMobileNavbar(header, navToggle);
  setupSectionNavigation(navLinks, navToggle, pageSections);
  setupScrollReveal();
  renderWasteChart();
  setupVideoSearch();
  setupEcoSearch();
  setupProductButtons();
  setupTeamPhotos();
  setupPhotobooth();
  setupHeroParticles();
  setupHeroCounters();
});

function setupMobileNavbar(header, navToggle) {
  if (!header || !navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu navigasi");
    }
  });
}

function setupSectionNavigation(links, navToggle, sections) {
  if (!sections.length) return;

  document.body.classList.add("section-mode");

  const showSection = (hash, shouldUpdateHistory = true) => {
    const targetId = hash?.startsWith("#") ? hash.slice(1) : hash;
    const target = document.getElementById(targetId) || document.getElementById("home") || sections[0];

    if (!target || !Array.from(sections).includes(target)) return;

    sections.forEach((section) => {
      const isActive = section === target;
      section.classList.toggle("is-active-section", isActive);

      if (isActive) {
        section.removeAttribute("hidden");
        revealActiveSection(section);
      } else {
        section.setAttribute("hidden", "");
      }
    });

    updateActiveNavigation(target.id);
    document.body.classList.remove("nav-open");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu navigasi");
    }

    window.scrollTo({ top: 0, behavior: shouldUpdateHistory ? "smooth" : "auto" });

    const nextHash = `#${target.id}`;
    if (shouldUpdateHistory && window.location.hash !== nextHash) {
      history.pushState(null, "", nextHash);
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target || !Array.from(sections).includes(target)) return;

      event.preventDefault();
      showSection(href);
    });
  });

  window.addEventListener("popstate", () => {
    showSection(window.location.hash || "#home", false);
  });

  showSection(window.location.hash || "#home", false);
}

function revealActiveSection(section) {
  const revealItems = section.querySelectorAll(".reveal");
  revealItems.forEach((item) => item.classList.add("is-visible"));

  if (section.id === "plastic-facts") {
    document.querySelector(".bar-chart")?.classList.add("is-visible");
  }
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  const chart = document.querySelector(".bar-chart");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    chart?.classList.add("is-visible");
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  if (chart) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chart.classList.add("is-visible");
          chartObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });

    chartObserver.observe(chart);
  }
}

function updateActiveNavigation(activeId) {
  const menuLinks = document.querySelectorAll(".nav-links a");

  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

function renderWasteChart() {
  const chart = document.getElementById("wasteChart");
  if (!chart) return;

  const wasteData = [
    { label: "Sisa makanan", value: 40.77, color: "#45a66b" },
    { label: "Plastik", value: 20.52, color: "#63b6d9" },
    { label: "Kayu/ranting", value: 13.13, color: "#f7c948" },
    { label: "Kertas/karton", value: 11.4, color: "#7abf78" },
    { label: "Logam", value: 3.11, color: "#b8a07e" },
    { label: "Kain", value: 2.51, color: "#c9a0dc" },
    { label: "Kaca", value: 2.39, color: "#8ecae6" },
    { label: "Lainnya", value: 6.17, color: "#9fb7c8" }
  ];

  chart.innerHTML = wasteData.map((item) => {
    const height = `${Math.min(item.value * 2, 100)}%`;

    return `
      <div class="chart-bar">
        <span class="bar-label">${item.label}</span>
        <span class="bar-track" aria-hidden="true">
          <span class="bar-fill" style="--bar-height: ${height}; --bar-color: ${item.color};"></span>
        </span>
        <span class="bar-value">${item.value}%</span>
      </div>
    `;
  }).join("");
}

function setupVideoSearch() {
  const input = document.getElementById("videoSearch");
  const cards = document.querySelectorAll(".video-card");
  const resultCount = document.getElementById("videoResultCount");

  if (!input || !cards.length || !resultCount) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.dataset.title?.toLowerCase() || "";
      const category = card.dataset.category?.toLowerCase() || "";
      const isMatch = title.includes(keyword) || category.includes(keyword);

      card.classList.toggle("is-hidden", !isMatch);
      if (isMatch) visibleCount += 1;
    });

    resultCount.textContent = visibleCount
      ? `${visibleCount} video ditemukan`
      : "Tidak ada video yang cocok";
  });
}

function setupEcoSearch() {
  const form = document.getElementById("ecoSearchForm");
  const input = document.getElementById("ecoQuery");
  const message = document.getElementById("ecoMessage");

  if (!form || !input || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = input.value.trim();

    if (!keyword) {
      message.textContent = "Masukkan kata kunci terlebih dahulu.";
      message.className = "form-message error";
      input.focus();
      return;
    }

    message.textContent = "Mengarahkan ke Ecosia...";
    message.className = "form-message success";

    const url = `https://www.ecosia.org/search?q=${encodeURIComponent(keyword)}`;
    window.location.href = url;
  });
}

function setupProductButtons() {
  const buttons = document.querySelectorAll(".product-btn");
  const notice = document.getElementById("productNotice");

  if (!buttons.length || !notice) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product || "Produk";
      notice.textContent = `${productName} dibuat dari rajutan tangan yang reusable, ringan, dan cocok untuk membawa tumbler tanpa kantong plastik sekali pakai.`;
    });
  });
}

function setupPhotobooth() {
  const video = document.getElementById("photoboothVideo");
  const cameraStage = video?.closest(".camera-stage");
  const startButton = document.getElementById("startCameraBtn");
  const captureButton = document.getElementById("capturePhotoBtn");
  const resetButton = document.getElementById("resetPhotosBtn");
  const downloadButton = document.getElementById("downloadBoothBtn");
  const status = document.getElementById("photoboothStatus");
  const canvas = document.getElementById("photoboothCanvas");
  const photoSlots = document.getElementById("photoSlots");

  if (!video || !cameraStage || !startButton || !captureButton || !resetButton || !downloadButton || !status || !canvas || !photoSlots) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const layouts = {
    "3x1": { label: "3x1", rows: 3, cols: 1, count: 3, width: 900, height: 1800 },
    "2x2": { label: "2x2", rows: 2, cols: 2, count: 4, width: 1400, height: 1600 },
    "3x2": { label: "3x2", rows: 3, cols: 2, count: 6, width: 1400, height: 1900 }
  };

  const themes = {
    garden: {
      bg: "#e7f7e9",
      bg2: "#fff4d6",
      border: "#25724e",
      accent: "#f7c948",
      soft: "#ffffff",
      sticker: "#45a66b",
      ink: "#123f2d"
    },
    candy: {
      bg: "#fff0f5",
      bg2: "#dff3ff",
      border: "#ef709d",
      accent: "#f7c948",
      soft: "#ffffff",
      sticker: "#ff8fab",
      ink: "#3d2634"
    },
    ocean: {
      bg: "#dff3ff",
      bg2: "#e7f7e9",
      border: "#2f86a6",
      accent: "#f7c948",
      soft: "#ffffff",
      sticker: "#63b6d9",
      ink: "#123f2d"
    }
  };

  let cameraStream = null;
  let capturedPhotos = [];

  const getLayout = () => {
    const checked = document.querySelector('input[name="boothLayout"]:checked');
    return layouts[checked?.value] || layouts["3x1"];
  };

  const getTheme = () => {
    const checked = document.querySelector('input[name="boothFrame"]:checked');
    return themes[checked?.value] || themes.garden;
  };

  const getStickerPacks = () => {
    return Array.from(document.querySelectorAll(".sticker-check input:checked"))
      .map((input) => input.dataset.sticker)
      .filter(Boolean);
  };

  const setStatus = (message, type = "") => {
    status.textContent = message;
    status.className = type ? `photobooth-status ${type}` : "photobooth-status";
  };

  const updateButtons = () => {
    const layout = getLayout();
    captureButton.disabled = !cameraStream || capturedPhotos.length >= layout.count;
    downloadButton.disabled = capturedPhotos.length === 0;
  };

  const updateCameraAspectRatio = () => {
    if (!cameraStream || !video.videoWidth || !video.videoHeight) return;

    cameraStage.style.setProperty("--camera-aspect-ratio", `${video.videoWidth} / ${video.videoHeight}`);
  };

  const getCameraVideoConstraints = () => {
    const isPortraitViewport = window.matchMedia?.("(orientation: portrait)").matches && window.innerWidth <= 860;

    return {
      facingMode: "user",
      width: { ideal: isPortraitViewport ? 960 : 1280 },
      height: { ideal: isPortraitViewport ? 1280 : 960 }
    };
  };

  const updateSlots = () => {
    const layout = getLayout();
    photoSlots.innerHTML = Array.from({ length: layout.count }, (_, index) => {
      const filledClass = index < capturedPhotos.length ? " is-filled" : "";
      return `<span class="photo-slot${filledClass}">${index + 1}</span>`;
    }).join("");
  };

  const refreshBooth = () => {
    const layout = getLayout();
    if (capturedPhotos.length > layout.count) {
      capturedPhotos = capturedPhotos.slice(0, layout.count);
    }

    renderPhotoboothCanvas(context, canvas, layout, getTheme(), getStickerPacks(), capturedPhotos);
    updateSlots();
    updateButtons();
  };

  const stopCamera = () => {
    if (!cameraStream) return;

    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    video.srcObject = null;
    cameraStage.classList.remove("is-camera-on");
    cameraStage.style.removeProperty("--camera-aspect-ratio");
    startButton.textContent = "Nyalakan Kamera";
    setStatus("Kamera dimatikan.");
    updateButtons();
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Browser ini belum mendukung akses kamera.", "error");
      return;
    }

    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: getCameraVideoConstraints(),
        audio: false
      });

      video.srcObject = cameraStream;
      await video.play();
      updateCameraAspectRatio();
      cameraStage.classList.add("is-camera-on");
      startButton.textContent = "Matikan Kamera";

      const layout = getLayout();
      setStatus(`Kamera aktif. Foto ${capturedPhotos.length + 1}/${layout.count} siap diambil.`, "success");
      updateButtons();
    } catch (error) {
      setStatus("Kamera tidak bisa diakses. Izinkan kamera di browser, lalu coba lagi.", "error");
      updateButtons();
    }
  };

  const capturePhoto = () => {
    const layout = getLayout();

    if (!cameraStream || !video.videoWidth || !video.videoHeight) {
      setStatus("Nyalakan kamera dulu sebelum ambil foto.", "error");
      return;
    }

    if (capturedPhotos.length >= layout.count) {
      setStatus(`Layout ${layout.label} sudah penuh. Reset untuk mulai lagi.`, "success");
      updateButtons();
      return;
    }

    const shotCanvas = document.createElement("canvas");
    const shotContext = shotCanvas.getContext("2d");
    if (!shotContext) return;

    shotCanvas.width = video.videoWidth;
    shotCanvas.height = video.videoHeight;
    shotContext.translate(shotCanvas.width, 0);
    shotContext.scale(-1, 1);
    shotContext.drawImage(video, 0, 0, shotCanvas.width, shotCanvas.height);

    const photo = new Image();
    photo.onload = () => {
      capturedPhotos.push(photo);
      refreshBooth();

      const nextNumber = Math.min(capturedPhotos.length + 1, layout.count);
      const complete = capturedPhotos.length >= layout.count;
      setStatus(
        complete ? `Layout ${layout.label} lengkap dan siap di-download.` : `Foto ${nextNumber}/${layout.count} siap diambil.`,
        complete ? "success" : ""
      );
    };
    photo.src = shotCanvas.toDataURL("image/png");
  };

  startButton.addEventListener("click", () => {
    if (cameraStream) {
      stopCamera();
      return;
    }

    startCamera();
  });

  captureButton.addEventListener("click", capturePhoto);
  video.addEventListener("loadedmetadata", updateCameraAspectRatio);
  window.addEventListener("resize", updateCameraAspectRatio);

  resetButton.addEventListener("click", () => {
    capturedPhotos = [];
    refreshBooth();
    const layout = getLayout();
    setStatus(cameraStream ? `Foto 1/${layout.count} siap diambil.` : "Pilih layout dan nyalakan kamera.");
  });

  downloadButton.addEventListener("click", () => {
    if (!capturedPhotos.length) return;

    const link = document.createElement("a");
    link.download = `cup-holder-strap-photobooth-${getLayout().label}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setStatus("Hasil photobooth berhasil disiapkan untuk di-download.", "success");
  });

  document.querySelectorAll('input[name="boothLayout"], input[name="boothFrame"], .sticker-check input').forEach((input) => {
    input.addEventListener("change", () => {
      refreshBooth();
      const layout = getLayout();
      setStatus(`${capturedPhotos.length}/${layout.count} foto terpasang di layout ${layout.label}.`);
    });
  });

  refreshBooth();
}

function renderPhotoboothCanvas(context, canvas, layout, theme, stickerPacks, photos) {
  canvas.width = layout.width;
  canvas.height = layout.height;

  drawBoothBackground(context, canvas.width, canvas.height, theme, layout);

  const margin = layout.cols === 1 ? 76 : 66;
  const headerHeight = layout.cols === 1 ? 150 : 132;
  const footerHeight = layout.cols === 1 ? 130 : 118;
  const gap = layout.cols === 1 ? 34 : 32;
  const usableWidth = canvas.width - margin * 2 - gap * (layout.cols - 1);
  const usableHeight = canvas.height - margin * 2 - headerHeight - footerHeight - gap * (layout.rows - 1);
  const cardWidth = usableWidth / layout.cols;
  const cardHeight = usableHeight / layout.rows;

  context.save();
  context.fillStyle = theme.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${layout.cols === 1 ? 46 : 50}px Inter, Arial, sans-serif`;
  context.fillText("Cup Holder Strap Booth", canvas.width / 2, margin + 36);
  context.font = `800 ${layout.cols === 1 ? 24 : 26}px Inter, Arial, sans-serif`;
  context.fillStyle = "rgba(18, 63, 45, 0.72)";
  context.fillText(`${layout.label} Polaroid Layout`, canvas.width / 2, margin + 82);
  context.restore();

  for (let index = 0; index < layout.count; index += 1) {
    const col = index % layout.cols;
    const row = Math.floor(index / layout.cols);
    const x = margin + col * (cardWidth + gap);
    const y = margin + headerHeight + row * (cardHeight + gap);

    drawPolaroidCard(context, x, y, cardWidth, cardHeight, photos[index], index, theme);
  }

  drawBoothStickers(context, canvas.width, canvas.height, theme, stickerPacks);

  context.save();
  context.fillStyle = "rgba(18, 63, 45, 0.78)";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 ${layout.cols === 1 ? 24 : 25}px Inter, Arial, sans-serif`;
  context.fillText("Less plastic, more cute moments", canvas.width / 2, canvas.height - margin + 10);
  context.restore();
}

function drawBoothBackground(context, width, height, theme, layout) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, theme.bg);
  gradient.addColorStop(0.58, "#ffffff");
  gradient.addColorStop(1, theme.bg2);

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.42;
  context.fillStyle = theme.accent;

  const dotSize = layout.cols === 1 ? 9 : 10;
  const spacing = layout.cols === 1 ? 86 : 96;
  for (let y = 40; y < height; y += spacing) {
    for (let x = 38; x < width; x += spacing) {
      context.beginPath();
      context.arc(x, y, dotSize, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();

  context.save();
  context.lineWidth = layout.cols === 1 ? 18 : 20;
  context.strokeStyle = theme.border;
  roundedRectPath(context, 24, 24, width - 48, height - 48, 34);
  context.stroke();
  context.lineWidth = 5;
  context.strokeStyle = "rgba(255, 255, 255, 0.82)";
  roundedRectPath(context, 48, 48, width - 96, height - 96, 26);
  context.stroke();
  context.restore();
}

function drawPolaroidCard(context, x, y, width, height, photo, index, theme) {
  const radius = Math.min(24, width * 0.05);
  const pad = Math.max(18, width * 0.052);
  const bottomPad = Math.max(58, height * 0.16);
  const photoX = x + pad;
  const photoY = y + pad;
  const photoWidth = width - pad * 2;
  const photoHeight = height - pad * 2 - bottomPad;

  context.save();
  context.shadowColor = "rgba(18, 63, 45, 0.2)";
  context.shadowBlur = 24;
  context.shadowOffsetY = 12;
  context.fillStyle = "#ffffff";
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
  context.restore();

  context.save();
  roundedRectPath(context, photoX, photoY, photoWidth, photoHeight, 14);
  context.clip();

  if (photo) {
    drawImageContain(context, photo, photoX, photoY, photoWidth, photoHeight, theme);
  } else {
    const placeholderGradient = context.createLinearGradient(photoX, photoY, photoX + photoWidth, photoY + photoHeight);
    placeholderGradient.addColorStop(0, theme.bg);
    placeholderGradient.addColorStop(1, theme.bg2);
    context.fillStyle = placeholderGradient;
    context.fillRect(photoX, photoY, photoWidth, photoHeight);
    context.fillStyle = "rgba(255, 255, 255, 0.62)";
    context.fillRect(photoX + photoWidth * 0.1, photoY + photoHeight * 0.42, photoWidth * 0.8, photoHeight * 0.16);
  }
  context.restore();

  context.save();
  context.lineWidth = 5;
  context.strokeStyle = "rgba(18, 63, 45, 0.08)";
  roundedRectPath(context, photoX, photoY, photoWidth, photoHeight, 14);
  context.stroke();

  context.fillStyle = theme.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${Math.max(20, Math.min(30, width * 0.058))}px Inter, Arial, sans-serif`;
  context.fillText(photo ? `SNAP ${String(index + 1).padStart(2, "0")}` : `FOTO ${index + 1}`, x + width / 2, y + height - bottomPad / 2);
  context.restore();
}

function drawBoothStickers(context, width, height, theme, stickerPacks) {
  drawWashiTape(context, 74, 66, 140, 42, -0.18, theme.accent);
  drawWashiTape(context, width - 214, 66, 140, 42, 0.18, theme.sticker);
  drawWashiTape(context, 70, height - 112, 150, 42, 0.16, theme.sticker);
  drawWashiTape(context, width - 220, height - 112, 150, 42, -0.16, theme.accent);

  if (stickerPacks.includes("eco")) {
    drawLeafSticker(context, 112, 178, 42, theme.sticker, theme.ink);
    drawLeafSticker(context, width - 116, height - 190, 46, theme.border, theme.ink);
    drawStickerPill(context, width - 330, 144, 214, 58, "REUSE", theme.bg, theme.ink);
    drawStickerPill(context, 98, height - 202, 244, 58, "LESS PLASTIC", theme.bg2, theme.ink);
  }

  if (stickerPacks.includes("sweet")) {
    drawFlowerSticker(context, width - 118, 198, 36, theme.accent, theme.sticker, theme.ink);
    drawFlowerSticker(context, 126, height - 252, 34, theme.sticker, theme.accent, theme.ink);
    drawHeartSticker(context, 102, 265, 34, theme.sticker);
    drawHeartSticker(context, width - 95, height - 288, 32, theme.accent);
  }

  if (stickerPacks.includes("spark")) {
    drawSparkle(context, 82, 112, 28, theme.ink);
    drawSparkle(context, width - 82, 124, 30, theme.ink);
    drawSparkle(context, width - 120, height - 178, 28, theme.ink);
    drawWaveSticker(context, width / 2 - 84, height - 96, 168, theme.border);
  }
}

function drawImageContain(context, image, x, y, width, height, theme) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  context.fillStyle = theme.soft || "#ffffff";
  context.fillRect(x, y, width, height);

  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function roundedRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function drawStickerPill(context, x, y, width, height, text, fill, ink) {
  context.save();
  context.fillStyle = fill;
  context.strokeStyle = "rgba(18, 63, 45, 0.2)";
  context.lineWidth = 4;
  roundedRectPath(context, x, y, width, height, height / 2);
  context.fill();
  context.stroke();
  context.fillStyle = ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 25px Inter, Arial, sans-serif";
  context.fillText(text, x + width / 2, y + height / 2 + 1);
  context.restore();
}

function drawWashiTape(context, x, y, width, height, angle, fill) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(angle);
  context.globalAlpha = 0.82;
  context.fillStyle = fill;
  roundedRectPath(context, -width / 2, -height / 2, width, height, 10);
  context.fill();
  context.globalAlpha = 0.24;
  context.fillStyle = "#ffffff";
  for (let i = -width / 2; i < width / 2; i += 24) {
    context.fillRect(i, -height / 2, 9, height);
  }
  context.restore();
}

function drawLeafSticker(context, x, y, size, fill, stroke) {
  context.save();
  context.translate(x, y);
  context.rotate(-0.35);
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, -size);
  context.bezierCurveTo(size * 0.9, -size * 0.58, size * 0.82, size * 0.48, 0, size);
  context.bezierCurveTo(-size * 0.9, size * 0.45, -size * 0.8, -size * 0.6, 0, -size);
  context.fill();
  context.stroke();
  context.beginPath();
  context.moveTo(0, -size * 0.72);
  context.lineTo(0, size * 0.72);
  context.stroke();
  context.restore();
}

function drawFlowerSticker(context, x, y, size, petalFill, centerFill, stroke) {
  context.save();
  context.translate(x, y);
  context.fillStyle = petalFill;
  context.strokeStyle = stroke;
  context.lineWidth = 3;

  for (let i = 0; i < 6; i += 1) {
    context.rotate(Math.PI / 3);
    context.beginPath();
    context.ellipse(0, -size * 0.72, size * 0.36, size * 0.58, 0, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  context.fillStyle = centerFill;
  context.beginPath();
  context.arc(0, 0, size * 0.36, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.restore();
}

function drawHeartSticker(context, x, y, size, fill) {
  context.save();
  context.translate(x, y);
  context.fillStyle = fill;
  context.strokeStyle = "rgba(18, 63, 45, 0.2)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(0, size * 0.45);
  context.bezierCurveTo(-size, -size * 0.18, -size * 0.52, -size * 0.86, 0, -size * 0.38);
  context.bezierCurveTo(size * 0.52, -size * 0.86, size, -size * 0.18, 0, size * 0.45);
  context.fill();
  context.stroke();
  context.restore();
}

function drawSparkle(context, x, y, size, stroke) {
  context.save();
  context.strokeStyle = stroke;
  context.lineWidth = 5;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x, y - size);
  context.lineTo(x, y + size);
  context.moveTo(x - size, y);
  context.lineTo(x + size, y);
  context.moveTo(x - size * 0.58, y - size * 0.58);
  context.lineTo(x + size * 0.58, y + size * 0.58);
  context.moveTo(x + size * 0.58, y - size * 0.58);
  context.lineTo(x - size * 0.58, y + size * 0.58);
  context.stroke();
  context.restore();
}

function drawWaveSticker(context, x, y, width, stroke) {
  context.save();
  context.strokeStyle = stroke;
  context.lineWidth = 8;
  context.lineCap = "round";
  context.beginPath();

  for (let i = 0; i <= 6; i += 1) {
    const nextX = x + (width / 6) * i;
    const nextY = y + (i % 2 === 0 ? -12 : 12);
    if (i === 0) {
      context.moveTo(nextX, nextY);
    } else {
      context.lineTo(nextX, nextY);
    }
  }

  context.stroke();
  context.restore();
}

function setupTeamPhotos() {
  const photos = document.querySelectorAll(".team-photo[data-photo-base]");
  const extensions = [".jpg", ".jpeg", ".png", ".jfif", ".webp"];

  photos.forEach((photo) => {
    const basePath = photo.dataset.photoBase;
    const fallback = photo.closest(".team-photo-wrap")?.querySelector(".avatar-fallback");
    const directSource = photo.getAttribute("src");
    const candidates = [
      directSource,
      ...extensions.map((extension) => basePath ? `${basePath}${extension}` : "")
    ].filter(Boolean);
    const uniqueCandidates = [...new Set(candidates)];
    let attempt = 0;

    const showPhoto = () => {
      photo.hidden = false;
      if (fallback) fallback.hidden = true;
    };

    const showFallback = () => {
      photo.hidden = true;
      if (fallback) fallback.hidden = false;
    };

    const tryNextPhoto = () => {
      if (attempt >= uniqueCandidates.length) {
        showFallback();
        return;
      }

      showPhoto();
      photo.src = uniqueCandidates[attempt];
      attempt += 1;
    };

    photo.addEventListener("error", tryNextPhoto);
    photo.addEventListener("load", showPhoto);

    if (photo.complete) {
      if (photo.naturalWidth > 0) {
        showPhoto();
      } else {
        tryNextPhoto();
      }
      return;
    }

    showPhoto();
  });
}

function setupHeroParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  const particleCount = Math.min(35, Math.floor(window.innerWidth / 40));

  const resizeCanvas = () => {
    const heroSection = canvas.closest(".hero");
    if (!heroSection) return;
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particleTypes = ["leaf", "pollen", "sparkle"];

  const createParticle = () => {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: type === "leaf" ? 4 + Math.random() * 6 : type === "pollen" ? 2 + Math.random() * 3 : 1.5 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.15 - Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      opacity: 0.15 + Math.random() * 0.35,
      type,
      color: type === "leaf"
        ? `hsla(${130 + Math.random() * 30}, ${55 + Math.random() * 25}%, ${40 + Math.random() * 20}%, `
        : type === "pollen"
          ? `hsla(${45 + Math.random() * 15}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 15}%, `
          : `hsla(${160 + Math.random() * 60}, ${50 + Math.random() * 30}%, ${70 + Math.random() * 20}%, `,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.012,
      swayAmount: 0.3 + Math.random() * 0.6
    };
  };

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  const drawLeaf = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color + p.opacity + ")";
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.5, p.size * 0.3, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.3, -p.size * 0.6, -p.size * 0.3, 0, -p.size);
    ctx.fill();
    ctx.restore();
  };

  const drawPollen = (p) => {
    ctx.save();
    ctx.fillStyle = p.color + p.opacity + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.color + (p.opacity * 0.3) + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawSparkle = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.color + p.opacity + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 1.5);
    ctx.lineTo(0, p.size * 1.5);
    ctx.moveTo(-p.size * 1.5, 0);
    ctx.lineTo(p.size * 1.5, 0);
    ctx.stroke();
    ctx.restore();
  };

  let animationId;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * p.swayAmount;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;

      if (p.type === "leaf") drawLeaf(p);
      else if (p.type === "pollen") drawPollen(p);
      else drawSparkle(p);
    });

    animationId = requestAnimationFrame(animate);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    animate();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (!prefersReducedMotion) {
      animate();
    }
  });
}

function setupHeroCounters() {
  const counters = document.querySelectorAll(".hero-stat-num[data-count]");
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }
}
