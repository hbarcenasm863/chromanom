/* palabras-dba.js — Curso y DBA de cada palabra del banco de palabras (el mismo archivo en BioNom, ChromaNom e
   IonNom). Los datos van en palabras-dba-datos.js (GENERADO desde la revisión de agentes expertos en currículo
   MEN: window.PALABRAS_DBA = {PALABRA:{dba:[…],curso:N}}). Este archivo:
     · pone w.dba y w.curso a cada palabra de BANCO_AHORCADO;
     · agrega en las pestañas de Crucigramas, Ahorcado, Sopa de letras y Criptograma del panel docente el
       selector «Palabras hasta el curso», que deja en el banco solo las palabras de ese curso o anteriores
       (se guarda en el equipo). Las palabras del método MDEC (modelo propio del docente) no llevan DBA.
   Se carga en docente.html después del banco de palabras y antes de los juegos de palabras. */
(function(){
'use strict';
var B=window.BANCO_AHORCADO,D=window.PALABRAS_DBA||{};if(!Array.isArray(B))return;
var TODAS=B.slice(),CLAVE='palabras_curso_docente';
TODAS.forEach(function(w){var d=D[w[0]];if(d){w.dba=d.dba;w.curso=d.curso;}});
function leer(){try{var v=localStorage.getItem(CLAVE);return /^(6|7|8|9|10|11)$/.test(v||'')?+v:0;}catch(e){return 0;}}
function aplicar(c){
  var quedan=TODAS.filter(function(w){return !c||!w.curso||w.curso<=c;});
  B.length=0;Array.prototype.push.apply(B,quedan);
  var sel=document.querySelectorAll('.pal-curso select'),notas=document.querySelectorAll('.pal-curso .pal-n');
  for(var i=0;i<sel.length;i++)sel[i].value=String(c||'');
  for(var j=0;j<notas.length;j++)notas[j].textContent=quedan.length+' de '+TODAS.length+' palabras';
}
window.PALABRAS_CURSO={aplicar:aplicar,todas:function(){return TODAS.slice();}};
var CAJAS=['panel-cz','panel-ah','panel-sp','panel-cr','tab-crucigramas','tab-ahorcado','tab-sopa','tab-criptograma'];
function barra(){
  var d=document.createElement('div');d.className='pal-curso no-print';
  d.style.cssText='display:flex;flex-wrap:wrap;align-items:center;gap:.5em;margin:.2em 0 .8em;font-size:.92em';
  var ops='<option value="">Todos los cursos</option>';for(var g=6;g<=11;g++)ops+='<option value="'+g+'">Hasta '+g+'.°</option>';
  d.innerHTML='<label>Palabras hasta el curso: <select aria-label="Palabras hasta el curso">'+ops+'</select></label>'+
    '<small class="pal-n" style="opacity:.75"></small>'+
    '<small style="opacity:.75">(según los DBA del MEN; cambia el banco de crucigramas, ahorcado, sopa y criptograma)</small>';
  d.querySelector('select').addEventListener('change',function(){var c=+this.value||0;try{localStorage.setItem(CLAVE,c?String(c):'');}catch(e){}aplicar(c);});
  return d;
}
function poner(){
  CAJAS.forEach(function(id){var p=document.getElementById(id);if(!p||p.tagName==='BUTTON'||p.querySelector('.pal-curso'))return;p.insertBefore(barra(),p.firstChild);});
  aplicar(leer());
}
aplicar(leer());
if(document.readyState==='complete')setTimeout(poner,0);else window.addEventListener('load',function(){setTimeout(poner,0);});
/* si un juego vuelve a pintar su pestaña y borra el selector, se pone otra vez al abrirla */
document.addEventListener('click',function(){setTimeout(function(){CAJAS.forEach(function(id){var p=document.getElementById(id);if(p&&p.tagName!=='BUTTON'&&!p.querySelector('.pal-curso'))poner();});},50);});
})();
