// All features use vanilla JavaScript so the site can run on GitHub Pages.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a, .footer-links a, .hero-actions a, .brand");
  const pageSections = document.querySelectorAll("main > section[id]");

  setupMobileNavbar(header, navToggle);
  setupSectionNavigation(navLinks, navToggle, pageSections);
  setupScrollReveal();
  renderWasteChart();
  setupVideoSearch();
  setupEcoSearch();
  setupProductButtons();
  setupTeamPhotos();
});

function setupMobileNavbar(header, navToggle) {
  if (!header || !navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
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
      notice.textContent = `${productName} adalah contoh produk dummy ramah lingkungan.`;
    });
  });
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
