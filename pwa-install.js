// ChromaNom — PWA Install
// Botón siempre visible + modal automático en primera visita.
// Cubre: Chrome/Android (beforeinstallprompt), Android manual, iOS Safari.
(function () {
  'use strict';

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // Ya está instalada — no mostrar nada
  if (isStandalone) return;

  let deferredPrompt = null;
  let btn = null;

  // ── Captura el evento nativo lo antes posible ─────────────────────────────
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (btn) btn.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (btn) btn.style.display = 'none';
    closeSheet();
  });

  // ── Bottom-sheet unificada ────────────────────────────────────────────────
  function showSheet(html, id) {
    if (document.getElementById(id)) return;
    const ov = document.createElement('div');
    ov.id = id;
    ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px;animation:pwa-fade .2s ease';
    ov.innerHTML = `
      <style>
        @keyframes pwa-fade{from{opacity:0}to{opacity:1}}
        @keyframes pwa-slide{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
        .pwa-card{animation:pwa-slide .25s ease;background:#fff;border-radius:18px;padding:22px 20px 20px;max-width:360px;width:100%;color:#0d2d42;box-shadow:0 8px 32px rgba(0,0,0,.28)}
        .pwa-card ol li{padding:4px 0}
        .pwa-btn-main{width:100%;background:#0d4a73;color:#fff;border:none;border-radius:10px;padding:13px;font-size:.92rem;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:8px}
        .pwa-btn-skip{width:100%;background:transparent;color:#4a6070;border:1px solid #d0dde8;border-radius:10px;padding:10px;font-size:.82rem;cursor:pointer;font-family:inherit}
        .pwa-btn-main:active{opacity:.85}.pwa-btn-skip:active{opacity:.7}
      </style>
      ${html}`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
    return ov;
  }

  function closeSheet() {
    ['pwa-sheet-native','pwa-sheet-android','pwa-sheet-ios'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function header() {
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
      <img src="icons/icon-192.png" width="44" height="44" style="border-radius:12px" alt="">
      <div>
        <div style="font-weight:800;font-size:1rem">Instalar ChromaNom</div>
        <div style="font-size:.75rem;color:#4a6070">Acceso rápido desde tu pantalla de inicio</div>
      </div>
    </div>`;
  }

  // ── Sheet 1: prompt nativo disponible ────────────────────────────────────
  function showNativeSheet() {
    const ov = showSheet(`
      <div class="pwa-card">
        ${header()}
        <p style="font-size:.84rem;line-height:1.6;margin-bottom:16px;color:#2a3f52">
          Instala la app para usarla <strong>sin conexión</strong>, acceder más rápido y tener una experiencia de pantalla completa.
        </p>
        <button class="pwa-btn-main" id="pwa-native-ok">⬇ Instalar ahora</button>
        <button class="pwa-btn-skip" id="pwa-native-skip">Ahora no</button>
      </div>`, 'pwa-sheet-native');
    if (!ov) return;
    ov.querySelector('#pwa-native-ok').addEventListener('click', () => {
      ov.remove();
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(({ outcome }) => {
        deferredPrompt = null;
        if (outcome === 'accepted' && btn) btn.style.display = 'none';
      });
    });
    ov.querySelector('#pwa-native-skip').addEventListener('click', () => ov.remove());
  }

  // ── Sheet 2: Android sin prompt nativo (instrucciones manuales) ──────────
  function showAndroidSheet() {
    const ov = showSheet(`
      <div class="pwa-card">
        ${header()}
        <ol style="margin:0 0 16px;padding-left:22px;font-size:.84rem;line-height:1.7;color:#1a3a50">
          <li>Toca el menú <strong>⋮</strong> (tres puntos) arriba a la derecha</li>
          <li>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla de inicio"</strong></li>
          <li>Toca <strong>Instalar</strong> para confirmar</li>
        </ol>
        <button class="pwa-btn-main" id="pwa-android-ok">Entendido</button>
        <button class="pwa-btn-skip" id="pwa-android-skip">Ahora no</button>
      </div>`, 'pwa-sheet-android');
    if (!ov) return;
    ov.querySelector('#pwa-android-ok').addEventListener('click', () => ov.remove());
    ov.querySelector('#pwa-android-skip').addEventListener('click', () => ov.remove());
  }

  // ── Sheet 3: iOS Safari ──────────────────────────────────────────────────
  function showIOSSheet() {
    const ov = showSheet(`
      <div class="pwa-card">
        ${header()}
        <ol style="margin:0 0 16px;padding-left:22px;font-size:.84rem;line-height:1.7;color:#1a3a50">
          <li>Toca el botón <strong>Compartir</strong> &#9096; en la barra del navegador</li>
          <li>Desplázate hasta <strong>"Agregar a pantalla de inicio"</strong></li>
          <li>Toca <strong>Agregar</strong> para confirmar</li>
        </ol>
        <button class="pwa-btn-main" id="pwa-ios-ok">Entendido</button>
        <button class="pwa-btn-skip" id="pwa-ios-skip">Ahora no</button>
      </div>`, 'pwa-sheet-ios');
    if (!ov) return;
    ov.querySelector('#pwa-ios-ok').addEventListener('click', () => ov.remove());
    ov.querySelector('#pwa-ios-skip').addEventListener('click', () => ov.remove());
  }

  // ── Decide qué mostrar al pulsar el botón ────────────────────────────────
  function onInstallClick() {
    if (isIOS) { showIOSSheet(); return; }
    if (deferredPrompt) { showNativeSheet(); return; }
    showAndroidSheet();
  }

  // ── Modal automático en primera visita (una vez por sesión) ──────────────
  function autoPrompt() {
    if (sessionStorage.getItem('pwa-prompted')) return;
    sessionStorage.setItem('pwa-prompted', '1');
    setTimeout(() => {
      if (isStandalone) return;
      if (isIOS) { showIOSSheet(); return; }
      if (deferredPrompt) { showNativeSheet(); return; }
      if (isAndroid) { showAndroidSheet(); }
    }, 4000);
  }

  // ── Botón siempre visible en el nav ──────────────────────────────────────
  function inject() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.title = 'Instalar ChromaNom en este dispositivo';
    btn.innerHTML = '⬇<span class="pwa-lbl"> Instalar</span>';
    btn.style.cssText = [
      'display:inline-flex',
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
      'transition:background .15s',
      'white-space:nowrap',
    ].join(';');
    btn.addEventListener('mouseover', () => { btn.style.background = 'rgba(255,255,255,.22)'; });
    btn.addEventListener('mouseout',  () => { btn.style.background = 'rgba(255,255,255,.13)'; });
    btn.addEventListener('click', onInstallClick);

    // Ocultar texto en pantallas muy estrechas
    const lbl = btn.querySelector('.pwa-lbl');
    const mq = window.matchMedia('(max-width:480px)');
    const syncLbl = e => { if (lbl) lbl.style.display = e.matches ? 'none' : ''; };
    mq.addEventListener('change', syncLbl);
    syncLbl(mq);

    navLinks.appendChild(btn);
    autoPrompt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
