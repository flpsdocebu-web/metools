
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

const ADMIN_USERNAME="admin";
const ADMIN_BOOTSTRAP_PASSWORD=process.env.ADMIN_BOOTSTRAP_PASSWORD||"";
const TOKEN_SECRET=process.env.APP_SECRET || "replace-this-with-a-long-secret-before-production";
// Create the store client at operation time so long-lived function instances
// never retain an expired Netlify Blobs access token.
const blobStore=()=>getStore({name:"eie-me-system",consistency:"strong"});

const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const keySafe=s=>String(s||"").trim().toLowerCase().replace(/[^a-z0-9._-]/g,"");
const now=()=>new Date().toISOString();

function hashPassword(password,salt=crypto.randomBytes(16).toString("hex")){
  const hash=crypto.pbkdf2Sync(password,salt,180000,32,"sha256").toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password,stored){
  const [salt,hash]=String(stored||"").split(":"); if(!salt||!hash)return false;
  const check=crypto.pbkdf2Sync(password,salt,180000,32,"sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash,"hex"),Buffer.from(check,"hex"));
}
function sign(payload){
  const body=Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig=crypto.createHmac("sha256",TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}
function verifyToken(token){
  try{
    const [body,sig]=token.split(".");
    const expected=crypto.createHmac("sha256",TOKEN_SECRET).update(body).digest("base64url");
    if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return null;
    const p=JSON.parse(Buffer.from(body,"base64url").toString());
    if(p.exp<Date.now())return null; return p;
  }catch{return null}
}
async function getUsers(){return await blobStore().get("users",{type:"json"})||[]}
async function setUsers(users){await blobStore().setJSON("users",users)}
async function getSubIndex(){return await blobStore().get("submission-index",{type:"json"})||[]}
async function setSubIndex(x){await blobStore().setJSON("submission-index",x)}

async function ensureAdmin(){
  const users=await getUsers();
  if(!users.some(u=>u.role==="admin")){
    if(!ADMIN_BOOTSTRAP_PASSWORD) throw new Error("ADMIN_SETUP_REQUIRED");
    users.unshift({id:"admin-001",username:ADMIN_USERNAME,passwordHash:hashPassword(ADMIN_BOOTSTRAP_PASSWORD),name:"Administrator",role:"admin",status:"active",district:"",schoolName:"",schoolId:"",createdAt:now()});
    await setUsers(users);
  }
}
function publicUser(u){const {passwordHash,...safe}=u;return safe}
async function auth(req,adminOnly=false){
  const h=req.headers.get("authorization")||"";const token=h.startsWith("Bearer ")?h.slice(7):"";
  const payload=verifyToken(token);if(!payload)throw new Error("UNAUTHORIZED");
  const users=await getUsers();const user=users.find(u=>u.id===payload.id&&u.status==="active");
  if(!user)throw new Error("UNAUTHORIZED");if(adminOnly&&user.role!=="admin")throw new Error("FORBIDDEN");return user;
}

export default async (req,context)=>{
  const url=new URL(req.url);const path=url.pathname.replace(/^\/api/,"")||"/";
  try{
    await ensureAdmin();
    if(path==="/register"&&req.method==="POST"){
      const b=await req.json(); const username=keySafe(b.username);
      if(!b.district||!b.schoolName||!b.schoolId||!username||!b.password) return json({error:"All registration fields are required."},400);
      if(b.password!==b.confirmPassword)return json({error:"Passwords do not match."},400);
      if(String(b.password).length<8)return json({error:"Password must be at least 8 characters."},400);
      const users=await getUsers(); if(users.some(u=>u.username===username))return json({error:"Username is already in use."},409);
      users.push({id:crypto.randomUUID(),username,passwordHash:hashPassword(b.password),name:b.schoolName,role:"user",status:"inactive",district:String(b.district).trim(),schoolName:String(b.schoolName).trim(),schoolId:String(b.schoolId).trim(),createdAt:now()});
      await setUsers(users); return json({ok:true});
    }
    if(path==="/login"&&req.method==="POST"){
      const b=await req.json();const users=await getUsers();const user=users.find(u=>u.username===keySafe(b.username));
      if(!user||user.status!=="active"||!verifyPassword(b.password,user.passwordHash))return json({error:"Invalid username or password."},401);
      return json({token:sign({id:user.id,role:user.role,exp:Date.now()+8*60*60*1000}),user:publicUser(user)});
    }
    if(path==="/me"&&req.method==="GET"){const u=await auth(req);return json({user:publicUser(u)})}
    if(path==="/users"&&req.method==="GET"){await auth(req,true);const users=await getUsers();return json({users:users.map(publicUser)})}
    if(path==="/users/update"&&req.method==="POST"){
      await auth(req,true);const b=await req.json();const users=await getUsers();const i=users.findIndex(u=>u.id===b.id&&u.role!=="admin");if(i<0)return json({error:"User not found."},404);
      if(["active","inactive"].includes(b.status))users[i].status=b.status;await setUsers(users);return json({ok:true});
    }
    if(path==="/users/delete"&&req.method==="POST"){
      await auth(req,true);const b=await req.json();let users=await getUsers();const target=users.find(u=>u.id===b.id);if(!target||target.role==="admin")return json({error:"User cannot be deleted."},400);
      users=users.filter(u=>u.id!==b.id);await setUsers(users);return json({ok:true});
    }
    if(path==="/draft"&&req.method==="GET"){
      const u=await auth(req);const draft=await blobStore().get(`draft-${u.id}`,{type:"json"});return json({draft:draft||null});
    }
    if(path==="/draft"&&req.method==="POST"){
      const u=await auth(req);const b=await req.json();const data=b.data||{};data.savedAt=now();await blobStore().setJSON(`draft-${u.id}`,data);return json({ok:true,savedAt:data.savedAt});
    }
    if(path==="/submit"&&req.method==="POST"){
      const u=await auth(req);if(u.role==="admin")return json({error:"Administrator cannot submit a school report."},400);
      const b=await req.json();const id=crypto.randomUUID();const report={id,userId:u.id,username:u.username,district:u.district,schoolName:u.schoolName,schoolId:u.schoolId,submittedAt:now(),status:"Submitted",data:b.data||{}};
      await blobStore().setJSON(`report-${id}`,report);const idx=await getSubIndex();idx.unshift({id,userId:u.id,district:u.district,schoolName:u.schoolName,schoolId:u.schoolId,submittedAt:report.submittedAt,status:report.status});await setSubIndex(idx.slice(0,5000));return json({ok:true,id});
    }
    if(path==="/submissions"&&req.method==="GET"){await auth(req,true);return json({submissions:await getSubIndex()})}
    if(path==="/submission"&&req.method==="GET"){await auth(req,true);const r=await blobStore().get(`report-${url.searchParams.get("id")}`,{type:"json"});if(!r)return json({error:"Report not found."},404);return json({report:r})}
    if(path==="/my-submissions"&&req.method==="GET"){const u=await auth(req);const idx=await getSubIndex();return json({submissions:idx.filter(x=>x.userId===u.id)})}
    if(path==="/dashboard"&&req.method==="GET"){
      await auth(req,true);const users=await getUsers();const idx=await getSubIndex();const ordinary=users.filter(u=>u.role==="user");
      const districts=[...new Set(ordinary.map(u=>u.district).filter(Boolean))];const counts={};idx.forEach(r=>counts[r.district]=(counts[r.district]||0)+1);
      return json({registeredSchools:ordinary.length,submissions:idx.length,activeUsers:ordinary.filter(u=>u.status==="active").length,districts:districts.length,recent:idx.slice(0,8),byDistrict:Object.entries(counts).map(([district,count])=>({district,count})).sort((a,b)=>b.count-a.count)});
    }
    if(path==="/change-password"&&req.method==="POST"){
      const u=await auth(req,true);const b=await req.json();if(!verifyPassword(b.currentPassword,u.passwordHash))return json({error:"Current password is incorrect."},400);
      if(String(b.newPassword||"").length<10)return json({error:"New password must be at least 10 characters."},400);
      const users=await getUsers();const i=users.findIndex(x=>x.id===u.id);users[i].passwordHash=hashPassword(b.newPassword);await setUsers(users);return json({ok:true});
    }
    return json({error:"Not found."},404);
  }catch(err){
    if(err.message==="ADMIN_SETUP_REQUIRED")return json({error:"Administrator setup is incomplete."},503);
    if(err.message==="UNAUTHORIZED")return json({error:"Your session has expired. Please log in again."},401);
    if(err.message==="FORBIDDEN")return json({error:"Administrator access required."},403);
    if(err.name==="BlobsInternalError"||String(err.message).includes("decode token"))return json({error:"The database connection expired. Please refresh the page and try again."},503);
    console.error(err);return json({error:"Server error."},500);
  }
};

export const config={path:"/api/*"};
