
const API="/api";
const indicators=[
{domain:"A. Governance and LSCP Management",text:"An updated LSCP is developed annually before the opening of classes and reviewed/updated every term."},
{domain:"A. Governance and LSCP Management",text:"The LSCP was developed collaboratively with teaching and non-teaching personnel, learners, parents/guardians, and relevant community representatives."},
{domain:"A. Governance and LSCP Management",text:"Roles, decision authority, succession arrangements, and coordination mechanisms for emergency learning continuity are defined."},
{domain:"A. Governance and LSCP Management",text:"Capability-mapping data on learners, teachers, connectivity, devices, accessibility, and home-learning support informed the LSCP."},
{domain:"A. Governance and LSCP Management",text:"School-based CLC/ALS arrangements are reflected in the school LSCP and AIP, where applicable."},
{domain:"A. Governance and LSCP Management",text:"Risks, locally relevant hazards, vulnerable groups, and access barriers are identified and linked to actions and resources."},
{domain:"B. Teaching-Learning Continuity",text:"Learning experiences are identified for each key stage and each continuity level (Hayo, Hinay, Hinga, Hinto)."},
{domain:"B. Teaching-Learning Continuity",text:"Planned learning experiences are feasible for learner circumstances and include suitable online, digital, broadcast, print, or offline options."},
{domain:"B. Teaching-Learning Continuity",text:"Learning resources are quality-assured, accessible, inclusive, age-appropriate, and aligned with learning design principles."},
{domain:"B. Teaching-Learning Continuity",text:"Teachers understand which learning experiences and resources to use at each activated level."},
{domain:"B. Teaching-Learning Continuity",text:"HINGA implementation reduces academic demands and prioritizes well-being checks, review, trauma-informed resources, and low-stakes assessment."},
{domain:"B. Teaching-Learning Continuity",text:"HINTO implementation halts academic learning and prioritizes safety, basic needs, and status monitoring."},
{domain:"B. Teaching-Learning Continuity",text:"Transition to HAYO is safe and gradual, with structured remediation and foundational skill recovery after disruption."},
{domain:"B. Teaching-Learning Continuity",text:"Alternative/flexible arrangements are planned for prolonged Hinga or Hinto conditions and lost instructional time."},
{domain:"C. Learner Support and Inclusion",text:"Learner status, safety, displacement, accessibility, and participation are tracked using privacy-conscious records."},
{domain:"C. Learner Support and Inclusion",text:"Provisions address learners with disabilities, indigenous learners, geographically isolated learners, ALS learners, and other at-risk groups."},
{domain:"C. Learner Support and Inclusion",text:"Parents/guardians receive orientation on the LSCP, activated level, learning support roles, and available assistance."},
{domain:"C. Learner Support and Inclusion",text:"Family Kits, check-in guides, MHPSS/trauma-informed supports, or referral pathways are available as appropriate."},
{domain:"C. Learner Support and Inclusion",text:"Non-participating or unreachable learners are followed up through documented, safe, and reasonable procedures."},
{domain:"C. Learner Support and Inclusion",text:"Feedback and formative assessment practices are appropriate to the activated level and do not increase distress."},
{domain:"D. Personnel Preparedness and Welfare",text:"Teaching and non-teaching personnel are oriented on the LSCP, emergency roles, call tree, and reporting procedures."},
{domain:"D. Personnel Preparedness and Welfare",text:"Teachers/ALS implementers are capacitated for level-appropriate learning delivery, MHPSS-sensitive practice, and inclusive support."},
{domain:"D. Personnel Preparedness and Welfare",text:"Personnel safety and fitness to return are assessed before resumption of duties or in-person learning."},
{domain:"D. Personnel Preparedness and Welfare",text:"Continuity/relief staffing and workload arrangements are available when personnel cannot immediately return."},
{domain:"D. Personnel Preparedness and Welfare",text:"Personnel well-being, MHPSS needs, and referral/support mechanisms are monitored and addressed."},
{domain:"E. Communication and Coordination",text:"An updated emergency call tree is included in the LSCP and can be automatically activated."},
{domain:"E. Communication and Coordination",text:"Personnel first report their safety status; advisers/assigned teachers check the status of learners through parents/guardians."},
{domain:"E. Communication and Coordination",text:"Level activation, learning arrangements, schedules, and changes are communicated promptly through redundant channels."},
{domain:"E. Communication and Coordination",text:"Coordination with the SDO, LGU, DRRM bodies, health/safety authorities, and partners is documented."},
{domain:"E. Communication and Coordination",text:"Communication is accessible, child-sensitive, privacy-conscious, and available in locally appropriate languages/formats."},
{domain:"E. Communication and Coordination",text:"Required information is submitted through the EiE Learning Continuity dashboard or prescribed reporting mechanism."},
{domain:"F. Safety, Protection, and Well-being",text:"Situation assessment covers hazard type, safety/security, physical and psychosocial condition, resource availability, and extent of disruption."},
{domain:"F. Safety, Protection, and Well-being",text:"In-person classes resume only after affected facilities/infrastructure are declared safe by authorized inspectors when required."},
{domain:"F. Safety, Protection, and Well-being",text:"Child protection, safeguarding, referral, evacuation, reunification, and MHPSS protocols are integrated or cross-referenced."},
{domain:"F. Safety, Protection, and Well-being",text:"Learning modalities and material distribution do not expose learners, families, or personnel to avoidable risk."},
{domain:"F. Safety, Protection, and Well-being",text:"Emergency drills/orientations and safe access, distribution, and retrieval procedures are documented."},
{domain:"F. Safety, Protection, and Well-being",text:"The activated level and response are reviewed as conditions change, with safety and well-being as primary considerations."},
{domain:"G. Resource and Logistics Management",text:"A proportional supply of identified learning resources and emergency learning kits is available, pre-positioned, or has a replenishment plan."},
{domain:"G. Resource and Logistics Management",text:"Inventory, secure storage, distribution, retrieval, safeguarding, and accountability procedures cover DepEd and donated devices/resources."},
{domain:"G. Resource and Logistics Management",text:"Resource needs and LSCP actions are reflected in the AIP/budget, including reasonable communication support where allowable."},
{domain:"G. Resource and Logistics Management",text:"Distribution/access arrangements identify responsible persons, locations, timelines, and accommodations for vulnerable learners."},
{domain:"G. Resource and Logistics Management",text:"Partnerships and donations are coordinated, documented, and aligned with identified needs and applicable rules."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"Activation decisions, dates, evidence, affected populations, delivery arrangements, and transitions are documented."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"Implementation data cover reach/participation, resource access, learner and personnel well-being, incidents, and emerging gaps."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"School records are reconciled with required SDO/EiE dashboard reports and submitted within prescribed timelines."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"Feedback from learners, parents, teachers, and partners is collected and used to adjust implementation."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"After-action review identifies lessons, effective practices, unresolved risks, and actions for LSCP improvement."},
{domain:"H. Monitoring, Reporting, and Improvement",text:"Technical assistance needs, responsible persons, timelines, and follow-through status are documented and monitored."}
];
let state={token:null,user:null,emergencyRecords:[],continuityRecords:[],technicalAssistanceRecords:[]};
const scoreValues={"Compliant":3,"Partially Compliant":2,"Not Compliant":1};
function ratingFor(p){if(p==null)return"Not yet rated";if(p>=90)return"Outstanding";if(p>=80)return"Very Satisfactory";if(p>=70)return"Satisfactory";if(p>=60)return"Needs Improvement";return"Needs Immediate Technical Assistance"}
function calculateScore(items){const a=(items||[]).filter(x=>Object.hasOwn(scoreValues,x.status));const earned=a.reduce((n,x)=>n+scoreValues[x.status],0),maximum=a.length*3,percentage=maximum?Math.round(earned/maximum*10000)/100:null;return{earnedPoints:earned,maximumPoints:maximum,applicableItems:a.length,percentage,rating:ratingFor(percentage)}}
function scoreOfReport(r){const s=r.score||r.data?.score;return s&&s.percentage!=null?s:calculateScore(r.data?.checklist||r.checklist||[])}
function serializeChecklist(){return indicators.map((item,i)=>({indicator:item.text,domain:item.domain,status:qs("#meForm")?.elements.namedItem(`indicator_${i}_status`)?.value||""}))}
function updateLiveScore(){const box=qs("#liveScore");if(!box)return;const s=calculateScore(serializeChecklist());box.textContent=s.percentage==null?"—":`${s.percentage.toFixed(2)}%`;qs("#livePoints").textContent=s.maximumPoints?`${s.earnedPoints} of ${s.maximumPoints} points • ${s.applicableItems} applicable item${s.applicableItems===1?"":"s"}`:"Not Applicable items are excluded from scoring.";const p=qs("#liveRating");p.textContent=s.rating;p.className=`rating-pill ${s.percentage==null?"neutral":s.percentage>=80?"high":s.percentage>=60?"mid":"low"}`}

