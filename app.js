(() => {
'use strict';
const $ = s => document.querySelector(s);
const uid = () => 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
const STORE = 'avec-rams-hrn-v1';
const hazardCategories = ['Mecánicos','Eléctricos','Térmicos','Ruido y vibraciones','Radiaciones','Materiales y sustancias','Ergonómicos','Entorno de trabajo','Otros'];
const defaultTasks = ['Producción / operación','Preparación / puesta a punto','Limpieza','Mantenimiento','Reparación','Ajuste / cambio de formato','Desatasco','Inspección','Transporte / manipulación','Otra tarea'];
const state = {data:loadData(), page:'dashboard', clientId:null, projectId:null, machineId:null, limitId:null, crossId:null, editor:null, installPrompt:null, search:''};
function loadData(){try{const d=JSON.parse(localStorage.getItem(STORE)||'{}');return {clients:Array.isArray(d.clients)?d.clients:[],hazardCategories:d.hazardCategories||hazardCategories,tasks:d.tasks||defaultTasks};}catch{return {clients:[],hazardCategories,tasks:defaultTasks};}}
function save(){localStorage.setItem(STORE,JSON.stringify(state.data));$('#saveStatus').textContent='Guardado local · '+new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function byId(list,id){return list.find(x=>x.id===id);}
function client(){return byId(state.data.clients,state.clientId);}
function project(){return byId(client()?.projects||[],state.projectId);}
function machine(){return byId(project()?.machines||[],state.machineId);}
function limit(){return byId(machine()?.limits||[],state.limitId);}
function notice(msg,error=false){const n=$('#notice');n.textContent=msg;n.classList.toggle('error',error);n.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>n.classList.add('hidden'),5000);}
function stat(label,value){return `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`;}
function allCrosses(){return state.data.clients.flatMap(c=>(c.projects||[]).flatMap(p=>(p.machines||[]).flatMap(m=>(m.limits||[]).flatMap(l=>l.crosses||[]))));}
function renderDashboard(){
 state.page='dashboard';$('#dashboard').classList.remove('hidden');$('#workspace').classList.add('hidden');
 const projects=state.data.clients.reduce((n,c)=>n+(c.projects||[]).length,0), machines=state.data.clients.reduce((n,c)=>n+(c.projects||[]).reduce((a,p)=>a+(p.machines||[]).length,0),0), possible=allCrosses().filter(x=>x.possible==='Y').length;
 $('#stats').innerHTML=stat('Clientes',state.data.clients.length)+stat('Proyectos',projects)+stat('Líneas / máquinas',machines)+stat('Cruces posibles (Y)',possible);
 const q=state.search.toLowerCase();
 const clients=state.data.clients.filter(c=>JSON.stringify(c).toLowerCase().includes(q));
 $('#clientList').innerHTML=clients.map(c=>`<article class="record-card"><div class="record-icon">C</div><div class="record-main"><h3>${esc(c.name)}</h3><p>${esc(c.industry||'Industria no especificada')} · ${esc(c.plant||'Planta no especificada')} · ${(c.projects||[]).length} proyecto(s)</p></div><div class="record-actions"><button class="mini-btn primary" data-action="open-client" data-id="${c.id}">Abrir</button><button class="mini-btn" data-action="edit-client" data-id="${c.id}">Editar</button><button class="mini-btn" data-action="delete-client" data-id="${c.id}">Eliminar</button></div></article>`).join('');
 $('#emptyState').classList.toggle('hidden',clients.length>0);
 if(!state.data.clients.length) $('#emptyState').classList.remove('hidden');
}
function showWorkspace(title,sub,html,eyebrow='RELEVAMIENTO'){
 $('#dashboard').classList.add('hidden');$('#workspace').classList.remove('hidden');$('#workspaceTitle').textContent=title;$('#workspaceSubtitle').textContent=sub||'';$('#workspaceEyebrow').textContent=eyebrow;$('#workspaceContent').innerHTML=html;
}
function breadcrumb(parts){return `<div class="breadcrumb">${parts.map((p,i)=>`${i?'<span>›</span>':''}${p.action?`<button data-action="${p.action}">${esc(p.label)}</button>`:`<span>${esc(p.label)}</span>`}`).join('')}</div>`;}
function renderClient(){
 const c=client();if(!c)return renderDashboard();
 const html=breadcrumb([{label:'Clientes',action:'dashboard'},{label:c.name}])+`<div class="section-head"><div><h3>Proyectos</h3><p class="muted">Un cliente puede contener varios proyectos.</p></div><button class="btn btn-primary" data-action="new-project">＋ Nuevo proyecto</button></div><div class="card-list">${(c.projects||[]).map(p=>`<article class="record-card"><div class="record-icon">P</div><div class="record-main"><h3>${esc(p.name)}</h3><p>${esc(p.description||'Sin descripción')} · ${(p.machines||[]).length} línea(s) / máquina(s)</p></div><div class="record-actions"><button class="mini-btn primary" data-action="open-project" data-id="${p.id}">Abrir</button><button class="mini-btn" data-action="edit-project" data-id="${p.id}">Editar</button><button class="mini-btn" data-action="delete-project" data-id="${p.id}">Eliminar</button></div></article>`).join('')}</div>${!(c.projects||[]).length?'<div class="empty"><strong>Sin proyectos</strong><p>Creá un proyecto para continuar.</p></div>':''}`;
 showWorkspace(c.name,`${c.industry||'Industria no especificada'} · ${c.plant||'Planta no especificada'}`,html,'1 · CLIENTE');
}
function renderProject(){
 const c=client(),p=project();if(!p)return renderClient();
 const html=breadcrumb([{label:'Clientes',action:'dashboard'},{label:c.name,action:'open-client'},{label:p.name}])+`<div class="section-head"><div><h3>Líneas / máquinas</h3><p class="muted">Cada línea o máquina contiene sus límites espaciales y funcionales.</p></div><button class="btn btn-primary" data-action="new-machine">＋ Nueva línea / máquina</button></div><div class="card-list">${(p.machines||[]).map(m=>`<article class="record-card"><div class="record-icon">M</div><div class="record-main"><h3>${esc(m.name)}</h3><p>${esc(m.kind||'Tipo no especificado')} · ${(m.limits||[]).length} límite(s)</p></div><div class="record-actions"><button class="mini-btn primary" data-action="open-machine" data-id="${m.id}">Abrir</button><button class="mini-btn" data-action="edit-machine" data-id="${m.id}">Editar</button><button class="mini-btn" data-action="delete-machine" data-id="${m.id}">Eliminar</button></div></article>`).join('')}</div>${!(p.machines||[]).length?'<div class="empty"><strong>Sin líneas o máquinas</strong><p>Agregá la primera para registrar sus límites.</p></div>':''}`;
 showWorkspace(p.name,`Proyecto de ${c.name}`,html,'2 · PROYECTO');
}
function renderMachine(){
 const c=client(),p=project(),m=machine();if(!m)return renderProject();
 const html=breadcrumb([{label:'Clientes',action:'dashboard'},{label:c.name,action:'open-client'},{label:p.name,action:'open-project'},{label:m.name}])+`<div class="section-head"><div><h3>Límites de la línea / máquina</h3><p class="muted">Definí cada límite para evaluar peligros y tareas de forma independiente.</p></div><button class="btn btn-primary" data-action="new-limit">＋ Nuevo límite</button></div><div class="card-list">${(m.limits||[]).map(l=>`<article class="record-card"><div class="record-icon">L</div><div class="record-main"><h3>${esc(l.name)}</h3><p>${esc(l.description||'Sin descripción')} · ${(l.crosses||[]).length} cruce(s) configurado(s)</p></div><div class="record-actions"><button class="mini-btn primary" data-action="open-limit" data-id="${l.id}">Evaluar</button><button class="mini-btn" data-action="edit-limit" data-id="${l.id}">Editar</button><button class="mini-btn" data-action="delete-limit" data-id="${l.id}">Eliminar</button></div></article>`).join('')}</div>${!(m.limits||[]).length?'<div class="empty"><strong>Sin límites registrados</strong><p>Agregá al menos un límite para comenzar la matriz.</p></div>':''}`;
 showWorkspace(m.name,`Línea / máquina · ${p.name}`,html,'3 · LÍNEA / MÁQUINA');
}
function renderLimit(){
 const c=client(),p=project(),m=machine(),l=limit();if(!l)return renderMachine();
 const crosses=l.crosses||[];
 const cats=state.data.hazardCategories;
 const tasks=state.data.tasks;
 const html=breadcrumb([{label:'Clientes',action:'dashboard'},{label:c.name,action:'open-client'},{label:p.name,action:'open-project'},{label:m.name,action:'open-machine'},{label:l.name}])+`
 <div class="section-head"><div><h3>Matriz de peligros y tareas</h3><p class="muted">Marcar Y únicamente cuando el peligro puede presentarse durante la tarea en este límite.</p></div><button class="btn btn-primary" data-action="new-cross">＋ Configurar cruce</button></div>
 <div class="inline-note"><strong>Regla de habilitación:</strong> la ficha RAMS se habilita solo para cruces marcados <b>Y</b>. Los cruces <b>N</b> no permiten cargar factores ni calcular HRN.</div>
 <div class="toolbar"><label class="search-label">Categoría de peligro<select id="hazardFilter"><option value="">Todas las categorías</option>${cats.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label class="search-label">Grupo de tarea<select id="taskFilter"><option value="">Todos los grupos</option>${tasks.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label></div>
 <div class="matrix-wrap"><table class="matrix"><thead><tr><th>Categoría de peligro</th><th>Peligro / condición peligrosa</th><th>Grupo de tarea</th><th>Posible</th><th>Evaluación</th><th>Acciones</th></tr></thead><tbody id="matrixRows">${crosses.map(crossRow).join('')}</tbody></table></div>
 <p class="small">Los catálogos iniciales son editables desde la configuración del proyecto; deben validarse contra las celdas A1:I1 y la columna de tareas del libro RAMS oficial antes del uso definitivo.</p>`;
 showWorkspace(l.name,`Límite de ${m.name} · ${crosses.length} cruce(s)`,html,'4–5 · LÍMITES / MATRIZ');
}
function crossRow(x){return `<tr data-cat="${esc(x.category)}" data-task="${esc(x.taskGroup)}"><td>${esc(x.category)}</td><td><strong>${esc(x.hazard)}</strong></td><td>${esc(x.taskGroup)}</td><td><button class="yn ${x.possible==='Y'?'yes':'no'}" data-action="toggle-cross" data-id="${x.id}" aria-label="Cambiar posibilidad">${x.possible}</button></td><td>${x.possible==='Y'?`<button class="mini-btn primary" data-action="open-cross" data-id="${x.id}">${x.rams?'Editar RAMS':'Cargar RAMS'}</button>`:'<span class="small">No habilitada</span>'}</td><td><button class="mini-btn" data-action="edit-cross" data-id="${x.id}">Editar</button> <button class="mini-btn" data-action="delete-cross" data-id="${x.id}">Eliminar</button></td></tr>`;}
function renderCross(){
 const l=limit(),x=byId(l?.crosses||[],state.crossId);if(!x||x.possible!=='Y')return renderLimit();
 const r=x.rams||{};
 const factors=['FE','DPH','NP','LO'];
 const scenario=(key,label,desc)=>{const d=r[key]||{FE:1,DPH:1,NP:1,LO:1};const val=factors.reduce((n,k)=>n*(Number(d[k])||0),1);return `<div class="hrn-card"><h4>${label}</h4><div class="hrn-value">${Number.isFinite(val)?val.toLocaleString('es-AR',{maximumFractionDigits:2}):'—'}</div><div class="hrn-label">HRN = FE × DPH × NP × LO</div><div class="factor-list">${factors.map(k=>`<div class="field"><label>${k}</label><input type="number" min="0" step="any" data-factor="${k}" data-scenario="${key}" value="${esc(d[k]??1)}"></div>`).join('')}</div><p class="small">${desc}</p></div>`;};
 const html=breadcrumb([{label:'Clientes',action:'dashboard'},{label:client().name,action:'open-client'},{label:project().name,action:'open-project'},{label:machine().name,action:'open-machine'},{label:limit().name,action:'open-limit'},{label:'RAMS'}])+`
 <div class="content-block"><div class="block-head"><div><h3>${esc(x.hazard)}</h3><p class="muted">${esc(x.category)} · Tarea: ${esc(x.taskGroup)}</p></div><span class="risk-tag">Cruce Y · Posible</span></div><p class="muted">${esc(x.description||'Sin descripción adicional')}</p></div>
 <div class="section-head"><div><h3>Evaluación HRN por escenario</h3><p class="muted">Ingresá los factores de acuerdo con las escalas definidas en el procedimiento RAMS aplicable.</p></div><button class="btn btn-light" data-action="open-limit">← Volver a matriz</button></div>
 <div class="inline-note"><strong>Importante:</strong> se muestra el producto de los cuatro factores. Los valores y umbrales de clasificación deben contrastarse con las escalas oficiales del Excel; no se asignan automáticamente categorías de riesgo sin esa validación.</div>
 <div class="hrn-grid">${scenario('unprotected','1 · Sin protección','Condición de referencia sin medidas de protección.')}${scenario('current','2 · Protecciones actuales','Considera las medidas instaladas y efectivas.')}${scenario('proposed','3 · Nuevas medidas','Ajustá DPH para mitigación y/o LO para prevención.')}</div>
 <div class="content-block"><h3>Medidas correctivas / preventivas propuestas</h3><div class="field"><label>Descripción de las medidas</label><textarea id="measures" placeholder="Describir medida, responsable, plazo y evidencia de implementación…">${esc(r.measures||'')}</textarea></div><div class="field" style="margin-top:12px"><label>Observaciones del relevamiento</label><textarea id="observations" placeholder="Condiciones observadas, supuestos y referencias…">${esc(r.observations||'')}</textarea></div><div class="dialog-actions"><button class="btn btn-secondary" data-action="save-rams">Guardar evaluación</button><button class="btn btn-primary" data-action="save-rams-back">Guardar y volver a matriz</button></div></div>`;
 showWorkspace('Evaluación RAMS',`${x.hazard} · ${x.taskGroup}` ,html,'6 · RAMS / CÁLCULO HRN');
}
function openEditor(type,id=null){
 const specs={
 client:{title:id?'Editar cliente':'Nuevo cliente',fields:[['name','Nombre del cliente','text',true],['industry','Tipo de industria','text',false],['plant','Planta','text',false],['notes','Notas','textarea',false]]},
 project:{title:id?'Editar proyecto':'Nuevo proyecto',fields:[['name','Nombre del proyecto','text',true],['description','Descripción / alcance','textarea',false]]},
 machine:{title:id?'Editar línea / máquina':'Nueva línea / máquina',fields:[['name','Nombre de línea / máquina','text',true],['kind','Tipo','select',false,['Línea','Máquina','Celda','Equipo','Otro']],['description','Descripción','textarea',false]]},
 limit:{title:id?'Editar límite':'Nuevo límite',fields:[['name','Nombre del límite','text',true],['description','Descripción del límite espacial / funcional','textarea',false]]},
 cross:{title:id?'Editar cruce':'Configurar cruce peligro × tarea',fields:[['category','Categoría de peligro','select',true,state.data.hazardCategories],['hazard','Peligro / condición peligrosa','text',true],['taskGroup','Grupo de tarea','select',true,state.data.tasks],['possible','¿El cruce es posible?','select',true,['Y','N']],['description','Descripción / evidencia','textarea',false]]}
 };
 const spec=specs[type];state.editor={type,id};
 $('#dialogTitle').textContent=spec.title;$('#dialogEyebrow').textContent=type.toUpperCase();
 const obj=id?getObject(type,id):{};
 $('#dialogFields').innerHTML=spec.fields.map(f=>{const [key,label,kind,required,opts]=f;let input='';
 if(kind==='select')input=`<select name="${key}" ${required?'required':''}>${(opts||[]).map(o=>`<option ${String(obj[key]??'')===String(o)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
 else if(kind==='textarea')input=`<textarea name="${key}" ${required?'required':''}>${esc(obj[key]||'')}</textarea>`;
 else input=`<input name="${key}" type="${kind}" value="${esc(obj[key]||'')}" ${required?'required':''} autocomplete="off">`;
 return `<div class="field ${kind==='textarea'?'full':''}"><label>${label}${required?' *':''}</label>${input}</div>`;}).join('');
 $('#editorDialog').showModal();
}
function getObject(type,id){if(type==='client')return byId(state.data.clients,id)||{};if(type==='project')return byId(client()?.projects||[],id)||{};if(type==='machine')return byId(project()?.machines||[],id)||{};if(type==='limit')return byId(machine()?.limits||[],id)||{};if(type==='cross')return byId(limit()?.crosses||[],id)||{};return {};}
function submitEditor(ev){ev.preventDefault();const {type,id}=state.editor;const form=new FormData($('#editorForm'));const obj=Object.fromEntries(form.entries());let target;
 if(type==='client'){if(id){target=byId(state.data.clients,id);Object.assign(target,obj);}else state.data.clients.push({...obj,id:uid(),projects:[]});}
 else {const parent=type==='project'?client():type==='machine'?project():type==='limit'?machine():limit();const arr=type==='project'?(parent.projects||[]):type==='machine'?(parent.machines||[]):type==='limit'?(parent.limits||[]):(parent.crosses||[]);if(!parent)return;
 if(type==='project'&&!parent.projects)parent.projects=[];if(type==='machine'&&!parent.machines)parent.machines=[];if(type==='limit'&&!parent.limits)parent.limits=[];if(type==='cross'&&!parent.crosses)parent.crosses=[];
 const actual=type==='project'?parent.projects:type==='machine'?parent.machines:type==='limit'?parent.limits:parent.crosses;
 if(id){target=byId(actual,id);Object.assign(target,obj);if(type==='cross'&&obj.possible==='N')delete target.rams;}else{target={...obj,id:uid()};if(type==='project')target.machines=[];if(type==='machine')target.limits=[];if(type==='limit')target.crosses=[];if(type==='cross'&&obj.possible==='Y')target.rams={unprotected:{FE:1,DPH:1,NP:1,LO:1},current:{FE:1,DPH:1,NP:1,LO:1},proposed:{FE:1,DPH:1,NP:1,LO:1}};actual.push(target);}
 }
 save();$('#editorDialog').close();renderCurrent();
}
function removeRecord(type,id){if(!confirm('¿Eliminar este registro y sus elementos asociados?'))return;let arr=type==='client'?state.data.clients:type==='project'?client().projects:type==='machine'?project().machines:type==='limit'?machine().limits:limit().crosses;const i=arr.findIndex(x=>x.id===id);if(i>=0)arr.splice(i,1);save();renderCurrent();}
function renderCurrent(){if(state.page==='dashboard')renderDashboard();else if(state.page==='client')renderClient();else if(state.page==='project')renderProject();else if(state.page==='machine')renderMachine();else if(state.page==='limit')renderLimit();else if(state.page==='cross')renderCross();}
function route(action,id){
 if(action==='dashboard'){state.page='dashboard';renderDashboard();return;}
 if(action==='open-client'){if(id)state.clientId=id;state.page='client';renderClient();return;}
 if(action==='open-project'){if(id)state.projectId=id;state.page='project';renderProject();return;}
 if(action==='open-machine'){if(id)state.machineId=id;state.page='machine';renderMachine();return;}
 if(action==='open-limit'){if(id)state.limitId=id;state.page='limit';renderLimit();return;}
 if(action==='open-cross'){state.crossId=id;state.page='cross';const x=byId(limit().crosses,id);if(x?.possible==='Y')renderCross();else notice('La ficha RAMS solo está disponible para cruces marcados Y.',true);return;}
 const editMap={'new-client':['client',null],'edit-client':['client',id],'new-project':['project',null],'edit-project':['project',id],'new-machine':['machine',null],'edit-machine':['machine',id],'new-limit':['limit',null],'edit-limit':['limit',id],'new-cross':['cross',null],'edit-cross':['cross',id]};
 if(editMap[action]){openEditor(...editMap[action]);return;}
 const delMap={'delete-client':'client','delete-project':'project','delete-machine':'machine','delete-limit':'limit','delete-cross':'cross'};
 if(delMap[action]){removeRecord(delMap[action],id);return;}
 if(action==='toggle-cross'){const x=byId(limit().crosses,id);if(!x)return;x.possible=x.possible==='Y'?'N':'Y';if(x.possible==='N')delete x.rams;else x.rams={unprotected:{FE:1,DPH:1,NP:1,LO:1},current:{FE:1,DPH:1,NP:1,LO:1},proposed:{FE:1,DPH:1,NP:1,LO:1}};save();renderLimit();return;}
 if(action==='save-rams'||action==='save-rams-back'){saveRams();if(action==='save-rams-back'){state.page='limit';renderLimit();notice('Evaluación RAMS guardada.');}else notice('Evaluación RAMS guardada.');}
}
function saveRams(){const x=byId(limit().crosses,state.crossId);if(!x||x.possible!=='Y')return;const r=x.rams||{};document.querySelectorAll('[data-factor]').forEach(inp=>{const key=inp.dataset.scenario,f=inp.dataset.factor;if(!r[key])r[key]={};r[key][f]=Math.max(0,Number(inp.value)||0);});r.measures=$('#measures')?.value||'';r.observations=$('#observations')?.value||'';x.rams=r;save();renderCross();}
function exportFile(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function exportJson(){exportFile('RAMS_HRN_respaldo_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state.data,null,2),'application/json');}
function exportCsv(){
 const rows=[['Cliente','Industria','Planta','Proyecto','Línea/Máquina','Límite','Categoría peligro','Peligro','Grupo tarea','Posible','Escenario','FE','DPH','NP','LO','HRN','Medidas','Observaciones']];
 state.data.clients.forEach(c=>(c.projects||[]).forEach(p=>(p.machines||[]).forEach(m=>(m.limits||[]).forEach(l=>(l.crosses||[]).forEach(x=>{
 if(x.possible!=='Y'){rows.push([c.name,c.industry,c.plant,p.name,m.name,l.name,x.category,x.hazard,x.taskGroup,'N','','','','','','','','']);return;}
 ['unprotected','current','proposed'].forEach((key,i)=>{const r=x.rams?.[key]||{},f=['FE','DPH','NP','LO'].map(k=>Number(r[k]??0)),hrn=f.reduce((a,b)=>a*b,1);rows.push([c.name,c.industry,c.plant,p.name,m.name,l.name,x.category,x.hazard,x.taskGroup,'Y',['Sin protección','Protecciones actuales','Nuevas medidas'][i],...f,hrn,x.rams?.measures||'',x.rams?.observations||'']);});
 })))));
 const csv=rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');exportFile('RAMS_HRN_datos_'+new Date().toISOString().slice(0,10)+'.csv','\ufeff'+csv,'text/csv;charset=utf-8');
}
function importJson(file){const reader=new FileReader();reader.onload=()=>{try{const d=JSON.parse(reader.result);if(!Array.isArray(d.clients))throw new Error('El archivo no contiene una lista de clientes válida.');if(!confirm('La importación reemplazará los datos locales actuales. ¿Continuar?'))return;state.data={clients:d.clients,hazardCategories:d.hazardCategories||hazardCategories,tasks:d.tasks||defaultTasks};save();renderDashboard();notice('Respaldo importado correctamente.');}catch(e){notice('No se pudo importar: '+e.message,true);}};reader.readAsText(file);}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-action]');if(!b)return;ev.preventDefault();route(b.dataset.action,b.dataset.id);});
$('#newClient').addEventListener('click',()=>openEditor('client'));$('#emptyNew').addEventListener('click',()=>openEditor('client'));$('#goHome').addEventListener('click',()=>{state.page='dashboard';renderDashboard();});$('#backDashboard').addEventListener('click',()=>{state.page='dashboard';renderDashboard();});
$('#editorForm').addEventListener('submit',submitEditor);$('#closeDialog').addEventListener('click',()=>$('#editorDialog').close());$('#cancelDialog').addEventListener('click',()=>$('#editorDialog').close());
$('#search').addEventListener('input',e=>{state.search=e.target.value;renderDashboard();$('#search').value=state.search;});
$('#exportJson').addEventListener('click',exportJson);$('#exportCsv').addEventListener('click',exportCsv);$('#importJson').addEventListener('click',()=>$('#importFile').click());$('#importFile').addEventListener('change',e=>{if(e.target.files[0])importJson(e.target.files[0]);e.target.value='';});
$('#workspaceContent').addEventListener('change',e=>{if(e.target.id==='hazardFilter'||e.target.id==='taskFilter'){const cat=$('#hazardFilter').value,task=$('#taskFilter').value;document.querySelectorAll('#matrixRows tr').forEach(tr=>tr.classList.toggle('hidden',!!((cat&&tr.dataset.cat!==cat)||(task&&tr.dataset.task!==task))));}});
window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);
function updateConnection(){const el=$('#connection');el.classList.toggle('online',navigator.onLine);el.innerHTML=`<i></i> ${navigator.onLine?'Online':'Offline · datos locales'}`;}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').addEventListener('click',async()=>{if(!state.installPrompt)return;state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null;$('#installBtn').classList.add('hidden');});
if('serviceWorker'in navigator&&location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
updateConnection();renderDashboard();
})();