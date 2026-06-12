const inlineContentScriptId = "siteContent";

const fallbackContent = {
  agencyTagline: "Our Services",
  hero: {
    headline: "AI & Automation Solutions for Scalable Growth",
    subheadline:
      "Unlock the full potential of AI & automation with tailored solutions. Understand your current processes, systems, and data to identify where AI can drive impactful change.",
    stats: [
      { value: "260+", label: "Hours Saved / Yr" },
      { value: "3x", label: "Pipeline Velocity" },
      { value: "ROI+", label: "Guaranteed Outcomes" }
    ],
    platformLabel: "Platform",
    platformHeadline: "The visual AI automation platform",
    platformText:
      "Connect any app, data source, or AI model. Build and manage automations and AI agents visually, in code, or with a prompt.",
    primaryCta: { text: "Contact Us", url: "mailto:autoaxiomai@gmail.com" },
    secondaryCta: { text: "Watch Demo", url: "#success-stories" }
  },
  secondSection: {
    headline: "Automate business processes with confidence",
    subheadline:
      "From a simple workflow to managing AI automation systems across your entire business, make it happen with Axiom.",
    cta: { text: "Explore more", url: "#services" },
    cards: [
      { icon: "✨", title: "Build and ship fast, be first", description: "Move from idea to automation quickly." },
      { icon: "↗", title: "Solve smarter, boost efficiency", description: "Connect tools and reduce manual effort." },
      { icon: "👥", title: "Orchestrate with clarity and control", description: "Manage autonomous AI agents at scale." }
    ]
  },
  targetAudience: ["Small Business Owners", "Service Businesses", "E-commerce Brands"],
  services: [],
  footer: ["Services", "Solutions", "Apps", "Success Stories", "Privacy Policy", "Terms"],
  integrationsShowcase: { kicker: "Applications", headline: "3,000+ pre-built apps. Limitless integration.", subheadline: "", cta: { text: "Browse apps", url: "#success-stories" }, apps: [] },
  solutionsSection: { kicker: "Solutions", headline: "Adapt at speed with visual-first automation and AI", subheadline: "", defaultTab: "", tabs: [] },
  successStories: { kicker: "Success stories", headline: "Automation success stories", subheadline: "", cta: { text: "Explore success stories", url: "#success-stories" }, cards: [] }
};

async function loadContent() {
  try {
    const inlineScript = document.getElementById(inlineContentScriptId);
    const inlineJson = inlineScript?.textContent?.trim();
    if (!inlineJson) throw new Error("Inline JSON not found");
    return JSON.parse(inlineJson);
  } catch {
    return fallbackContent;
  }
}

function renderList(container, items, className = "") {
  if (!container) return;
  container.innerHTML = "";
  items.forEach((item) => {
    const span = document.createElement("span");
    if (className) span.className = className;
    span.textContent = item;
    container.appendChild(span);
  });
}

function initNavigation() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("mainNav");
  if (!menuBtn || !nav) return;
  menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
}

function initLazyEmbeds(scope = document) {
  const frames = scope.querySelectorAll("iframe[data-src]:not([src])");
  if (!frames.length) return;

  const loadFrame = (frame) => {
    const src = frame.dataset.src;
    if (!src || frame.src) return;
    frame.src = src;
  };

  if (!("IntersectionObserver" in window)) {
    frames.forEach(loadFrame);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadFrame(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "240px 0px" }
  );

  frames.forEach((frame) => observer.observe(frame));
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal, .service-card, .success-card").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

function initSolutionsSection(section) {
  const tabsContainer = document.getElementById("solutionsTabs");
  const panel = document.getElementById("solutionsPanel");
  if (!tabsContainer || !panel || !section?.tabs?.length) return;
  document.getElementById("solutionsKicker").textContent = section.kicker || "Solutions";
  document.getElementById("solutionsHeadline").textContent = section.headline || "";
  document.getElementById("solutionsSubheadline").textContent = section.subheadline || "";

  const tabs = section.tabs;
  let activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === section.defaultTab));

  const renderTabs = () => {
    tabsContainer.innerHTML = tabs
      .map((tab, idx) => `<button type="button" class="solutions-tab ${idx === activeIndex ? "active" : ""}" data-index="${idx}">${tab.label}</button>`)
      .join("");
  };

  const renderPanel = () => {
    const active = tabs[activeIndex];
    panel.innerHTML = `
      <div class="solutions-media">
        <div class="solution-photo solution-photo-lottie" role="img" aria-label="${active.imageAlt || active.title}">
          <iframe
            data-src="https://lottie.host/embed/203c5b49-b3fb-4910-bfab-5490397f10de/IYs1FiN7mW.lottie"
            title="${active.label || "Solution"} automation animation"
            loading="lazy"
          ></iframe>
        </div>
        <div class="solutions-flow">
          ${(active.flow || [])
            .map((step, i) => `
            <div class="flow-step"><span class="flow-icon">${step.icon || "•"}</span><small>${step.label}</small></div>
            ${i < active.flow.length - 1 ? '<span class="flow-connector">•••</span>' : ""}
          `)
            .join("")}
        </div>
      </div>
      <div class="solutions-copy">
        <h3>${active.title}</h3>
        <p>${active.description}</p>
        <a class="btn btn-primary" href="${active.ctaUrl || "#success-stories"}">${active.ctaText || "Learn more"}</a>
      </div>
    `;
    initLazyEmbeds(panel);
  };

  tabsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".solutions-tab");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (Number.isNaN(index)) return;
    activeIndex = index;
    renderTabs();
    renderPanel();
  });

  renderTabs();
  renderPanel();
}

