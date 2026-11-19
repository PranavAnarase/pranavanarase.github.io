'use strict';

// ----------------------------------------------------
// 1. Element Toggle Helper
// ----------------------------------------------------
const elementToggleFunc = function (elem) {
  if (elem) elem.classList.toggle("active");
};

// ----------------------------------------------------
// 2. Sidebar Toggle (for Mobile)
// ----------------------------------------------------
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// ----------------------------------------------------
// 3. Testimonials & Modal (with safe null-checks)
// ----------------------------------------------------
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
};

if (testimonialsItem && modalContainer) {
  testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const title = this.querySelector("[data-testimonials-title]");
      const text = this.querySelector("[data-testimonials-text]");

      if (modalImg && avatar) {
        modalImg.src = avatar.src;
        modalImg.alt = avatar.alt || "";
      }
      if (modalTitle && title) {
        modalTitle.innerHTML = title.innerHTML;
      }
      if (modalText && text) {
        modalText.innerHTML = text.innerHTML;
      }

      testimonialsModalFunc();
    });
  });
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// ----------------------------------------------------
// 4. Custom Select Dropdown & Portfolio Filter
// ----------------------------------------------------
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  const target = selectedValue.trim().toLowerCase();

  filterItems.forEach(item => {
    const category = (item.dataset.category || "").trim().toLowerCase();
    if (target === "all" || target === category || category.includes(target)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
};

// Dropdown click for mobile
if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

// Dropdown items
if (selectItems) {
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const selectedValue = this.innerText.trim();
      if (selectValue) selectValue.innerText = selectedValue;
      if (select) elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });
}

