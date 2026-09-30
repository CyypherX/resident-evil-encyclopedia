import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ArchiveIndex from "./pages/ArchiveIndex";
import ArchiveRecordPage from "./pages/ArchiveRecordPage";
import "./App.css";
import MusicControl from "./components/MusicControl";

function BootScreen(){
 const navigate=useNavigate();
 return <main className="archive-entry"><div className="blood-glow"/><div className="vignette"/><div className="scanlines"/><div className="noise"/><div className="hud-frame"><span className="hud-corner tl"/><span className="hud-corner tr"/><span className="hud-corner bl"/><span className="hud-corner br"/></div><div className="system-status"><div className="status-light"/><span>ARCHIVE SYSTEM ONLINE</span></div><div className="incident-number"><span>UNIVERSE DATABASE</span><strong>RE // 004</strong></div><section className="content"><div className="classification-top"><span>CLASSIFIED DATABASE</span><i/><span>MADE BY CyypherX</span></div><p className="eyebrow">BIOHAZARD RESEARCH ARCHIVE</p><div className="resident-evil-logo-wrap"><img className="resident-evil-logo" src="/resident-evil-logo.png" alt="Resident Evil" /></div><div className="archive-title"><span>UNIVERSE</span><strong>ARCHIVE</strong></div><div className="red-line"/><p className="description">PERSONNEL // FOUNDERS // BLOODLINES // FACTIONS // BIOLOGICAL AGENTS<br/>B.O.W.s // FACILITIES // DOCUMENTS // INCIDENTS // CHRONOLOGY // REQUIEM</p><button className="enter-button" onClick={()=>navigate("/archive")}><span className="button-number">01</span><span className="button-text">ENTER ARCHIVE</span></button></section><div className="bottom-left"><span>RESEARCH NODE</span><strong>RPD-2026</strong></div><div className="bottom-right"><span>STATUS</span><strong>RE // 9</strong></div></main>
}

export default function App(){return <BrowserRouter><MusicControl/><Routes><Route path="/" element={<BootScreen/>}/><Route path="/archive" element={<ArchiveIndex/>}/><Route path="/:section/:record" element={<ArchiveRecordPage/>}/><Route path="/:section" element={<ArchiveRecordPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter>}
