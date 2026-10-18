"""Genera fondo-moleculas.svg (versión premium).
# Uso: python3 herramientas/generar_fondo_moleculas.py fondo-moleculas.svg
# Después de regenerarlo, comprobar que ninguna molécula se cruce (medir las
# cajas de cada <g class="mol"> en el navegador, incluidas las copias vecinas
# del mosaico de 900x1100) y subir la versión de caché en sw.js.
Cada molécula se define con átomos (x,y en unidades de enlace) y enlaces;
los colores siguen el código MDEC. Todas son estructuras reales."""
import math, sys
G='#166534'; T='#0891b2'; D='#b45309'; P='#CC79A7'   # cadena, ramificación, insaturación, grupo funcional
L=40  # longitud de enlace
def zig(n,start=(0,0),up=True):
    pts=[];x,y=start
    for i in range(n):
        pts.append((x+i*L*math.cos(math.radians(30)), y+(0 if (i%2==0)==up else -L*0.5)))
    return pts
def mol_chain(n): # zigzag horizontal
    return [(i*34.64, 0 if i%2==0 else -20) for i in range(n)]
def ring(cx,cy,r=23):
    return [(cx+r*math.cos(math.radians(-90+60*k)), cy+r*math.sin(math.radians(-90+60*k))) for k in range(6)]

MOLS={}
# atoms: list of (x,y,label or None,color); bonds: (i,j,order,color)
c=mol_chain(5)
MOLS['2-metilpentano']=dict(atoms=[(x,y,None,G) for x,y in c]+[(c[1][0],c[1][1]-40,None,T)],
    bonds=[(0,1,1,G),(1,2,1,G),(2,3,1,G),(3,4,1,G),(1,5,1,T)])
c=mol_chain(5)
MOLS['pent-2-eno']=dict(atoms=[(x,y,None,G) for x,y in c],
    bonds=[(0,1,1,G),(1,2,2,D),(2,3,1,G),(3,4,1,G)])
r=ring(0,0)
MOLS['benceno']=dict(atoms=[(x,y,None,G) for x,y in r], bonds=[(k,(k+1)%6,1,G) for k in range(6)], circle=(0,0,13,P))
c=mol_chain(4)
MOLS['butan-2-ol']=dict(atoms=[(x,y,None,G) for x,y in c]+[(c[1][0],c[1][1]-40,'OH',P)],
    bonds=[(0,1,1,G),(1,2,1,G),(2,3,1,G),(1,4,1,P)])
c=mol_chain(3)
MOLS['ácido propanoico']=dict(atoms=[(x,y,None,G) for x,y in c]+[(c[2][0],c[2][1]-40,'O',P),(c[2][0]+34.64,c[2][1]+20,'OH',P)],
    bonds=[(0,1,1,G),(1,2,1,G),(2,3,2,P),(2,4,1,P)])
r=ring(0,0)
MOLS['metilciclohexano']=dict(atoms=[(x,y,None,G) for x,y in r]+[(r[1][0]+34.64,r[1][1]-20,None,T)],
    bonds=[(k,(k+1)%6,1,G) for k in range(6)]+[(1,6,1,T)])
c=mol_chain(4)
MOLS['butan-2-ona']=dict(atoms=[(x,y,None,G) for x,y in c]+[(c[1][0],c[1][1]-40,'O',P)],
    bonds=[(0,1,1,G),(1,2,1,G),(2,3,1,G),(1,4,2,P)])
MOLS['but-2-ino']=dict(atoms=[(i*40,0,None,G) for i in range(4)], bonds=[(0,1,1,G),(1,2,3,D),(2,3,1,G)])
c=mol_chain(3)
MOLS['propan-1-amina']=dict(atoms=[(x,y,None,G) for x,y in c]+[(c[2][0]+34.64,c[2][1]-20,'NH₂',P)],
    bonds=[(0,1,1,G),(1,2,1,G),(2,3,1,P)])
