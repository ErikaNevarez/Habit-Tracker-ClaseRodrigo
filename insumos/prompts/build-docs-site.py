#!/usr/bin/env python3
"""
Genera un index.html autocontenido que navega toda la documentacion de la guia
(README, guia didactica, skills, pre-clase, bloques 0-13, briefs y spec).

El contenido markdown queda EMBEBIDO en el HTML, asi que el archivo funciona
abriendolo directo (file://). El formateo usa marked.js por CDN; si no hay
internet, muestra el texto crudo legible.

Uso:  python3 build-docs-site.py
Salida: insumos/prompts/index.html
"""
import os
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(script_dir, "..", ".."))


def rel(p):
    return os.path.relpath(p, repo_root).replace(os.sep, "/")


docs = {}


def add(path):
    if os.path.isfile(path):
        with open(path, encoding="utf-8") as f:
            docs[rel(path)] = f.read()


# Todos los .md dentro de insumos/prompts/ (excepto este script)
for root, dirs, files in os.walk(script_dir):
    for fn in sorted(files):
        if fn.endswith(".md"):
            add(os.path.join(root, fn))

# Extras fuera de prompts/
add(os.path.join(repo_root, "insumos", "brief.md"))
add(os.path.join(repo_root, "insumos", "brief-demo-expandido.md"))
add(os.path.join(repo_root, "spec.md"))
add(os.path.join(repo_root, "README.md"))

keys = set(docs.keys())
P = "insumos/prompts/"


def title_of(key):
    for line in docs[key].splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return key.split("/")[-1]


def link(key, label=None):
    lbl = label if label else title_of(key)
    return f'<li><a href="#" class="navlink" data-key="{key}">{lbl}</a></li>'


nav = ['<nav id="nav">']

# Inicio
nav.append('<div class="group"><div class="ghead">Inicio</div><ul>')
for k in [P + "README.md", P + "GUIA-DIDACTICA.md", P + "SKILLS-RECOMENDADAS.md"]:
    if k in keys:
        nav.append(link(k))
nav.append("</ul></div>")

# Pre-clase
pre = sorted(k for k in keys if k.startswith(P + "pre-clase/"))
pre.sort(key=lambda k: (0 if k.endswith("README.md") else 1, k))
if pre:
    nav.append('<div class="group"><div class="ghead">Pre-clase</div><ul>')
    for k in pre:
        nav.append(link(k))
    nav.append("</ul></div>")

# Bloques
bloque_dirs = sorted({k.split("/")[2] for k in keys if k.startswith(P + "bloque-")})
if bloque_dirs:
    nav.append('<div class="group"><div class="ghead">Bloques</div>')
    for bd in bloque_dirs:
        parts = bd.split("-")
        num = parts[1]
        name = " ".join(parts[2:])
        nav.append(f'<div class="sub">Bloque {num} · {name}</div><ul>')
        for k in sorted(k for k in keys if k.startswith(P + bd + "/")):
            nav.append(link(k))
        nav.append("</ul>")
    nav.append("</div>")

# Briefs y spec
extras = [
    k
    for k in ["insumos/brief.md", "insumos/brief-demo-expandido.md", "spec.md", "README.md"]
    if k in keys
]
if extras:
    nav.append('<div class="group"><div class="ghead">Briefs y spec</div><ul>')
    for k in extras:
        nav.append(link(k))
    nav.append("</ul></div>")

nav.append("</nav>")
nav_html = "\n".join(nav)

docs_json = json.dumps(docs, ensure_ascii=False).replace("</", "<\\/")
default_key = P + "README.md" if (P + "README.md") in keys else sorted(keys)[0]

