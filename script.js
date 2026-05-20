// All features use vanilla JavaScript so the site can run on GitHub Pages.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-links a, .footer-links a, .hero-actions a, .brand");

  setupMobileNavbar(header, navToggle);
  setupSmoothScroll(navLinks, header, navToggle);
  setupScrollReveal();
  setupActiveNavigation();
  renderWasteChart();
  setupVideoSearch();
  setupEcoSearch();
  setupProductButtons();
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

function setupSmoothScroll(links, header, navToggle) {
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      history.pushState(null, "", href);
      document.body.classList.remove("nav-open");

      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Buka menu navigasi");
      }
    });
  });
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

function setupActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const menuLinks = document.querySelectorAll(".nav-links a");

  if (!("IntersectionObserver" in window)) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.getAttribute("id");
      menuLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

function renderWasteChart() {
  const chart = document.getElementById("wasteChart");
  if (!chart) return;

  const wasteData = [
    { label: "Sisa makanan", value: 41.8, color: "#45a66b" },
    { label: "Plastik", value: 18.5, color: "#63b6d9" },
    { label: "Kayu/ranting", value: 11.6, color: "#f7c948" },
    { label: "Kertas/karton", value: 10.6, color: "#7abf78" },
    { label: "Lainnya", value: 17.5, color: "#9fb7c8" }
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
