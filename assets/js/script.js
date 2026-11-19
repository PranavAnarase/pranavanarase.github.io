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
    if (target === "all" || target === category) {
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
// 6. Sliding Liquid Glass Tab Indicator
// ----------------------------------------------------
const glassTabIndicator = document.getElementById("glass-tab-indicator");

function updateGlassTabIndicator(activeBtn) {
  if (!glassTabIndicator || !activeBtn) return;
  const rect = activeBtn.getBoundingClientRect();
  const navRect = activeBtn.parentElement.parentElement.getBoundingClientRect();
  const left = rect.left - navRect.left;
  glassTabIndicator.style.width = `${rect.width}px`;
  glassTabIndicator.style.transform = `translateX(${left}px)`;
}

// ----------------------------------------------------
// 7. Page Navigation (About, Resume, Portfolio, Publications, Contact)
// ----------------------------------------------------
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

if (navigationLinks && pages) {
  navigationLinks.forEach(navBtn => {
    navBtn.addEventListener("click", function () {
      const targetPage = this.textContent.trim().toLowerCase();

      // Update active nav button
      navigationLinks.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      // Slide the Liquid Glass Indicator
      updateGlassTabIndicator(this);

      // Switch active article page
      let pageFound = false;
      pages.forEach(page => {
        const pageName = (page.dataset.page || "").trim().toLowerCase();
        if (pageName === targetPage) {
          page.classList.add("active");
          pageFound = true;
        } else {
          page.classList.remove("active");
        }
      });

      if (pageFound) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });

  // Position initial indicator on page load
  window.addEventListener("load", () => {
    const activeLink = document.querySelector(".navbar-link.active");
    if (activeLink) updateGlassTabIndicator(activeLink);
  });
  window.addEventListener("resize", () => {
    const activeLink = document.querySelector(".navbar-link.active");
    if (activeLink) updateGlassTabIndicator(activeLink);
  });
}

// ----------------------------------------------------
// 8. LiquidGlass WebGL Shader Initialization (ybouane/liquidglass)
// ----------------------------------------------------
async function initLiquidGlassEffect() {
  try {
    // Wait for fonts so geometry is stable
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Try dynamic module import of local liquidglass library
    const { LiquidGlass } = await import("./liquidglass.js");

    const rootEl = document.getElementById("portfolio-root") || document.body;
    const glassElements = [];

    // 1. Sliding Tab Indicator
    const indicatorEl = document.getElementById("glass-tab-indicator");
    if (indicatorEl) {
      indicatorEl.dataset.config = JSON.stringify({
        bevelMode: 0,
        cornerRadius: 18,
        zRadius: 16,
        blurAmount: 0.15,
        refraction: 0.85,
        chromAberration: 0.08,
        edgeHighlight: 0.25,
        shadowOpacity: 0.35,
        specular: 0.5
      });
      glassElements.push(indicatorEl);
    }

    // 2. Sidebar Profile Glass Card
    const sidebarGlass = document.getElementById("glass-sidebar-card");
    if (sidebarGlass) {
      sidebarGlass.dataset.config = JSON.stringify({
        cornerRadius: 22,
        zRadius: 18,
        blurAmount: 0.15,
        chromAberration: 0.06,
        refraction: 0.7,
        edgeHighlight: 0.18,
        tintStrength: 0.05
      });
      glassElements.push(sidebarGlass);
    }

    // 3. Floating Draggable Dome Magnifier Lens (bevelMode: 1)
    const magnifierEl = document.getElementById("glass-magnifier");
    if (magnifierEl && window.innerWidth > 768) {
      magnifierEl.dataset.config = JSON.stringify({
        bevelMode: 1, // Dome / half-sphere magnifier lens
        cornerRadius: 32,
        zRadius: 32,
        floating: true, // Draggable via Pointer Events
        blurAmount: 0,
        refraction: 1.25,
        edgeHighlight: 0.3,
        shadowOpacity: 0.35
      });
      glassElements.push(magnifierEl);
    }

    // 4. Interactive Glass Buttons (button: true)
    const glassButtons = document.querySelectorAll(".glass-btn");
    glassButtons.forEach(btn => {
      btn.dataset.config = JSON.stringify({
        button: true, // Tactile hover lift + press bevel flattening
        cornerRadius: 14,
        zRadius: 12,
        blurAmount: 0.2,
        specular: 0.5,
        edgeHighlight: 0.2
      });
      glassElements.push(btn);
    });

    if (glassElements.length > 0) {
      await LiquidGlass.init({
        root: rootEl,
        glassElements: glassElements
      });
      console.log("LiquidGlass (ybouane/liquidglass) initialized successfully with", glassElements.length, "elements.");
    }
  } catch (err) {
    console.warn("LiquidGlass WebGL initialization skipped or fallback active:", err);
  }
}

initLiquidGlassEffect();
