/* Kristiyana Marcheva portfolio, interactions */
(function () {
  var root = document.documentElement;

  // Loading screen: shown on the first visit of a session, until the page has loaded
  function ready() {
    root.classList.add('ready');
    setTimeout(function () { root.classList.remove('loading'); }, root.classList.contains('seen') ? 0 : 500);
  }
  if (root.classList.contains('seen')) { root.classList.remove('loading'); }
  else {
    var start = Date.now();
    var go = function () { setTimeout(ready, Math.max(0, 1100 - (Date.now() - start))); };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    setTimeout(ready, 6000); // never keep anyone waiting longer than this
  }

  // Gooey nav pill: follows the hovered link, rests on the current page
  document.querySelectorAll('.nav .navlist').forEach(function (ul) {
    var goo = ul.querySelector('.goo'); if (!goo) return;
    var blobs = goo.querySelectorAll('i');
    var active = ul.querySelector('.pl.on');
    var shown = false;
    function place(el) { blobs.forEach(function (b) { b.style.setProperty('--x', el.offsetLeft + 'px'); b.style.setProperty('--w', el.offsetWidth + 'px'); }); }
    ul.querySelectorAll('.pl').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        if (!shown) {
          ul.classList.add('still'); place(active || a); ul.classList.add('gooing'); shown = true;
          requestAnimationFrame(function () { requestAnimationFrame(function () { ul.classList.remove('still'); place(a); }); });
        } else place(a);
      });
    });
    ul.addEventListener('mouseleave', function () {
      if (active) place(active); else { ul.classList.remove('gooing'); shown = false; }
    });
    window.addEventListener('resize', function () { if (shown && active) place(active); });
  });

  // Work page filters
  var filters = document.querySelectorAll('.filters [data-filter]');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) { var on = b === btn; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      document.querySelectorAll('.grid .card').forEach(function (c) {
        var cats = (c.dataset.cats || '').split(' ');
        c.classList.toggle('off', !(f === 'all' || cats.indexOf(f) > -1));
      });
    });
  });

  // Design process pop-up
  var modal = document.querySelector('.pmodal');
  if (modal) {
    var imgs = JSON.parse(modal.dataset.images || '[]'), i = 0, opener = null;
    var pic = modal.querySelector('.pimg img'), num = modal.querySelector('.pn');
    function show(n) { i = (n + imgs.length) % imgs.length; pic.src = imgs[i][0]; pic.alt = imgs[i][1]; if (num) num.textContent = (i + 1) + ' / ' + imgs.length; }
    function open(e) { opener = e.currentTarget; show(0); modal.hidden = false; modal.classList.add('open'); root.style.overflow = 'hidden'; var c = modal.querySelector('[data-proc-close].pbtn'); if (c) c.focus(); }
    function close() { modal.classList.remove('open'); modal.hidden = true; root.style.overflow = ''; if (opener) opener.focus(); }
    imgs.forEach(function (p) { var im = new Image(); im.src = p[0]; }); // preload
    document.querySelectorAll('[data-proc-open]').forEach(function (b) { b.addEventListener('click', open); });
    modal.querySelectorAll('[data-proc-close]').forEach(function (b) { b.addEventListener('click', close); });
    modal.querySelectorAll('[data-proc-prev]').forEach(function (b) { b.addEventListener('click', function () { show(i - 1); }); });
    modal.querySelectorAll('[data-proc-next]').forEach(function (b) { b.addEventListener('click', function () { show(i + 1); }); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'ArrowRight') show(i + 1);
    });
  }
})();
