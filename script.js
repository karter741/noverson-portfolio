/* ========== SEPARATED JAVASCRIPT FILE ========== */

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === "#" || targetId === "") return;
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Sticky navbar style on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.style.background = 'rgba(255, 255, 255, 0.96)';
    navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.02)';
  } else {
    navbar.style.background = 'rgba(255, 255, 255, 0.92)';
    navbar.style.boxShadow = 'none';
  }
});

// Resume PDF download functionality
const resumeBtn = document.getElementById('resumeBtn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const resumeContent = `NOVERSON GABITO
IT GRADUATE / WEB DEVELOPER / AI SUPPORT
Contact: +639124445166 | noverson.gabito@gmail.com | Buano, Balamban, Cebu

EDUCATION: Bachelor of Science in Information Technology, University of Cebu - Pardo and Talisay (2021-2025)

EXPERTISE: JavaScript, Node.js, React, MongoDB, AI Data Training & Annotation, Blockchain Fundamentals, CRM Tools, Git, Microsoft Office, Google Workspace

EXPERIENCE: On-the-Job Trainee at Rockson Tech Company / Xode Blockchain
- AI data training, preparation and annotation
- Xterium Wallet testing & evaluation
- Collaborated with developers, maintained high data accuracy
- Gained blockchain workflows expertise

PROFILE: IT graduate skilled in AI training, blockchain systems, web development, and fast-paced environments.`;
    
    const blob = new Blob([resumeContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'NOVERSON_GABITO_RESUME.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
}

// Copy contact (email + phone) toast functionality
const copyBtn = document.getElementById('copyContactBtn');
const toast = document.getElementById('copyToast');
if (copyBtn && toast) {
  copyBtn.addEventListener('click', () => {
    const contactInfo = "noverson.gabito@gmail.com | +63 912 444 5166";
    navigator.clipboard.writeText(contactInfo).then(() => {
      toast.style.opacity = '1';
      setTimeout(() => {
        toast.style.opacity = '0';
      }, 1800);
    }).catch(() => alert("Could not copy manually"));
  });
}

// Scroll reveal animation for elements
const scrollElements = document.querySelectorAll('.exp-card, .timeline-card, .project-item, .hero-visual, .contact-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

scrollElements.forEach(el => {
  el.classList.add('animate-on-scroll');
  observer.observe(el);
});

// Hero content immediate reveal
document.querySelectorAll('.hero-content, .badge').forEach(el => el.classList.add('animate-in'));

// Dynamic footer year update
const footerYear = document.querySelector('footer p');
if(footerYear) footerYear.innerHTML = `© ${new Date().getFullYear()} Noverson Gabito — IT Graduate | Web Developer | AI Support — Based on real experience & expertise.`;