// Filter button items for larger screens
if (filterBtns) {
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedValue = this.innerText.trim();
      if (selectValue) selectValue.innerText = selectedValue;
      filterFunc(selectedValue);

      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

// ----------------------------------------------------
// 5. Contact Form Validation & Web3Forms Email Automation
// ----------------------------------------------------
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

if (form && formInputs && formBtn) {
  // Input validation
  formInputs.forEach(input => {
    input.addEventListener("input", function () {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });

  // Automated email delivery on submit
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const originalBtnContent = formBtn.innerHTML;
    formBtn.innerHTML = '<span class="label"><ion-icon name="hourglass-outline"></ion-icon> <span>Sending...</span></span>';
    formBtn.setAttribute("disabled", "");

    if (formStatus) {
      formStatus.style.display = "none";
      formStatus.innerText = "";
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        if (formStatus) {
          formStatus.style.display = "block";
          formStatus.style.background = "rgba(46, 204, 113, 0.15)";
          formStatus.style.color = "#2ecc71";
          formStatus.style.border = "1px solid rgba(46, 204, 113, 0.3)";
          formStatus.innerHTML = "✓ Thank you! Your message has been sent directly to Pranav's email.";
        }
        form.reset();
        formBtn.setAttribute("disabled", "");
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (err) {
      if (formStatus) {
        formStatus.style.display = "block";
        formStatus.style.background = "rgba(231, 76, 60, 0.15)";
        formStatus.style.color = "#e74c3c";
        formStatus.style.border = "1px solid rgba(231, 76, 60, 0.3)";
        formStatus.innerHTML = "✕ Could not send message. Please email pranavanarase@gmail.com directly.";
      }
      formBtn.removeAttribute("disabled");
    } finally {
      formBtn.innerHTML = originalBtnContent;
    }
  });
}

// ----------------------------------------------------
// 6. Sliding Liquid Glass Tab Indicator (Apple iOS / visionOS)
// ----------------------------------------------------
const glassTabIndicator = document.getElementById("glass-tab-indicator");

function updateGlassTabIndicator(activeBtn) {
  if (!glassTabIndicator || !activeBtn) return;
  const parent = glassTabIndicator.parentElement;
  if (!parent) return;

  const btnRect = activeBtn.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  // Precise pixel coordinates relative to the navbar container
  const left = btnRect.left - parentRect.left;
  const top = btnRect.top - parentRect.top;

  glassTabIndicator.style.width = `${btnRect.width}px`;
  glassTabIndicator.style.height = `${btnRect.height}px`;
  glassTabIndicator.style.transform = `translate(${left}px, ${top}px)`;
  glassTabIndicator.style.opacity = '1';
}

// ----------------------------------------------------
// 7. Page Navigation (About, Resume, Portfolio, Publications, Contact)
// ----------------------------------------------------
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function navigateToPage(pageName) {
  const target = (pageName || "").toLowerCase().trim();
  let pageFound = false;

  navigationLinks.forEach(btn => {
    if (btn.textContent.trim().toLowerCase() === target) {
      navigationLinks.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateGlassTabIndicator(btn);
    }
  });

  pages.forEach(page => {
    const name = (page.dataset.page || "").toLowerCase().trim();
    if (name === target) {
      page.classList.add("active");
      pageFound = true;
    } else {
      page.classList.remove("active");
    }
  });

  if (pageFound) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

if (navigationLinks && pages) {
  navigationLinks.forEach(navBtn => {
    navBtn.addEventListener("click", function () {
      const targetPage = this.textContent.trim().toLowerCase();
      navigateToPage(targetPage);
    });
  });

  // Position initial indicator on page load & font readiness
  const updateInitialIndicator = () => {
    const activeLink = document.querySelector(".navbar-link.active");
    if (activeLink) updateGlassTabIndicator(activeLink);
  };

  window.addEventListener("DOMContentLoaded", updateInitialIndicator);
  window.addEventListener("load", updateInitialIndicator);
  window.addEventListener("resize", updateInitialIndicator);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateInitialIndicator);
  }
  updateInitialIndicator();
}

// ----------------------------------------------------
// 8. LiquidGlass WebGL Shader Initialization (ybouane/liquidglass)
// ----------------------------------------------------
async function initLiquidGlassEffect() {
  try {
    if (window.innerWidth <= 768) return; // Desktop only

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const { LiquidGlass } = await import("./liquidglass.js");
    const magnifierEl = document.getElementById("glass-magnifier");

    if (magnifierEl) {
      magnifierEl.dataset.config = JSON.stringify({
        bevelMode: 1, // Dome magnifier lens
        cornerRadius: 32,
        zRadius: 32,
        floating: false, // Managed by our high-performance drag controller
        blurAmount: 0.1,
        refraction: 1.1,
        edgeHighlight: 0.35,
        shadowOpacity: 0.35
      });

      await LiquidGlass.init({
        root: document.body,
        glassElements: [magnifierEl]
      });
      console.log("LiquidGlass Dome Magnifier initialized successfully.");
    }
  } catch (err) {
    console.warn("LiquidGlass WebGL initialization fallback active:", err);
  }
}

// ----------------------------------------------------
// 9. Apple Spotlight / iOS Liquid Glass Search Palette
// ----------------------------------------------------
const searchIndex = [
  // Projects
  {
    title: "AuraStudy – AI-Adaptive Study Planner",
    desc: "EdTech & Scheduling | FastAPI, React & MySQL. Personalized study planner using diagnostic gap analysis, prerequisite DAGs, and SM-2 spaced repetition.",
    category: "project",
    page: "portfolio",
    icon: "sparkles-outline"
  },
  {
    title: "AI Secondary Brain & Automation Framework",
    desc: "Autonomous workflow system using LangChain, NLP, and Python for context retrieval and scheduling.",
    category: "project",
    page: "portfolio",
    icon: "hardware-chip-outline"
  },
  {
    title: "NeuroCampus - Smart Campus Management",
    desc: "Full-stack MERN portal with real-time analytics, event management, and automated student workflows.",
    category: "project",
    page: "portfolio",
    icon: "school-outline"
  },
  {
    title: "Intelligent Disease Predictor",
    desc: "Multi-condition ML diagnosis platform achieving 94%+ accuracy with clinical parameter evaluation.",
    category: "project",
    page: "portfolio",
    icon: "pulse-outline"
  },
  {
    title: "EcoTrack - Carbon Footprint Analyzer",
    desc: "IoT & Flask dashboard visualizing household emissions and recommending energy optimizations.",
    category: "project",
    page: "portfolio",
    icon: "leaf-outline"
  },
  // Leadership & Experience
  {
    title: "Vice President - DSSA VIIT",
    desc: "Leadership role directing student development, data science hackathons, and technical bootcamps.",
    category: "experience",
    page: "resume",
    icon: "ribbon-outline"
  },
  {
    title: "Technical Team Lead - DSSA VIIT",
    desc: "Headed project development teams and conducted hands-on technical workshops in Python & ML.",
    category: "experience",
    page: "resume",
    icon: "code-working-outline"
  },
  // Education
  {
    title: "B.Tech CSE - Data Science (VIIT Pune)",
    desc: "Vishwakarma Institute of Information Technology, Pune. Current CGPA: 8.84.",
    category: "education",
    page: "resume",
    icon: "medal-outline"
  },
  {
    title: "Higher Secondary Certificate (HSC) - 89.60%",
    desc: "Maharashtra State Board of Secondary and Higher Secondary Education.",
    category: "education",
    page: "resume",
    icon: "document-text-outline"
  },
  {
    title: "Secondary School Certificate (SSC) - 93.40%",
    desc: "Maharashtra State Board of Secondary and Higher Secondary Education.",
    category: "education",
    page: "resume",
    icon: "book-outline"
  },
  // Skills
  {
    title: "Core Technologies & Languages",
    desc: "Python, C++, Java, Machine Learning, Deep Learning, NLP, React, Node.js, SQL, Git.",
    category: "skills",
    page: "resume",
    icon: "construct-outline"
  },
  // Research & Publications
  {
    title: "Advancements in Personal Health & Medical Devices",
    desc: "Published research exploring IoT health sensors, edge computing, and real-time medical alert algorithms.",
    category: "publication",
    page: "publications",
    icon: "journal-outline"
  },
  // Contact
  {
    title: "Contact & Inquiries",
    desc: "Reach Pranav via email (pranavanarase@gmail.com), phone (+91 7499003474), or send a direct message.",
    category: "contact",
    page: "contact",
    icon: "mail-outline"
  }
];

const searchModal = document.getElementById("search-modal");
const searchBackdrop = document.getElementById("search-backdrop");
const searchInput = document.getElementById("search-input");
const searchCloseBtn = document.getElementById("search-close-btn");
const searchResultsList = document.getElementById("search-results-list");
const searchEmptyState = document.getElementById("search-empty-state");
const searchQueryEcho = document.getElementById("search-query-echo");
const searchTags = document.querySelectorAll(".search-tag");

let activeFilter = "all";
let currentQuery = "";
let selectedResultIndex = 0;

function openSearchModal() {
  if (!searchModal) return;
  searchModal.classList.add("active");
  searchModal.setAttribute("aria-hidden", "false");
  if (searchInput) {
    searchInput.value = "";
    currentQuery = "";
    setTimeout(() => searchInput.focus(), 50);
  }
  renderSearchResults();
}

function closeSearchModal() {
  if (!searchModal) return;
  searchModal.classList.remove("active");
  searchModal.setAttribute("aria-hidden", "true");
}

function toggleSearchModal() {
  if (searchModal && searchModal.classList.contains("active")) {
    closeSearchModal();
  } else {
    openSearchModal();
  }
}

function renderSearchResults() {
  if (!searchResultsList) return;

  const q = currentQuery.toLowerCase().trim();
  const filtered = searchIndex.filter(item => {
    const matchesFilter = (activeFilter === "all" || item.category === activeFilter);
    const matchesQuery = !q || 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  searchResultsList.innerHTML = "";
  selectedResultIndex = 0;

  if (filtered.length === 0) {
    searchResultsList.style.display = "none";
    if (searchEmptyState) {
      searchEmptyState.style.display = "flex";
      if (searchQueryEcho) searchQueryEcho.textContent = currentQuery;
    }
    return;
  }

  searchResultsList.style.display = "flex";
  if (searchEmptyState) searchEmptyState.style.display = "none";

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `search-result-item ${index === 0 ? "selected" : ""}`;
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");

    li.innerHTML = `
      <div class="search-result-left">
        <div class="search-result-icon">
          <ion-icon name="${item.icon}"></ion-icon>
        </div>
        <div class="search-result-text">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-desc">${item.desc}</span>
        </div>
      </div>
      <span class="search-result-badge badge-${item.category}">${item.category}</span>
    `;

    const triggerSelect = () => {
      closeSearchModal();
      navigateToPage(item.page);
    };

    li.addEventListener("click", triggerSelect);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") triggerSelect();
    });

    searchResultsList.appendChild(li);
  });
}

