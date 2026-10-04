/* ==========================================================
   CINEMATIC.JS — Opini Visual
   Small, dependency-free helpers for the portfolio page:
   1. Header state + mobile menu
   2. Active nav link while scrolling
   3. Scroll reveal (.reveal, .reveal-image)
   4. Hero video (loaded only when it is appropriate)
   5. Current year
   Portfolio grid and lightbox live in portfolio.js.
========================================================== */

(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* 1. Header + mobile menu */

    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");

    function onScroll() {
        if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setMenu(open) {
        if (!toggle || !nav) return;
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "Close" : "Menu";
        document.body.style.overflow = open ? "hidden" : "";
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            setMenu(!nav.classList.contains("is-open"));
        });

        nav.addEventListener("click", function (e) {
            if (e.target.closest("a")) setMenu(false);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("is-open")) {
                setMenu(false);
                toggle.focus();
            }
        });

        window.matchMedia("(min-width: 800px)").addEventListener("change", function (e) {
            if (e.matches) setMenu(false);
        });
    }


    /* 2. Active nav link */

    var navLinks = nav ? nav.querySelectorAll("a[href^='#']") : [];

    if (navLinks.length && "IntersectionObserver" in window) {
        var byId = {};
        navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) { a.classList.remove("is-active"); });
                var link = byId[entry.target.id];
                if (link) link.classList.add("is-active");
            });
        }, { rootMargin: "-45% 0px -50% 0px" });

        Object.keys(byId).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
        });
    }


    /* 3. Scroll reveal */

    var revealEls = document.querySelectorAll(".reveal, .reveal-image");

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }


    /* 4. Hero video: skipped for reduced motion, data saver, or slow connections */

    var heroVideo = document.querySelector(".hero__video");

    if (heroVideo) {
        var conn = navigator.connection || {};
        var slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");

        if (!reduceMotion && !slow) {
            heroVideo.addEventListener("playing", function () {
                heroVideo.classList.add("is-playing");
            }, { once: true });

            heroVideo.src = heroVideo.getAttribute("data-src");
            var playing = heroVideo.play();
            if (playing && playing.catch) playing.catch(function () { /* poster stays */ });
        }
    }


    /* 5. Year */

    document.querySelectorAll("[data-current-year]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

})();
