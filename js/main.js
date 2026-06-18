/**
 * main.js — Cybersecurity Portfolio
 *
 * Renders every section of the site dynamically from data defined in data.js.
 * Expected globals: SITE, SKILLS, PROJECTS, WRITEUPS, ACHIEVEMENTS, SECTION_ORDER
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const WRITEUP_INITIAL_COUNT = 4;

/* ------------------------------------------------------------------ */
/*  Bootstrap                                                         */
/* ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
  // Render content
  renderHero();
  renderAbout();
  renderProjects();
  renderWriteups();
  renderAchievements();
  renderFooter();

  // Reorder sections to match SECTION_ORDER
  reorderSections();

  // Interactive behaviour
  setupNavbar();
  setupScrollReveal();
});

/* ================================================================== */
/*  HELPER FUNCTIONS                                                  */
/* ================================================================== */

/**
 * Return an inline SVG icon string for a known social platform.
 * Falls back to an empty string for unknown platforms.
 */
function createSocialIcon(platform) {
  const p = (platform || '').toLowerCase();

  const svgs = {
    github:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 ' +
        '0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756' +
        '-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997' +
        '.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.22' +
        '-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02' +
        '.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176' +
        '.77.838 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222' +
        ' 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12 24 5.37 18.63 0 12 0z"/>' +
      '</svg>',

    linkedin:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 ' +
        '2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 ' +
        '5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.891 ' +
        '20.452H3.781V9h3.11v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 ' +
        '1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' +
      '</svg>',

    email:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="2" y="4" width="20" height="16" rx="2"/>' +
        '<path d="M22 4L12 13 2 4"/>' +
      '</svg>',

    envelope:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<rect x="2" y="4" width="20" height="16" rx="2"/>' +
        '<path d="M22 4L12 13 2 4"/>' +
      '</svg>',
  };

  return svgs[p] || '';
}

/** Return a tag span HTML string. */
function createTag(text) {
  return `<span class="tag">${text}</span>`;
}

/** Return an anchor HTML string styled as a project link. */
function createLink(label, url) {
  return `<a class="project-link" href="${url}" target="_blank" rel="noopener">${label} →</a>`;
}

/**
 * Build the social-links HTML shared by the hero and footer.
 * Returns an HTML string of `.social-link` anchors.
 */
function buildSocialsHTML(socials) {
  return (socials || [])
    .filter((s) => s.url)
    .map((s) => {
      const isEmail = ['email', 'envelope', 'mail'].includes(s.platform.toLowerCase());
      const href = isEmail ? `mailto:${s.url}` : s.url;
      const target = isEmail ? '' : ' target="_blank" rel="noopener"';
      const icon = createSocialIcon(s.platform);
      const labelText = icon ? `${icon}<span>${s.label}</span>` : s.label;
      return `<a class="social-link" href="${href}"${target}>${labelText}</a>`;
    })
    .join('');
}

/* ================================================================== */
/*  RENDER — Hero                                                     */
/* ================================================================== */

function renderHero() {
  const section = document.getElementById('hero');
  if (!section) return;

  const nameEl = section.querySelector('.hero-name');
  const titleEl = section.querySelector('.hero-title');
  const socialsEl = section.querySelector('.hero-socials');

  if (nameEl) nameEl.textContent = SITE.name;
  if (titleEl) titleEl.textContent = SITE.title;
  if (socialsEl) socialsEl.innerHTML = buildSocialsHTML(SITE.socials);
}

/* ================================================================== */
/*  RENDER — About                                                    */
/* ================================================================== */

function renderAbout() {
  const section = document.getElementById('about');
  if (!section) return;

  // Bio text — wrap in <p> if it doesn't already contain block-level markup
  const aboutText = section.querySelector('.about-text');
  if (aboutText && SITE.bio) {
    const bio = SITE.bio.trim();
    aboutText.innerHTML = bio.startsWith('<') ? bio : `<p>${bio}</p>`;
  }

  // Skills grid
  const grid = section.querySelector('.skills-grid');
  if (grid && SKILLS) {
    grid.innerHTML = SKILLS.map(
      (group) => `
      <div class="skill-group">
        <div class="skill-group-title">${group.category}</div>
        <div class="skill-tags">
          ${group.items.map((item) => `<span class="skill-tag">${item}</span>`).join('')}
        </div>
      </div>`
    ).join('');
  }
}

/* ================================================================== */
/*  RENDER — Projects                                                 */
/* ================================================================== */

