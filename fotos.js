/* ChromaNom / IonNom · fotos reales de bancos de imágenes libres (Wikimedia
   Commons, buscadas con Openverse) con su cita en formato APA debajo.
   Cada imagen se guarda dentro del sitio para que funcione sin internet; la
   cita indica autor, año, título, fuente y la licencia libre con que se puede usar.
   Uso: <div data-foto="clave" data-pie="Pie de foto"></div>  o  FOTO('clave','pie').
   Los datos de cada foto están en fotos-datos.js (window.FOTOS_DATOS).
   La ruta de las imágenes es window.FOTOS_RUTA (por defecto «img/fotos/»). */
(function(){
var F=window.FOTOS_DATOS||{},R=window.FOTOS_RUTA||'img/fotos/';
var css='.foto{margin:14px auto;max-width:560px;background:#fff;color:#0d2d42;border:1px solid #cbd5e1;border-radius:12px;overflow:hidden}'+
'.foto img{display:block;width:100%;height:auto;max-height:340px;object-fit:cover;background:#eef2f7}'+
'.foto.cont img{object-fit:contain}'+
'.foto figcaption{padding:8px 11px 9px;font-size:.88rem;line-height:1.4}'+
'.foto .pie{display:block;font-weight:600;margin-bottom:4px}'+
'.foto .apa{display:block;font-style:normal;font-size:.72rem;color:#475569;line-height:1.4;overflow-wrap:anywhere;padding-left:1.4em;text-indent:-1.4em}'+
'.foto .apa a{color:inherit}@media print{.foto{break-inside:avoid}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function apa(d){
  return esc(d.autor).replace(/\.$/,'')+'. ('+esc(d.anio||'s. f.')+'). <i>'+esc(d.titulo)+'</i> ['+esc(d.tipo||'Fotografía')+']. '+esc(d.fuente||'Wikimedia Commons')+'. '+
    '<a href="'+esc(d.url)+'" target="_blank" rel="noopener">'+esc(d.url)+'</a>. '+
    (d.licUrl?'Licencia <a href="'+esc(d.licUrl)+'" target="_blank" rel="noopener">'+esc(d.lic)+'</a>.':esc(d.lic)+'.');
}
window.FOTO_APA=function(k){return F[k]?apa(F[k]):'';};
window.FOTO=function(k,pie,cls){
  var d=F[k]; if(!d)return '';
  return '<figure class="foto'+(cls?' '+cls:'')+'"><img src="'+R+k+'.jpg" alt="'+esc(pie||d.titulo)+'" loading="lazy" width="'+(d.w||640)+'" height="'+(d.h||480)+'">'+
    '<figcaption>'+(pie?'<span class="pie">'+pie+'</span>':'')+'<cite class="apa">'+apa(d)+'</cite></figcaption></figure>';
};
function montar(){document.querySelectorAll('[data-foto]').forEach(function(el){
  el.outerHTML=FOTO(el.getAttribute('data-foto'),el.getAttribute('data-pie')||'',el.getAttribute('data-cls')||'');});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
})();
