const sections = document.querySelectorAll('section');

function revealSections(){
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      section.classList.add('show');
    }
  });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);