function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}
function toast(msg){const t=qs("#toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),3500)}
async function api(path,opts={}){
  const headers={"Content-Type":"application/json",...(opts.headers||{})};
  if(state.token) headers.Authorization=`Bearer ${state.token}`;
  let r;try{r=await fetch(API+path,{...opts,headers})}catch{throw new Error("Cannot connect to the website service. Please refresh and try again.")}
  const raw=await r.text();let data={};try{data=raw?JSON.parse(raw):{}}catch{}
  if(!r.ok) throw new Error(data.error||(r.status>=500?"The website service is temporarily unavailable. Please try again.":"Request failed."));
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
qs("#logoutBtn").addEventListener("click",()=>{sessionStorage.removeItem("eieToken");state={token:null,user:null,emergencyRecords:[],continuityRecords:[],technicalAssistanceRecords:[]};qs("#appView").classList.add("hidden");qs("#authView").classList.remove("hidden")});

function buildChecklist(){
  const tb=qs("#checklistTable tbody");tb.innerHTML="";
  let domain="";indicators.forEach((x,i)=>{if(x.domain!==domain){domain=x.domain;tb.insertAdjacentHTML("beforeend",`<tr class="checklist-domain"><th colspan="6">${esc(domain)}</th></tr>`)}tb.insertAdjacentHTML("beforeend",`<tr><td>${i+1}</td><td>${esc(x.text)}</td><td><select name="indicator_${i}_status"><option value="">Select...</option><option>Compliant</option><option>Partially Compliant</option><option>Not Compliant</option><option>Not Applicable</option></select></td><td><textarea rows="2" name="indicator_${i}_mov"></textarea></td><td><textarea rows="2" name="indicator_${i}_findings"></textarea></td><td><textarea rows="2" name="indicator_${i}_action"></textarea></td></tr>`)});
  qsa("#checklistTable select").forEach(x=>x.addEventListener("change",updateLiveScore));configureRequiredFields();updateLiveScore();
}
const emergencyFieldNames=["hazardType","emergencyDate","affectedArea","levelActivatedAt","affectedLearners","affectedPersonnel","decisionMaker","reportedAt","reviewDate","situationDescription","assessmentSources","activatedResources","communicationChannels"];
const continuityFieldNames=["continuityLevel","learningArrangement","continuityActivationDate","continuityDuration","continuityResponsible","continuityStatus","continuityNotes"];
const taFieldNames=["taIssue","taRootCause","taProvided","taResponsible","taTimeline","taStatus","taFollowUp"];
function configureRequiredFields(){
  const form=qs("#meForm");if(!form)return;
  qsa("#meForm label").forEach(label=>label.classList.add("required-field"));
  qsa("#meForm input,#meForm select,#meForm textarea").forEach(el=>{
    if(el.type!=="button"&&!emergencyFieldNames.includes(el.name)&&!continuityFieldNames.includes(el.name)&&!taFieldNames.includes(el.name))el.required=true;
  });
}
function validateNamedFields(names,message){
  const form=qs("#meForm");
  for(const name of names){
    const field=form.elements.namedItem(name);
    const valid=field instanceof RadioNodeList?[...field].some(x=>x.checked):String(field?.value||"").trim()!=="";
    if(!valid){toast(message);const target=field instanceof RadioNodeList?[...field][0]:field;target?.focus();target?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  }
  return true;
}
function validateReportForSubmission(){
  if(!(state.emergencyRecords||[]).length){toast("Save at least one complete Emergency / Hazard record before submitting.");qs("#saveEmergency")?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  if(state.emergencyRecords.some(record=>emergencyFieldNames.some(name=>String(record[name]??"").trim()===""))){toast("Every saved Emergency / Hazard record must contain all required activation details.");qs("#emergencyRecords")?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  if(!(state.continuityRecords||[]).length){toast("Save at least one complete Learning Continuity activation before submitting.");qs("#saveContinuity")?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  if(!(state.technicalAssistanceRecords||[]).length){toast("Save at least one complete Technical Assistance record before submitting.");qs("#saveTA")?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  if(state.technicalAssistanceRecords.some(record=>taFieldNames.some(name=>String(record[name]??"").trim()===""))){toast("Every saved Technical Assistance record must contain all required details.");qs("#taRecords")?.scrollIntoView({behavior:"smooth",block:"center"});return false}
  const form=qs("#meForm");if(!form.reportValidity()){toast("Please complete every required field marked with an asterisk.");return false}
  return true;
}
buildChecklist();
const enrollmentNames=["enrollmentKinder","enrollmentES","enrollmentJHS","enrollmentSHS","enrollmentALS"];
function updateEnrollmentTotal(){const total=enrollmentNames.reduce((sum,name)=>sum+(Number(formValue(name))||0),0),field=qs("#meForm")?.elements.namedItem("enrollmentTotal");if(field)field.value=total}
enrollmentNames.forEach(name=>qs("#meForm").elements.namedItem(name)?.addEventListener("input",updateEnrollmentTotal));

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
  d.checklist=indicators.map((item,i)=>({indicator:item.text,domain:item.domain,status:d[`indicator_${i}_status`]||"",mov:d[`indicator_${i}_mov`]||"",findings:d[`indicator_${i}_findings`]||"",action:d[`indicator_${i}_action`]||""}));
  d.emergencies=state.emergencyRecords||[];
  d.continuityActivations=state.continuityRecords||[];
  d.technicalAssistanceRecords=state.technicalAssistanceRecords||[];
  d.score=calculateScore(d.checklist);
  return d;
}
function fillForm(data){
  if(!data)return;
  const legacyLevels={"Level 0 - Normal Operations":"HAYO (Continue)","Level 1 - Preparedness / Alert":"HINAY (Ease-in)","Level 2 - Alternative Learning Delivery":"HINGA (Check-in)","Level 3 - Full Emergency Response":"HINTO (Stop)"};
  if(legacyLevels[data.continuityLevel])data={...data,continuityLevel:legacyLevels[data.continuityLevel]};
  state.emergencyRecords=Array.isArray(data.emergencies)?data.emergencies:[];
  state.continuityRecords=Array.isArray(data.continuityActivations)?data.continuityActivations.map(x=>({...x,level:legacyLevels[x.level]||x.level})):[];
  state.technicalAssistanceRecords=Array.isArray(data.technicalAssistanceRecords)?data.technicalAssistanceRecords:[];
  if(!state.technicalAssistanceRecords.length&&(data.technicalAssistance||data.responsiblePerson||data.overallStatus))state.technicalAssistanceRecords=[{taIssue:data.gaps||"Legacy report issue / gap",taRootCause:"Not specified in legacy report",taProvided:data.technicalAssistance||"Not specified in legacy report",taResponsible:data.responsiblePerson||"Not specified in legacy report",taTimeline:data.targetDate||"Not specified",taStatus:String(data.overallStatus||"").includes("Fully")?"Completed":String(data.overallStatus||"").includes("Ongoing")?"Ongoing":"Open",taFollowUp:data.nextSteps||"Not specified in legacy report"}];
  for(const [k,v] of Object.entries(data)){
    if(k==="checklist"||v==null||typeof v==="object")continue;
    const el=qs("#meForm").elements.namedItem(k);if(!el)continue;
    if(el instanceof RadioNodeList){[...el].forEach(x=>x.checked=x.value===v)} else el.value=v;
  }
  if(Array.isArray(data.checklist)) indicators.forEach((item,i)=>{
    const x=data.checklist.find(saved=>saved.indicator===item.text)||(data.checklist.length===indicators.length?data.checklist[i]:null);if(!x)return;
    const fields={status:x.status||"",mov:x.mov||x.remarks||"",findings:x.findings||"",action:x.action||""};
    Object.entries(fields).forEach(([key,value])=>{const el=qs("#meForm").elements.namedItem(`indicator_${i}_${key}`);if(el)el.value=value});
  });
  renderEmergencyRecords();renderContinuityRecords();renderTARecords();
  updateEnrollmentTotal();
  updateLiveScore();
}
function formValue(name){return qs("#meForm").elements.namedItem(name)?.value||""}
function clearFields(names){names.forEach(name=>{const el=qs("#meForm").elements.namedItem(name);if(!el)return;if(el instanceof RadioNodeList)[...el].forEach(x=>x.checked=false);else el.value=""})}
function renderEmergencyRecords(){
  const box=qs("#emergencyRecords");if(!box)return;const rows=state.emergencyRecords||[];
  box.innerHTML=rows.length?rows.map((r,i)=>`<div class="saved-record"><div><span class="record-number">Emergency ${i+1}</span><strong>${esc(r.hazardType)} — ${esc(r.affectedArea)}</strong><small>${esc(r.emergencyDate||"Date not specified")} • ${esc(r.affectedLearners||0)} learner(s) • ${esc(r.affectedPersonnel||0)} personnel</small><p>${esc(r.situationDescription||"No situation description.")}</p><small><b>Approved by:</b> ${esc(r.decisionMaker||"—")} &nbsp; • &nbsp; <b>Review:</b> ${esc(r.reviewDate||"—")}</small></div><button class="btn red remove-emergency" data-index="${i}" type="button">Remove</button></div>`).join(""):`<p class="muted">No emergency records saved yet.</p>`;
  qsa(".remove-emergency").forEach(b=>b.onclick=()=>{state.emergencyRecords.splice(Number(b.dataset.index),1);renderEmergencyRecords();toast("Emergency record removed.")});
}
function saveEmergencyRecord(){
  if(!validateNamedFields(emergencyFieldNames,"Please complete all required Emergency / Hazard fields."))return;
  const record=Object.fromEntries(emergencyFieldNames.map(name=>[name,formValue(name)]));record.savedAt=new Date().toISOString();
  state.emergencyRecords.push(record);renderEmergencyRecords();qs("#addEmergency").disabled=false;toast("Emergency record saved.");
}
function renderContinuityRecords(){
  const box=qs("#continuityRecords");if(!box)return;const rows=state.continuityRecords||[];
  box.innerHTML=rows.length?rows.map((r,i)=>`<div class="saved-record"><div><span class="record-number">Activation ${i+1}</span><strong>${esc(r.level)}</strong><small>${esc(r.activationDate||"Date not specified")} • ${esc(r.status||"Status not specified")} • ${esc(r.duration||"Duration not specified")}</small><p>${esc(r.arrangement||"No learning delivery arrangement entered.")}</p></div><button class="btn red remove-continuity" data-index="${i}" type="button">Remove</button></div>`).join(""):`<p class="muted">No continuity-level records saved yet.</p>`;
  qsa(".remove-continuity").forEach(b=>b.onclick=()=>{state.continuityRecords.splice(Number(b.dataset.index),1);renderContinuityRecords();toast("Continuity record removed.")});
}
function saveContinuityRecord(){
  if(!validateNamedFields(continuityFieldNames,"Please complete all required Learning Continuity fields."))return;
  const record={level:formValue("continuityLevel"),arrangement:formValue("learningArrangement"),activationDate:formValue("continuityActivationDate"),duration:formValue("continuityDuration"),responsible:formValue("continuityResponsible"),status:formValue("continuityStatus"),notes:formValue("continuityNotes"),savedAt:new Date().toISOString()};
  state.continuityRecords.push(record);renderContinuityRecords();qs("#addContinuity").disabled=false;toast("Continuity-level record saved.");
}
function renderTARecords(){
  const box=qs("#taRecords");if(!box)return;const rows=state.technicalAssistanceRecords||[];
  box.innerHTML=rows.length?rows.map((r,i)=>`<div class="saved-record"><div><span class="record-number">Technical Assistance ${i+1}</span><strong>${esc(r.taIssue)}</strong><small>${esc(r.taStatus||"Status not specified")} • ${esc(r.taResponsible||"Responsible person not specified")} • ${esc(printDate(r.taTimeline))}</small><p><b>Root cause:</b> ${esc(r.taRootCause||"—")}</p><p><b>Assistance:</b> ${esc(r.taProvided||"—")}</p><small><b>Follow-up / Evidence:</b> ${esc(r.taFollowUp||"—")}</small></div><button class="btn red remove-ta" data-index="${i}" type="button">Remove</button></div>`).join(""):`<p class="muted">No technical assistance records saved yet.</p>`;
  qsa(".remove-ta").forEach(b=>b.onclick=()=>{state.technicalAssistanceRecords.splice(Number(b.dataset.index),1);renderTARecords();toast("Technical assistance record removed.")});
}
function saveTARecord(){
  if(!validateNamedFields(taFieldNames,"Please complete all required Technical Assistance fields."))return;
  const record=Object.fromEntries(taFieldNames.map(name=>[name,formValue(name)]));record.savedAt=new Date().toISOString();
  state.technicalAssistanceRecords.push(record);renderTARecords();qs("#addTA").disabled=false;toast("Technical assistance record saved.");
}
qs("#saveEmergency").onclick=saveEmergencyRecord;
qs("#addEmergency").onclick=()=>{clearFields(emergencyFieldNames);qs("#addEmergency").disabled=true;toast("Ready for another emergency record.")};
qs("#saveContinuity").onclick=saveContinuityRecord;
qs("#addContinuity").onclick=()=>{clearFields(["continuityLevel","learningArrangement","continuityActivationDate","continuityDuration","continuityResponsible","continuityStatus","continuityNotes"]);qs("#addContinuity").disabled=true;toast("Ready for another continuity activation.")};
qs("#saveTA").onclick=saveTARecord;
qs("#addTA").onclick=()=>{clearFields(taFieldNames);qs("#addTA").disabled=true;toast("Ready for another technical assistance entry.")};
async function loadDraft(){
  buildChecklist();fillSchoolProfile();
  state.emergencyRecords=[];state.continuityRecords=[];state.technicalAssistanceRecords=[];renderEmergencyRecords();renderContinuityRecords();renderTARecords();
  try{const d=await api("/draft");if(d.draft)fillForm(d.draft)}catch{}
  fillSchoolProfile();
}
function renderMeActions(){
  const a=qs("#meActions");a.innerHTML="";
  if(state.user.role==="admin"){
    a.innerHTML=`<button class="btn primary" type="button" id="adminSave">Save</button><button class="btn secondary" type="button" id="adminPrint">Print Blank Tool</button>`;
    qs("#adminSave").onclick=async()=>{try{await api("/draft",{method:"POST",body:JSON.stringify({data:serializeForm()})});toast("M&E record saved successfully.")}catch(err){toast(err.message)}};
    qs("#adminPrint").onclick=()=>printMEReport();return
  }
  a.innerHTML=`<button class="btn secondary" type="button" id="saveDraft">Save</button><button class="btn green" type="button" id="submitME">Submit</button><button class="btn secondary" type="button" id="printME">Print</button><button class="btn red" type="button" id="pdfME">Save as PDF</button>`;
  qs("#saveDraft").onclick=async()=>{await api("/draft",{method:"POST",body:JSON.stringify({data:serializeForm()})});toast("Draft saved.")};
  qs("#submitME").onclick=async()=>{if(!validateReportForSubmission())return;const d=serializeForm();await api("/submit",{method:"POST",body:JSON.stringify({data:d})});toast("M&E report submitted successfully.")};
  qs("#printME").onclick=()=>printMEReport();
  qs("#pdfME").onclick=()=>savePDF();
}
function savePDF(){
  printMEReport();
}

function printDate(value){if(!value)return"";const d=new Date(`${value}T00:00:00`);return Number.isNaN(d.valueOf())?value:d.toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"})}
function printCell(label,value){return`<tr><th>${esc(label)}</th><td>${esc(value||"")}</td></tr>`}
function buildPrintReport(){
  const d=serializeForm(),score=d.score||calculateScore(d.checklist),short={"Compliant":"C","Partially Compliant":"PC","Not Compliant":"NC","Not Applicable":"NA"};
  const counts={C:0,PC:0,NC:0,NA:0};(d.checklist||[]).forEach(x=>{if(short[x.status])counts[short[x.status]]++});
  const emergencies=(d.emergencies?.length?d.emergencies:[Object.fromEntries(emergencyFieldNames.map(name=>[name,d[name]]))]).filter(x=>x.hazardType||x.emergencyDate||x.situationDescription);
  const activations=(d.continuityActivations?.length?d.continuityActivations:[{level:d.continuityLevel,arrangement:d.learningArrangement,activationDate:d.continuityActivationDate,duration:d.continuityDuration,responsible:d.continuityResponsible,status:d.continuityStatus,notes:d.continuityNotes}]).filter(x=>x.level||x.arrangement);
  const taRecords=d.technicalAssistanceRecords?.length?d.technicalAssistanceRecords:(d.technicalAssistance||d.responsiblePerson?[{taIssue:d.gaps,taRootCause:"",taProvided:d.technicalAssistance,taResponsible:d.responsiblePerson,taTimeline:d.targetDate,taStatus:d.overallStatus,taFollowUp:d.nextSteps}]:[]);
  let printedDomain="";const checkRows=(d.checklist||[]).map((x,i)=>{const domain=x.domain||indicators[i]?.domain||"";const heading=domain!==printedDomain?`<tr class="print-domain"><th colspan="9">${esc(domain)}</th></tr>`:"";printedDomain=domain;return`${heading}<tr><td class="center">${i+1}</td><td>${esc(x.indicator)}</td><td class="center mark">${x.status==="Compliant"?"✓":""}</td><td class="center mark">${x.status==="Partially Compliant"?"✓":""}</td><td class="center mark">${x.status==="Not Compliant"?"✓":""}</td><td class="center mark">${x.status==="Not Applicable"?"✓":""}</td><td>${esc(x.mov||x.remarks||"")}</td><td>${esc(x.findings||"")}</td><td>${esc(x.action||"")}</td></tr>`}).join("");
  const domainRows=[...new Set(indicators.map(x=>x.domain))].map(domain=>{const items=(d.checklist||[]).filter((x,i)=>(x.domain||indicators[i]?.domain)===domain),domainScore=calculateScore(items),domainCounts={C:0,PC:0,NC:0,NA:0};items.forEach(x=>{if(short[x.status])domainCounts[short[x.status]]++});return`<tr><td>${esc(domain.replace(/^[A-H]\. /,""))}</td><td>${domainCounts.C}</td><td>${domainCounts.PC}</td><td>${domainCounts.NC}</td><td>${domainCounts.NA}</td><td>${domainScore.applicableItems}</td><td>${domainScore.percentage==null?"—":domainScore.percentage.toFixed(2)+"%"}</td></tr>`}).join("");
  qs("#printReport").innerHTML=`
    <div class="print-sheet print-cover">
      <header class="report-header"><img src="/assets/cebu-province-logo.png" alt=""><div><div>REPUBLIC OF THE PHILIPPINES</div><strong>DEPARTMENT OF EDUCATION</strong><small>SCHOOLS DIVISION OF CEBU PROVINCE</small></div></header>
      <div class="cover-title"><h1>MONITORING AND<br>EVALUATION TOOL</h1><h2>Learning and Service Continuity Plan (LSCP)</h2><p>Anchored on DepEd Order No. 14, s. 2026<br>Guidelines on Learning Continuity in Emergencies</p></div>
      <table class="form-table cover-details">${printCell("School",d.schoolName)}${printCell("Schools Division Office",d.division)}${printCell("Region",d.region)}${printCell("Monitoring Date",printDate(d.monitoringDate))}${printCell("Evaluator / Team",d.monitoredBy)}</table>
      <p class="controlled">CONTROLLED WORKING COPY &nbsp;•&nbsp; OFFICIAL SYSTEM-GENERATED REPORT</p>
    </div>
    <div class="print-sheet">
      <h2 class="section-title">1. School Profile</h2>
      <table class="form-table">${printCell("Region / SDO / District",[d.region,d.division,d.district].filter(Boolean).join(" / "))}${printCell("School Name / School ID",[d.schoolName,d.schoolId].filter(Boolean).join(" / "))}${printCell("School Address / Contact Details",[d.schoolAddress,d.schoolContact].filter(Boolean).join(" / "))}${printCell("School Head / Designation / Contact",[d.schoolHead,d.designation,d.schoolHeadContact].filter(Boolean).join(" / "))}${printCell("School Type",d.schoolType)}${printCell("Classification / Location",d.schoolClassification)}${printCell("Enrollment",`Kinder: ${d.enrollmentKinder||0} | ES: ${d.enrollmentES||0} | JHS: ${d.enrollmentJHS||0} | SHS: ${d.enrollmentSHS||0} | ALS: ${d.enrollmentALS||0} | Total: ${d.enrollmentTotal||0}`)}${printCell("Personnel",`Teaching: ${d.personnelTeaching||0} | Non-teaching: ${d.personnelNonTeaching||0} | ALS Implementers: ${d.personnelALS||0} | Volunteers/Partners: ${d.personnelVolunteers||0}`)}${printCell("Major hazards / recurring disruptions",d.recurringHazards)}${printCell("Date LSCP developed / last updated",printDate(d.lscpUpdatedDate))}${printCell("Stakeholders involved in LSCP development",d.lscpStakeholders)}${printCell("LSCP reflected in SIP/AIP",`${d.lscpInSipAip||""} | Reference / page: ${d.lscpReference||""}`)}${printCell("School Year / Monitoring Date",`${d.schoolYear||""} / ${printDate(d.monitoringDate)}`)}</table>
      <h2 class="section-title">2. Emergency / Hazard Profile</h2>
      <table class="report-grid"><thead><tr><th>Emergency / Hazard</th><th>Date Occurred</th><th>Affected Learners</th><th>Affected Personnel</th><th>Situation Description</th></tr></thead><tbody>${emergencies.length?emergencies.map(x=>`<tr><td>${esc(x.hazardType||"")}</td><td>${esc(printDate(x.emergencyDate))}</td><td class="center">${esc(x.affectedLearners||"0")}</td><td class="center">${esc(x.affectedPersonnel||"0")}</td><td>${esc(x.situationDescription||"")}</td></tr>`).join(""):`<tr><td colspan="5" class="blank-row"></td></tr>`}</tbody></table>
      ${emergencies.map((x,i)=>`<h3 class="sub-title">Emergency ${i+1} — Activation Details</h3><table class="form-table emergency-print-details">${printCell("Emergency / hazard and affected area",[x.hazardType,x.affectedArea].filter(Boolean).join(" — "))}${printCell("Date and time level activated",x.levelActivatedAt?new Date(x.levelActivatedAt).toLocaleString("en-PH"):"")}${printCell("Decision maker / approving authority",x.decisionMaker)}${printCell("Assessment sources used",x.assessmentSources)}${printCell("Learners / personnel affected",`${x.affectedLearners||0} learners / ${x.affectedPersonnel||0} personnel`)}${printCell("Learning experiences/resources activated",x.activatedResources)}${printCell("Communication channels used",x.communicationChannels)}${printCell("Date/time reported to EiE dashboard / SDO",x.reportedAt?new Date(x.reportedAt).toLocaleString("en-PH"):"")}${printCell("Planned review / transition date",printDate(x.reviewDate))}</table>`).join("")}
      <h2 class="section-title">3. Activated Learning Continuity Level</h2>
      <table class="report-grid"><thead><tr><th>Selected Level</th><th>Learning Delivery Arrangement</th><th>Date Activated</th><th>Status / Duration</th><th>Responsible Person</th><th>Basis / Actions Taken</th></tr></thead><tbody>${activations.length?activations.map(x=>`<tr><td>${esc(x.level||"")}</td><td>${esc(x.arrangement||"")}</td><td>${esc(printDate(x.activationDate))}</td><td>${esc([x.status,x.duration].filter(Boolean).join(" / "))}</td><td>${esc(x.responsible||"")}</td><td>${esc(x.notes||"")}</td></tr>`).join(""):`<tr><td colspan="6" class="blank-row"></td></tr>`}</tbody></table>
    </div>
    <div class="print-sheet print-landscape">
      <h2 class="section-title">4. Compliance and Implementation Checklist</h2>
      <p class="guide"><b>Rating guide:</b> C = Compliant; PC = Partially Compliant; NC = Not Compliant; NA = Not Applicable. Mark one rating per indicator and cite specific means of verification (MOV). NA is excluded from automatic scoring.</p>
      <table class="report-grid checklist-print"><thead><tr><th>No.</th><th>Indicator</th><th>C</th><th>PC</th><th>NC</th><th>NA</th><th>Means of Verification</th><th>Findings / Gaps</th><th>Remarks / Action Needed</th></tr></thead><tbody>${checkRows}</tbody></table>
    </div>
    <div class="print-sheet">
      <h2 class="section-title">5. Rating Summary</h2>
      <table class="report-grid summary-table domain-summary"><thead><tr><th>Domain</th><th>C</th><th>PC</th><th>NC</th><th>NA</th><th>Applicable Items</th><th>Score</th></tr></thead><tbody>${domainRows}<tr class="summary-total"><td><b>TOTAL / OVERALL</b></td><td>${counts.C}</td><td>${counts.PC}</td><td>${counts.NC}</td><td>${counts.NA}</td><td>${score.applicableItems}</td><td><b>${score.percentage==null?"—":score.percentage.toFixed(2)+"%"}</b></td></tr></tbody></table>
      <p class="overall-print-rating"><b>Descriptive Rating:</b> ${esc(score.rating)} &nbsp; | &nbsp; <b>Points:</b> ${score.earnedPoints} of ${score.maximumPoints}</p>
      <p class="guide"><b>Automatic computation used by the online tool:</b> earned points ÷ maximum applicable points × 100. Compliant = 3; Partially Compliant = 2; Not Compliant = 1; Not Applicable is excluded.</p>
    </div>
    <div class="print-sheet print-landscape">
      <h2 class="section-title">6. Summary of Technical Assistance</h2>
      <table class="report-grid ta-table"><thead><tr><th>No.</th><th>Issue / Gap</th><th>Root Cause</th><th>Technical Assistance Provided / Agreed</th><th>Responsible Person / Office</th><th>Timeline</th><th>Status</th><th>Follow-up / Evidence</th></tr></thead><tbody>${taRecords.length?taRecords.map((x,i)=>`<tr><td class="center">${i+1}</td><td>${esc(x.taIssue||"")}</td><td>${esc(x.taRootCause||"")}</td><td>${esc(x.taProvided||"")}</td><td>${esc(x.taResponsible||"")}</td><td>${esc(printDate(x.taTimeline))}</td><td>${esc(x.taStatus||"")}</td><td>${esc(x.taFollowUp||"")}</td></tr>`).join(""):Array.from({length:6},(_,i)=>`<tr><td class="center">${i+1}</td><td></td><td></td><td></td><td></td><td></td><td>☐ Open<br>☐ Ongoing<br>☐ Completed</td><td></td></tr>`).join("")}</tbody></table>
    </div>
    <div class="print-sheet">
      <h2 class="section-title">7. Overall Findings and Recommendations</h2>
      <div class="narrative"><h3>Key strengths / good practices</h3><p>${esc(d.strengths||"")}</p><h3>Priority gaps / risks requiring action</h3><p>${esc(d.gaps||"")}</p><h3>Recommendations and agreed next steps</h3><p>${esc(d.nextSteps||"")}</p><h3>Support required from District / SDO / partners</h3><p>${esc(d.supportRequired||"")}</p><h3>Additional remarks</h3><p>${esc(d.additionalRemarks||"")}</p></div>
      <h2 class="section-title">8. Signatures and Acknowledgment</h2>
      <p class="acknowledgment">The findings and agreed technical assistance/actions were discussed with the concerned school personnel. Signatures acknowledge receipt and discussion.</p>
      <div class="signature-grid"><div><span>${esc(d.schoolHead||"")}</span><b>School Head</b><small>${esc(d.designation||"")}</small></div><div><span>${esc(d.validatedBy||"")}</span><b>Validated / Acknowledged by</b><small>${esc(d.validatedDesignation||"")}</small></div><div><span>${esc(d.monitoredBy||"")}</span><b>Evaluator / M&E Team Leader</b><small>${esc(d.monitorDesignation||"")}</small></div></div>
    </div>`;
}
function printMEReport(){buildPrintReport();document.body.classList.add("printing-report");qs("#printReport").setAttribute("aria-hidden","false");setTimeout(()=>window.print(),60)}
window.addEventListener("afterprint",()=>{document.body.classList.remove("printing-report");qs("#printReport")?.setAttribute("aria-hidden","true")});
async function renderDashboard(){
  const d=await api("/dashboard");
  let reports=d.recent||[];try{reports=(await api("/submissions")).submissions||reports}catch{}
  const latest=[...reports.reduce((m,r)=>{const key=r.schoolId||r.schoolName;if(!m.has(key))m.set(key,r);return m},new Map()).values()];
  const scores=latest.map(scoreOfReport).filter(s=>s.percentage!=null);
  const average=scores.length?scores.reduce((n,s)=>n+s.percentage,0)/scores.length:null;
  const overallRating=ratingFor(average);
  const latestChecklist=latest.flatMap(r=>r.data?.checklist||[]),answeredItems=latestChecklist.filter(x=>x.status).length,expectedItems=latest.reduce((n,r)=>n+(r.data?.checklist?.length||indicators.length),0),completionRate=expectedItems?answeredItems/expectedItems*100:null;
  const emergencyRecords=latest.flatMap(r=>r.data?.emergencies||[]),continuityRecords=latest.flatMap(r=>r.data?.continuityActivations?.length?r.data.continuityActivations:(r.data?.continuityLevel?[{level:r.data.continuityLevel}]:[])),technicalAssistanceRecords=latest.flatMap(r=>r.data?.technicalAssistanceRecords||[]);
  const continuityBands=["HAYO","HINAY","HINGA","HINTO"].map(level=>[level,continuityRecords.filter(x=>String(x.level||"").toUpperCase().startsWith(level)).length]);
  const urgentActivations=continuityBands.filter(([level])=>level==="HINGA"||level==="HINTO").reduce((n,[,count])=>n+count,0);
  const domainPerformance=[...new Set(indicators.map(x=>x.domain))].map(domain=>{const items=latestChecklist.filter((x,i)=>(x.domain||indicators.find(y=>y.text===x.indicator)?.domain)===domain),s=calculateScore(items);return{domain:domain.replace(/^[A-H]\. /,""),percentage:s.percentage,applicable:s.applicableItems}});
  const hazardCounts=emergencyRecords.reduce((m,x)=>{const key=x.hazardType||"Not specified";m[key]=(m[key]||0)+1;return m},{}),topHazards=Object.entries(hazardCounts).sort((a,b)=>b[1]-a[1]);
  const bands=[["Outstanding",scores.filter(s=>s.percentage>=90).length,"high","#1c8f5b"],["Very Satisfactory",scores.filter(s=>s.percentage>=80&&s.percentage<90).length,"high","#57b985"],["Satisfactory",scores.filter(s=>s.percentage>=70&&s.percentage<80).length,"mid","#1768c5"],["Needs Improvement",scores.filter(s=>s.percentage>=60&&s.percentage<70).length,"mid","#f4b400"],["Needs Immediate Technical Assistance",scores.filter(s=>s.percentage<60).length,"low","#c33d3d"]];
  let donutCursor=0;const donutStops=bands.map(([,count,,color])=>{const start=donutCursor;donutCursor+=scores.length?count/scores.length*100:0;return`${color} ${start}% ${donutCursor}%`}).join(",");
  const donutBackground=scores.length?`conic-gradient(${donutStops})`:"#e4ebf3";
  const overallClass=average==null?"neutral":average>=80?"high":average>=60?"mid":"low";
  qs("#dashboardPage").innerHTML=`<div class="page-title"><div><div class="kicker">ADMINISTRATOR</div><h2>Dashboard</h2><p>Division-wide status of registered schools and EIE M&E submissions.</p></div></div>
  <div class="stats"><div class="stat"><span>Registered Schools</span><strong>${d.registeredSchools}</strong></div><div class="stat"><span>Submitted Reports</span><strong>${d.submissions}</strong></div><div class="stat"><span>Division Average</span><strong>${average==null?"—":average.toFixed(2)+"%"}</strong></div><div class="stat"><span>Outstanding Schools</span><strong>${scores.filter(s=>s.percentage>=90).length}</strong></div></div>
  <div class="stats operational-stats"><div class="stat"><span>Checklist Completion</span><strong>${completionRate==null?"—":completionRate.toFixed(1)+"%"}</strong><small>${answeredItems} of ${expectedItems} expected responses</small></div><div class="stat"><span>Recorded Emergencies</span><strong>${emergencyRecords.length}</strong><small>From each school's latest report</small></div><div class="stat"><span>HINGA / HINTO Activations</span><strong>${urgentActivations}</strong><small>May require closer division support</small></div><div class="stat"><span>Technical Assistance Actions</span><strong>${technicalAssistanceRecords.length}</strong><small>${technicalAssistanceRecords.filter(x=>x.taStatus==="Open").length} open • ${technicalAssistanceRecords.filter(x=>x.taStatus==="Ongoing").length} ongoing</small></div></div>
  <article class="card overall-card"><div class="overall-head"><div><div class="kicker">OVERALL DIVISION PERFORMANCE</div><h3>${esc(overallRating)}</h3><p>${scores.length} of ${d.registeredSchools} registered school${d.registeredSchools===1?"":"s"} evaluated using their latest submission.</p></div><div class="overall-score ${overallClass}">${average==null?"—":average.toFixed(2)+"%"}</div></div><div class="overall-progress"><span style="width:${average||0}%"></span></div><div class="band-grid">${bands.map(([label,count,tone])=>`<div class="band-item ${tone}"><strong>${count}</strong><span>${esc(label)}</span></div>`).join("")}</div>${bands[4][1]?`<div class="ta-alert"><strong>${bands[4][1]} school${bands[4][1]===1?"":"s"}</strong> currently need immediate technical assistance based on their latest rating.</div>`:""}</article>
  <div class="dashboard-two"><article class="card"><h3>Overall Rating Distribution</h3><div class="donut-layout"><div class="donut-chart" role="img" aria-label="Rating distribution for ${scores.length} evaluated schools" style="background:${donutBackground}"><div class="donut-center"><strong>${scores.length}</strong><span>Evaluated<br>Schools</span></div></div><div class="donut-legend">${bands.map(([label,count,,color])=>`<div><i style="background:${color}"></i><span>${esc(label)}</span><strong>${count} <small>(${scores.length?Math.round(count/scores.length*100):0}%)</small></strong></div>`).join("")}</div></div></article><article class="card"><h3>Activated Continuity Levels</h3><div class="continuity-summary">${continuityBands.map(([level,count])=>`<div class="continuity-count ${level.toLowerCase()}"><strong>${count}</strong><span>${level}</span></div>`).join("")}</div><h3 class="dashboard-subtitle">Emergency / Hazard Profile</h3>${topHazards.length?`<div class="hazard-list">${topHazards.map(([name,count])=>`<div><span>${esc(name)}</span><strong>${count}</strong></div>`).join("")}</div>`:`<p class="muted">No emergency records in the latest reports.</p>`}</article></div>
  <article class="card"><h3>Performance by Compliance Domain</h3><p class="muted">Aggregated from the latest school submission and excluding Not Applicable items.</p><div class="domain-performance">${domainPerformance.map(x=>`<div class="domain-performance-row"><span>${esc(x.domain)}</span><div class="domain-track"><i style="width:${x.percentage||0}%"></i></div><strong>${x.percentage==null?"—":x.percentage.toFixed(1)+"%"}</strong><small>${x.applicable} items</small></div>`).join("")}</div></article>
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
  const latest=[...reports.reduce((m,r)=>{const key=r.schoolId||r.schoolName;if(!m.has(key))m.set(key,r);return m},new Map()).values()],scores=latest.map(scoreOfReport).filter(s=>s.percentage!=null);
  const bands=[["Outstanding",scores.filter(s=>s.percentage>=90).length],["Very Satisfactory",scores.filter(s=>s.percentage>=80&&s.percentage<90).length],["Satisfactory",scores.filter(s=>s.percentage>=70&&s.percentage<80).length],["Needs Improvement",scores.filter(s=>s.percentage>=60&&s.percentage<70).length],["Needs Immediate Technical Assistance",scores.filter(s=>s.percentage<60).length]];
  const average=scores.length?scores.reduce((n,s)=>n+s.percentage,0)/scores.length:null,checklist=latest.flatMap(r=>r.data?.checklist||[]),responseCounts=[["Compliant",checklist.filter(x=>x.status==="Compliant").length],["Partially Compliant",checklist.filter(x=>x.status==="Partially Compliant").length],["Not Compliant",checklist.filter(x=>x.status==="Not Compliant").length],["Not Applicable",checklist.filter(x=>x.status==="Not Applicable").length]];
  const domainPerformance=[...new Set(indicators.map(x=>x.domain))].map(domain=>{const items=checklist.filter(x=>(x.domain||indicators.find(y=>y.text===x.indicator)?.domain)===domain),s=calculateScore(items);return{domain:domain.replace(/^[A-H]\. /,""),percentage:s.percentage,applicable:s.applicableItems}});
  const emergencies=latest.flatMap(r=>r.data?.emergencies||[]),hazards=Object.entries(emergencies.reduce((m,x)=>{const key=x.hazardType||"Not specified";m[key]=(m[key]||0)+1;return m},{})).sort((a,b)=>b[1]-a[1]);
  const continuity=latest.flatMap(r=>r.data?.continuityActivations?.length?r.data.continuityActivations:(r.data?.continuityLevel?[{level:r.data.continuityLevel}]:[])),levels=["HAYO","HINAY","HINGA","HINTO"].map(level=>[level,continuity.filter(x=>String(x.level||"").toUpperCase().startsWith(level)).length]);
  const taRecords=latest.flatMap(r=>r.data?.technicalAssistanceRecords?.length?r.data.technicalAssistanceRecords:(r.data?.overallStatus?[{taStatus:r.data.overallStatus}]:[])),taStatuses=taRecords.reduce((m,r)=>{const key=r.taStatus||"Not specified";m[key]=(m[key]||0)+1;return m},{}),taRows=Object.entries(taStatuses).sort((a,b)=>b[1]-a[1]);
  const max=Math.max(1,...d.byDistrict.map(x=>x.count));
  const bandMax=Math.max(1,...bands.map(x=>x[1]));
  qs("#analyticsPage").innerHTML=`<div class="page-title"><div><div class="kicker">ANALYTICS</div><h2>Reports & Analytics</h2><p>Division analysis based on each school's latest complete EIE M&E submission.</p></div></div>
  <div class="stats"><div class="stat"><span>Evaluated Schools</span><strong>${latest.length}</strong><small>Latest submission per school</small></div><div class="stat"><span>Division Average</span><strong>${average==null?"—":average.toFixed(2)+"%"}</strong><small>${esc(ratingFor(average))}</small></div><div class="stat"><span>Emergency Records</span><strong>${emergencies.length}</strong><small>Documented in latest reports</small></div><div class="stat"><span>TA Action Records</span><strong>${taRecords.length}</strong><small>${taRecords.filter(x=>x.taStatus==="Completed").length} completed</small></div></div>
  <div class="analytics-grid"><article class="card"><h3>Rating Distribution</h3>${scores.length?bands.map(x=>`<div class="bar-row"><span>${esc(x[0])}</span><div class="bar"><span style="width:${Math.round(x[1]/bandMax*100)}%"></span></div><strong>${x[1]}</strong></div>`).join(""):`<p class="muted">No scored submissions yet.</p>`}</article><article class="card"><h3>Checklist Response Mix</h3><div class="response-mix">${responseCounts.map(([label,count],i)=>`<div class="response-${i}"><strong>${count}</strong><span>${esc(label)}</span><small>${checklist.length?Math.round(count/checklist.length*100):0}%</small></div>`).join("")}</div></article></div>
  <article class="card"><h3>Performance by Compliance Domain</h3><p class="muted">Combined performance across domains A–H; Not Applicable responses are excluded.</p><div class="domain-performance">${domainPerformance.map(x=>`<div class="domain-performance-row"><span>${esc(x.domain)}</span><div class="domain-track"><i style="width:${x.percentage||0}%"></i></div><strong>${x.percentage==null?"—":x.percentage.toFixed(1)+"%"}</strong><small>${x.applicable} items</small></div>`).join("")}</div></article>
  <div class="analytics-grid"><article class="card"><h3>Activated Learning Continuity Levels</h3><div class="continuity-summary">${levels.map(([level,count])=>`<div class="continuity-count ${level.toLowerCase()}"><strong>${count}</strong><span>${level}</span></div>`).join("")}</div></article><article class="card"><h3>Emergency / Hazard Distribution</h3>${hazards.length?`<div class="hazard-list">${hazards.map(([name,count])=>`<div><span>${esc(name)}</span><strong>${count}</strong></div>`).join("")}</div>`:`<p class="muted">No emergency records available.</p>`}</article></div>
  <div class="analytics-grid"><article class="card"><h3>Technical Assistance Action Status</h3>${taRows.length?`<div class="hazard-list">${taRows.map(([name,count])=>`<div><span>${esc(name)}</span><strong>${count}</strong></div>`).join("")}</div>`:`<p class="muted">No technical assistance records available.</p>`}</article><article class="card"><h3>Submissions by District</h3>${d.byDistrict.length?d.byDistrict.map(x=>`<div class="bar-row"><span>${esc(x.district)}</span><div class="bar"><span style="width:${Math.round(x.count/max*100)}%"></span></div><strong>${x.count}</strong></div>`).join(""):`<p class="muted">No submissions yet.</p>`}</article></div>
  <article class="card"><h3>Latest School Performance</h3>${renderSubmissionTable(latest,false)}</article>`;
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
