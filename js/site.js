/**
 * THE SECOND SERVE — site script
 * No libraries. Every effect checks prefers-reduced-motion.
 */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  document.addEventListener("DOMContentLoaded", () => {
    header();
    menu();
    splitText();
    marquees();
    reveals();
    counters();
    steps();
    faq();
    copyButtons();
    if (!reduce && finePointer) { tilt(); magnet(); }
    if (!reduce) parallax();
    if (!reduce) window.addEventListener("load", () => setTimeout(serve, 650), { once: true });
  });

  /* Header turns to frosted glass once you scroll */
  function header() {
    const el = $("[data-header]");
    if (!el) return;
    const update = () => el.classList.toggle("is-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* Full-screen phone menu */
  function menu() {
    const btn = $("[data-menu-btn]");
    const panel = $("[data-menu]");
    if (!btn || !panel) return;
    panel.hidden = false;
    const label = $(".menu-label", btn);
    const set = (open) => {
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    btn.addEventListener("click", () => set(!document.body.classList.contains("menu-open")));
    $$("a", panel).forEach((a) => a.addEventListener("click", () => set(false)));
    document.addEventListener("click", (e) => {
      if (document.body.classList.contains("menu-open") && !panel.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { set(false); btn.focus(); }
    });
    window.addEventListener("resize", () => { if (window.innerWidth > 1080) set(false); });
  }

  /* Headline words blur in one after another */
  function splitText() {
    $$("[data-split]").forEach((el) => {
      const text = el.textContent.trim();
      el.setAttribute("aria-label", text);
      el.textContent = "";
      text.split(/\s+/).forEach((word, i) => {
        const span = document.createElement("span");
        span.className = "w";
        span.setAttribute("aria-hidden", "true");
        span.style.setProperty("--i", i);
        span.textContent = word;
        el.append(span, " ");
      });
    });
  }

  /* Duplicate marquee content so the loop is seamless */
  function marquees() {
    const track = $("[data-photo-marquee] .photo-track");
    if (track) {
      [...track.children].forEach((fig) => {
        const c = fig.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        $$("img", c).forEach((img) => (img.alt = ""));
        track.append(c);
      });
    }
    const ticker = $("[data-marquee]");
    if (ticker) {
      const list = $(".ticker-list", ticker);
      const clone = list.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      ticker.append(clone);
    }
  }

  /* Fade-and-unblur sections as they scroll into view */
  function reveals() {
    // Clipped elements can't be observed directly (a fully clipped box never "intersects"),
    // so we watch their parent and reveal all its clipped children together.
    const els = $$(".reveal-up");
    const clipParents = [...new Set($$(".reveal-clip").map((el) => el.parentElement))];
    const show = (el) => {
      if (el.classList.contains("reveal-up")) el.classList.add("is-in");
      else $$(":scope > .reveal-clip", el).forEach((c) => c.classList.add("is-in"));
    };
    if (reduce || !("IntersectionObserver" in window)) { [...els, ...clipParents].forEach(show); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    [...els, ...clipParents].forEach((el) => io.observe(el));
  }

  /* Numbers count up the first time they are seen */
  function counters() {
    const els = $$("[data-count]");
    const fmt = (n, el) => (el.dataset.prefix || "") + Math.round(n).toLocaleString("en-US");
    if (reduce || !("IntersectionObserver" in window)) return;
    els.forEach((el) => (el.textContent = fmt(0, el)));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const to = Number(el.dataset.count);
        const dur = 1600;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(2, -10 * p);
          el.textContent = fmt(to * (p === 1 ? 1 : eased), el);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* How it works: active step swaps the sticky photo, rail fills as you scroll */
  function steps() {
    const wrap = $("[data-steps]");
    if (!wrap) return;
    const items = $$("[data-step]", wrap);
    const imgs = $$("[data-step-img]", wrap);
    const fill = $("[data-steps-fill]", wrap);
    const rail = $(".steps-wrap", wrap);
    const activate = (i) => {
      items.forEach((el, n) => el.classList.toggle("is-active", n === i));
      imgs.forEach((el) => el.classList.toggle("is-active", Number(el.dataset.stepImg) === i));
    };
    let current = 0;
    let ticking = false;
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let best = 0;
      items.forEach((el, n) => { if (el.getBoundingClientRect().top < mid) best = n; });
      if (best !== current) { current = best; activate(best); }
      if (fill && rail) {
        const r = rail.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        fill.style.setProperty("--p", p.toFixed(3));
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* "Copy email" buttons: work even when the device has no email app for mailto: links */
  function copyButtons() {
    $$("[data-copy]").forEach((btn) => {
      const label = btn.textContent;
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copy;
        let ok = false;
        try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
          const t = document.createElement("textarea");
          t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
          document.body.append(t); t.select();
          try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
          t.remove();
        }
        btn.textContent = ok ? "Email copied" : text;
        setTimeout(() => (btn.textContent = label), 2200);
      });
    });
  }

  /* FAQ opens and closes with a smooth height animation */
  function faq() {
    $$("[data-faq] details").forEach((d) => {
      const summary = $("summary", d);
      const body = $(".faq-body", d);
      if (!summary || !body || reduce) return;
      summary.addEventListener("click", (e) => {
        e.preventDefault();
        if (d.dataset.animating) return;
        d.dataset.animating = "1";
        const done = () => delete d.dataset.animating;
        if (d.open) {
          const a = body.animate([{ height: body.offsetHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 380, easing: "cubic-bezier(.65,0,.35,1)" });
          a.onfinish = () => { d.open = false; done(); };
        } else {
          d.open = true;
          const h = body.offsetHeight;
          const a = body.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 460, easing: "cubic-bezier(.22,.8,.2,1)" });
          a.onfinish = done;
        }
      });
    });
  }

  /* Cards and photos tilt slightly toward the cursor */
  function tilt() {
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* Primary buttons: fill grows from where the cursor enters, button leans toward it */
  function magnet() {
    $$("[data-magnet]").forEach((el) => {
      const setOrigin = (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--fx", ((e.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--fy", ((e.clientY - r.top) / r.height) * 100 + "%");
      };
      el.addEventListener("pointerenter", setOrigin);
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(x * 0.18).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", (e) => { setOrigin(e); el.style.transform = ""; });
    });
  }

  /* Photos drift slightly slower than the page as you scroll */
  function parallax() {
    const imgs = $$("[data-parallax]");
    if (!imgs.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      imgs.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const off = (r.top + r.height / 2 - vh / 2) * -0.06;
        img.style.setProperty("--py", Math.max(-28, Math.min(28, off)).toFixed(1) + "px");
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* A ball is served across the court once, bounces twice and stops at the net */
  function serve() {
    const hero = $("[data-hero]");
    const outer = $("[data-serve]");
    if (!hero || !outer || !outer.animate) return;
    const inner = $(".serve-y", outer);
    const ball = $(".serve-ball", outer);
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    const size = ball.offsetWidth || 32;
    const mobile = w < 640;
    const photo = $(".hero-photo", hero);
    const photoTop = photo ? photo.getBoundingClientRect().top - hero.getBoundingClientRect().top : h;
    const ground = mobile ? photoTop - size - 14 : h - 52 - size;
    const startY = h * 0.14;
    const x = (f) => `translateX(${(w * f - size / 2).toFixed(1)}px)`;
    const y = (v) => `translateY(${v.toFixed(1)}px)`;

    outer.style.opacity = "1";
    const duration = 2300;
    // after the last bounce the ball fades out and is removed
    outer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: duration + 150, easing: "ease-out", fill: "forwards" })
      .onfinish = () => outer.remove();
    outer.animate(
      [
        { transform: `translateX(${-size * 2}px)`, offset: 0 },
        { transform: x(mobile ? 0.34 : 0.3), offset: 0.42 },
        { transform: x(mobile ? 0.44 : 0.41), offset: 0.8 },
        { transform: x(mobile ? 0.48 : 0.46), offset: 1, easing: "ease-out" },
      ],
      { duration, fill: "forwards", easing: "linear" }
    );
    inner.animate(
      [
        { transform: y(startY), offset: 0, easing: "cubic-bezier(.55,0,1,.45)" },
        { transform: y(ground), offset: 0.42, easing: "cubic-bezier(0,.55,.45,1)" },
        { transform: y(ground - h * 0.2), offset: 0.61, easing: "cubic-bezier(.55,0,1,.45)" },
        { transform: y(ground), offset: 0.8, easing: "cubic-bezier(0,.55,.45,1)" },
        { transform: y(ground - h * 0.06), offset: 0.89, easing: "cubic-bezier(.55,0,1,.45)" },
        { transform: y(ground), offset: 0.97 },
        { transform: y(ground), offset: 1 },
      ],
      { duration, fill: "forwards" }
    );
    window.addEventListener("resize", () => (outer.style.opacity = "0"), { once: true });
    ball.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(820deg)" }], { duration: duration + 300, fill: "forwards", easing: "cubic-bezier(.2,.6,.3,1)" });
  }
})();
