/* BIM Automation Studio - extra GA4 event tracking.
   Loaded on every page after the gtag snippet. Sends anonymous interaction
   events only (no form contents, no names, no emails).
   Event-scoped params registered as custom dimensions in GA:
   event_category, event_label, link_text, page_section, video_title,
   faq_question, form_name, percent_scrolled */
(function () {
  if (typeof window.gtag !== 'function') return;

  var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';

  function send(name, params) {
    try { window.gtag('event', name, params || {}); } catch (e) {}
  }
  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim().slice(0, 100); }
  function slug(t) {
    return clean(t).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32);
  }
  function sectionOf(el) {
    if (!el || !el.closest) return 'other';
    if (el.closest('.floating-cta')) return 'floating';
    if (el.closest('nav')) return 'nav';
    if (el.closest('footer')) return 'footer';
    var s = el.closest('section');
    if (!s) return 'other';
    if (s.getAttribute('data-track')) return s.getAttribute('data-track');
    if (s.id) return s.id;
    var cls = (s.className || '').split(/\s+/)[0];
    if (cls && cls !== 'section') return cls;
    var h = s.querySelector('h2, h3');
    if (h) return slug(h.textContent) || 'section';
    return 'section';
  }

  /* Clicks: in-page CTAs and email links. Floating CTAs keep their inline
     gtag call, so they are skipped here to avoid double counting. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a, button') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var sec = sectionOf(a);
    var base = { page_section: sec, link_text: clean(a.textContent), event_label: page + '_' + sec };

    if (/^mailto:/i.test(href)) {
      base.event_category = 'contact';
      send('email_click', base);
      return;
    }
    var inline = a.getAttribute('onclick') || '';
    if (/gtag\(/.test(inline)) return;
    if (a.tagName === 'BUTTON' && (a.type === 'submit' || a.closest('form'))) return;

    var isCta = /#get-in-touch/.test(href) || a.classList.contains('cta-button') || (/pricing\.html/.test(href) && a.classList.contains('btn'));
    if (isCta) {
      base.event_category = 'inline';
      send('cta_click', base);
    }
  }, true);

  /* Embedded YouTube players: a click into an iframe blurs the page window. */
  window.addEventListener('blur', function () {
    setTimeout(function () {
      var f = document.activeElement;
      if (f && f.tagName === 'IFRAME' && /youtube/.test(f.src || '') && !f.getAttribute('data-bas-tracked')) {
        f.setAttribute('data-bas-tracked', '1');
        var sec = sectionOf(f);
        send('video_embed_click', {
          video_title: clean(f.getAttribute('title')),
          page_section: sec,
          event_label: page + '_' + sec
        });
      }
    }, 0);
  });

  /* Self-hosted demo video (autoplays muted, so unmuting is the real signal). */
  Array.prototype.forEach.call(document.querySelectorAll('video'), function (v) {
    var title = v.getAttribute('title') || (v.getAttribute('src') || '').split('/').pop();
    var sent = false;
    v.addEventListener('volumechange', function () {
      if (sent || v.muted || v.volume === 0) return;
      sent = true;
      send('video_unmute', { video_title: title, page_section: sectionOf(v), event_label: page + '_video' });
    });
  });

  /* FAQ and accordion opens. */
  Array.prototype.forEach.call(document.querySelectorAll('details'), function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      var s = d.querySelector('summary');
      if (!s) return;
      var q = s.querySelector('.faq-item__q') || s;
      var sec = sectionOf(d);
      send('faq_open', { faq_question: clean(q.textContent), page_section: sec, event_label: page + '_' + sec });
    });
  });

  /* Form submits (name of the form only, never its contents). */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    var name = f.classList.contains('quick-form') ? page + '_quick_form' : page + '_' + sectionOf(f) + '_form';
    send('lead_form_submit', { form_name: name, page_section: sectionOf(f), event_label: name });
  }, true);

  /* Section views: fires once per section per page load when it is meaningfully on screen. */
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var big = en.intersectionRatio >= 0.4 || en.intersectionRect.height >= window.innerHeight * 0.5;
        if (!big) return;
        var sec = sectionOf(en.target);
        io.unobserve(en.target);
        if (seen[sec]) return;
        seen[sec] = 1;
        send('section_view', { page_section: sec, event_label: page + '_' + sec });
      });
    }, { threshold: [0, 0.1, 0.25, 0.4, 0.6] });
    Array.prototype.forEach.call(document.querySelectorAll('section'), function (s) { io.observe(s); });
  }

  /* Scroll depth at 25 / 50 / 75 percent (GA's built-in scroll only fires at 90). */
  var marks = [25, 50, 75], hit = {};
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    var pct = (window.scrollY / max) * 100;
    marks.forEach(function (m) {
      if (pct >= m && !hit[m]) {
        hit[m] = 1;
        send('scroll_depth', { percent_scrolled: m, event_label: page + '_' + m });
      }
    });
    if (hit[75]) window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
