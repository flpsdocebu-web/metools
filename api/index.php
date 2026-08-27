<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const DATA_FILE = __DIR__ . '/data.json';
const SECRET_FILE = __DIR__ . '/app.key';
const SCORE_VALUES = ['Compliant'=>3,'Partially Compliant'=>2,'Not Compliant'=>1];
if (file_exists(__DIR__.'/config.php')) require __DIR__.'/config.php';
if (!defined('ADMIN_BOOTSTRAP_PASSWORD') || strlen((string)ADMIN_BOOTSTRAP_PASSWORD)<12) out(['error'=>'Server setup is incomplete. Configure the administrator password.'],503);

function out(array $data, int $status=200): never { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); exit; }
function body(): array { $v=json_decode(file_get_contents('php://input') ?: '{}', true); return is_array($v)?$v:[]; }
function now(): string { return gmdate('c'); }
function clean_user(mixed $v): string { return preg_replace('/[^a-z0-9._-]/','',strtolower(trim((string)$v))) ?? ''; }
function uuid(): string { $b=random_bytes(16); $b[6]=chr((ord($b[6])&15)|64); $b[8]=chr((ord($b[8])&63)|128); return vsprintf('%s%s-%s-%s-%s-%s%s%s',[...str_split(bin2hex($b),4)]); }
function secret(): string { if(!file_exists(SECRET_FILE)) file_put_contents(SECRET_FILE,bin2hex(random_bytes(48)),LOCK_EX); return trim((string)file_get_contents(SECRET_FILE)); }
function base64url(string $v): string { return rtrim(strtr(base64_encode($v),'+/','-_'),'='); }
function sign_token(array $payload): string { $b=base64url(json_encode($payload)); return $b.'.'.base64url(hash_hmac('sha256',$b,secret(),true)); }
function verify_token(string $token): ?array { $p=explode('.',$token); if(count($p)!==2||!hash_equals(base64url(hash_hmac('sha256',$p[0],secret(),true)),$p[1]))return null; $d=json_decode(base64_decode(strtr($p[0],'-_','+/')),true); return is_array($d)&&($d['exp']??0)>time()?$d:null; }
function score(array $items): array { $earned=0;$count=0;foreach($items as $x){$s=$x['status']??'';if(isset(SCORE_VALUES[$s])){$earned+=SCORE_VALUES[$s];$count++;}}$max=$count*3;$pct=$max?round($earned/$max*100,2):null;$rating=$pct===null?'Not yet rated':($pct>=90?'Outstanding':($pct>=80?'Very Satisfactory':($pct>=70?'Satisfactory':($pct>=60?'Needs Improvement':'Needs Immediate Technical Assistance'))));return ['earnedPoints'=>$earned,'maximumPoints'=>$max,'applicableItems'=>$count,'percentage'=>$pct,'rating'=>$rating]; }
function initial_data(): array { return ['users'=>[['id'=>'admin-001','username'=>'admin','passwordHash'=>password_hash(ADMIN_BOOTSTRAP_PASSWORD,PASSWORD_DEFAULT),'name'=>'Administrator','role'=>'admin','status'=>'active','district'=>'','schoolName'=>'','schoolId'=>'','createdAt'=>now()]],'drafts'=>[],'reports'=>[]]; }
function read_data(): array { if(!file_exists(DATA_FILE)){ $d=initial_data(); file_put_contents(DATA_FILE,json_encode($d),LOCK_EX); return $d; } $d=json_decode((string)file_get_contents(DATA_FILE),true); return is_array($d)?$d:initial_data(); }
function save_data(array $d): void { $tmp=DATA_FILE.'.tmp'; file_put_contents($tmp,json_encode($d,JSON_UNESCAPED_UNICODE),LOCK_EX); rename($tmp,DATA_FILE); }
function public_user(array $u): array { unset($u['passwordHash']); return $u; }
function current_user(array $d, bool $admin=false): array { $h=$_SERVER['HTTP_AUTHORIZATION']??'';$t=str_starts_with($h,'Bearer ')?substr($h,7):'';$p=verify_token($t);foreach($d['users'] as $u){if(($p['id']??'')===$u['id']&&$u['status']==='active'){if($admin&&$u['role']!=='admin')out(['error'=>'Administrator access required.'],403);return $u;}}out(['error'=>'Your session has expired. Please log in again.'],401); }

