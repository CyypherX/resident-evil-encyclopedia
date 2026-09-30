import {useEffect,useRef,useState} from 'react';
import './ArchiveImage.css';

const cache=new Map();

const clean=(value='')=>value
  .replace(/\s*\([^)]*\)/g,'')
  .replace(/\b(original|recent|latest|reference|resident evil)\b/gi,'')
  .replace(/\s+/g,' ')
  .trim();

const tokens=(value='')=>clean(value).toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>2 && !['type','game','character','virus','creature','location','project','files','gear','sites'].includes(w));

function scoreTitle(title, name){
  const t=(title||'').toLowerCase();
  const words=tokens(name);
  if(!words.length) return 0;
  let score=0;
  for(const word of words){ if(t.includes(word)) score+=3; }
  if(t.includes(clean(name).toLowerCase())) score+=8;
  if(/resident evil|biohazard/.test(t)) score+=2;
  if(/disambiguation|list of|soundtrack|episode|merchandise/.test(t)) score-=8;
  return score;
}

async function wikipediaImage(query,name){
  const key=`wiki:${query}`;
  if(cache.has(key)) return cache.get(key);
  try{
    const url=`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=0&gsrlimit=10&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=1400&format=json&origin=*`;
    const response=await fetch(url,{signal:AbortSignal.timeout(9000)});
    if(!response.ok) throw new Error('wiki');
    const data=await response.json();
    const pages=Object.values(data?.query?.pages||{}).filter(p=>p.thumbnail?.source);
    pages.sort((a,b)=>scoreTitle(b.title,name)-scoreTitle(a.title,name));
    const result=pages[0]?.thumbnail?.source||null;
    cache.set(key,result);
    return result;
  }catch{cache.set(key,null);return null;}
}

async function commonsImage(query,name){
  const key=`commons:${query}`;
  if(cache.has(key)) return cache.get(key);
  try{
    const url=`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=1400&format=json&origin=*`;
    const response=await fetch(url,{signal:AbortSignal.timeout(9000)});
    if(!response.ok) throw new Error('commons');
    const data=await response.json();
    const pages=Object.values(data?.query?.pages||{}).filter(p=>p.imageinfo?.[0]?.thumburl||p.imageinfo?.[0]?.url);
    pages.sort((a,b)=>scoreTitle(b.title,name)-scoreTitle(a.title,name));
    const info=pages[0]?.imageinfo?.[0];
    const result=info?.thumburl||info?.url||null;
    cache.set(key,result);
    return result;
  }catch{cache.set(key,null);return null;}
}

async function findEntityImage(name,type=''){
  const entity=clean(name);
  const queries=[entity,`Resident Evil ${entity}`,`${entity} ${clean(type)}`];
  for(const query of queries){
    const result=await wikipediaImage(query,entity);
    if(result) return result;
  }
  for(const query of queries){
    const result=await commonsImage(query,entity);
    if(result) return result;
  }
  return null;
}

export default function ArchiveImage({name,type='Resident Evil',className=''}){
  const ref=useRef(null);
  const [src,setSrc]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    let alive=true;
    const node=ref.current;
    if(!node) return;
    const load=()=>{
      const key=`entity:${name}|${type}`;
      const cached=cache.get(key);
      if(cached){setSrc(cached);setLoading(false);return;}
      setLoading(true);
      findEntityImage(name,type).then(result=>{
        if(!alive) return;
        cache.set(key,result);
        setSrc(result);
      }).finally(()=>alive&&setLoading(false));
      observer?.disconnect();
    };
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)) load();
    },{rootMargin:'500px'});
    observer.observe(node);
    return()=>{alive=false;observer.disconnect()};
  },[name,type]);

  return <div ref={ref} className={`archive-image ${className} ${loading?'is-loading':''}`} aria-label={`${name} image`}>
    {src ? <img src={src} alt={`${name} — ${type}`} loading="lazy" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentElement?.classList.add('image-missing')}}/> : (!loading && <div className="image-missing-label">IMAGE NOT INDEXED</div>)}
    <span className="archive-image-caption">{type}</span>
  </div>;
}
