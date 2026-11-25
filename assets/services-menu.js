const servicesMenu = document.querySelector('.services-menu');
const servicesToggle = servicesMenu.querySelector('summary');
const mainNav = servicesMenu.closest('nav');
const headerRow = mainNav.parentElement;
const siteHeader = headerRow.closest('.site-header');
const wordmark = headerRow.querySelector('.wordmark');
const mobileMenu = document.createElement('button');
const menuIcon = document.createElement('span');

mainNav.id = mainNav.id || 'main-navigation';
mobileMenu.className = 'mobile-menu-toggle';
mobileMenu.type = 'button';
mobileMenu.setAttribute('aria-label', 'Main menu');
mobileMenu.setAttribute('aria-controls', mainNav.id);
mobileMenu.setAttribute('aria-expanded', 'false');
menuIcon.setAttribute('aria-hidden', 'true');
mobileMenu.append(menuIcon);
mainNav.before(mobileMenu);

function closeMobileMenu() {
  mobileMenu.setAttribute('aria-expanded', 'false');
  servicesMenu.open = false;
}

function updateNavigationLayout() {
  const gap = parseFloat(getComputedStyle(headerRow).columnGap);
  headerRow.classList.add('is-measuring-nav');
  const menuWidth = mainNav.getBoundingClientRect().width;
  headerRow.classList.remove('is-measuring-nav');

  const requiredWidth = wordmark.getBoundingClientRect().width + gap + menuWidth;
  const compact = requiredWidth > headerRow.getBoundingClientRect().width;
  if (compact === siteHeader.classList.contains('is-compact')) return;

  const focused = document.activeElement;
  closeMobileMenu();
  siteHeader.classList.toggle('is-compact', compact);
  if (compact && mainNav.contains(focused)) mobileMenu.focus();
  if (!compact && focused === mobileMenu) servicesToggle.focus();
}

mobileMenu.addEventListener('click', () => {
  if (mobileMenu.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu();
  } else {
    mobileMenu.setAttribute('aria-expanded', 'true');
  }
});

document.addEventListener('click', (event) => {
  if (!servicesMenu.contains(event.target) || event.target.closest('.services-menu a')) {
    servicesMenu.open = false;
  }

  if (mobileMenu.getAttribute('aria-expanded') === 'true' &&
      !mobileMenu.contains(event.target) &&
      (!mainNav.contains(event.target) || event.target.closest('nav a'))) {
    closeMobileMenu();
  }
});

servicesMenu.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && servicesMenu.open) {
    event.stopPropagation();
    servicesMenu.open = false;
    servicesToggle.focus();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.getAttribute('aria-expanded') === 'true') {
    closeMobileMenu();
    if (mobileMenu.getClientRects().length) mobileMenu.focus();
  }
});

const headerObserver = new ResizeObserver(updateNavigationLayout);
headerObserver.observe(headerRow);
headerObserver.observe(wordmark);
document.fonts.ready.then(updateNavigationLayout);
updateNavigationLayout();
