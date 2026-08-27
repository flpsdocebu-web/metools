
const API="/api";
const indicators=[
"School has an updated Learning and Service Continuity Plan (LSCP) accessible to personnel.",
"School personnel are oriented on roles and responsibilities during emergencies.",
"Learner and personnel contact information / communication tree is updated.",
"Rapid assessment of affected learners, personnel, facilities, and learning resources is conducted.",
"Appropriate learning continuity level or alternative delivery arrangement is activated.",
"Learning materials and alternative learning resources are available and distributed as needed.",
"Strategies are in place for learners with limited connectivity, disability, displacement, or other barriers.",
"Learner attendance, participation, and access to learning are monitored during the emergency.",
"Health, safety, child protection, and psychosocial support measures are integrated in implementation.",
"Teachers receive instructional guidance, coaching, or technical assistance for emergency learning delivery.",
"Parents, LGUs, community partners, and other stakeholders are engaged when appropriate.",
"Data privacy and appropriate handling of learner and personnel information are observed.",
"Implementation issues and service gaps are documented and acted upon.",
"School recovery and transition-to-normalcy measures are identified and implemented.",
"Monitoring results are used to improve the LSCP and future emergency preparedness."
];
let state={token:null,user:null,emergencyRecords:[],continuityRecords:[]};
const scoreValues={"Compliant":3,"Partially Compliant":2,"Not Compliant":1};
function ratingFor(p){if(p==null)return"Not yet rated";if(p>=90)return"Outstanding";if(p>=80)return"Very Satisfactory";if(p>=70)return"Satisfactory";if(p>=60)return"Needs Improvement";return"Needs Immediate Technical Assistance"}
function calculateScore(items){const a=(items||[]).filter(x=>Object.hasOwn(scoreValues,x.status));const earned=a.reduce((n,x)=>n+scoreValues[x.status],0),maximum=a.length*3,percentage=maximum?Math.round(earned/maximum*10000)/100:null;return{earnedPoints:earned,maximumPoints:maximum,applicableItems:a.length,percentage,rating:ratingFor(percentage)}}
function scoreOfReport(r){const s=r.score||r.data?.score;return s&&s.percentage!=null?s:calculateScore(r.data?.checklist||r.checklist||[])}
function serializeChecklist(){return indicators.map((indicator,i)=>({indicator,status:qs("#meForm")?.elements.namedItem(`indicator_${i}_status`)?.value||""}))}
function updateLiveScore(){const box=qs("#liveScore");if(!box)return;const s=calculateScore(serializeChecklist());box.textContent=s.percentage==null?"—":`${s.percentage.toFixed(2)}%`;qs("#livePoints").textContent=s.maximumPoints?`${s.earnedPoints} of ${s.maximumPoints} points • ${s.applicableItems} applicable item${s.applicableItems===1?"":"s"}`:"Not Applicable items are excluded from scoring.";const p=qs("#liveRating");p.textContent=s.rating;p.className=`rating-pill ${s.percentage==null?"neutral":s.percentage>=80?"high":s.percentage>=60?"mid":"low"}`}