function renderProjects() {
  const section = document.getElementById('projects');
  if (!section) return;

  /* ---------- Filter bar ---------- */
  const filterBar = section.querySelector('.filter-bar');
  if (filterBar) {
    const allTags = [...new Set(PROJECTS.flatMap((p) => p.tags || []))];
    const buttons = ['All', ...allTags]
      .map(
        (tag) =>
          `<button class="filter-btn${tag === 'All' ? ' active' : ''}" data-tag="${tag}">${tag}</button>`
      )
      .join('');
    filterBar.innerHTML = buttons;

    // Filter click handler
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Toggle active state
      filterBar.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tag = btn.dataset.tag;
      const cards = section.querySelectorAll('.project-card');

      cards.forEach((card) => {
        const cardTags = Array.from(card.querySelectorAll('.tag')).map((t) => t.textContent);
        if (tag === 'All' || cardTags.includes(tag)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  /* ---------- Card rendering ---------- */
  const grid = section.querySelector('.projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((project) => {
    const accent = project.accent ? `style="--card-accent: ${project.accent}"` : '';

    // Primary image
    const imageHTML = project.image
      ? `<div class="project-card-image"><img src="${project.image}" alt="${project.title}" loading="lazy"></div>`
      : '';

    // Gallery images
    const galleryHTML =
      project.images && project.images.length
        ? `<div class="card-gallery">${project.images.map((img) => `<img src="${img}" alt="${project.title}" loading="lazy">`).join('')}</div>`
        : '';

    // Tags
    const tagsHTML = (project.tags || []).map((t) => createTag(t)).join('');

    // Links
    const linksHTML =
      project.links && project.links.length
        ? `<div class="project-card-links">${project.links.map((l) => createLink(l.label, l.url)).join('')}</div>`
        : '';

    // Details toggle
    const detailsHTML = project.details
      ? `<button class="details-toggle" aria-expanded="false">+ Details</button>
         <div class="project-card-details">${project.details}</div>`
      : '';

    return `
    <div class="project-card reveal" ${accent}>
      ${imageHTML}
      ${galleryHTML}
      <div class="project-card-accent"></div>
      <div class="project-card-body">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-desc">${project.description}</p>
        <div class="project-card-tags">${tagsHTML}</div>
        ${linksHTML}
        ${detailsHTML}
      </div>
    </div>`;
  }).join('');

  // Wire up details toggles
  wireDetailsToggles(grid);
}

/* ================================================================== */
/*  RENDER — Writeups                                                 */
/* ================================================================== */

function renderWriteups() {
  const section = document.getElementById('writeups');
  if (!section) return;

  const pinned = WRITEUPS.filter((w) => w.pinned === true);
  const regular = WRITEUPS.filter((w) => !w.pinned);

  /* ---------- Pinned writeups ---------- */
  const pinnedContainer = section.querySelector('.writeups-pinned');
  if (pinnedContainer && pinned.length) {
    pinnedContainer.innerHTML = pinned.map((w) => {
      const accent = w.accent ? `style="--card-accent: ${w.accent}"` : '';
      const imageHTML = w.image
        ? `<div class="project-card-image"><img src="${w.image}" alt="${w.title}" loading="lazy"></div>`
        : '';
      const galleryHTML =
        w.images && w.images.length
          ? `<div class="card-gallery">${w.images.map((img) => `<img src="${img}" alt="${w.title}" loading="lazy">`).join('')}</div>`
          : '';
      const tagsHTML = (w.tags || []).map((t) => createTag(t)).join('');
      const linksHTML =
        w.links && w.links.length
          ? `<div class="project-card-links">${w.links.map((l) => createLink(l.label, l.url)).join('')}</div>`
          : '';
      const detailsHTML = w.details
        ? `<button class="details-toggle" aria-expanded="false">+ Details</button>
           <div class="project-card-details">${w.details}</div>`
        : '';

      return `
      <div class="project-card pinned reveal" ${accent}>
        ${imageHTML}
        ${galleryHTML}
        <div class="project-card-accent"></div>
        <div class="project-card-body">
          <span class="pinned-badge">★ Featured</span>
          <h3 class="project-card-title">${w.title}</h3>
          <p class="project-card-desc">${w.description}</p>
          <div class="project-card-tags">${tagsHTML}</div>
          ${linksHTML}
          ${detailsHTML}
        </div>
      </div>`;
    }).join('');

    wireDetailsToggles(pinnedContainer);
  }

  /* ---------- Regular writeups ---------- */
  const listContainer = section.querySelector('.writeups-list');
  if (listContainer && regular.length) {
    listContainer.innerHTML = regular
      .map((w, i) => {
        const accent = w.accent ? `style="--card-accent: ${w.accent}"` : '';
        const hiddenClass = i >= WRITEUP_INITIAL_COUNT ? ' writeup-hidden' : '';
        const tagsHTML = (w.tags || []).map((t) => createTag(t)).join('');
        const linksHTML =
          w.links && w.links.length
            ? `<div class="writeup-item-links">${w.links.map((l) => createLink(l.label, l.url)).join('')}</div>`
            : '';

        return `
        <div class="writeup-item reveal${hiddenClass}" ${accent}>
          <div class="writeup-item-accent"></div>
          <div class="writeup-item-content">
            <div class="writeup-item-title">${w.title}</div>
            <div class="writeup-item-desc">${w.description}</div>
          </div>
          <div class="writeup-item-tags">${tagsHTML}</div>
          ${linksHTML}
        </div>`;
      })
      .join('');
  }

  /* ---------- Show more / less ---------- */
  const showMoreBtn = section.querySelector('.writeups-show-more');
  if (showMoreBtn) {
    const remaining = regular.length - WRITEUP_INITIAL_COUNT;
    if (remaining > 0) {
      showMoreBtn.textContent = `Show ${remaining} more`;
      showMoreBtn.style.display = '';

      let expanded = false;
      showMoreBtn.addEventListener('click', () => {
        const items = listContainer.querySelectorAll('.writeup-item');
        expanded = !expanded;

        items.forEach((item, i) => {
          if (i >= WRITEUP_INITIAL_COUNT) {
            item.classList.toggle('writeup-hidden', !expanded);
          }
        });

        showMoreBtn.textContent = expanded ? 'Show less' : `Show ${remaining} more`;
      });
    } else {
      // Not enough items to need the button
      showMoreBtn.style.display = 'none';
    }
  }
}

/* ================================================================== */
/*  RENDER — Achievements                                             */
/* ================================================================== */

function renderAchievements() {
  const section = document.getElementById('achievements');
  if (!section) return;

  const grid = section.querySelector('.achievements-grid');
  if (!grid) return;

  grid.innerHTML = ACHIEVEMENTS.map((a) => {
    const accent = a.accent ? `style="--card-accent: ${a.accent}"` : '';

    const placementHTML = a.placement
      ? `<div class="achievement-placement">${a.placement}</div>`
      : '';

    const imageHTML = a.image
      ? `<div class="achievement-card-image"><img src="${a.image}" alt="${a.title}" loading="lazy"></div>`
      : '';

    const tagsHTML = (a.tags || []).map((t) => createTag(t)).join('');

    const detailsHTML = a.details
      ? `<button class="details-toggle" aria-expanded="false">+ Details</button>
         <div class="project-card-details">${a.details}</div>`
      : '';

    return `
    <div class="achievement-card reveal" ${accent}>
      ${placementHTML}
      ${imageHTML}
      <div class="achievement-card-body">
        <h3 class="achievement-card-title">${a.title}</h3>
        <p class="achievement-card-desc">${a.description}</p>
        <div class="achievement-card-tags">${tagsHTML}</div>
        ${detailsHTML}
      </div>
    </div>`;
  }).join('');

  wireDetailsToggles(grid);
}

/* ================================================================== */
/*  RENDER — Footer                                                   */
/* ================================================================== */

function renderFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const socialsEl = footer.querySelector('.footer-socials');
  if (socialsEl) socialsEl.innerHTML = buildSocialsHTML(SITE.socials);

  const copyEl = footer.querySelector('.footer-copy');
  if (copyEl) {
    copyEl.innerHTML = copyEl.innerHTML.replace(
      /\d{4}/,
      new Date().getFullYear().toString()
    );
    // If there's no year placeholder yet, append one
    if (!/\d{4}/.test(copyEl.textContent)) {
      copyEl.textContent = `© ${new Date().getFullYear()} ${SITE.name}`;
    }
  }
}

/* ================================================================== */
/*  Section Reordering                                                */
/* ================================================================== */

function reorderSections() {
  const main = document.querySelector('main');
  if (!main || !SECTION_ORDER) return;

  SECTION_ORDER.forEach((id) => {
    const sec = document.getElementById(id);
    if (sec) main.appendChild(sec); // appendChild moves existing nodes
  });
}

/* ================================================================== */
/*  Navbar                                                            */
/* ================================================================== */

function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  /* ---------- Mobile toggle ---------- */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ---------- Scroll class ---------- */
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ---------- Active section highlighting ---------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if (sections.length && navLinkEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkEls.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ================================================================== */
/*  Scroll Reveal                                                     */
/* ================================================================== */

function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // one-time reveal
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ================================================================== */
/*  Shared Utilities                                                  */
/* ================================================================== */

/**
 * Wire up all `.details-toggle` buttons within a container to
 * expand / collapse their adjacent `.project-card-details` element.
 */
function wireDetailsToggles(container) {
  container.querySelectorAll('.details-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const details = btn.nextElementSibling;
      if (!details) return;

      const isExpanded = details.classList.toggle('expanded');
      btn.textContent = isExpanded ? '− Details' : '+ Details';
      btn.setAttribute('aria-expanded', isExpanded);
    });
  });
}