c=mol_chain(4)
MOLS['but-1-eno']=dict(atoms=[(x,y,None,G) for x,y in c], bonds=[(0,1,2,D),(1,2,1,G),(2,3,1,G)])

def render(name,x,y,rot,scale,op):
    m=MOLS[name]; A=m['atoms']
    cx=sum(a[0] for a in A)/len(A); cy=sum(a[1] for a in A)/len(A)
    out=[f'  <!-- {name} -->',f'  <g class="mol" opacity="{op}" transform="translate({x} {y}) rotate({rot}) scale({scale}) translate({-cx:.1f} {-cy:.1f})">']
    def trim(i,j):
        (x1,y1,l1,_),(x2,y2,l2,_)=A[i],A[j]
        dx,dy=x2-x1,y2-y1; d=math.hypot(dx,dy); ux,uy=dx/d,dy/d
        s1=11 if l1 else 0; s2=(14 if l2 and len(l2)>1 else 11) if l2 else 0
        return x1+ux*s1,y1+uy*s1,x2-ux*s2,y2-uy*s2,ux,uy
    for i,j,o,col in m['bonds']:
        x1,y1,x2,y2,ux,uy=trim(i,j); nx,ny=-uy,ux
        if o==1: out.append(f'    <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}"/>')
        elif o==2:
            for s in (-2.6,2.6): out.append(f'    <line x1="{x1+nx*s:.1f}" y1="{y1+ny*s:.1f}" x2="{x2+nx*s:.1f}" y2="{y2+ny*s:.1f}" stroke="{col}"/>')
        else:
            for s in (-4,0,4): out.append(f'    <line x1="{x1+nx*s:.1f}" y1="{y1+ny*s:.1f}" x2="{x2+nx*s:.1f}" y2="{y2+ny*s:.1f}" stroke="{col}"/>')
    if 'circle' in m:
        a,b,rr,col=m['circle']; out.append(f'    <circle cx="{a}" cy="{b}" r="{rr}" stroke="{col}"/>')
    for (ax,ay,l,col) in A:
        if l: out.append(f'    <text x="{ax:.1f}" y="{ay:.1f}" fill="{col}" stroke="none" text-anchor="middle" dominant-baseline="central" transform="rotate({-rot} {ax:.1f} {ay:.1f})">{l}</text>')
        else: out.append(f'    <circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}" stroke="none"/>')
    out.append('  </g>')
    return '\n'.join(out)

W,H=900,1100
P_=[  # (molécula, x, y, rotación, escala, opacidad) — x,y = centro
 ('benceno',110,120,0,1.5,.55),('2-metilpentano',420,90,-8,1.0,1),('butan-2-ona',740,150,6,1.15,.8),
 ('but-2-ino',280,300,-12,1.0,1),('ácido propanoico',620,360,4,1.3,.6),
 ('butan-2-ol',110,470,-6,1.15,.8),('metilciclohexano',420,560,10,1.35,.55),('propan-1-amina',770,600,-4,1.05,1),
 ('pent-2-eno',230,760,6,1.25,.65),('but-1-eno',600,820,-10,1.0,1),
 ('benceno',820,980,0,1.0,1),('butan-2-ona',120,980,-4,0.95,1),('2-metilpentano',460,1010,8,1.3,.55),
]
body=[render(*p) for p in P_]
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<!-- Marca de agua de ChromaNom (versión premium): moléculas reales en fórmula
     esqueletal, trazo fino con nodos en los átomos de carbono, coloreadas con
     el código MDEC: verde = cadena · turquesa = ramificación ·
     dorado = insaturación · rosa = grupo funcional.
     Generado con un script: cada molécula tiene su propio espacio y el mosaico
     se repite sin que ninguna se cruce con otra (comprobado midiendo en el
     navegador). Distintos tamaños/opacidades dan sensación de profundidad. -->
<g fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" font-family="Outfit, Arial, sans-serif" font-weight="600" font-size="17">
''' + '\n'.join(body) + '\n</g>\n</svg>\n'
open(sys.argv[1],'w',encoding='utf-8').write(svg)
