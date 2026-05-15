(function () {
  var root = document.documentElement;
  var mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function hasDarkSignal(el) {
    if (!el) return false;

    var cls = (el.className || '').toString().toLowerCase();
    var dataTheme = (el.getAttribute('data-theme') || '').toLowerCase();
    var bsTheme = (el.getAttribute('data-bs-theme') || '').toLowerCase();

    return cls.indexOf('dark') !== -1 || dataTheme === 'dark' || bsTheme === 'dark';
  }

  function hasLightSignal(el) {
    if (!el) return false;

    var cls = (el.className || '').toString().toLowerCase();
    var dataTheme = (el.getAttribute('data-theme') || '').toLowerCase();
    var bsTheme = (el.getAttribute('data-bs-theme') || '').toLowerCase();

    return cls.indexOf('light') !== -1 || dataTheme === 'light' || bsTheme === 'light';
  }

  function shouldEnableBetterDark() {
    var body = document.body;

    var explicitDark = hasDarkSignal(root) || hasDarkSignal(body);
    var explicitLight = hasLightSignal(root) || hasLightSignal(body);

    if (explicitLight) {
      return false;
    }

    if (explicitDark) {
      return true;
    }

    return mediaQuery ? mediaQuery.matches : false;
  }

  function applyState() {
    if (shouldEnableBetterDark()) {
      root.classList.add('lhc-betterdark-enabled');
    } else {
      root.classList.remove('lhc-betterdark-enabled');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyState);
  } else {
    applyState();
  }

  if (mediaQuery) {
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', applyState);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(applyState);
    }
  }

  var observer = new MutationObserver(applyState);
  observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });

  if (document.body) {
    observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });
    });
  }
})();
