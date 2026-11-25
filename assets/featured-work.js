(() => {
  // The project cards listed in works/index.html.
  const projects = [
    {"page": "works/cnc-cutouts.html", "image": "assets/works/cnc-cutouts/arched-entrance-display.jpg", "category": "CNC Cutting", "title": "CNC Cutouts"},
    {"page": "works/custom-jersey-frame.html", "image": "assets/works/custom-jersey-frame/liverpool-front.jpg", "category": "Custom Framing", "title": "Custom Jersey Frame"},
    {"page": "works/hulhumale-hospital-police-kiosk-wrapping.html", "image": "assets/works/hulhumale-police-kiosk/kiosk-front.jpg", "category": "Sticker Wrapping", "title": "Hulhumalé Hospital Police Kiosk Wrapping"},
    {"page": "works/hulhumale-hospital-signage.html", "image": "assets/works/custom-signage/services-directory.jpg", "category": "Custom Signage", "title": "Hulhumalé Hospital Signage"},
    {"page": "works/mtcc-taxi-line.html", "image": "assets/works/mtcc-taxi-line/raised-billboard.jpeg", "category": "Billboard Printing & Installation", "title": "MTCC Malé Taxi Line Billboards"},
    {"page": "works/irai-signage.html", "image": "assets/works/led-signage/irai-night.jpg", "category": "Illuminated Shopfront Sign", "title": "iRAi"},
    {"page": "works/sports-projecting-sign.html", "image": "assets/works/yte/raised-logo.jpg", "category": "Shopfront & LED Signage", "title": "Yt’e Shop Branding"},
    {"page": "works/the-1981-drum.html", "image": "assets/works/led-signage/the-1981-drum.jpg", "category": "Illuminated Drum Sign", "title": "The 1981"},
    {"page": "works/786-fresh-mart.html", "image": "assets/works/led-signage/fresh-mart-workshop.jpg", "category": "Projecting Sign", "title": "786 Fresh Mart"},
    {"page": "works/bello-boutique.html", "image": "assets/works/led-signage/bello-boutique.jpg", "category": "Halo-Lit Sign", "title": "Bello Boutique"},
    {"page": "works/micro-tailor.html", "image": "assets/works/led-signage/micro-tailor.jpg", "category": "LED Lightbox", "title": "Micro Tailor"},
    {"page": "works/stacked-projecting-signs.html", "image": "assets/works/led-signage/stacked-projecting-signs.jpg", "category": "Projecting Sign System", "title": "Stacked Projecting Signs"},
    {"page": "works/sirius-2.html", "image": "assets/works/led-signage/sirius-2.jpg", "category": "Illuminated Channel Letters", "title": "Sirius-2"},
    {"page": "works/health-and-glow-pharmacy.html", "image": "assets/works/led-signage/health-and-glow.jpg", "category": "Raised Letter Sign", "title": "Health & Glow Pharmacy"},
    {"page": "works/ihusaan-fihaara.html", "image": "assets/works/ihusaan-fihaara/full-pillar.jpg", "category": "Sticker Wrapping", "title": "Ihusaan Fihaara"},
    {"page": "works/springcool.html", "image": "assets/works/springcool/side-profile.jpg", "category": "Vehicle Wrapping", "title": "Springcool Maldives PVT LTD"},
  ];

  const grid = document.querySelector('.home-featured-grid');
  const slots = Array.from(grid.querySelectorAll('.works-card'), card => ({
    card,
    photo: card.querySelector('img'),
    category: card.querySelector('.works-card-copy > span'),
    title: card.querySelector('strong'),
    project: null,
  }));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const displayed = new Set();
  const rotationTime = 5000;
  const fadeTime = 600;
  let queue = [];
  let slotOrder = [];
  let lastSlot;
  let fadingSlot;
  let timer;

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
      const swap = Math.floor(Math.random() * (index + 1));
      [items[index], items[swap]] = [items[swap], items[index]];
    }
    return items;
  }

  function displayProject(slot, project) {
    if (slot.project) displayed.delete(slot.project.page);
    slot.project = project;
    slot.card.href = project.page;
    slot.photo.src = project.image;
    slot.category.textContent = project.category;
    slot.title.textContent = project.title;
    displayed.add(project.page);
  }

  function schedule(delay = rotationTime) {
    timer = window.setTimeout(() => {
      if (!queue.length) queue = shuffle(projects.filter(project => !displayed.has(project.page)));
      if (!slotOrder.length) {
        slotOrder = shuffle([...slots]);
        if (slotOrder[0] === lastSlot) slotOrder.push(slotOrder.shift());
      }

      const slot = slotOrder[0];
      fadingSlot = slot;
      slot.card.classList.add('is-fading');
      timer = window.setTimeout(() => {
        displayProject(slot, queue.shift());
        slot.card.classList.remove('is-fading');
        lastSlot = slotOrder.shift();
        fadingSlot = null;
        schedule(rotationTime - fadeTime);
      }, fadeTime);
    }, delay);
  }

  function restart() {
    window.clearTimeout(timer);
    if (fadingSlot) fadingSlot.card.classList.remove('is-fading');
    fadingSlot = null;
    if (reducedMotion.matches || document.hidden || grid.matches(':hover, :focus-within')) return;
    schedule();
  }

  queue = shuffle([...projects]);
  for (const slot of slots) displayProject(slot, queue.shift());

  for (const event of ['pointerenter', 'pointerleave', 'focusin']) {
    grid.addEventListener(event, restart);
  }
  grid.addEventListener('focusout', () => window.requestAnimationFrame(restart));
  document.addEventListener('visibilitychange', restart);
  reducedMotion.addEventListener('change', restart);
  restart();
})();
