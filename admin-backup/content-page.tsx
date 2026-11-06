'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import AdminShell from '@/components/admin/AdminShell';
import { ADMIN_PAGES, sectionDocumentId } from '@/lib/admin/pageRegistry';

type Fields = { eyebrow:string; heading:string; body:string; buttonLabel:string; buttonLink:string; visible:boolean };
const EMPTY:Fields = { eyebrow:'',heading:'',body:'',buttonLabel:'',buttonLink:'',visible:true };
export default function AdminV2Content() {
  const [pageId,setPageId] = useState(ADMIN_PAGES[0].id);
  const page = ADMIN_PAGES.find(p=>p.id===pageId) ?? ADMIN_PAGES[0];
  const [key,setKey] = useState(page.sections[0].key);
  const [fields,setFields] = useState<Fields>(EMPTY);
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  useEffect(()=>{
    let active=true;
    setBusy(true);setMessage('');
    getDoc(doc(db,'siteContent',sectionDocumentId(key))).then(s=>{
      if(active) setFields({...EMPTY,...(s.exists()?s.data():{})});
    }).catch(e=>{if(active)setMessage(String(e));}).finally(()=>{if(active)setBusy(false);});
    return ()=>{active=false};
  },[key]);
  function changePage(id:string){const next=ADMIN_PAGES.find(p=>p.id===id);if(!next)return;setPageId(id);setKey(next.sections[0].key)}
  async function save(){
    if(!auth.currentUser){setMessage('Please sign in.');return;}
    setBusy(true);setMessage('');
    try{
      await setDoc(doc(db,'siteContent',sectionDocumentId(key)),{
        ...fields,language:'EN',page:page.label,section:key,status:'published',updatedAt:serverTimestamp(),updatedBy:auth.currentUser.uid,
      },{merge:true});
      setMessage('Published successfully.');
    }catch(e){setMessage(`Save failed: ${String(e)}`)}finally{setBusy(false)}
  }
  const field=(name:keyof Omit<Fields,'visible'>,label:string,multi=false)=><label style={{display:'grid',gap:6,marginBottom:18}}><span>{label}</span>{multi?<textarea rows={5} value={fields[name]} onChange={e=>setFields(f=>({...f,[name]:e.target.value}))}/>:<input value={fields[name]} onChange={e=>setFields(f=>({...f,[name]:e.target.value}))}/>}</label>;
  return <AdminShell title="Website Editor V2" eyebrow="NEW CMS · ENGLISH ONLY">
    <div style={{display:'grid',gridTemplateColumns:'minmax(210px,260px) minmax(0,1fr)',gap:24,padding:24}}>
      <aside><label>Page <select value={pageId} onChange={e=>changePage(e.target.value)}>{ADMIN_PAGES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label><div style={{display:'grid',gap:8,marginTop:20}}>{page.sections.map(s=><button type="button" key={s.key} onClick={()=>setKey(s.key)} style={{padding:12,textAlign:'left',background:key===s.key?'#d4a5a7':'#eee',color:'#222'}}>{s.label}</button>)}</div></aside>
      <section style={{maxWidth:800}}><h2>{page.sections.find(s=>s.key===key)?.label}</h2><p>Firestore: siteContent/{sectionDocumentId(key)}</p>{busy&&<p>Loading / saving…</p>}{field('eyebrow','Eyebrow')}{field('heading','Heading',true)}{field('body','Body',true)}{field('buttonLabel','Button label')}{field('buttonLink','Button link')}<label><input type="checkbox" checked={fields.visible} onChange={e=>setFields(f=>({...f,visible:e.target.checked}))}/> Visible</label><div style={{marginTop:20}}><button type="button" disabled={busy} onClick={save}>Publish English content</button></div>{message&&<p role="status">{message}</p>}</section>
    </div>
  </AdminShell>;
}