TEMPLATE = r"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Documentacion — Habit Tracker</title>
<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
<style>
  :root{
    --bg:#0f1115; --panel:#161922; --panel2:#1c2030; --text:#e6e8ee; --muted:#9aa3b2;
    --accent:#6ea8fe; --border:#262b38; --code:#0c0e13;
  }
  [data-theme="light"]{
    --bg:#f6f7f9; --panel:#ffffff; --panel2:#eef1f6; --text:#1b1f27; --muted:#5b6472;
    --accent:#2563eb; --border:#e2e6ee; --code:#f3f5f9;
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{
    font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    background:var(--bg); color:var(--text); display:flex;
  }
  #sidebar{
    width:320px; min-width:320px; height:100vh; overflow-y:auto;
    background:var(--panel); border-right:1px solid var(--border); padding:0 0 40px;
  }
  .brand{
    position:sticky; top:0; background:var(--panel); border-bottom:1px solid var(--border);
    padding:14px 16px; z-index:5;
  }
  .brand h1{font-size:15px;margin:0 0 2px}
  .brand p{margin:0;color:var(--muted);font-size:12px}
  .brand .row{display:flex;gap:8px;align-items:center;margin-top:10px}
  #search{
    flex:1; background:var(--panel2); color:var(--text); border:1px solid var(--border);
    border-radius:8px; padding:7px 10px; font-size:13px;
  }
  #theme{
    background:var(--panel2); color:var(--text); border:1px solid var(--border);
    border-radius:8px; padding:7px 10px; cursor:pointer; font-size:13px;
  }
  .group{padding:10px 8px 4px}
  .ghead{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);padding:6px 10px}
  .sub{font-size:12px;color:var(--muted);padding:8px 10px 2px;font-weight:600}
  nav ul{list-style:none;margin:0 0 6px;padding:0}
  nav a{
    display:block;padding:6px 10px;margin:1px 4px;border-radius:7px;
    color:var(--text);text-decoration:none;font-size:13.5px;
  }
  nav a:hover{background:var(--panel2)}
  nav a.active{background:var(--accent);color:#fff}
  #main{flex:1;height:100vh;overflow-y:auto}
  .topbar{
    display:none; position:sticky; top:0; background:var(--panel);
    border-bottom:1px solid var(--border); padding:10px 14px; z-index:4;
  }
  #content{max-width:860px;margin:0 auto;padding:40px 32px 120px}
  #content h1{font-size:28px;border-bottom:1px solid var(--border);padding-bottom:10px;margin-top:0}
  #content h2{font-size:22px;margin-top:34px;border-bottom:1px solid var(--border);padding-bottom:6px}
  #content h3{font-size:18px;margin-top:26px}
  #content a{color:var(--accent)}
  #content code{background:var(--code);padding:2px 6px;border-radius:5px;font-size:13px;
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  #content pre{background:var(--code);border:1px solid var(--border);border-radius:10px;
    padding:14px 16px;overflow:auto}
  #content pre code{background:none;padding:0;font-size:12.5px;line-height:1.5}
  #content blockquote{margin:14px 0;padding:8px 16px;border-left:3px solid var(--accent);
    background:var(--panel2);border-radius:0 8px 8px 0;color:var(--text)}
  #content table{border-collapse:collapse;width:100%;margin:16px 0;font-size:13.5px}
  #content th,#content td{border:1px solid var(--border);padding:8px 10px;text-align:left;vertical-align:top}
  #content th{background:var(--panel2)}
  #content hr{border:none;border-top:1px solid var(--border);margin:28px 0}
  .warn{background:#fde68a;color:#5b4500;padding:10px 14px;border-radius:8px;margin-bottom:16px}
  .menubtn{background:var(--panel2);color:var(--text);border:1px solid var(--border);
    border-radius:8px;padding:6px 10px;cursor:pointer}
  @media(max-width:820px){
    #sidebar{position:fixed;left:0;top:0;transform:translateX(-100%);transition:.2s;z-index:20;box-shadow:0 0 40px rgba(0,0,0,.4)}
    body.navopen #sidebar{transform:translateX(0)}
    .topbar{display:flex;gap:10px;align-items:center}
    #content{padding:24px 18px 100px}
  }
</style>
</head>
<body data-theme="dark">
  <aside id="sidebar">
    <div class="brand">
      <h1>Habit Tracker — Documentacion</h1>
      <p>Guia de construccion dirigiendo agentes</p>
      <div class="row">
        <input id="search" placeholder="Buscar..." autocomplete="off">
        <button id="theme" title="Tema">◐</button>
      </div>
    </div>
    __NAV__
  </aside>
  <div id="main">
    <div class="topbar">
      <button class="menubtn" id="menu">☰ Menu</button>
      <strong id="crumb"></strong>
    </div>
    <article id="content"></article>
  </div>

<script>
const DOCS = __DOCS__;
const DEFAULT = "__DEFAULT__";

function escapeHtml(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

function renderMd(md){
  if(window.marked && marked.parse){
    marked.setOptions({breaks:false, gfm:true});
    return marked.parse(md);
  }
  return '<div class="warn">No se pudo cargar el formateador (¿sin internet?). Texto crudo abajo.</div><pre>'+escapeHtml(md)+'</pre>';
}

function resolveKey(curKey, href){
  href = href.split('#')[0].split('?')[0];
  if(!href) return null;
  const stack = curKey.split('/').slice(0,-1);
  for(const p of href.split('/')){
    if(p==='..') stack.pop();
    else if(p==='.'||p==='') continue;
    else stack.push(p);
  }
  return stack.join('/');
}

function show(key, push){
  if(!DOCS[key]){ return; }
  const content = document.getElementById('content');
  content.innerHTML = renderMd(DOCS[key]);
  content.parentElement.scrollTop = 0;
  document.getElementById('crumb').textContent = key;
  document.querySelectorAll('.navlink').forEach(a=>{
    a.classList.toggle('active', a.dataset.key===key);
  });
  // Interceptar enlaces internos a otros .md
  content.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(/^https?:/i.test(href)){ a.target='_blank'; a.rel='noopener'; return; }
    if(href.startsWith('#')){ return; }
    const target = resolveKey(key, href);
    if(target && DOCS[target]){
      a.addEventListener('click',e=>{ e.preventDefault(); location.hash=encodeURIComponent(target); });
    }
  });
  if(push!==false) location.hash = encodeURIComponent(key);
  document.body.classList.remove('navopen');
}

