const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el));

const heroMeta = document.querySelector('.hero-meta');
if (heroMeta) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 600) heroMeta.style.transform = `translateY(${y * 0.15}px)`;
  });
}

// Contact form submission
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const venture = form.venture.value;
    const message = form.message.value.trim();

    if (!name || !email || !venture || !message) {
      showStatus('error', 'Please fill in all required fields.');
      return;
    }

    // Disable submit
    submitBtn.disabled = true;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending… <span class="arrow">→</span>';

    try {
      // Collect form fields into a plain JSON payload
      const payload = {
        name:    form.name.value.trim(),
        email:   form.email.value.trim(),
        company: form.company.value.trim(),
        venture: form.venture.value,
        message: form.message.value.trim(),
        _gotcha: form._gotcha?.value || ''
      };

      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showStatus('success', '✓ Message received. We\'ll be in touch within one business day.');
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.error || 'Something went wrong. Please email us directly at support@guerramanagementgroup.com.';
        showStatus('error', msg);
      }
    } catch (err) {
      showStatus('error', 'Network error. Please email us directly at support@guerramanagementgroup.com.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });
}

function showStatus(type, message) {
  if (!status) return;
  status.className = 'form-status show ' + type;
  status.textContent = message;
  status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