$route=trim((string)($_GET['route']??''),'/');$method=$_SERVER['REQUEST_METHOD'];$d=read_data();
if($route==='register'&&$method==='POST'){ $b=body();$un=clean_user($b['username']??'');if(empty($b['district'])||empty($b['schoolName'])||empty($b['schoolId'])||!$un||empty($b['password']))out(['error'=>'All registration fields are required.'],400);if(($b['password']??'')!==($b['confirmPassword']??''))out(['error'=>'Passwords do not match.'],400);if(strlen($b['password'])<8)out(['error'=>'Password must be at least 8 characters.'],400);foreach($d['users'] as $u)if($u['username']===$un)out(['error'=>'Username is already in use.'],409);$d['users'][]=['id'=>uuid(),'username'=>$un,'passwordHash'=>password_hash($b['password'],PASSWORD_DEFAULT),'name'=>trim($b['schoolName']),'role'=>'user','status'=>'inactive','district'=>trim($b['district']),'schoolName'=>trim($b['schoolName']),'schoolId'=>trim($b['schoolId']),'createdAt'=>now()];save_data($d);out(['ok'=>true]); }
if($route==='login'&&$method==='POST'){ $b=body();foreach($d['users'] as $u)if($u['username']===clean_user($b['username']??'')&&$u['status']==='active'&&password_verify((string)($b['password']??''),$u['passwordHash']))out(['token'=>sign_token(['id'=>$u['id'],'role'=>$u['role'],'exp'=>time()+28800]),'user'=>public_user($u)]);out(['error'=>'Invalid username or password.'],401); }
if($route==='me'&&$method==='GET'){ $u=current_user($d);out(['user'=>public_user($u)]); }
if($route==='users'&&$method==='GET'){ current_user($d,true);out(['users'=>array_map('public_user',$d['users'])]); }
if($route==='users/update'&&$method==='POST'){ current_user($d,true);$b=body();foreach($d['users'] as &$u)if($u['id']===($b['id']??'')&&$u['role']!=='admin')$u['status']=in_array($b['status']??'', ['active','inactive'],true)?$b['status']:$u['status'];unset($u);save_data($d);out(['ok'=>true]); }
if($route==='users/delete'&&$method==='POST'){ current_user($d,true);$b=body();$d['users']=array_values(array_filter($d['users'],fn($u)=>$u['role']==='admin'||$u['id']!==($b['id']??'')));save_data($d);out(['ok'=>true]); }
if($route==='draft'&&$method==='GET'){ $u=current_user($d);out(['draft'=>$d['drafts'][$u['id']]??null]); }
if($route==='draft'&&$method==='POST'){ $u=current_user($d);$b=body();$data=$b['data']??[];$data['score']=score($data['checklist']??[]);$data['savedAt']=now();$d['drafts'][$u['id']]=$data;save_data($d);out(['ok'=>true,'score'=>$data['score'],'savedAt'=>$data['savedAt']]); }
if($route==='submit'&&$method==='POST'){ $u=current_user($d);if($u['role']==='admin')out(['error'=>'Administrator cannot submit a school report.'],400);$b=body();$data=$b['data']??[];$data['score']=score($data['checklist']??[]);$r=['id'=>uuid(),'userId'=>$u['id'],'username'=>$u['username'],'district'=>$u['district'],'schoolName'=>$u['schoolName'],'schoolId'=>$u['schoolId'],'submittedAt'=>now(),'status'=>'Submitted','score'=>$data['score'],'data'=>$data];array_unshift($d['reports'],$r);$d['reports']=array_slice($d['reports'],0,5000);save_data($d);out(['ok'=>true,'id'=>$r['id'],'score'=>$r['score']]); }
if($route==='submissions'&&$method==='GET'){ current_user($d,true);out(['submissions'=>array_map(fn($r)=>array_diff_key($r,['data'=>true]),$d['reports'])]); }
if($route==='submission'&&$method==='GET'){ current_user($d,true);foreach($d['reports'] as $r)if($r['id']===($_GET['id']??''))out(['report'=>$r]);out(['error'=>'Report not found.'],404); }
if($route==='my-submissions'&&$method==='GET'){ $u=current_user($d);out(['submissions'=>array_values(array_map(fn($r)=>array_diff_key($r,['data'=>true]),array_filter($d['reports'],fn($r)=>$r['userId']===$u['id'])))]); }
if($route==='dashboard'&&$method==='GET'){ current_user($d,true);$ordinary=array_values(array_filter($d['users'],fn($u)=>$u['role']==='user'));$counts=[];foreach($d['reports'] as $r)$counts[$r['district']]=($counts[$r['district']]??0)+1;arsort($counts);out(['registeredSchools'=>count($ordinary),'submissions'=>count($d['reports']),'activeUsers'=>count(array_filter($ordinary,fn($u)=>$u['status']==='active')),'districts'=>count(array_unique(array_filter(array_column($ordinary,'district')))),'recent'=>array_slice(array_map(fn($r)=>array_diff_key($r,['data'=>true]),$d['reports'],),0,8),'byDistrict'=>array_map(fn($k,$v)=>['district'=>$k,'count'=>$v],array_keys($counts),array_values($counts))]); }
if($route==='change-password'&&$method==='POST'){ $u=current_user($d,true);$b=body();if(!password_verify((string)($b['currentPassword']??''),$u['passwordHash']))out(['error'=>'Current password is incorrect.'],400);if(strlen((string)($b['newPassword']??''))<10)out(['error'=>'New password must be at least 10 characters.'],400);foreach($d['users'] as &$x)if($x['id']===$u['id'])$x['passwordHash']=password_hash($b['newPassword'],PASSWORD_DEFAULT);unset($x);save_data($d);out(['ok'=>true]); }
out(['error'=>'Not found.'],404);
