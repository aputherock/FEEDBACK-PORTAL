/**
 * CTMC Feedback Portal — script.js
 * Author: Mr. Apurba Goswami
 * Features: SVG icons, 3D tilt cards, glassmorphism modals,
 *           WhatsApp integration, particles, ripple, form validation
 * Future scope: Replace #bgCanvas with Three.js (see bottom of file)
 *
 * FIXES APPLIED:
 * 1. Removed space in BBA > MD phone number ("9181007 34089" → "918100734089")
 * 2. Renamed p.png / s.png to pinki.png / shreyasi.png (case-safe, descriptive)
 * 3. Added console.warn in onerror so missing images are visible in DevTools
 */

"use strict";

/* ============================================================
   FACULTY MAPPING
   ──────────────────────────────────────────────────────────
   HOW TO ADD FACULTY PHOTOS:
   1. Create a folder named  "faculty-images"  next to index.html
   2. Add each teacher's photo inside it (jpg/png/webp)
   3. Set the "image" field to the filename, e.g:
         image: 'faculty-images/priya.jpg'
   4. If image is missing → SVG person fallback shows automatically

   WHATSAPP PHONE FORMAT: country code + number, no spaces or +
   Example India: 919876543210  (91 = India code)

   ⚠️  IMPORTANT FOR MOBILE (Android/iOS servers are case-sensitive):
       Make sure your actual filenames on the server EXACTLY match
       what is written here — lowercase, no extra spaces.
   ============================================================ */

const facultyData = {
  BCA: [
    {
      name: "Prof. Apurba Goswami",
      title: "Faculty From BCA Department",
      phone: "919547173980",
      image: "./bg_images/apu.jpg",
    },
    {
      name: "Mr. Vikash Kumar",
      title: "HOD from BCA Department",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",           // ✅ FIX: was "918100734089" — no spaces
      image: "./bg_images/MD.png",
    },
  ],

  BBA: [
    {
      name: "Mr. Vikash Kumar",
      title: "HOD",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",           // ✅ FIX: was "9181007 34089" (had a space — broke WhatsApp)
      image: "./bg_images/MD.png",
    },
    // {
    //   name: "Mr. Aman Bose",
    //   title: "Faculty – BBA Department",
    //   phone: "91XXXXXXXXXX",
    //   image: "faculty-images/bba3.jpg",
    // },
  ],

  "Hospital Management": [
    {
      name: "Prof Mr. Vikash Kumar",
      title: "HOD",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",
      image: "./bg_images/MD.png",
    },
    {
      name: "Prof MS. Pinki Kuila",
      title: "Faculty – Hospital Mgmt",
      phone: "917063231685",
      image: "./bg_images/pinki.png",    // ✅ FIX: was "bg_images/p.png" — renamed to avoid case issues on mobile
    },
    {
      name: "Prof Ms. Shreyasi Maity",
      title: "Faculty – Hospital Mgmt",
      phone: "917029353339",
      image: "./bg_images/shreyasi.png", // ✅ FIX: was "bg_images/s.png" — renamed to avoid case issues on mobile
    },
  ],

  "Hotel Management": [
    {
      name: "Mr. Abhik Dash",
      title: "Faculty from Hotel Management",
      phone: "917602040014",
      image: "./bg_images/a.png",
    },
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",
      image: "./bg_images/MD.png",
    },
    {
      name: "Mr. Vikash Kumar",
      title: "HOD",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
  ],

  BMLT: [
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",
      image: "./bg_images/MD.png",
    },
    {
      name: "Mr. Vikash Kumar",
      title: "HOD",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
  ],

  "Multimedia & Animation": [
    {
      name: "Prof Mr. Ritamvar Jana",
      title: "Faculty – Multimedia & Animation",
      phone: "917076709757",   // ← update with correct number if different
      image: "./bg_images/ritamvar.png",
    },
    {
      name: "Mr. Vikash Kumar",
      title: "HOD",
      phone: "919002143980",
      image: "./bg_images/hod.jpg",
    },
    {
      name: "Mr. Monojit Das -MD",
      title: "MD (Manager Director)",
      phone: "918100734089",
      image: "./bg_images/MD.png",
    },
  ],
};

/* Legacy single-entry map kept for back-compatibility (WA modal) — auto-built from facultyData */
const FACULTY_MAP = Object.fromEntries(
  Object.entries(facultyData).map(([dept, list]) => [
    dept,
    { ...list[0], dept },
  ]),
);

/* ============================================================
   SVG ICON MAP — for form modal header (injected by JS)
   Each key matches a department name in FACULTY_MAP
   ============================================================ */
