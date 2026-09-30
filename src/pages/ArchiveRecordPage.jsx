import {useMemo,useState} from "react";
import {Navigate,useNavigate,useParams} from "react-router-dom";
import ArchiveShell from "../components/ArchiveShell";
import {archiveData} from "./archiveData";
import "./RecordShared.css";
import "./ArchiveRecordPage.css";

const map={characters:"Characters",organizations:"Organizations",viruses:"Viruses",bows:"B.O.W.s",parasites:"Parasites",fungi:"Fungi",creatures:"Creatures",locations:"Locations",incidents:"Incidents",games:"Games",media:"Media",weapons:"Weapons & Gear",projects:"Concepts & Projects",requiem:"Requiem",timeline:"Timeline",documents:"Documents & Files",bloodlines:"People & Bloodlines",facilities:"Facilities & Sites"};
const meta={Characters:['CHARACTERS','Agents, survivors, scientists, antagonists and the people who shaped the biohazard era.'],Organizations:['ORGANIZATIONS','Corporations, agencies, cults, NGOs, military units and clandestine networks.'],Viruses:['VIRUSES','Viral agents, variants and research programs from Progenitor through the later bioweapon era.'],'B.O.W.s':['B.O.W.s','Bio Organic Weapons, engineered organisms and major mutated combat forms.'],Parasites:['PARASITES','Las Plagas, Cadou and other host-control or symbiotic biological systems.'],Fungi:['FUNGI','The Mold, E-Series and Megamycete research that defines the Ethan Winters era.'],Creatures:['CREATURES','Mutated animals, infected humans and recurring monsters outside the dedicated B.O.W. index.'],Locations:['LOCATIONS','Cities, laboratories, estates, ships, villages and other incident sites.'],Incidents:['INCIDENTS','Outbreaks, operations, containment actions and major historical disasters.'],Games:['GAMES','Mainline games, remakes, saga entries and selected major spinoffs in continuity context.'],Media:['MEDIA','CG films, animated continuity and separate live-action film timelines.'],'Weapons & Gear':['WEAPONS & GEAR','Signature weapons, healing items, inventory systems and survival equipment.'],'Concepts & Projects':['CONCEPTS & PROJECTS','Research programs, operations and recurring scientific concepts behind the incidents.'],Requiem:['REQUIEM / RE9','A dedicated record set for Resident Evil Requiem and its 2026-era characters, locations and biological mysteries.'],Timeline:['TIMELINE','Chronological index from the Progenitor era and 1968 Umbrella foundation through 2026.'],'Documents & Files':['DOCUMENTS & FILES','Original archive summaries of memos, research files, incident records and historical documents.'],'People & Bloodlines':['PEOPLE & BLOODLINES','Families, founder lineages, research cohorts and relationships that connect generations of the universe.'],'Facilities & Sites':['FACILITIES & SITES','Laboratories, headquarters, prisons, research stations and specialized facilities separated from general locations.']};

const dossierLabels=[['role','ROLE / FUNCTION'],['origin','ORIGIN / CONTEXT'],['affiliations','AFFILIATIONS'],['keyEvents','KEY EVENTS / HISTORY'],['relationships','RELATIONSHIPS / CONNECTIONS'],['research','BIOLOGY / RESEARCH / OPERATIONS'],['legacy','LEGACY / SIGNIFICANCE']];
const slugify=(value)=>encodeURIComponent(value.toLowerCase().trim().replace(/\s+/g,'-'));

function RecordDetail({record,headline,section}){
  const navigate=useNavigate();
  return <ArchiveShell section={`${headline} // RECORD`}><div className={`record-page archive-record-page theme-${section}`}>
    <section className="record-detail-screen">
      <div className="detail-topline"><span>RE // ARCHIVE / {headline} / RECORD</span><button type="button" className="detail-back" onClick={()=>navigate(-1)}>BACK TO DATABASE</button></div>
      <div className="detail-classification"><span>{record.type}</span><span>{record.status}</span></div>
      <h1>{record.name}</h1>
      <p className="detail-summary">{record.summary}</p>
      <div className="dossier-columns detail-meta-columns"><div className="dossier-source"><span>CONNECTED RECORDS / APPEARANCES</span><strong>{record.connections}</strong></div><div className="dossier-source"><span>CLASSIFICATION</span><strong>{record.status}</strong></div></div>
      <div className="dossier-detail-grid">{dossierLabels.map(([key,label])=><section className="dossier-detail" key={key}><span>{label}</span><p>{record.dossier?.[key] || 'No expanded entry has been indexed for this field yet.'}</p></section>)}</div>
      <button type="button" className="detail-back detail-back-bottom" onClick={()=>navigate(-1)}>BACK TO DATABASE</button>
    </section>
  </div></ArchiveShell>;
}

export default function ArchiveRecordPage(){
  const {section,record:recordSlug}=useParams();
  const cat=map[section?.toLowerCase()];
  if(!cat) return <Navigate to="/archive" replace/>;
  const records=archiveData[cat]||[];
  const matchedRecord=recordSlug ? records.find(r=>slugify(r.name)===recordSlug) : null;
  if(recordSlug){
    if(!matchedRecord) return <Navigate to={`/${section}`} replace/>;
    const [headline]=meta[cat];
    return <RecordDetail record={matchedRecord} headline={headline} section={section}/>;
  }
  const [query,setQuery]=useState('');
  const navigate=useNavigate();
  const filtered=useMemo(()=>records.filter(r=>Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())),[records,query]);
  const [headline,desc]=meta[cat];
  return <ArchiveShell section={`${headline} DATABASE`}><div className={`record-page archive-record-page theme-${section}`}>
    <section className="record-hero"><div className="record-eyebrow">RE // ARCHIVE / {headline} / INDEX</div><h1>{headline}<span>DATABASE</span></h1><p>{desc}</p><div className="record-meta">FILE TYPE / {headline} <b>{String(records.length).padStart(3,'0')} RECORDS</b></div></section>
    <section className="record-browser"><div className="record-toolbar"><div><small>AUTHORIZED PUBLIC ACCESS</small><h2>INDEXED RECORDS</h2></div><label className="record-search"><span>⌕</span><input aria-label="Search records" placeholder="SEARCH DATABASE..." value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
      <div className="record-grid record-grid-text-only">{filtered.map(r=><button type="button" className="record-tile" key={r.name} onClick={()=>navigate(`/${section}/${slugify(r.name)}`)}><div className="tile-top"><span>{String(records.indexOf(r)+1).padStart(3,'0')} // FILE</span><span>+</span></div><small>{r.type}</small><h3>{r.name}</h3><p>{r.summary}</p><div className="tile-bottom"><span>{r.status}</span><span>OPEN RECORD</span></div></button>)}</div>
      {filtered.length===0&&<p className="record-empty">NO MATCHING RECORDS FOUND.</p>}
    </section>
  </div></ArchiveShell>
}
