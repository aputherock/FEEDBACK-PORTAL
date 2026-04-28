'use strict';

/* ---- Department Config ---- */
const DEPT_CONFIG = {
  'BCA':                    { icon:'💻', phone:'9547173980', color:'#6c63ff', faculty:'Prof Mr. Apurba Goswami' },
  'Hotel Management':       { icon:'🏨', phone:'9547173980', color:'#f59e0b', faculty:'Prof. Sneha Sharma' },
  'Hospital Management':    { icon:'🏥', phone:'9547173980', color:'#10b981', faculty:'Prof. Anita Verma' },
  'Multimedia & Animation': { icon:'🎨', phone:'9547173980', color:'#ec4899', faculty:'Prof. Arjun Mehta' }
};

let currentDept = null;
let feedbackType = 'Feedback';

/* ---- Detect touch device ---- */
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

/* ---- DOM refs ---- */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const feedbackForm = document.getElementById('feedbackForm');
const studentName  = document.getElementById('studentName');
const rollNumber   = document.getElementById('rollNumber');
const deptField    = document.getElementById('deptField');
const semesterSel  = document.getElementById('semester');
const messageTA    = document.getElementById('message');
const charCount    = document.getElementById('charCount');
const submitBtn    = document.getElementById('submitBtn');
const toast        = document.getElementById('toast');
const toastMsg     = document.getElementById('toastMsg');
const toastIcon    = document.getElementById('toastIcon');
const modalDeptIcon= document.getElementById('modalDeptIcon');
const modalDeptName= document.getElementById('modalDeptName');
const modalDeptBadge=document.getElementById('modalDeptBadge');
const bgCanvas     = document.getElementById('bgCanvas');

/* ================================================
   INJECT CSS CUSTOM PROP --c PER CARD
   ================================================ */
document.querySelectorAll('.dept-card').forEach(card => {
  const c = card.getAttribute('data-color');
  if (c) card.style.setProperty('--c', c);
});

/* ================================================
   CANVAS PARTICLE BACKGROUND
   FIX: Proper resize + reduced particles on mobile
   ================================================ */
(function() {
  const ctx = bgCanvas.getContext('2d');
  const html = document.documentElement;
  let W, H, particles = [];

  function resize() {
    W = bgCanvas.width  = window.innerWidth;
    H = bgCanvas.height = window.innerHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });

  function isLight() {
    return html.getAttribute('data-theme') === 'light';
  }

  // FIX: Fewer particles on mobile for better performance
  const PARTICLE_COUNT = window.innerWidth < 600 ? 60 : 130;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 2 + 0.4;
      this.speed = Math.random() * 0.35 + 0.08;
      this.alpha = Math.random() * 0.55 + 0.1;
      const colors = isLight()
        ? ['#6c63ff', '#ec4899', '#f59e0b', '#10b981']
        : ['#6c63ff', '#ec4899', '#a78bfa', '#f59e0b'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.dx = (Math.random() - 0.5) * 0.35;
    }
    update() {
      this.y -= this.speed;
      this.x += this.dx;
      if (this.y < -5) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = isLight() ? this.alpha * 0.7 : this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = isLight() ? 10 : 7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let animId;
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  })();
})();

/* ================================================
   SCROLL REVEAL
   ================================================ */
document.querySelectorAll('.dept-card.reveal').forEach((el, i) => el.style.setProperty('--i', i));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 180 + i * 130);
  });
});

/* ================================================
   3D CARD TILT — DESKTOP ONLY
   FIX: Skip entirely on touch devices; they were
   causing sticky/frozen transforms on mobile
   ================================================ */