const DEPT_SVG_ICONS = {
  BCA: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#00d4ff">
      <rect x="4" y="8" width="40" height="26" rx="3" stroke="currentColor" stroke-width="2.5" fill="rgba(0,212,255,0.10)"/>
      <path d="M16 42h16M24 34v8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="9" y="13" width="11" height="9" rx="1.5" fill="currentColor" opacity="0.25"/>
      <path d="M25 15h10M25 20h8M25 24h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  BBA: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#a855f7">
      <rect x="5"  y="30" width="8" height="13" rx="2" fill="currentColor" opacity="0.35"/>
      <rect x="20" y="20" width="8" height="23" rx="2" fill="currentColor" opacity="0.6"/>
      <rect x="35" y="10" width="8" height="33" rx="2" fill="currentColor" opacity="0.9"/>
      <path d="M9 30 L24 20 L39 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 2" opacity="0.7"/>
    </svg>`,

  "Hospital Management": `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#22c55e">
      <rect x="6" y="14" width="36" height="30" rx="3" stroke="currentColor" stroke-width="2.5" fill="rgba(34,197,94,0.10)"/>
      <rect x="16" y="6" width="16" height="8" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
      <path d="M24 22v10M19 27h10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <rect x="10" y="36" width="7" height="8" rx="1" fill="currentColor" opacity="0.35"/>
      <rect x="31" y="36" width="7" height="8" rx="1" fill="currentColor" opacity="0.35"/>
    </svg>`,

  "Hotel Management": `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#f59e0b">
      <rect x="4" y="16" width="40" height="28" rx="3" stroke="currentColor" stroke-width="2.5" fill="rgba(245,158,11,0.08)"/>
      <path d="M4 24h40" stroke="currentColor" stroke-width="2" opacity="0.4"/>
      <rect x="8"  y="28" width="7" height="6" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="21" y="28" width="7" height="6" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="34" y="28" width="7" height="6" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="18" y="36" width="13" height="8" rx="1" fill="currentColor" opacity="0.4"/>
      <path d="M16 16V11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" stroke="currentColor" stroke-width="2"/>
    </svg>`,

  BMLT: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#ef4444">
      <circle cx="20" cy="18" r="11" stroke="currentColor" stroke-width="2.5" fill="rgba(239,68,68,0.08)"/>
      <circle cx="20" cy="18" r="5.5" stroke="currentColor" stroke-width="1.5" fill="rgba(239,68,68,0.15)"/>
      <circle cx="20" cy="18" r="2" fill="currentColor" opacity="0.8"/>
      <path d="M28 26l10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M6 42h36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M16 42v-7M22 42v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

  "Multimedia & Animation": `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#f472b6">
      <rect x="3" y="10" width="8" height="28" rx="2" stroke="currentColor" stroke-width="2" fill="rgba(244,114,182,0.10)"/>
      <rect x="4.5" y="13" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="4.5" y="20" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="4.5" y="27" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="37" y="10" width="8" height="28" rx="2" stroke="currentColor" stroke-width="2" fill="rgba(244,114,182,0.10)"/>
      <rect x="38.5" y="13" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="38.5" y="20" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="38.5" y="27" width="5" height="4" rx="1" fill="currentColor" opacity="0.5"/>
      <rect x="11" y="13" width="26" height="18" rx="2.5" stroke="currentColor" stroke-width="2" fill="rgba(244,114,182,0.07)"/>
      <path d="M20 17.5 L20 27 L30 22.5 Z" fill="currentColor" opacity="0.75"/>
      <path d="M13 36 Q18 33 24 36 Q30 39 35 36" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
      <circle cx="16" cy="42" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="43" r="1.5" fill="currentColor" opacity="0.7"/>
      <circle cx="32" cy="42" r="1.5" fill="currentColor" opacity="0.5"/>
    </svg>`,
};

/* ── Active state ── */
let activeDept = null;
let activeFaculty = null;
let formData = {};

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initBgCanvas();
  initCards();
  initForm();
  initModals();
  initRipple();
  initScrollAnimations();
  initLiveValidation();

  // Scroll hint click
  const hint = document.querySelector(".scroll-hint");
  if (hint) {
    hint.addEventListener("click", () =>
      document
        .getElementById("departments")
        .scrollIntoView({ behavior: "smooth" }),
    );
  }

  // WA send button
  document.getElementById("waSendBtn").addEventListener("click", function () {
    const phone = this.dataset.phone;
    const text = this.dataset.waText;
    window.open(
      `https://wa.me/${phone}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
    showToast();
  });

  // WA back button → go back to faculty picker
  document.getElementById("waBackBtn").addEventListener("click", () => {
    hideModal("waModal");
    setTimeout(() => {
      if (formData.dept) showFacultyPicker(formData.dept);
    }, 200);
  });
});

