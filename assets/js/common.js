// Navigation data - Edit here to update menu everywhere
const navbarLinks = [
  {
    title: "← Back to home",
    url: "https://naviplus.io/"
  },
  {
    title: "Demo",
    dropdown: true,
    children: [
      {
        title: "Live demo (Navi+ 1Click)",
        url: "https://naviplus.io/demo/"
      },
      { divider: true },
      {
        title: "Case studies",
        url: "https://naviplus.io/demo/case-study"
      },
      {
        title: "Dawn demos",
        url: "https://naviplus.io/demo/dawn"
      },
      {
        title: "Other demos",
        url: "https://naviplus.io/demo/others"
      }
    ]
  },
  {
    title: "Pricing",
    url: "https://naviplus.io/pricing"
  },
  {
    title: "User Guide",
    dropdown: true,
    activePage: "user-guide",
    children: [
      {
        title: "Home",
        url: "/",
        active: true
      },
      { divider: true },
      {
        title: "Getting Started",
        url: "/docs/getting-started/"
      },
      { divider: true },
      {
        title: "Explore common menus",
        url: "/docs/usage/explore-common-menus/"
      },
      {
        title: "Tabbar",
        url: "/docs/usage/tabbar-bottom-navigation/how-to-use/"
      },
      {
        title: "Mega Menu",
        url: "/docs/usage/mega-menu-desktop/how-to-use/"
      },
      {
        title: "Slide (Hamburger) Menu",
        url: "/docs/usage/slide-menu-hamburger-menu/how-to-use/"
      },
      {
        title: "FAB - Floating Menu",
        url: "/docs/usage/fab-floating-menu-quick-access/how-to-use/"
      },
      {
        title: "Grid Menu",
        url: "/docs/usage/grid-menu/how-to-use/"
      }
    ]
  },
  {
    title: "Tools",
    url: "https://tools.naviplus.io/"
  },
  {
    title: "Language",
    dropdown: true,
    children: [
      {
        title: "🇬🇧 English",
        url: typeof window !== 'undefined' ? window.location.href : '/'
      },
      { divider: true },
      {
        title: "🇫🇷 French",
        url: "https://translate.google.com/translate?sl=en&tl=fr&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇩🇪 German",
        url: "https://translate.google.com/translate?sl=en&tl=de&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇨🇳 Chinese (Simplified)",
        url: "https://translate.google.com/translate?sl=en&tl=zh-CN&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇯🇵 Japanese",
        url: "https://translate.google.com/translate?sl=en&tl=ja&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇮🇹 Italian",
        url: "https://translate.google.com/translate?sl=en&tl=it&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇧🇷 Portuguese (Brazil)",
        url: "https://translate.google.com/translate?sl=en&tl=pt&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      {
        title: "🇪🇸 Spanish",
        url: "https://translate.google.com/translate?sl=en&tl=es&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      },
      { divider: true },
      {
        title: "🌐 More languages...",
        url: "https://translate.google.com/?sl=en&tl=auto&op=translate&u=" + (typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''),
        target: "_blank"
      }
    ]
  }
];

// CTA button configuration
const navbarCTA = {
  text: "Get started for free",
  url: "https://naviplus.io/#get-started-for-free",
  class: "btn btn-primary btn-sm"
};

function buildNavLink(link) {
  if (link.dropdown && Array.isArray(link.children)) {
    const li = document.createElement('li');
    li.className = 'nav-item dropdown';

    const a = document.createElement('a');
    a.className = 'nav-link dropdown-toggle link-body-emphasis';
    a.href = '#';
    a.role = 'button';
    a.dataset.bsToggle = 'dropdown';
    a.ariaExpanded = 'false';
    a.textContent = link.title;
    li.appendChild(a);

    const menu = document.createElement('ul');
    menu.className = 'dropdown-menu';

    link.children.forEach(child => {
      if (child.divider) {
        const dividerLi = document.createElement('li');
        const hr = document.createElement('hr');
        hr.className = 'dropdown-divider';
        dividerLi.appendChild(hr);
        menu.appendChild(dividerLi);
      } else {
        const childLi = document.createElement('li');
        const childA = document.createElement('a');
        childA.className = 'dropdown-item';
        childA.href = child.url || '#';
        childA.textContent = child.title;
        if (child.target) childA.target = child.target;
        if (child.active) childA.setAttribute('aria-current', 'page');
        childLi.appendChild(childA);
        menu.appendChild(childLi);
      }
    });

    li.appendChild(menu);
    return li;
  } else {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'nav-link px-2 link-body-emphasis';
    a.href = link.url || '#';
    a.textContent = link.title;
    li.appendChild(a);
    return li;
  }
}

function renderNavbar() {
  const listContainer = document.getElementById('navbar-links');
  if (listContainer) {
    listContainer.innerHTML = '';
    navbarLinks.forEach(link => {
      listContainer.appendChild(buildNavLink(link));
    });
  }

  const ctaContainer = document.getElementById('navbar-cta');
  if (ctaContainer && navbarCTA && navbarCTA.text && navbarCTA.url) {
    const btn = document.createElement('a');
    btn.href = navbarCTA.url;
    btn.className = navbarCTA.class || 'btn btn-primary btn-sm';
    btn.textContent = navbarCTA.text;
    ctaContainer.innerHTML = '';
    ctaContainer.appendChild(btn);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNavbar);
} else {
  renderNavbar();
}

