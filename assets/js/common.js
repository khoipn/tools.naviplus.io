(function () {
  var GROUPS = {
    images: [
      { key: 'tool_webp_title',     en: 'Image Converter',    path: '/toolset/images/convert-to-webp.html',     icon: 'ri-swap-line'    },
      { key: 'tool_resizer_title',  en: 'Image Resizer',      path: '/toolset/images/image-resizer.html',       icon: 'ri-crop-line'    },
      { key: 'tool_palette_title',  en: 'Color Palette',      path: '/toolset/design/color-palette.html',       icon: 'ri-palette-line' }
    ],
    security: [
      { key: 'tool_encrypt_title',  en: 'AES-GCM Encrypt',   path: '/toolset/security/encrypt.html',           icon: 'ri-lock-line'  },
      { key: 'tool_password_title', en: 'Password Generator', path: '/toolset/security/generate-password.html', icon: 'ri-key-2-line' }
    ]
  };

  window.renderToolTabs = function () {
    var container = document.getElementById('tool-tabs');
    if (!container) return;

    var path = window.location.pathname;
    var langPrefix = (window.getLangPrefix && window.getLangPrefix()) || '';
    if (langPrefix && path.indexOf(langPrefix) === 0) {
      path = path.slice(langPrefix.length) || '/';
    }
    if (path !== '/' && path.slice(-1) === '/') path = path.slice(0, -1);

    var currentGroup = null;
    var groupKeys = Object.keys(GROUPS);
    for (var i = 0; i < groupKeys.length; i++) {
      var tools = GROUPS[groupKeys[i]];
      for (var j = 0; j < tools.length; j++) {
        if (path === tools[j].path) { currentGroup = groupKeys[i]; break; }
      }
      if (currentGroup) break;
    }

    if (!currentGroup) { container.innerHTML = ''; return; }

    var tr   = window.t || function (k, def) { return def || k; };
    var base = window.location.origin + langPrefix;

    container.innerHTML = '';
    GROUPS[currentGroup].forEach(function (tool) {
      var a = document.createElement('a');
      a.href      = base + tool.path;
      a.className = 'tool-tab' + (path === tool.path ? ' active' : '');
      a.innerHTML = '<i class="' + tool.icon + '"></i>' + tr(tool.key, tool.en);
      container.appendChild(a);
    });
  };

  function injectShareButton() {
    var h1 = document.querySelector('.tool-page-header h1');
    if (!h1 || h1.parentNode.classList.contains('tool-title-row')) return;

    var url   = window.location.href;
    var title = document.title;

    var shareItems = [
      { icon: 'ri-twitter-x-line',  label: 'X / Twitter',  href: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title) },
      { icon: 'ri-facebook-line',   label: 'Facebook',     href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) },
      { icon: 'ri-linkedin-line',   label: 'LinkedIn',     href: 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) },
      { icon: 'ri-whatsapp-line',   label: 'WhatsApp',     href: 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url) },
    ];

    var menu = document.createElement('div');
    menu.className = 'tool-share-menu';

    shareItems.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'tool-share-item';
      a.href      = item.href;
      a.target    = '_blank';
      a.rel       = 'noopener noreferrer';
      a.innerHTML = '<i class="' + item.icon + '"></i>' + item.label;
      menu.appendChild(a);
    });

    var divider = document.createElement('div');
    divider.className = 'tool-share-divider';
    menu.appendChild(divider);

    var copyBtn = document.createElement('button');
    copyBtn.className = 'tool-share-item';
    copyBtn.innerHTML = '<i class="ri-link"></i>Copy link';
    copyBtn.addEventListener('click', function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          copyBtn.innerHTML = '<i class="ri-check-line"></i>Copied!';
          setTimeout(function () { copyBtn.innerHTML = '<i class="ri-link"></i>Copy link'; }, 2000);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.innerHTML = '<i class="ri-check-line"></i>Copied!';
        setTimeout(function () { copyBtn.innerHTML = '<i class="ri-link"></i>Copy link'; }, 2000);
      }
      menu.classList.remove('open');
    });
    menu.appendChild(copyBtn);

    var wrap = document.createElement('div');
    wrap.className = 'tool-share-wrap';

    var btn = document.createElement('button');
    btn.className = 'tool-share-btn';
    btn.innerHTML = '<i class="ri-share-line"></i>Share';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
        return;
      }
      menu.classList.toggle('open');
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);

    var row = document.createElement('div');
    row.className = 'tool-title-row';
    h1.parentNode.insertBefore(row, h1);
    row.appendChild(h1);
    row.appendChild(wrap);

    document.addEventListener('click', function () { menu.classList.remove('open'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.renderToolTabs();
    injectShareButton();
  });
})();
