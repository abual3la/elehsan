document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-q');
    question.addEventListener('click', () => {
      // Close others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });
      // Toggle current
      item.classList.toggle('active');
    });
  });

  // Analytics Tracking for Clicks
  const trackEvent = (eventName, buttonType) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        'event_category': 'conversion',
        'event_label': buttonType
      });
    }
  };

  // Track WhatsApp clicks
  document.querySelectorAll('a[href^="https://wa.me"]').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('click_whatsapp', btn.textContent.trim()));
  });

  // Track Call clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
    btn.addEventListener('click', () => trackEvent('click_call', btn.textContent.trim()));
  });
});