function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function toast(msg){const t=qs("#toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),3500)}
async function api(path,opts={}){
  const headers={"Content-Type":"application/json",...(opts.headers||{})};
  if(state.token) headers.Authorization=`Bearer ${state.token}`;
  const r=await fetch(API+path,{...opts,headers});
  const data=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(data.error||"Request failed");
  return data;
}
function setTabs(mode){
  qs("#loginForm").classList.toggle("hidden",mode!=="login");
  qs("#registerForm").classList.toggle("hidden",mode!=="register");
  qs("#loginTab").classList.toggle("active",mode==="login");
  qs("#registerTab").classList.toggle("active",mode==="register");
}
qs("#loginTab").addEventListener("click",()=>setTabs("login"));
qs("#registerTab").addEventListener("click",()=>setTabs("register"));
qs("#toggleLoginPassword").addEventListener("click",()=>{
  const f=qs("#loginPassword");const show=f.type==="password";f.type=show?"text":"password";qs("#toggleLoginPassword").textContent=show?"Hide":"Show";
});
qs("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault(); qs("#loginError").textContent="";
  try{
    const d=await api("/login",{method:"POST",body:JSON.stringify({username:qs("#loginUsername").value.trim(),password:qs("#loginPassword").value})});
    state.token=d.token;state.user=d.user;sessionStorage.setItem("eieToken",d.token);await openApp();
  }catch(err){qs("#loginError").textContent=err.message}
});
qs("#registerForm").addEventListener("submit",async e=>{
  e.preventDefault();qs("#registerError").textContent="";
  const password=qs("#regPassword").value,confirm=qs("#regConfirmPassword").value;
  if(password!==confirm){qs("#registerError").textContent="Passwords do not match.";return}
  try{
    await api("/register",{method:"POST",body:JSON.stringify({
      district:qs("#regDistrict").value.trim(),schoolName:qs("#regSchoolName").value.trim(),schoolId:qs("#regSchoolId").value.trim(),
      username:qs("#regUsername").value.trim(),password,confirmPassword:confirm
    })});
    toast("Account created and submitted for administrator approval.");qs("#registerForm").reset();setTabs("login");
  }catch(err){qs("#registerError").textContent=err.message}
});
qs("#logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem("eieToken");state={token:null,user:null};qs("#appView").classList.add("hidden");qs("#authView").classList.remove("hidden")});

function buildChecklist(){
  const tb=qs("#checklistTable tbody");tb.innerHTML="";
  indicators.forEach((x,i)=>tb.insertAdjacentHTML("beforeend",`<tr><td>${i+1}</td><td>${x}</td><td><select name="indicator_${i}_status"><option value="">Select...</option><option>Compliant</option><option>Partially Compliant</option><option>Not Compliant</option><option>Not Applicable</option></select></td><td><textarea rows="2" name="indicator_${i}_remarks"></textarea></td></tr>`));
  qsa("#checklistTable select").forEach(x=>x.addEventListener("change",updateLiveScore));updateLiveScore();
}
buildChecklist();

function navItems(){
  if(state.user.role==="admin") return [
    ["dashboardPage","Dashboard"],["mePage","M&E Tool"],["usersPage","User Management"],["submissionsPage","Submitted Reports"],["analyticsPage","Reports & Analytics"],["settingsPage","Settings"]
  ];
  return [["mePage","M&E Tool"],["myReportsPage","My Submitted Reports"],["profilePage","Profile"]];
}
function buildNav(){
  const n=qs("#sidebarNav");n.innerHTML="";
  navItems().forEach(([id,label])=>{
    const b=document.createElement("button");b.type="button";b.dataset.page=id;b.innerHTML=`<b>•</b><span>${label}</span>`;
    b.addEventListener("click",()=>showPage(id));n.appendChild(b);
  });
}
async function showPage(id){
  qsa(".page").forEach(p=>p.classList.add("hidden"));qs("#"+id).classList.remove("hidden");
  qsa("#sidebarNav button").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  if(id==="dashboardPage") await renderDashboard();
  if(id==="usersPage") await renderUsers();
  if(id==="submissionsPage") await renderSubmissions();
  if(id==="analyticsPage") await renderAnalytics();
  if(id==="myReportsPage") await renderMyReports();
  if(id==="profilePage") renderProfile();
  if(id==="settingsPage") renderSettings();
  if(id==="mePage") await loadDraft();
}
function fillSchoolProfile(){
  if(state.user.role!=="admin"){
    qs("#meDistrict").value=state.user.district||"";qs("#meSchoolName").value=state.user.schoolName||"";qs("#meSchoolId").value=state.user.schoolId||"";
    ["#meDistrict","#meSchoolName","#meSchoolId"].forEach(s=>qs(s).readOnly=true);
  }
}
function serializeForm(){
  const d=Object.fromEntries(new FormData(qs("#meForm")).entries());
  d.checklist=indicators.map((indicator,i)=>({indicator,status:d[`indicator_${i}_status`]||"",remarks:d[`indicator_${i}_remarks`]||""}));
  d.emergencies=state.emergencyRecords||[];
  d.continuityActivations=state.continuityRecords||[];
  d.score=calculateScore(d.checklist);
  return d;
}
function fillForm(data){
  if(!data)return;
  state.emergencyRecords=Array.isArray(data.emergencies)?data.emergencies:[];
  state.continuityRecords=Array.isArray(data.continuityActivations)?data.continuityActivations:[];
  for(const [k,v] of Object.entries(data)){
    if(k==="checklist"||v==null||typeof v==="object")continue;
    const el=qs("#meForm").elements.namedItem(k);if(!el)continue;
    if(el instanceof RadioNodeList){[...el].forEach(x=>x.checked=x.value===v)} else el.value=v;
  }
  if(Array.isArray(data.checklist)) data.checklist.forEach((x,i)=>{
    const s=qs("#meForm").elements.namedItem(`indicator_${i}_status`),r=qs("#meForm").elements.namedItem(`indicator_${i}_remarks`);
    if(s)s.value=x.status||"";if(r)r.value=x.remarks||"";
  });
  renderEmergencyRecords();renderContinuityRecords();
  updateLiveScore();
}
function formValue(name){return qs("#meForm").elements.namedItem(name)?.value||""}
function clearFields(names){names.forEach(name=>{const el=qs("#meForm").elements.namedItem(name);if(!el)return;if(el instanceof RadioNodeList)[...el].forEach(x=>x.checked=false);else el.value=""})}
function renderEmergencyRecords(){
  const box=qs("#emergencyRecords");if(!box)return;const rows=state.emergencyRecords||[];
  box.innerHTML=rows.length?rows.map((r,i)=>`<div class="saved-record"><div><span class="record-number">Emergency ${i+1}</span><strong>${esc(r.hazardType)}</strong><small>${esc(r.emergencyDate||"Date not specified")} • ${esc(r.affectedLearners||0)} learner(s) • ${esc(r.affectedPersonnel||0)} personnel</small><p>${esc(r.situationDescription||"No situation description.")}</p></div><button class="btn red remove-emergency" data-index="${i}" type="button">Remove</button></div>`).join(""):`<p class="muted">No emergency records saved yet.</p>`;
  qsa(".remove-emergency").forEach(b=>b.onclick=()=>{state.emergencyRecords.splice(Number(b.dataset.index),1);renderEmergencyRecords();toast("Emergency record removed.")});
}
function saveEmergencyRecord(){
  const record={hazardType:formValue("hazardType"),emergencyDate:formValue("emergencyDate"),affectedLearners:formValue("affectedLearners"),affectedPersonnel:formValue("affectedPersonnel"),situationDescription:formValue("situationDescription"),savedAt:new Date().toISOString()};
  if(!record.hazardType){toast("Please select the type of emergency or hazard.");return}
  state.emergencyRecords.push(record);renderEmergencyRecords();qs("#addEmergency").disabled=false;toast("Emergency record saved.");
}
function renderContinuityRecords(){
  const box=qs("#continuityRecords");if(!box)return;const rows=state.continuityRecords||[];
  box.innerHTML=rows.length?rows.map((r,i)=>`<div class="saved-record"><div><span class="record-number">Activation ${i+1}</span><strong>${esc(r.level)}</strong><small>${esc(r.activationDate||"Date not specified")} • ${esc(r.status||"Status not specified")} • ${esc(r.duration||"Duration not specified")}</small><p>${esc(r.arrangement||"No learning delivery arrangement entered.")}</p></div><button class="btn red remove-continuity" data-index="${i}" type="button">Remove</button></div>`).join(""):`<p class="muted">No continuity-level records saved yet.</p>`;
  qsa(".remove-continuity").forEach(b=>b.onclick=()=>{state.continuityRecords.splice(Number(b.dataset.index),1);renderContinuityRecords();toast("Continuity record removed.")});
}
function saveContinuityRecord(){
  const record={level:formValue("continuityLevel"),arrangement:formValue("learningArrangement"),activationDate:formValue("continuityActivationDate"),duration:formValue("continuityDuration"),responsible:formValue("continuityResponsible"),status:formValue("continuityStatus"),notes:formValue("continuityNotes"),savedAt:new Date().toISOString()};
  if(!record.level){toast("Please select an activated learning continuity level.");return}
  state.continuityRecords.push(record);renderContinuityRecords();qs("#addContinuity").disabled=false;toast("Continuity-level record saved.");
}
qs("#saveEmergency").onclick=saveEmergencyRecord;
qs("#addEmergency").onclick=()=>{clearFields(["hazardType","emergencyDate","affectedLearners","affectedPersonnel","situationDescription"]);qs("#addEmergency").disabled=true;toast("Ready for another emergency record.")};
qs("#saveContinuity").onclick=saveContinuityRecord;
qs("#addContinuity").onclick=()=>{clearFields(["continuityLevel","learningArrangement","continuityActivationDate","continuityDuration","continuityResponsible","continuityStatus","continuityNotes"]);qs("#addContinuity").disabled=true;toast("Ready for another continuity activation.")};
async function loadDraft(){
  buildChecklist();fillSchoolProfile();
  state.emergencyRecords=[];state.continuityRecords=[];renderEmergencyRecords();renderContinuityRecords();
  try{const d=await api("/draft");if(d.draft)fillForm(d.draft)}catch{}
  fillSchoolProfile();
}
function renderMeActions(){
  const a=qs("#meActions");a.innerHTML="";
  if(state.user.role==="admin"){
    a.innerHTML=`<button class="btn primary" type="button" id="adminSave">Save</button><button class="btn secondary" type="button" id="adminPrint">Print Blank Tool</button>`;
    qs("#adminSave").onclick=async()=>{try{await api("/draft",{method:"POST",body:JSON.stringify({data:serializeForm()})});toast("M&E record saved successfully.")}catch(err){toast(err.message)}};
    qs("#adminPrint").onclick=()=>window.print();return
  }
  a.innerHTML=`<button class="btn secondary" type="button" id="saveDraft">Save</button><button class="btn green" type="button" id="submitME">Submit</button><button class="btn secondary" type="button" id="printME">Print</button><button class="btn red" type="button" id="pdfME">Save as PDF</button>`;
  qs("#saveDraft").onclick=async()=>{await api("/draft",{method:"POST",body:JSON.stringify({data:serializeForm()})});toast("Draft saved.")};
  qs("#submitME").onclick=async()=>{const d=serializeForm();if(!d.monitoringDate){toast("Please enter the Date of Monitoring.");return}await api("/submit",{method:"POST",body:JSON.stringify({data:d})});toast("M&E report submitted successfully.")};
  qs("#printME").onclick=()=>window.print();
  qs("#pdfME").onclick=()=>savePDF();
}
function savePDF(){
  if(typeof html2pdf==="undefined"){window.print();return}
  const el=qs("#mePage");const school=qs("#meSchoolName").value||"School";
  html2pdf().set({margin:8,filename:`EIE_ME_${school.replace(/[^a-z0-9]+/gi,"_")}.pdf`,image:{type:"jpeg",quality:.97},html2canvas:{scale:1.4,useCORS:true},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["avoid-all","css","legacy"]}}).from(el).save();
}
async function renderDashboard(){
  const d=await api("/dashboard");
  let reports=d.recent||[];try{reports=(await api("/submissions")).submissions||reports}catch{}
  const latest=[...reports.reduce((m,r)=>{const key=r.schoolId||r.schoolName;if(!m.has(key))m.set(key,r);return m},new Map()).values()];
  const scores=latest.map(scoreOfReport).filter(s=>s.percentage!=null);
  const average=scores.length?scores.reduce((n,s)=>n+s.percentage,0)/scores.length:null;
  const overallRating=ratingFor(average);
  const bands=[["Outstanding",scores.filter(s=>s.percentage>=90).length,"high","#1c8f5b"],["Very Satisfactory",scores.filter(s=>s.percentage>=80&&s.percentage<90).length,"high","#57b985"],["Satisfactory",scores.filter(s=>s.percentage>=70&&s.percentage<80).length,"mid","#1768c5"],["Needs Improvement",scores.filter(s=>s.percentage>=60&&s.percentage<70).length,"mid","#f4b400"],["Needs Immediate Technical Assistance",scores.filter(s=>s.percentage<60).length,"low","#c33d3d"]];
  let donutCursor=0;const donutStops=bands.map(([,count,,color])=>{const start=donutCursor;donutCursor+=scores.length?count/scores.length*100:0;return`${color} ${start}% ${donutCursor}%`}).join(",");
  const donutBackground=scores.length?`conic-gradient(${donutStops})`:"#e4ebf3";
  const overallClass=average==null?"neutral":average>=80?"high":average>=60?"mid":"low";
  qs("#dashboardPage").innerHTML=`<div class="page-title"><div><div class="kicker">ADMINISTRATOR</div><h2>Dashboard</h2><p>Division-wide status of registered schools and EIE M&E submissions.</p></div></div>
  <div class="stats"><div class="stat"><span>Registered Schools</span><strong>${d.registeredSchools}</strong></div><div class="stat"><span>Submitted Reports</span><strong>${d.submissions}</strong></div><div class="stat"><span>Division Average</span><strong>${average==null?"—":average.toFixed(2)+"%"}</strong></div><div class="stat"><span>Outstanding Schools</span><strong>${scores.filter(s=>s.percentage>=90).length}</strong></div></div>
  <article class="card overall-card"><div class="overall-head"><div><div class="kicker">OVERALL DIVISION PERFORMANCE</div><h3>${esc(overallRating)}</h3><p>${scores.length} of ${d.registeredSchools} registered school${d.registeredSchools===1?"":"s"} evaluated using their latest submission.</p></div><div class="overall-score ${overallClass}">${average==null?"—":average.toFixed(2)+"%"}</div></div><div class="overall-progress"><span style="width:${average||0}%"></span></div><div class="band-grid">${bands.map(([label,count,tone])=>`<div class="band-item ${tone}"><strong>${count}</strong><span>${esc(label)}</span></div>`).join("")}</div>${bands[4][1]?`<div class="ta-alert"><strong>${bands[4][1]} school${bands[4][1]===1?"":"s"}</strong> currently need immediate technical assistance based on their latest rating.</div>`:""}</article>
  <article class="card"><h3>Overall Rating Distribution</h3><div class="donut-layout"><div class="donut-chart" role="img" aria-label="Rating distribution for ${scores.length} evaluated schools" style="background:${donutBackground}"><div class="donut-center"><strong>${scores.length}</strong><span>Evaluated<br>Schools</span></div></div><div class="donut-legend">${bands.map(([label,count,,color])=>`<div><i style="background:${color}"></i><span>${esc(label)}</span><strong>${count} <small>(${scores.length?Math.round(count/scores.length*100):0}%)</small></strong></div>`).join("")}</div></div></article>
  <article class="card"><h3>Latest School Ratings</h3>${renderSubmissionTable(latest,false)}</article>`;
}
function renderSubmissionTable(rows,actions=true){
  if(!rows.length)return `<p class="muted">No submissions yet.</p>`;
  return `<div class="table-wrap"><table><thead><tr><th>School</th><th>District</th><th>School ID</th><th>Submitted</th><th>Score</th><th>Rating</th><th>Status</th>${actions?"<th>Action</th>":""}</tr></thead><tbody>${rows.map(r=>{const s=scoreOfReport(r);return`<tr><td>${esc(r.schoolName)}</td><td>${esc(r.district)}</td><td>${esc(r.schoolId)}</td><td>${new Date(r.submittedAt).toLocaleString()}</td><td><strong>${s.percentage==null?"—":s.percentage.toFixed(2)+"%"}</strong></td><td><span class="badge ${s.percentage==null?"gray":s.percentage>=80?"green":s.percentage>=60?"gold":"red"}">${esc(s.rating)}</span></td><td><span class="badge green">${esc(r.status||"Submitted")}</span></td>${actions?`<td><button class="btn secondary view-report" data-id="${r.id}" type="button">View</button></td>`:""}</tr>`}).join("")}</tbody></table></div>`;
}
async function renderUsers(){
  const d=await api("/users");
  qs("#usersPage").innerHTML=`<div class="page-title"><div><div class="kicker">ADMINISTRATION</div><h2>User Management</h2><p>Manage school accounts and account status.</p></div></div><article class="card">
  <div class="toolbar"><h3>Registered Accounts</h3><input id="userSearch" placeholder="Search school or district"></div>
  <div id="userTable">${userTable(d.users)}</div></article>`;
  qs("#userSearch").oninput=e=>qs("#userTable").innerHTML=userTable(d.users.filter(u=>`${u.schoolName} ${u.district} ${u.username}`.toLowerCase().includes(e.target.value.toLowerCase())));
  bindUserActions();
}
function userTable(users){return `<div class="table-wrap"><table><thead><tr><th>School</th><th>District</th><th>School ID</th><th>Username</th><th>Status</th><th>Actions</th></tr></thead><tbody>${users.map(u=>`<tr><td>${esc(u.schoolName||u.name||"Administrator")}</td><td>${esc(u.district||"—")}</td><td>${esc(u.schoolId||"—")}</td><td>${esc(u.username)}</td><td><span class="badge ${u.status==="active"?"green":"red"}">${u.status}</span></td><td>${u.role==="admin"?"Protected":`<button class="btn secondary user-toggle" data-id="${u.id}" data-status="${u.status}" type="button">${u.status==="active"?"Deactivate":"Activate"}</button> <button class="btn red user-delete" data-id="${u.id}" type="button">Delete</button>`}</td></tr>`).join("")}</tbody></table></div>`}
function bindUserActions(){
  qsa(".user-toggle").forEach(b=>b.onclick=async()=>{await api("/users/update",{method:"POST",body:JSON.stringify({id:b.dataset.id,status:b.dataset.status==="active"?"inactive":"active"})});toast("User updated.");renderUsers()});
  qsa(".user-delete").forEach(b=>b.onclick=async()=>{if(confirm("Delete this user account?")){await api("/users/delete",{method:"POST",body:JSON.stringify({id:b.dataset.id})});toast("User deleted.");renderUsers()}});
}
async function renderSubmissions(){
  const d=await api("/submissions");
  qs("#submissionsPage").innerHTML=`<div class="page-title"><div><div class="kicker">REPORTS</div><h2>Submitted M&E Reports</h2><p>Review reports submitted by schools.</p></div></div><article class="card">${renderSubmissionTable(d.submissions,true)}</article>`;
  qsa(".view-report").forEach(b=>b.onclick=()=>viewReport(b.dataset.id));
}
async function viewReport(id){
  const d=await api(`/submission?id=${encodeURIComponent(id)}`);
  const r=d.report;
  openModal(`<h2>${esc(r.schoolName)} — M&E Report</h2><p class="muted">${esc(r.district)} • School ID ${esc(r.schoolId)} • ${new Date(r.submittedAt).toLocaleString()}</p><div class="card"><pre style="white-space:pre-wrap;font-family:inherit">${esc(JSON.stringify(r.data,null,2))}</pre></div>`);
}
async function renderAnalytics(){
  const d=await api("/dashboard");
  let reports=[];try{reports=(await api("/submissions")).submissions||[]}catch{}
  const scores=reports.map(scoreOfReport).filter(s=>s.percentage!=null);
  const bands=[["Outstanding",scores.filter(s=>s.percentage>=90).length],["Very Satisfactory",scores.filter(s=>s.percentage>=80&&s.percentage<90).length],["Satisfactory",scores.filter(s=>s.percentage>=70&&s.percentage<80).length],["Needs Improvement",scores.filter(s=>s.percentage>=60&&s.percentage<70).length],["Needs Immediate Technical Assistance",scores.filter(s=>s.percentage<60).length]];
  const max=Math.max(1,...d.byDistrict.map(x=>x.count));
  const bandMax=Math.max(1,...bands.map(x=>x[1]));
  qs("#analyticsPage").innerHTML=`<div class="page-title"><div><div class="kicker">ANALYTICS</div><h2>Reports & Analytics</h2><p>Submission and rating distribution across the division.</p></div></div><article class="card"><h3>Rating Distribution</h3>${scores.length?bands.map(x=>`<div class="bar-row"><span>${esc(x[0])}</span><div class="bar"><span style="width:${Math.round(x[1]/bandMax*100)}%"></span></div><strong>${x[1]}</strong></div>`).join(""):`<p class="muted">No scored submissions yet.</p>`}</article><article class="card"><h3>Submissions by District</h3>${d.byDistrict.length?d.byDistrict.map(x=>`<div class="bar-row"><span>${esc(x.district)}</span><div class="bar"><span style="width:${Math.round(x.count/max*100)}%"></span></div><strong>${x.count}</strong></div>`).join(""):`<p class="muted">No submissions yet.</p>`}</article>`;
}
async function renderMyReports(){
  const d=await api("/my-submissions");
  qs("#myReportsPage").innerHTML=`<div class="page-title"><div><div class="kicker">MY REPORTS</div><h2>Submitted M&E Reports</h2><p>Your submission history.</p></div></div><article class="card">${renderSubmissionTable(d.submissions,false)}</article>`;
}
function renderProfile(){
  const u=state.user;qs("#profilePage").innerHTML=`<div class="page-title"><div><div class="kicker">ACCOUNT</div><h2>Profile</h2><p>Your registered school information.</p></div></div><article class="card"><div class="grid two"><label>District<input value="${escAttr(u.district||"")}" readonly></label><label>School Name<input value="${escAttr(u.schoolName||"")}" readonly></label><label>School ID<input value="${escAttr(u.schoolId||"")}" readonly></label><label>Username<input value="${escAttr(u.username)}" readonly></label></div></article>`;
}
function renderSettings(){
  qs("#settingsPage").innerHTML=`<div class="page-title"><div><div class="kicker">SECURITY</div><h2>Administrator Settings</h2><p>Change the administrator password after first login.</p></div></div><article class="card"><h3>Change Password</h3><form id="changePasswordForm" class="grid two"><label>Current Password<input id="curPass" type="password" required></label><label>New Password<input id="newPass" type="password" minlength="10" required></label><div><button class="btn primary" type="submit">Update Password</button></div></form></article>`;
  qs("#changePasswordForm").onsubmit=async e=>{e.preventDefault();await api("/change-password",{method:"POST",body:JSON.stringify({currentPassword:qs("#curPass").value,newPassword:qs("#newPass").value})});e.target.reset();toast("Password changed successfully.")};
}
function openModal(html){qs("#modalBody").innerHTML=html;qs("#modal").classList.remove("hidden")}
function closeModal(){qs("#modal").classList.add("hidden")}
qs("#modalClose").onclick=closeModal;qs("#modalBackdrop").onclick=closeModal;
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function escAttr(v){return esc(v)}
async function openApp(){
  const me=await api("/me");state.user=me.user;qs("#authView").classList.add("hidden");qs("#appView").classList.remove("hidden");
  qs("#headerName").textContent=state.user.role==="admin"?"Administrator":state.user.schoolName;
  qs("#headerRole").textContent=state.user.role==="admin"?"System Administrator":`${state.user.district} • School ID ${state.user.schoolId}`;
  buildNav();renderMeActions();fillSchoolProfile();await showPage(state.user.role==="admin"?"dashboardPage":"mePage");
}
(async()=>{
  const token=sessionStorage.getItem("eieToken");if(!token)return;
  state.token=token;try{await openApp()}catch{sessionStorage.removeItem("eieToken");state.token=null}
})();