// Search input listener
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentQuery = e.target.value;
    renderSearchResults();
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = searchResultsList ? searchResultsList.querySelectorAll(".search-result-item") : [];
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[selectedResultIndex]?.classList.remove("selected");
      selectedResultIndex = (selectedResultIndex + 1) % items.length;
      items[selectedResultIndex]?.classList.add("selected");
      items[selectedResultIndex]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[selectedResultIndex]?.classList.remove("selected");
      selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
      items[selectedResultIndex]?.classList.add("selected");
      items[selectedResultIndex]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[selectedResultIndex]?.click();
    }
  });
}

// Category filter tag clicks
if (searchTags) {
  searchTags.forEach(tag => {
    tag.addEventListener("click", function () {
      searchTags.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      activeFilter = this.dataset.filter || "all";
      renderSearchResults();
    });
  });
}

// Close events
if (searchCloseBtn) searchCloseBtn.addEventListener("click", closeSearchModal);
if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearchModal);

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    toggleSearchModal();
  }
  if (e.key === "Escape") {
    closeSearchModal();
  }
});

// ----------------------------------------------------
// 10. Floating Glass Magnifier Lens Drag & Search Trigger
// ----------------------------------------------------
function initMagnifierDrag() {
  const magnifier = document.getElementById("glass-magnifier");
  if (!magnifier) return;

  let isPointerDown = false;
  let startPointerX = 0, startPointerY = 0;
  let startX = 0, startY = 0;
  let currentX = 0, currentY = 0;
  let hasMoved = false;

  const onPointerDown = (e) => {
    isPointerDown = true;
    hasMoved = false;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    try {
      magnifier.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const onPointerMove = (e) => {
    if (!isPointerDown) return;
    if (Math.hypot(e.clientX - startPointerX, e.clientY - startPointerY) > 6) {
      hasMoved = true;
      magnifier.style.cursor = "grabbing";
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      magnifier.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
  };

  const onPointerUp = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    magnifier.style.cursor = "grab";
    try {
      magnifier.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Clean tap/click opens the Search Modal
    if (!hasMoved) {
      openSearchModal();
    }
  };

  magnifier.addEventListener("pointerdown", onPointerDown);
  magnifier.addEventListener("pointermove", onPointerMove);
  magnifier.addEventListener("pointerup", onPointerUp);
  magnifier.addEventListener("pointercancel", onPointerUp);

  magnifier.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSearchModal();
    }
  });
}

initMagnifierDrag();
initLiquidGlassEffect();