document.querySelectorAll('.navlink').forEach(a=>{
  a.addEventListener('click',e=>{ e.preventDefault(); location.hash=encodeURIComponent(a.dataset.key); });
});

function fromHash(){
  const k = decodeURIComponent((location.hash||'').replace(/^#/,''));
  show(DOCS[k] ? k : DEFAULT, false);
}
window.addEventListener('hashchange', fromHash);

// Busqueda
document.getElementById('search').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase().trim();
  document.querySelectorAll('#nav .group').forEach(g=>{
    let anyG=false;
    g.querySelectorAll('ul').forEach(ul=>{
      let any=false;
      ul.querySelectorAll('li').forEach(li=>{
        const m = li.textContent.toLowerCase().includes(q);
        li.style.display = m ? '' : 'none';
        if(m) any=true;
      });
      const sub = ul.previousElementSibling;
      if(sub && sub.classList.contains('sub')) sub.style.display = any ? '' : 'none';
      if(any) anyG=true;
    });
    g.style.display = anyG ? '' : 'none';
  });
});

// Tema
document.getElementById('theme').addEventListener('click',()=>{
  const b=document.body;
  b.dataset.theme = b.dataset.theme==='dark' ? 'light' : 'dark';
});
document.getElementById('menu').addEventListener('click',()=>document.body.classList.toggle('navopen'));

fromHash();
</script>
</body>
</html>
"""

out = (
    TEMPLATE.replace("__NAV__", nav_html)
    .replace("__DOCS__", docs_json)
    .replace("__DEFAULT__", default_key)
)

out_path = os.path.join(script_dir, "index.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(out)

print(f"Generado: {rel(out_path)}  ({len(docs)} documentos)")
