import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Clipboard,
  ExternalLink,
  Gauge,
  Lightbulb,
  Megaphone,
  Play,
  Send,
  Users,
  Zap,
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';

const channels = [
  { channel: 'WhatsApp communities', target: 180, effort: '6 relevant final-year groups', conversion: '30 per group', color: 'green' },
  { channel: 'College clubs + class reps', target: 170, effort: '5 campus partners', conversion: '34 per partner', color: 'blue' },
  { channel: 'Instagram + LinkedIn', target: 100, effort: '4 short demos + 1 boosted post', conversion: '2,000 reach × 5%', color: 'orange' },
  { channel: 'Faculty + placement email', target: 50, effort: '10 department / TPO forwards', conversion: '5 per forward', color: 'violet' },
];

const schedule = [
  ['01', 'Set the hook', 'Lock the one-line promise, RSVP form, referral codes and a 20-second build demo. Give each campus partner a tagged message.'],
  ['02', 'Seed trusted groups', 'Ask club leads and class reps to share once with a personal note. Open WhatsApp replies for questions; no bulk-added members.'],
  ['03', 'Show the outcome', 'Post a short screen recording of a tiny AI project being built. Ask students to comment with the project they would make.'],
  ['04', 'Make it social', 'Partner clubs run a “bring a teammate” reminder with their own referral code. Share the first live signup milestone.'],
  ['05', 'Answer objections', 'Publish the exact prerequisites: beginner-friendly, laptop/browser, free, and leave with a working project. Send faculty/TPO copy.'],
  ['06', 'Conversion push', 'Boost the best-performing demo for ₹1,200. Retarget engaged viewers with the workshop outcome and a clear RSVP CTA.'],
  ['07', 'Close the loop', 'Send one deadline reminder to opted-in channels, confirm registrations, deduplicate the list, and share joining details.'],
];

const reflections = [
  { ask: 'How do we get 500 signups on ₹2,000?', suggestion: 'Spread effort across lots of social channels and run a broad giveaway.', change: 'I prioritised four trusted, measurable lanes. The giveaway was dropped because it attracts low-intent entries; campus credibility and a concrete project outcome should drive better show-up quality.' },
  { ask: 'What should the landing page promise?', suggestion: 'Lead with “Learn AI and transform your career.”', change: 'I made the promise specific: build a first AI project in 60 minutes. A visible outcome is easier to believe and share than a career claim.' },
  { ask: 'How can referrals be tracked?', suggestion: 'Collect student email, phone, college, and social profile.', change: 'The prototype records only first name and a campus code. That is enough to demonstrate attribution without gathering contact details for a simulation.' },
];

