(function () {
  var GROUPS = {
    images: [
      { key: 'tool_webp_title',     en: 'Image Converter',    path: '/toolset/images/convert-to-webp.html',     icon: 'ri-swap-line'    },
      { key: 'tool_resizer_title',  en: 'Image Resizer',      path: '/toolset/images/image-resizer.html',       icon: 'ri-crop-line'    },
      { key: 'tool_palette_title',  en: 'Color Palette',      path: '/toolset/design/color-palette.html',       icon: 'ri-palette-line' },
      { key: 'tool_collage_title',    en: 'Photo Collage',    path: '/toolset/images/photo-collage.html',  icon: 'ri-layout-grid-line'  },
      { key: 'tool_watermark_title',  en: 'Image Watermark',  path: '/toolset/images/watermark.html',      icon: 'ri-copyright-line'    },
      { key: 'tool_rmbg_title',       en: 'BG Remover',       path: '/toolset/images/remove-background.html', icon: 'ri-scissors-cut-line' },
      { key: 'tool_cp_title',         en: 'Color Picker',     path: '/toolset/images/color-picker.html',      icon: 'ri-contrast-drop-2-line'   },
      { key: 'tool_imgup_title',      en: 'Temp Upload',      path: '/toolset/images/upload-image.html',      icon: 'ri-links-line'              }
    ],
    security: [
      { key: 'tool_encrypt_title',  en: 'AES-GCM Encrypt',   path: '/toolset/security/encrypt.html',           icon: 'ri-lock-line'       },
      { key: 'tool_password_title', en: 'Password Generator', path: '/toolset/security/generate-password.html', icon: 'ri-key-2-line'      },
      { key: 'tool_jwt_title',      en: 'JWT Decoder',        path: '/toolset/security/jwt-decoder.html',       icon: 'ri-shield-keyhole-line'  },
      { key: 'tool_hash_title',     en: 'Hash Generator',     path: '/toolset/security/hash-generator.html',    icon: 'ri-fingerprint-line'     }
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
    var skel = document.getElementById('np-page-skel');
    if (skel) {
      skel.classList.add('hide');
      setTimeout(function () { if (skel.parentNode) skel.parentNode.removeChild(skel); }, 300);
    }
  });

  window.uploadToFreeImageHost = async function(source, opts) {
    opts = opts || {};
    var type = opts.type || 'jpeg';
    var quality = (opts.quality != null) ? opts.quality : 0.92;
    var controller = new AbortController();
    var to = setTimeout(function() { controller.abort(); }, 15000);
    try {
      var base64;
      if (source instanceof Blob) {
        base64 = await new Promise(function(res, rej) {
          var r = new FileReader();
          r.onload = function() { res(r.result.split(',')[1]); };
          r.onerror = rej;
          r.readAsDataURL(source);
        });
      } else {
        var c = source;
        if (type === 'jpeg') {
          c = document.createElement('canvas');
          c.width = source.width; c.height = source.height;
          var ctx2 = c.getContext('2d');
          ctx2.fillStyle = '#ffffff';
          ctx2.fillRect(0, 0, c.width, c.height);
          ctx2.drawImage(source, 0, 0);
        }
        base64 = c.toDataURL(type === 'png' ? 'image/png' : 'image/jpeg', quality).split(',')[1];
      }
      var form = new FormData();
      form.append('image', base64);
      var res = await fetch(
        'https://api.imgbb.com/1/upload?key=0143a80320a4fd9a946836bfc65a44e9',
        { method: 'POST', body: form, signal: controller.signal }
      );
      clearTimeout(to);
      if (!res.ok) throw new Error('http_error');
      var data = await res.json();
      if (!data.success) throw new Error((data.error && data.error.message) || 'api_error');
      return data.data.url;
    } catch (err) {
      clearTimeout(to);
      if (err.name === 'AbortError') { var e = new Error('timeout'); e.code = 'timeout'; throw e; }
      throw err;
    }
  };

  window.showSnackbar = function(msg) {
    var s = document.getElementById('np-snackbar');
    if (!s) {
      s = document.createElement('div');
      s.id = 'np-snackbar';
      s.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(12px);background:#323232;color:#fff;padding:10px 20px;border-radius:8px;font-size:13.5px;z-index:99999;opacity:0;transition:opacity .18s,transform .18s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,.22);';
      document.body.appendChild(s);
    }
    s.textContent = msg;
    s.style.opacity = '1';
    s.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(s._to);
    s._to = setTimeout(function() {
      s.style.opacity = '0';
      s.style.transform = 'translateX(-50%) translateY(12px)';
    }, 3000);
  };

  window.copyToClipboard = function(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text).catch(function() {
        execCopy(text);
      });
    }
    execCopy(text);
    return Promise.resolve();
  };

  function execCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
})();
