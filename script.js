// Handle navbar toggle for mobile
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const header = document.getElementById("siteHeader");
const backToTopBtn = document.getElementById("backToTop");

// Toggle mobile menu
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when a link is clicked (mobile)
  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Sticky header shadow + back to top visibility
window.addEventListener("scroll", () => {
  const offset = window.scrollY;

  if (header) {
    if (offset > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (backToTopBtn) {
    if (offset > 260) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }
});

// Back to top button
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Intersection Observer for reveal animations
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  // Fallback: if IntersectionObserver not supported, just show them
  revealElements.forEach((el) => el.classList.add("in-view"));
}

// Animated counters (on home page)
const counters = document.querySelectorAll(".counter");
const runCounters = () => {
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target") || "0", 10);
    let current = 0;
    const duration = 1800;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      current = Math.floor(progress * target);
      counter.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toString();
      }
    };

    requestAnimationFrame(update);
  });
};

// Trigger counters when stats section is in view
const statsSection = document.querySelector(".section-stats");
if (statsSection && counters.length) {
  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounters();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  } else {
    // Fallback: run immediately
    runCounters();
  }
}

// Utility: simple email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// CONTACT FORM VALIDATION
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    const statusEl = document.getElementById("contactStatus");
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.className = "form-status";
    }

    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const projectTypeSelect = contactForm.querySelector("#projectType");
    const messageInput = contactForm.querySelector("#message");

    let isValid = true;

    const setError = (input, message) => {
      const group = input.closest(".form-group");
      if (!group) return;
      group.classList.add("invalid");
      const errorEl = group.querySelector(".error-message");
      if (errorEl) errorEl.textContent = message || "";
      isValid = false;
    };

    const clearError = (input) => {
      const group = input.closest(".form-group");
      if (!group) return;
      group.classList.remove("invalid");
      const errorEl = group.querySelector(".error-message");
      if (errorEl) errorEl.textContent = "";
    };

    // Name validation
    if (!nameInput.value.trim()) {
      setError(nameInput, "Please enter your name.");
    } else {
      clearError(nameInput);
    }

    // Email validation
    if (!emailInput.value.trim()) {
      setError(emailInput, "Please enter your email.");
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, "Please enter a valid email address.");
    } else {
      clearError(emailInput);
    }

    // Project type
    if (!projectTypeSelect.value) {
      setError(projectTypeSelect, "Please select a project type.");
    } else {
      clearError(projectTypeSelect);
    }

    // Message
    if (!messageInput.value.trim()) {
      setError(messageInput, "Please tell us a bit about your project.");
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, "Message should be at least 10 characters.");
    } else {
      clearError(messageInput);
    }

    if (!isValid) {
      // prevent submission and show errors
      event.preventDefault();
      if (statusEl) {
        statusEl.textContent = "Please fix the highlighted fields and try again.";
        statusEl.classList.add("error");
      }
    } else {
      // allow normal form submission (will POST to form action)
      if (statusEl) {
        statusEl.textContent = "Submitting…";
        statusEl.classList.add("submitting");
      }
      // do not call event.preventDefault() so the browser submits the form
    }
  });
}

// LOGIN FORM VALIDATION
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const loginStatus = document.getElementById("loginStatus");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginStatus.textContent = "";
    loginStatus.className = "form-status";

    const emailInput = loginForm.querySelector("#loginEmail");
    const passwordInput = loginForm.querySelector("#loginPassword");

    let isValid = true;

    const setError = (input, message) => {
      const group = input.closest(".form-group");
      if (!group) return;
      group.classList.add("invalid");
      const errorEl = group.querySelector(".error-message");
      if (errorEl) errorEl.textContent = message || "";
      isValid = false;
    };

    const clearError = (input) => {
      const group = input.closest(".form-group");
      if (!group) return;
      group.classList.remove("invalid");
      const errorEl = group.querySelector(".error-message");
      if (errorEl) errorEl.textContent = "";
    };

    // Email
    if (!emailInput.value.trim()) {
      setError(emailInput, "Please enter your email.");
    } else if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, "Please enter a valid email address.");
    } else {
      clearError(emailInput);
    }

    // Password
    if (!passwordInput.value.trim()) {
      setError(passwordInput, "Please enter your password.");
    } else if (passwordInput.value.trim().length < 6) {
      setError(passwordInput, "Password should be at least 6 characters.");
    } else {
      clearError(passwordInput);
    }

    if (isValid) {
      loginStatus.textContent = "Login form validated. (Demo only — no real authentication.)";
      loginStatus.classList.add("success");
      loginForm.reset();
    } else {
      loginStatus.textContent = "Please fix the errors above.";
      loginStatus.classList.add("error");
    }
  });
}

// REGISTER FORM VALIDATION (AFTER ✅)
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {

    const nameInput = document.getElementById("regName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("regConfirmPassword");

    let isValid = true;

    const setError = (input, message) => {
      const group = input.closest(".form-group");
      group.classList.add("invalid");
      group.querySelector(".error-message").textContent = message;
      isValid = false;
    };

    const clearError = (input) => {
      const group = input.closest(".form-group");
      group.classList.remove("invalid");
      group.querySelector(".error-message").textContent = "";
    };

    // Name
    if (!nameInput.value.trim()) setError(nameInput, "Enter your name");
    else clearError(nameInput);

    // Email
    if (!emailInput.value.trim()) setError(emailInput, "Enter email");
    else clearError(emailInput);

    // Password
    if (passwordInput.value.length < 6)
      setError(passwordInput, "Minimum 6 characters");
    else clearError(passwordInput);

    // Confirm password
    if (confirmPasswordInput.value !== passwordInput.value)
      setError(confirmPasswordInput, "Passwords do not match");
    else clearError(confirmPasswordInput);

    // ⛔ STOP ONLY IF INVALID
    if (!isValid) {
      event.preventDefault();
    }
    // ✅ IF VALID → form submits normally to Register.php
  });
}

// Set current year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}