/* ============================================================
   PARTICLES
   ============================================================ */
function initParticles() {
  const container = document.getElementById("particles");
  const colors = ["#00d4ff", "#a855f7", "#22c55e", "#f59e0b"];
  const count = window.innerWidth < 600 ? 20 : 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 2.5 + 1}px;
      height: ${Math.random() * 2.5 + 1}px;
      background: ${color};
      --dur: ${Math.random() * 12 + 6}s;
      --delay: -${Math.random() * 10}s;
      box-shadow: 0 0 6px ${color};
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   BACKGROUND CANVAS — Future Three.js slot
   ============================================================ */
function initBgCanvas() {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let w, h;
  const dots = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const dotCount = window.innerWidth < 600 ? 25 : 50;
  for (let i = 0; i < dotCount; i++) {
    dots.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,212,255,0.4)";
      ctx.fill();
    });
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}

/* ============================================================
   3D TILT — Department Cards
   ============================================================ */
function initCards() {
  document.querySelectorAll(".dept-card").forEach((card) => {
    const dept = card.dataset.dept;
    const color = card.dataset.color;
    card.style.setProperty("--card-color", color);

    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 700) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1)";
      card.style.transform =
        "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });

    card.addEventListener("click", () => openFormModal(dept));

    card.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        const rect = card.getBoundingClientRect();
        const dx = (t.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const dy = (t.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) scale(1.01)`;
      },
      { passive: true },
    );

    card.addEventListener("touchend", () => {
      card.style.transition = "transform 0.5s ease";
      card.style.transform = "none";
    });
  });
}

/* ============================================================
   FORM MODAL
   ============================================================ */
function openFormModal(dept) {
  activeDept = dept;

  const iconEl = document.getElementById("formDeptIcon");
  iconEl.innerHTML =
    DEPT_SVG_ICONS[dept] ||
    `<svg viewBox="0 0 48 48" fill="none" width="32" height="32"><circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2.5"/></svg>`;

  document.getElementById("formDeptName").textContent = dept + " Department";
  document.getElementById("feedbackForm").reset();
  document.getElementById("department").value = dept;
  resetTypeTab("Complaint");
  clearAllErrors();
  showModal("formModal");
}

function closeFormModal() {
  hideModal("formModal");
}

/* ============================================================
   FORM VALIDATION & SUBMIT
   ============================================================ */
function initForm() {
  document.getElementById("typeTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".type-tab");
    if (!tab) return;
    document
      .querySelectorAll(".type-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("feedbackType").value = tab.dataset.type;
  });

  document.getElementById("feedbackForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateForm()) buildAndShowWa();
  });
}

function validateForm() {
  let valid = true;
  ["studentName", "classId", "semester", "message"].forEach((id) => {
    const el = document.getElementById(id);
    const grp = el.closest(".form-group");
    if (!el.value.trim()) {
      grp.classList.add("has-error");
      valid = false;
    } else {
      grp.classList.remove("has-error");
    }
  });
  return valid;
}

function clearAllErrors() {
  document
    .querySelectorAll(".form-group")
    .forEach((g) => g.classList.remove("has-error"));
}

function resetTypeTab(type) {
  document
    .querySelectorAll(".type-tab")
    .forEach((t) => t.classList.toggle("active", t.dataset.type === type));
  document.getElementById("feedbackType").value = type;
}

function initLiveValidation() {
  ["studentName", "classId", "semester", "message"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => {
      const grp = el.closest(".form-group");
      el.value.trim()
        ? grp.classList.remove("has-error")
        : grp.classList.add("has-error");
    });
    el.addEventListener("input", () => {
      if (el.value.trim())
        el.closest(".form-group").classList.remove("has-error");
    });
  });
}

/* ============================================================
   WHATSAPP INTEGRATION
   ============================================================ */
function buildAndShowWa() {
  const name = document.getElementById("studentName").value.trim();
  const classId = document.getElementById("classId").value.trim();
  const semester = document.getElementById("semester").value;
  const dept = document.getElementById("department").value;
  const type = document.getElementById("feedbackType").value;
  const message = document.getElementById("message").value.trim();

  formData = { name, classId, semester, dept, type, message };

  closeFormModal();
  setTimeout(() => showFacultyPicker(dept), 200);
}

/* ============================================================
   FACULTY PICKER MODAL
   ============================================================ */