function App() {
  const [stats, setStats] = useState({ registrations: 0, target: 500, leaderboard: [] });
  const [apiState, setApiState] = useState('checking');
  const [form, setForm] = useState({ first_name: '', referral_code: 'BUILD-PESU' });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function refreshStats() {
    try {
      const response = await fetch(`${API}/api/stats`);
      if (!response.ok) throw new Error('API unavailable');
      setStats(await response.json());
      setApiState('connected');
    } catch {
      setApiState('offline');
    }
  }

  useEffect(() => {
    refreshStats();
  }, []);

  async function submitRegistration(event) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch(`${API}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail ?? 'Could not record this demo registration.');
      setNotice(`You're on the demo list, ${body.registration.first_name}.`);
      setForm((current) => ({ ...current, first_name: '' }));
      await refreshStats();
    } catch (error) {
      setNotice(error.message === 'Failed to fetch' ? 'Start the Python API to record demo signups.' : error.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyReferral() {
    try {
      await navigator.clipboard.writeText('BUILD-PESU');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice('Referral code: BUILD-PESU');
    }
  }

  const progress = Math.min(100, Math.round((stats.registrations / stats.target) * 100));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Build in 60 home">
          <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
          <span>BUILD<span className="brand-light">/60</span></span>
        </a>
        <div className="side-label">GROWTH FIELDNOTES</div>
        <nav className="side-nav" aria-label="Campaign sections">
          <a className="nav-item active" href="#overview"><Gauge size={17} /> Overview</a>
          <a className="nav-item" href="#audience"><Users size={17} /> Student insight</a>
          <a className="nav-item" href="#campaign"><Megaphone size={17} /> 7-day campaign</a>
          <a className="nav-item" href="#referrals"><ArrowUpRight size={17} /> Referral demo</a>
          <a className="nav-item" href="#learning"><Lightbulb size={17} /> AI learning log</a>
          <a className="nav-item" href="#pitch"><Play size={17} /> 3-minute pitch</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-label">THE BRIEF</div>
          <p>500 final-year engineering students. 7 days. ₹2,000.</p>
          <div className="status"><span className={`status-dot ${apiState}`} /> {apiState === 'connected' ? 'DEMO API CONNECTED' : apiState === 'offline' ? 'API OFFLINE' : 'CHECKING API'}</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">NXTWAVE <span>/</span> GROWTH CHALLENGE <span>/</span> ROUND 01</div>
          <div className="topbar-right"><span className="simulation-tag">SIMULATION ONLY</span><span className="avatar">GW</span></div>
        </header>

        <section className="overview section-block" id="overview">
          <div className="eyebrow"><span className="eyebrow-line" /> THE 7-DAY ACQUISITION SPRINT</div>
          <div className="overview-grid">
            <div>
              <h1>Build your first<br /><em>AI project</em> in 60.</h1>
              <p className="intro">A practical growth plan to fill a free, beginner-friendly workshop with students who are ready to build, not just browse.</p>
              <div className="tag-row"><span>FINAL-YEAR ENGINEERING</span><span>FREE WORKSHOP</span><span>7 DAYS</span></div>
            </div>
            <div className="target-panel">
              <div className="panel-topline"><span>REGISTRATION TARGET</span><span className="live-dot"><i /> LIVE DEMO</span></div>
              <div className="target-number"><strong>{stats.registrations.toString().padStart(3, '0')}</strong><span> / 500</span></div>
              <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
              <div className="target-foot"><span>{progress}% of goal</span><span>{500 - stats.registrations} to go</span></div>
              <div className="target-rule" />
              <div className="target-meta"><span>₹2,000 <small>total budget</small></span><span>7 <small>days live</small></span></div>
            </div>
          </div>
          <div className="section-divider"><span>01</span><span>THE OPPORTUNITY</span><span className="divider-line" /></div>
        </section>

        <section className="section-block audience-block" id="audience">
          <div className="section-heading"><div><div className="eyebrow">WHO WE ARE BUILDING FOR</div><h2>Curious enough to start.<br /><em>Busy enough to need a reason.</em></h2></div><div className="section-index">01 / 04</div></div>
          <div className="audience-grid">
            <article className="persona-panel">
              <div className="persona-top"><span className="persona-icon">F</span><div><h3>The final-year builder</h3><span>ENGINEERING · SEMESTER 7/8</span></div></div>
              <p>Has tried ChatGPT, maybe copied a tutorial, but has no small, finished AI project to show in an interview.</p>
              <div className="persona-details"><div><span>WANTS</span><b>A portfolio proof-point</b></div><div><span>BLOCKED BY</span><b>“I don't know where to begin”</b></div><div><span>DISCOVERS VIA</span><b>Peers, clubs, class groups</b></div></div>
            </article>
            <div className="reasons-panel">
              <div className="reason-row"><span className="reason-num">01</span><div><h3>Why care?</h3><p>AI is on every job description; a working mini-project makes the skill tangible, not just another course certificate.</p></div><ArrowDownRight size={18} /></div>
              <div className="reason-row"><span className="reason-num">02</span><div><h3>Why register now?</h3><p>Free, one hour, beginner-friendly, and leaves them with a project they can explain to a recruiter.</p></div><ArrowDownRight size={18} /></div>
              <div className="reason-row"><span className="reason-num">03</span><div><h3>What earns trust?</h3><p>A 20-second demo of the exact output, a peer/club invite, and clear prerequisites before they commit.</p></div><ArrowDownRight size={18} /></div>
            </div>
          </div>
        </section>

        <section className="section-block campaign-block" id="campaign">
          <div className="section-divider"><span>02</span><span>THE ACQUISITION PLAN</span><span className="divider-line" /></div>
          <div className="section-heading campaign-title"><div><div className="eyebrow">FOUR LANES. ONE CLEAR GOAL.</div><h2>500 registrations,<br /><em>earned through trust.</em></h2></div><div className="section-index">TARGET MODEL</div></div>
          <div className="channel-table">
            <div className="table-head"><span>CHANNEL / ACTION</span><span>REGS</span><span>ASSUMPTION</span><span>WHY IT EARNS A SLOT</span></div>
            {channels.map((item, index) => <div className="channel-row" key={item.channel}>
              <div className="channel-name"><span className={`channel-mark ${item.color}`}>0{index + 1}</span><div><strong>{item.channel}</strong><small>{item.effort}</small></div></div>
              <div className="channel-target">{item.target}<small> registrations</small></div>
              <div className="channel-assumption">{item.conversion}</div>
              <div className="channel-why">{index === 0 ? 'Trusted peer distribution; fast feedback in replies.' : index === 1 ? 'A campus lead gives relevance and a named point of contact.' : index === 2 ? 'The demo makes the promise concrete; spend follows proof.' : 'Faculty/TPO forwards add legitimacy beyond social feeds.'}</div>
            </div>)}
            <div className="table-total"><strong>MODELED TOTAL</strong><strong>500</strong><span>Unique registrations after deduplication</span><span>Planning estimate, not a guarantee</span></div>
          </div>
          <div className="budget-strip">
            <div className="budget-label"><span>SPEND PLAN</span><strong>₹2,000 <small>CAP</small></strong></div>
            <div className="budget-item"><i className="budget-swatch orange" /><div><b>₹1,200</b><span>Best-demo boost</span></div></div>
            <div className="budget-item"><i className="budget-swatch green" /><div><b>₹500</b><span>QR / campus prints</span></div></div>
            <div className="budget-item"><i className="budget-swatch blue" /><div><b>₹300</b><span>Contingency / data</span></div></div>
            <span className="budget-note">No paid signup incentives. Spend only after organic creative earns engagement.</span>
          </div>
          <div className="timeline-heading"><h3>Seven days, one action per day</h3><span>SEQUENCE TO LEARN FAST</span></div>
          <div className="timeline-list">{schedule.map(([day, title, description]) => <div className="timeline-row" key={day}><span className="timeline-day">D{day}</span><strong>{title}</strong><p>{description}</p></div>)}</div>
          <div className="measurement-note"><Gauge size={18} /><p><b>Decision rule:</b> check tagged registrations and cost per registration each evening. If a lane is below half its cumulative target by Day 4, move the remaining boost budget to the strongest demo and ask partners what blocked sharing.</p></div>
        </section>

        <section className="section-block referral-block" id="referrals">
          <div className="section-divider"><span>03</span><span>THE THING I BUILT</span><span className="divider-line" /></div>
          <div className="section-heading"><div><div className="eyebrow">WORKING ASSET · REFERRAL TRACKER</div><h2>Give every campus<br /><em>a trackable invite.</em></h2></div><div className="section-index">FASTAPI + REACT</div></div>
          <div className="referral-grid">
            <div className="signup-panel">
              <div className="signup-header"><div><span className="form-kicker">DEMO RSVP</span><h3>Save a spot</h3></div><span className="free-stamp">FREE</span></div>
              <form onSubmit={submitRegistration}>
                <label htmlFor="first-name">First name</label>
                <input id="first-name" name="first_name" autoComplete="given-name" placeholder="e.g. Aanya" minLength="2" maxLength="32" value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} required />
                <label htmlFor="referral-code">Campus invite</label>
                <select id="referral-code" value={form.referral_code} onChange={(event) => setForm({ ...form, referral_code: event.target.value })}>
                  <option value="BUILD-PESU">PES University · BUILD-PESU</option>
                  <option value="BUILD-VIT">VIT · BUILD-VIT</option>
                  <option value="BUILD-SRM">SRM Institute · BUILD-SRM</option>
                  <option value="BUILD-OTHER">Other community · BUILD-OTHER</option>
                </select>
                <button className="submit-button" type="submit" disabled={busy || apiState !== 'connected'}>{busy ? 'Recording…' : 'Record demo signup'} <Send size={16} /></button>
                <p className={`form-notice ${notice ? 'visible' : ''}`} role="status">{notice || ' '}</p>
              </form>
              <div className="privacy-line">Simulation only. No email or phone number collected.</div>
            </div>
            <div className="leaderboard-panel">
              <div className="leaderboard-header"><div><span className="form-kicker">CAMPUS SIGNAL</span><h3>Referral activity</h3></div><span className="live-label"><i /> LIVE</span></div>
              <div className="leaderboard-list">{stats.leaderboard.map((row, index) => <div className="leader-row" key={row.code}><span className={`rank rank-${index + 1}`}>0{index + 1}</span><span className="leader-campus">{row.campus}<small>{row.code}</small></span><strong>{row.registrations.toString().padStart(2, '0')}</strong></div>)}</div>
              <div className="referral-share"><div><span>YOUR DEMO CODE</span><strong>BUILD-PESU</strong></div><button type="button" className="copy-button" onClick={copyReferral} aria-label="Copy referral code">{copied ? <Check size={16} /> : <Clipboard size={16} />}<span>{copied ? 'Copied' : 'Copy code'}</span></button></div>
              <div className="api-foot"><span className={`status-dot ${apiState}`} />{apiState === 'connected' ? 'Saved to local demo store' : 'Start the FastAPI server to enable signups'}</div>
            </div>
          </div>
          <div className="asset-rationale"><span>WHY THIS ASSET</span><p>It turns “ask your college groups” into a measurable loop: each campus code attributes signups, reveals which partner is moving, and gives the organizer a reason to follow up. The form is intentionally low-friction for a prototype.</p></div>
        </section>

        <section className="section-block learning-block" id="learning">
          <div className="section-divider"><span>04</span><span>HOW I USED AI</span><span className="divider-line" /></div>
          <div className="section-heading"><div><div className="eyebrow">AI + LEARNING NOTES</div><h2>Use the draft.<br /><em>Keep the judgment.</em></h2></div><div className="section-index">3 DECISIONS</div></div>
          <div className="learning-list">{reflections.map((item, index) => <article className="learning-row" key={item.ask}><span className="learning-index">0{index + 1}</span><div className="learning-ask"><span>WHAT I ASKED</span><p>{item.ask}</p></div><div className="learning-suggest"><span>AI SUGGESTED</span><p>{item.suggestion}</p></div><div className="learning-change"><span>WHAT I CHANGED</span><p>{item.change}</p></div></article>)}</div>
          <div className="reflection-grid"><article><span>FIRST IDEA → FINAL</span><p>I started with a generic landing page and broad social push. I changed direction to a referral-led campus sprint because trust and attribution are the real constraints at this budget.</p></article><article><span>ANOTHER 24 HOURS</span><p>Interview 5–8 final-year students, test two demo hooks in real campus groups, and replace modeled conversion assumptions with observed click-to-registration data.</p></article><article><span>AI IDEA I REJECTED</span><p>Mass DMs and a prize for every referral. They could inflate signups, annoy students, and weaken show-up intent. I chose opt-in group sharing and a useful workshop outcome instead.</p></article></div>
        </section>

        <section className="section-block pitch-block" id="pitch">
          <div className="section-divider"><span>05</span><span>THE 3-MINUTE WALKTHROUGH</span><span className="divider-line" /></div>
          <div className="pitch-header"><div><div className="eyebrow">VIDEO NOTES</div><h2>Say it simply.</h2></div><a className="text-link" href="https://forms.gle/xEtJSgJfeqvnxv8q6" target="_blank" rel="noreferrer">Submission form <ExternalLink size={15} /></a></div>
          <div className="script-grid"><div className="script-time"><span>0:00–0:35</span><b>The audience</b></div><p>“I’m targeting final-year engineering students who have heard plenty about AI but still need one small project they can confidently explain. The offer is a concrete build, in one hour, for free.”</p></div>
          <div className="script-grid"><div className="script-time"><span>0:35–1:25</span><b>The growth math</b></div><p>“I use four channels that already have student trust: WhatsApp groups, campus clubs, short demo content, and faculty or placement forwards. The targets add to 500, but I’ll treat them as hypotheses and check attribution daily.”</p></div>
          <div className="script-grid"><div className="script-time"><span>1:25–2:20</span><b>The working asset</b></div><p>“I built a referral demo with a React interface and a Python API. Campus codes show where registrations came from. It stores only a first name and referral code because this is a simulation, not a live lead-generation campaign.”</p></div>
          <div className="script-grid"><div className="script-time"><span>2:20–3:00</span><b>The learning</b></div><p>“AI gave me fast drafts, but I rejected broad mass outreach and prize-led referrals. I’d rather test a specific build outcome with real students, learn which message converts, and improve from evidence.”</p></div>
          <footer className="page-footer"><span>BUILD/60 · GROWTH CHALLENGE</span><span>PLAN · TEST · LEARN</span></footer>
        </section>
      </main>
    </div>
  );
}

export default App;