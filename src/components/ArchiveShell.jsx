import { Link } from "react-router-dom";
import "./ArchiveShell.css";
import "../pages/RecordShared.css";
export default function ArchiveShell({children,section}){
 return <div className="archive-shell">
  <header className="shell-header">
   <Link to="/" className="shell-logo" aria-label="Return to start"><img src="/re-corner-logo.png" alt="RE" /></Link>
   <div className="shell-heading"><span>RESIDENT EVIL // BIOHAZARD ARCHIVE</span><strong>{section}</strong></div>
   <Link to="/archive" className="shell-back">ARCHIVE INDEX</Link>
  </header>
  <main className="shell-content">{children}</main>
  <footer className="shell-footer"><span>RE // ARCHIVE NETWORK</span><span>RESIDENT EVIL • ENCYCLOPEDIA • MADE • BY • CyypherX</span><Link to="/archive">RETURN TO INDEX</Link></footer>
 </div>
}