function showFacultyPicker(dept) {
  const list = facultyData[dept] || [];
  const grid = document.getElementById("facultyGrid");
  const title = document.getElementById("facultyPickerTitle");
  const subtitle = document.getElementById("facultyPickerSubtitle");

  title.textContent = "Choose Your Faculty";
  subtitle.textContent = dept + " Department";

  grid.innerHTML = "";

  list.forEach((faculty, idx) => {
    const card = document.createElement("div");
    card.className = "faculty-card";
    card.style.animationDelay = idx * 0.12 + "s";

    card.innerHTML = `
      <div class="fc-avatar-wrap">
        <img src="${faculty.image || ""}" alt="${faculty.name}" class="fc-avatar-img"
          onerror="console.warn('CTMC: Image failed to load →', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="fc-avatar-fallback" style="display:none">
          <svg viewBox="0 0 48 48" fill="none" width="34" height="34">
            <circle cx="24" cy="18" r="10" stroke="currentColor" stroke-width="2.5"/>
            <path d="M8 44c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <div class="fc-info">
        <p class="fc-name">${faculty.name}</p>
        <p class="fc-title">${faculty.title}</p>
        <p class="fc-phone">
          <svg viewBox="0 0 24 24" width="11" height="11" fill="#25d366" style="flex-shrink:0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          +${faculty.phone}
        </p>
      </div>
      <button class="fc-send-btn" data-idx="${idx}">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Send Message
      </button>
    `;

    card.querySelector(".fc-send-btn").addEventListener("click", () => {
      activeFaculty = faculty;
      hideModal("facultyPickerModal");
      setTimeout(() => showWaModalForFaculty(faculty), 200);
    });

    grid.appendChild(card);
  });

  showModal("facultyPickerModal");
}

function showWaModalForFaculty(faculty) {
  const { name, classId, semester, dept, type, message } = formData;

  const waText = `*CTMC Feedback Portal*
━━━━━━━━━━━━━━━━━━

*Name:* ${name}
*Class ID:* ${classId}
*Semester:* ${semester}
*Department:* ${dept}
*Type:* ${type}

*Message:*
${message}

━━━━━━━━━━━━━━━━━━
_Sent via CTMC Feedback Portal_`;

  document.getElementById("waFacultyName").textContent = faculty.name;
  document.getElementById("waFacultyTitle").textContent = faculty.title;
  document.getElementById("waPhone").textContent = "+" + faculty.phone;
  document.getElementById("waMessageBox").textContent = waText;

  const imgEl = document.getElementById("waFacultyImg");
  const fallbackEl = document.getElementById("waAvatarFallback");
  if (faculty.image) {
    imgEl.src = faculty.image;
    imgEl.alt = faculty.name;
    imgEl.style.display = "block";
    fallbackEl.style.display = "none";
    // ✅ FIX: also handle load error in WA modal image
    imgEl.onerror = function () {
      console.warn("CTMC: WA modal image failed to load →", this.src);
      this.style.display = "none";
      fallbackEl.style.display = "flex";
    };
  } else {
    imgEl.style.display = "none";
    fallbackEl.style.display = "flex";
  }

  const sendBtn = document.getElementById("waSendBtn");
  sendBtn.dataset.waText = encodeURIComponent(waText);
  sendBtn.dataset.phone = faculty.phone;

  showModal("waModal");
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function showModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";
}

function hideModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "";
}

function initModals() {
  document
    .getElementById("closeFormModal")
    .addEventListener("click", closeFormModal);
  document
    .getElementById("closeWaModal")
    .addEventListener("click", () => hideModal("waModal"));
  document
    .getElementById("closeFacultyPicker")
    .addEventListener("click", () => hideModal("facultyPickerModal"));

  ["formModal", "waModal", "facultyPickerModal"].forEach((id) => {
    document.getElementById(id).addEventListener("click", function (e) {
      if (e.target === this) hideModal(id);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideModal("formModal");
      hideModal("waModal");
      hideModal("facultyPickerModal");
    }
  });
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast() {
  const toast = document.getElementById("successToast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ============================================================
   RIPPLE
   ============================================================ */
function initRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-btn, .submit-btn, .wa-send-btn");
    if (!btn) return;
    const rc = btn.querySelector(".btn-ripple");
    if (!rc) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const el = document.createElement("span");
    el.className = "ripple-circle";
    el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
    rc.appendChild(el);
    setTimeout(() => el.remove(), 600);
  });
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.animationPlayState = "running";
          obs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".dept-card").forEach((card) => {
    card.style.animationPlayState = "paused";
    obs.observe(card);
  });
}

/* ============================================================
   FUTURE THREE.JS SLOT
   ============================================================
   Replace initBgCanvas() body with:

   const scene    = new THREE.Scene();
   const camera   = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true });
   renderer.setSize(innerWidth, innerHeight);
   renderer.setPixelRatio(devicePixelRatio);
   camera.position.z = 5;
   // ... add geometry, shaders, animation loop
   // On resize: camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(...)
   ============================================================ */