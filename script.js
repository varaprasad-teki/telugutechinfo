"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const menuToggle = $("#menuToggle");
    const siteNav = $("#siteNav");
    const themeToggle = $("#themeToggle");
    const progress = $("#scrollProgress");
    const backToTop = $("#backToTop");
    const toast = $("#siteToast");
    const year = $("#year");
    let toastTimer;
    let ticking = false;

    // Keep the footer current automatically.
    if (year) year.textContent = String(new Date().getFullYear());

    // Restore the theme only when the visitor previously selected one.
    const savedTheme = safeStorageGet("creator-hub-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);

    function safeStorageGet(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    }
    function safeStorageSet(key, value) {
      try { window.localStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
    }
    function setTheme(theme) {
      body.dataset.theme = theme;
      if (themeToggle) {
        const light = theme === "light";
        themeToggle.textContent = light ? "☾" : "☼";
        themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
        themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
      }
    }
    themeToggle?.addEventListener("click", () => {
      const nextTheme = body.dataset.theme === "light" ? "dark" : "light";
      setTheme(nextTheme);
      safeStorageSet("creator-hub-theme", nextTheme);
      announce(`${nextTheme === "light" ? "Light" : "Dark"} theme enabled`);
    });

    // Accessible mobile menu: close on navigation, Escape, and outside click.
    function closeMenu() {
      if (!menuToggle || !siteNav) return;
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
      body.classList.remove("menu-open");
    }
    menuToggle?.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuToggle.textContent = open ? "✕" : "☰";
      body.classList.toggle("menu-open", open);
    });
    $$("#siteNav a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (siteNav?.classList.contains("is-open") && !siteNav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 681px)").matches) closeMenu();
    }, { passive: true });

    // Scroll progress and back-to-top control are updated in one animation frame.
    function updateScrollUI() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (progress) progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
      backToTop?.classList.toggle("is-visible", window.scrollY > 520);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    }, { passive: true });
    updateScrollUI();
    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" }));

    // Reveal elements only as they enter the viewport; retain content for reduced-motion users.
    const revealTargets = $$(".feature-card, .section-heading, .embed-card, .subscribe-card, .cta-banner, .faq-card, .topic-ticker");
    if ("IntersectionObserver" in window && !reducedMotion()) {
      revealTargets.forEach((element, index) => {
        element.classList.add("reveal-on-scroll");
        element.style.setProperty("--reveal-delay", `${(index % 3) * 75}ms`);
      });
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
      revealTargets.forEach(element => observer.observe(element));
    }

    // Add a subtle pointer-following highlight on fine-pointer devices only.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $$(".feature-card, .faq-card, .subscribe-card").forEach(card => {
        card.addEventListener("pointermove", event => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
        }, { passive: true });
      });
    }

    // Small toast for useful feedback, without blocking navigation.
    function announce(message) {
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
    }
    function reducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    // Smooth in-page links with a safe fallback to native browser navigation.
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = $(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", id);
      });
    });
  });
})();