document.querySelectorAll('.dept-card').forEach(card => {

  // Desktop mouse tilt
  if (!isTouchDevice()) {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const dx  = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy  = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      card.style.transform = [
        `perspective(1000px)`,
        `rotateY(${dx * 14}deg)`,
        `rotateX(${-dy * 14}deg)`,
        `scale3d(1.05, 1.05, 1.05)`,
        `translateZ(8px)`
      ].join(' ');
      const shadowX = dx * 20;
      const shadowY = dy * 20;
      card.style.boxShadow = `
        ${shadowX}px ${shadowY + 20}px 60px rgba(0,0,0,0.55),
        0 0 0 1px rgba(255,255,255,0.08)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  }

  // Touch support — FIX: Simple scale pulse, NO 3D transforms
  card.addEventListener('touchstart', () => {
    card.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
    card.style.transform = 'scale(0.96)';
    card.style.boxShadow = `0 0 0 3px ${card.getAttribute('data-color') || '#6c63ff'}, 0 10px 40px rgba(0,0,0,0.5)`;
  }, { passive: true });

  card.addEventListener('touchend', () => {
    setTimeout(() => {
      card.style.transform = '';
      card.style.boxShadow = '';
    }, 180);
  });

  card.addEventListener('touchcancel', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ================================================
   OPEN MODAL
   ================================================ */
function openModal(dept) {
  const conf  = DEPT_CONFIG[dept];
  currentDept = dept;
  modalDeptIcon.textContent = conf.icon;
  modalDeptName.textContent = dept;
  modalDeptBadge.style.borderColor = conf.color + '55';
  deptField.value = dept;
  feedbackForm.reset();
  deptField.value = dept;
  charCount.textContent = '0';
  clearErrors();
  setActiveType('Feedback');
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Delay focus on mobile to avoid layout jump from keyboard
  setTimeout(() => {
    if (!isTouchDevice()) studentName.focus();
  }, 450);
}

document.querySelectorAll('.dept-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.getAttribute('data-dept')));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.getAttribute('data-dept'));
    }
  });
});

/* ================================================
   CLOSE MODAL
   ================================================ */
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  currentDept = null;
}
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
});

/* ================================================
   FEEDBACK TYPE TOGGLE
   ================================================ */
function setActiveType(type) {
  feedbackType = type;
  document.querySelectorAll('.type-btn').forEach(btn =>
    btn.classList.toggle('active', btn.getAttribute('data-type') === type)
  );
  document.getElementById('feedbackType').value = type;
}
document.querySelectorAll('.type-btn').forEach(btn =>
  btn.addEventListener('click', () => setActiveType(btn.getAttribute('data-type')))
);

/* ================================================
   CHAR COUNTER
   ================================================ */
messageTA.addEventListener('input', () => {
  const len = Math.min(messageTA.value.length, 500);
  if (messageTA.value.length > 500) messageTA.value = messageTA.value.slice(0, 500);
  charCount.textContent = len;
  charCount.style.color = len > 450 ? '#ef4444' : '';
});

/* ================================================
   VALIDATION
   ================================================ */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
}
function showError(field, errEl, msg) {
  field.classList.add('error');
  errEl.textContent = msg;
}
function validateForm() {
  clearErrors();
  let valid = true;
  const name = studentName.value.trim();
  const roll = rollNumber.value.trim();
  const sem  = semesterSel.value;
  const msg  = messageTA.value.trim();
  if (!name || name.length < 3) {
    showError(studentName, document.getElementById('nameError'), name ? 'Min 3 characters.' : 'Name is required.');
    valid = false;
  }
  if (!roll) {
    showError(rollNumber, document.getElementById('rollError'), 'Roll number is required.');
    valid = false;
  } else if (!/^[A-Za-z0-9]+$/.test(roll)) {
    showError(rollNumber, document.getElementById('rollError'), 'Letters and numbers only.');
    valid = false;
  }
  if (!sem) {
    showError(semesterSel, document.getElementById('semesterError'), 'Please select a semester.');
    valid = false;
  }
  if (!msg || msg.length < 10) {
    showError(messageTA, document.getElementById('msgError'), msg ? 'Min 10 characters.' : 'Message is required.');
    valid = false;
  }
  return valid;
}

/* ================================================
   RIPPLE
   ================================================ */
submitBtn.addEventListener('click', e => {
  const r   = submitBtn.getBoundingClientRect();
  const rip = document.createElement('span');
  rip.classList.add('ripple');
  rip.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:10px;height:10px;margin-left:-5px;margin-top:-5px`;
  submitBtn.appendChild(rip);
  setTimeout(() => rip.remove(), 600);
});

/* ================================================
   FORM SUBMIT → WHATSAPP
   ================================================ */
feedbackForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) return;

  const conf    = DEPT_CONFIG[currentDept];
  const dateStr = new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' });

  const waMsg = [
    `*EduVoice — Student ${feedbackType}*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    ` *Name:* ${studentName.value.trim()}`,
    ` *Roll No:* ${rollNumber.value.trim()}`,
    ` *Department:* ${currentDept}`,
    ` *Semester:* ${semesterSel.value}`,
    ` *Type:* ${feedbackType}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    ` *Message:*`,
    messageTA.value.trim(),
    `━━━━━━━━━━━━━━━━━━━━`,
    ` Submitted: ${dateStr}`,
    `_Sent via EduVoice Portal_`
  ].join('\n');

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    showToast('✅', `Redirecting to WhatsApp — ${conf.faculty}`);
    setTimeout(() => {
      closeModal();
      window.open(`https://wa.me/${conf.phone}?text=${encodeURIComponent(waMsg)}`, '_blank');
    }, 1200);
  }, 1600);
});

/* ================================================
   TOAST
   ================================================ */
let toastTimer;
function showToast(icon, msg, duration = 4000) {
  clearTimeout(toastTimer);
  toastIcon.textContent = icon;
  toastMsg.textContent  = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ================================================
   SMOOTH SCROLL CTA
   ================================================ */
document.querySelector('.cta-btn')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' });
});