function initAppsShowcase(showcase) {
  if (!showcase) return;
  document.getElementById("appsKicker").textContent = showcase.kicker || "Applications";
  document.getElementById("appsHeadline").textContent = showcase.headline || "";
  document.getElementById("appsSubheadline").textContent = showcase.subheadline || "";
  const cta = document.getElementById("appsCta");
  cta.textContent = showcase.cta?.text || "Browse apps";
  cta.href = showcase.cta?.url || "#success-stories";

  const grid = document.getElementById("appsGrid");
  const apps = showcase.apps || [];
  const renderCard = (app, isClone = false) => {
    const icon = app
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `<article class="app-card"${isClone ? ' aria-hidden="true"' : ""}><span class="app-icon">${icon}</span><span class="app-name">${app}</span></article>`;
  };

  if (!apps.length) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = `<div class="apps-track">${apps.map((app) => renderCard(app)).join("")}${apps
    .map((app) => renderCard(app, true))
    .join("")}</div>`;
}

function initSuccessStories(stories) {
  if (!stories) return;
  document.getElementById("successKicker").textContent = stories.kicker || "Success stories";
  document.getElementById("successHeadline").textContent = stories.headline || "";
  document.getElementById("successSubheadline").textContent = stories.subheadline || "";
  const cta = document.getElementById("successCta");
  cta.textContent = stories.cta?.text || "Explore success stories";
  cta.href = stories.cta?.url || "#success-stories";
  const grid = document.getElementById("successGrid");
  grid.innerHTML = (stories.cards || [])
    .map(
      (story, index) => `
      <article class="success-card reveal">
        <div class="success-card-media success-card-media-${index + 1}">
          <span class="story-logo">A</span>
          <span class="story-dots">•••</span>
          <span class="story-person">${(story.person || "Client")
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}</span>
          <span class="story-dots">•••</span>
          <span class="story-company">${story.company || "AI"}</span>
        </div>
        <div class="success-card-body">
          <p class="success-meta">${story.date || ""} • ${story.duration || ""}</p>
          <h3>${story.title}</h3>
        </div>
      </article>
    `
    )
    .join("");
}

function initBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;

  const toggleVisibility = () => {
    button.classList.toggle("visible", window.scrollY > 520);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();
}

function populateContent(content) {
  const hero = content.hero || {};
  const second = content.secondSection || {};
  document.getElementById("agencyTagline").textContent = content.agencyTagline || "";
  document.getElementById("heroHeadline").textContent = hero.headline || "";
  document.getElementById("heroSubheadline").textContent = hero.subheadline || "";
  document.getElementById("platformLabel").textContent = hero.platformLabel || "Platform";
  document.getElementById("platformHeadline").textContent = hero.platformHeadline || "";
  document.getElementById("platformText").textContent = hero.platformText || "";

  const primary = document.getElementById("primaryCta");
  primary.textContent = hero.primaryCta?.text || "Contact Us";
  primary.href = content.integrations?.calendlyUrl || hero.primaryCta?.url || "#success-stories";
  const secondary = document.getElementById("secondaryCta");
  secondary.textContent = hero.secondaryCta?.text || "Watch Demo";
  secondary.href = hero.secondaryCta?.url || "#success-stories";

  document.getElementById("heroStats").innerHTML = (hero.stats || [])
    .map((stat) => `<article class="hero-stat"><strong>${stat.value}</strong><span>${stat.label}</span></article>`)
    .join("");

  renderList(document.getElementById("targetAudience"), content.targetAudience || []);
  document.getElementById("capabilitiesHeadline").textContent = second.headline || "";
  document.getElementById("capabilitiesSubheadline").textContent = second.subheadline || "";
  document.getElementById("capabilitiesGrid").innerHTML = (second.cards || [])
    .map(
      (card) =>
        `<article class="capability-card reveal"><div class="capability-icon">${card.icon || "•"}</div><h3>${card.title}</h3><p>${card.description}</p></article>`
    )
    .join("");
  const capCta = document.getElementById("capabilitiesCta");
  capCta.textContent = second.cta?.text || "Explore more";
  capCta.href = second.cta?.url || "#services";

  document.getElementById("servicesGrid").innerHTML = (content.services || [])
    .map(
      (service, index) => `
      <article class="service-card reveal">
        <div class="service-card__top">
          <span class="service-card__number">${String(index + 1).padStart(2, "0")}</span>
          <span class="service-card__status">AI Agent</span>
        </div>
        <div class="service-card__title-container">
          <h3 class="service-card__title">${service.name}</h3>
          <p class="service-card__paragraph">${service.solution || "Custom AI automation blueprint for measurable business outcomes."}</p>
        </div>
        <a class="btn btn-primary service-card__button" href="mailto:autoaxiomai@gmail.com">Contact Us</a>
      </article>
    `
    )
    .join("");

  initSolutionsSection(content.solutionsSection);
  initAppsShowcase(content.integrationsShowcase);
  initSuccessStories(content.successStories);
}

async function main() {
  const loaded = await loadContent();
  const content = {
    ...fallbackContent,
    ...loaded,
    hero: { ...fallbackContent.hero, ...(loaded.hero || {}) },
    secondSection: { ...fallbackContent.secondSection, ...(loaded.secondSection || {}) },
    solutionsSection: { ...fallbackContent.solutionsSection, ...(loaded.solutionsSection || {}) },
    integrationsShowcase: {
      ...fallbackContent.integrationsShowcase,
      ...(loaded.integrationsShowcase || {})
    },
    successStories: { ...fallbackContent.successStories, ...(loaded.successStories || {}) }
  };
  populateContent(content);
  initNavigation();
  initLazyEmbeds();
  initRevealAnimations();
  initBackToTop();
}

main();
