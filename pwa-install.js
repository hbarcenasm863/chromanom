// ChromaNom — PWA Install Button
// Handles beforeinstallprompt (Chrome/Android/Edge) and iOS instructions.
// Injected into .nav-links; hidden when already installed (standalone mode).
(function () {
  'use strict';

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // Nothing to do if already installed
  if (isStandalone) return;

  let deferredPrompt = null;
  let btn = null;

  // ── Create button ─────────────────────────────────────────────────────────
  function buildButton() {
    const b = document.createElement('button');
    b.id = 'pwa-install-btn';
    b.title = 'Instalar ChromaNom en este dispositivo';
    b.innerHTML = '⬇<span id="pwa-install-label"> Instalar</span>';
    // Match .site-nav a style from all pages
    b.style.cssText = [
      'display:none',
      'align-items:center',
      'gap:5px',
      'background:rgba(255,255,255,.13)',
      'border:1.5px solid rgba(255,255,255,.28)',
      'color:#fff',
      'font-size:.78rem',
      'font-weight:600',
      'padding:5px 11px',
      'border-radius:8px',
      'cursor:pointer',
      'font-family:inherit',
      'letter-spacing:-.01em',
      'transition:background .15s,color .15s',
      'white-space:nowrap',
    ].join(';');
    b.addEventListener('mouseover', () => { b.style.background = 'rgba(255,255,255,.22)'; });
    b.addEventListener('mouseout',  () => { b.style.background = 'rgba(255,255,255,.13)'; });
    // Hide label text on narrow screens (mirrors .site-nav a span.full)
    const lbl = b.querySelector('#pwa-install-label');
    const mq = window.matchMedia('(max-width:480px)');
    const syncLabel = e => { if (lbl) lbl.style.display = e.matches ? 'none' : ''; };
    mq.addEventListener('change', syncLabel);
    syncLabel(mq);
    return b;
  }

  function show() { if (btn) btn.style.display = 'inline-flex'; }
  function hide() { if (btn) btn.style.display = 'none'; }

  // ── iOS: show a bottom-sheet with Add-to-Home-Screen instructions ─────────
  function showIOSSheet() {
    if (document.getElementById('pwa-ios-sheet')) return;
    const sheet = document.createElement('div');
    sheet.id = 'pwa-ios-sheet';
    sheet.style.cssText = [
      'position:fixed','inset:0','z-index:9999',
      'background:rgba(0,0,0,.55)',
      'display:flex','align-items:flex-end','justify-content:center',
      'padding:12px',
      'animation:pwa-fade .2s ease',
    ].join(';');
    sheet.innerHTML = `
      <style>
        @keyframes pwa-fade{from{opacity:0}to{opacity:1}}
        @keyframes pwa-slide{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        #pwa-ios-sheet .pwa-card{animation:pwa-slide .25s ease}
        #pwa-ios-sheet ol li{padding:4px 0}
      </style>
      <div class="pwa-card" style="background:#fff;border-radius:18px;padding:22px 20px 20px;max-width:360px;width:100%;color:#0d2d42;box-shadow:0 8px 32px rgba(0,0,0,.28)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <img src="icons/icon-192.png" width="40" height="40" style="border-radius:10px" alt="">
          <div>
            <div style="font-weight:700;font-size:.95rem">Instalar ChromaNom</div>
            <div style="font-size:.75rem;color:#4a6070">Añadir a pantalla de inicio</div>
          </div>
        </div>
        <ol style="margin:0 0 16px;padding-left:22px;font-size:.84rem;line-height:1.6;color:#1a3a50">
          <li>Toca el botón <strong>Compartir</strong>&nbsp;&#9096; en la barra del navegador</li>
          <li>Desplázate hasta <strong>"Agregar a pantalla de inicio"</strong></li>
          <li>Toca <strong>Agregar</strong> para confirmar</li>
        </ol>
        <button id="pwa-ios-close"
          style="width:100%;background:#0d2d42;color:#fff;border:none;border-radius:10px;padding:11px;font-size:.88rem;font-weight:700;cursor:pointer;font-family:inherit">
          Entendido
        </button>
      </div>`;
    document.body.appendChild(sheet);
    sheet.querySelector('#pwa-ios-close').addEventListener('click', () => sheet.remove());
    sheet.addEventListener('click', e => { if (e.target === sheet) sheet.remove(); });
  }

  // ── Chrome / Android / Edge: use beforeinstallprompt ──────────────────────
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    show();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hide();
  });

  // ── Wire up button click ──────────────────────────────────────────────────
  function onInstallClick() {
    if (isIOS) {
      showIOSSheet();
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(({ outcome }) => {
      deferredPrompt = null;
      if (outcome === 'accepted') hide();
    });
  }

  // ── Inject into nav once DOM is ready ────────────────────────────────────
  function inject() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    btn = buildButton();
    btn.addEventListener('click', onInstallClick);
    navLinks.appendChild(btn);

    // iOS: always show the button (no beforeinstallprompt event on Safari)
    if (isIOS) show();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
