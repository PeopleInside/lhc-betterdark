(function () {
  var root = document.documentElement;
  var betterDarkClass = 'lhc-betterdark-enabled';
  var mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var applyScheduled = false;
  var ignoreNextRootClassMutation = false;

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
    var shouldEnable = shouldEnableBetterDark();
    var hasClass = root.classList.contains(betterDarkClass);

    if (hasClass === shouldEnable) {
      return;
    }

    ignoreNextRootClassMutation = true;
    root.classList.toggle(betterDarkClass, shouldEnable);
  }

  function scheduleApplyState() {
    if (applyScheduled) {
      return;
    }

    applyScheduled = true;
    var run = function () {
      applyScheduled = false;
      applyState();
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(run);
    } else {
      window.setTimeout(run, 0);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyState);
  } else {
    applyState();
  }

  if (mediaQuery) {
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', scheduleApplyState);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(scheduleApplyState);
    }
  }

  if (typeof MutationObserver === 'function') {
    var observer = new MutationObserver(function (mutations) {
      if (ignoreNextRootClassMutation) {
        var shouldIgnore = true;

        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];

          if (!(mutation.target === root && mutation.attributeName === 'class')) {
            shouldIgnore = false;
            break;
          }
        }

        ignoreNextRootClassMutation = false;

        if (shouldIgnore) {
          return;
        }
      }

      scheduleApplyState();
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });

    if (document.body) {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme'] });
      });
    }
  }
})();
