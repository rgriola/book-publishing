/*
 * email-placeholder.js
 * Simple client-side placeholder for email capture (local only)
 * - Validates email
 * - Shows inline success/failure
 * - Stores email in sessionStorage so access can be granted
 * This is a placeholder until you move to a hosted solution or Mailchimp.
 */

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

function setupPlaceholderForm(formId, inputId, feedbackId, storageKey) {
  const form = document.getElementById(formId);
  if (!form) return;
  const input = document.getElementById(inputId);
  const feedback = form.querySelector(feedbackId);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!validateEmail(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.style.color = 'var(--color-accent)';
      return;
    }

    // Store email in sessionStorage to simulate access grant
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ email, time: Date.now() }));
      feedback.textContent = 'Thanks — check your inbox for instructions. You may now access the content.';
      feedback.style.color = 'var(--color-primary)';

      // Optionally redirect to reader after short delay
      setTimeout(() => {
        window.location.href = 'reader.html#chapter-1';
      }, 900);
    } catch (err) {
      console.error('Storage failed', err);
      feedback.textContent = 'An error occurred. Please try again.';
      feedback.style.color = 'var(--color-accent)';
    }
  });
}

// Initialize both forms
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupPlaceholderForm('email-placeholder-form', 'email-placeholder', '.email-feedback', 'email_placeholder');
    setupPlaceholderForm('email-placeholder-form-author', 'email-placeholder-author', '.email-feedback-author', 'email_placeholder_author');
  });
} else {
  setupPlaceholderForm('email-placeholder-form', 'email-placeholder', '.email-feedback', 'email_placeholder');
  setupPlaceholderForm('email-placeholder-form-author', 'email-placeholder-author', '.email-feedback-author', 'email_placeholder_author');
}

export default {};
