'use strict';
function safeUrl(v){if(typeof v!=='string'||v.length>2000)return false;try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password;}catch{return false;}}
function applyIssue(state,issue){
 if(issue.pull_request||typeof issue.body!=='string')return false;
 const marker='ONE_TECH_EVENT\n',pos=issue.body.indexOf(marker);
 if(pos<0||issue.body.length>15000)return false;
 let d;try{d=JSON.parse(issue.body.slice(pos+marker.length).trim());}catch{return false;}
 if(!d||typeof d!=='object'||typeof d.label!=='string'||!d.label.trim()||d.label.length>600||typeof d.note!=='string'||d.note.length>1000||!safeUrl(d.url))return false;
 const common={label:d.label,url:d.url,note:d.note,actor:issue.user.login,updatedAt:issue.updated_at,issue:issue.number};
 if(d.action==='work'){
  if(!['post','person'].includes(d.type)||typeof d.key!=='string'||d.key.length>2400||!new RegExp('^'+d.type+':(instagram|linkedin|credito|team):').test(d.key)||typeof d.done!=='boolean')return false;
  state.work[d.key]={...common,type:d.type,doneAt:d.done?issue.created_at:null};return true;
 }
 if(d.action==='entry'){
  if(typeof d.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(d.id)||!['person','post'].includes(d.kind)||!['instagram','linkedin','credito'].includes(d.platform)||!['Rispondere','Da valutare','Non prioritario'].includes(d.priority))return false;
  state.entries[d.id]={...common,id:d.id,kind:d.kind,platform:d.platform,priority:d.priority};return true;
 }
 return false;
}
module.exports={applyIssue,safeUrl};
