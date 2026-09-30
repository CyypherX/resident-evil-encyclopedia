import {useMemo,useState} from "react";
import ArchiveShell from "../components/ArchiveShell";
import {archiveData} from "./archiveData";
import "./Locations.css";
const records=archiveData.Locations;
export default function Locations(){
 const [query,setQuery]=useState("");
 const [selected,setSelected]=useState(null);
 const filtered=useMemo(()=>records.filter(r=>r.join(" ").toLowerCase().includes(query.toLowerCase())),[query]);
 return <ArchiveShell section="LOCATIONS DATABASE"><div className="record-page locations-page">
  <section className="record-hero">
   <div className="record-eyebrow">RE // ARCHIVE / LOCATIONS / INDEX</div>
   <h1>LOCATIONS<span>DATABASE</span></h1>
   <p>{"Sites of outbreaks, laboratories, settlements and covert facilities."}</p>
   <div className="record-meta">FILE TYPE / LOCATIONS <b>{String(records.length).padStart(3,"0")} RECORDS</b></div>
  </section>
  <section className="record-browser"><div className="record-toolbar"><div><small>AUTHORIZED PUBLIC ACCESS</small><h2>INDEXED RECORDS</h2></div><label className="record-search"><span>⌕</span><input aria-label="Search records" placeholder="SEARCH DATABASE..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
   <div className="record-grid">{filtered.map((r,i)=><button type="button" className={"record-tile "+(selected===r[0]?"selected":"")} key={r[0]} onClick={()=>setSelected(selected===r[0]?null:r[0])}>
    <div className="tile-top"><span>{String(records.indexOf(r)+1).padStart(3,"0")} // FILE</span><span>{selected===r[0]?"−":"+"}</span></div>
    <small>{r[1]}</small><h3>{r[0]}</h3><p>{r[2]}</p><div className="tile-bottom">OPEN RECORD <span>↗</span></div>
   </button>)}</div>
   {filtered.length===0&&<p className="record-empty">NO MATCHING RECORDS FOUND.</p>}
   {selected&&(()=>{const r=records.find(x=>x[0]===selected);return <article className="record-dossier"><div className="dossier-heading"><span>ACCESS GRANTED // RECORD DETAILS</span><button onClick={()=>setSelected(null)}>CLOSE ×</button></div><small>{r[1]}</small><h2>{r[0]}</h2><p>{r[2]}</p><div className="dossier-source"><span>ASSOCIATED FILE / APPEARANCE</span><strong>{r[3]}</strong></div><p className="dossier-note">Archive summary • Main game continuity; adaptations and remakes may vary in presentation.</p></article>})()}
  </section>
 </div></ArchiveShell>
}