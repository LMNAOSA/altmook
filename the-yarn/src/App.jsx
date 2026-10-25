import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import {
  ArrowRight, ArrowLeft, AudioLines, Check, ChevronDown, Download,
  Headphones, LockKeyhole, Mic2, Pause, Play, RotateCcw, SkipForward,
  Square, Volume2, VolumeX, X, Pencil, CircleHelp, ShieldCheck
} from 'lucide-react';

const PEOPLE = [
  { id: 'mat', name: 'Mat', mark: 'M', description: 'Just Mat' },
  { id: 'cozza', name: 'Cozza', mark: 'C', description: 'Just Cozza' },
  { id: 'both', name: 'Both', mark: 'M+C', description: 'Could get interesting' }
];
const form = new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });

async function api(path, options = {}) {
  const res = await fetch('/api/' + path, { credentials: 'same-origin', cache: 'no-store', ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.error || 'Something went wrong. Give it another go.');
    error.status = res.status;
    throw error;
  }
  return res;
}

function makeHistory(entries) {
  return entries.flatMap(entry => [
    { role: 'assistant', content: entry.question },
    { role: 'user', content: (entry.speaker === 'Unattributed' ? '[Both speakers; attribution unverified] ' : '[' + entry.speaker + '] ') + entry.answer }
  ]);
}

function toMarkdown(mode, entries, started) {
  const lines = [
    '# THE YARN — Interview Transcript',
    '',
    '**Interviewees:** ' + PEOPLE.find(person => person.id === mode)?.name,
    '**Started:** ' + new Date(started).toLocaleString('en-AU'),
    '**Note:** Original audio recordings are included separately. Answer text may have been corrected after automatic transcription. Speaker labels for joint interviews require human verification.',
    ''
  ];
  entries.forEach((entry, i) => {
    lines.push('## ' + (i + 1) + '. Interview exchange', '');
    lines.push('**Question (' + entry.time + '):** ' + entry.question, '');
    lines.push('**Answer — ' + entry.speaker + ':**', '', entry.answer || '[No transcript]', '');
    if (entry.rawTranscript && entry.rawTranscript !== entry.answer) {
      lines.push('**Original automated transcript:**', '', entry.rawTranscript, '');
    }
    if (entry.audio) lines.push('*Original audio: audio/answer-' + String(i + 1).padStart(2, '0') + '.' + entry.ext + '*', '');
  });
  return lines.join('\n');
}

function displayTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}

function mimeChoice() {
  for (const mime of ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']) {
    if (window.MediaRecorder?.isTypeSupported(mime)) return mime;
  }
  return '';
}

export default function App() {
  const [auth, setAuth] = useState('checking');
  const [setupMissing, setSetupMissing] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [mode, setMode] = useState('both');
  const [answerBy, setAnswerBy] = useState('Unattributed');
  const [phase, setPhase] = useState('intro');
  const [stage, setStage] = useState('ready');
  const [question, setQuestion] = useState('');
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState('');
  const [rawTranscript, setRawTranscript] = useState('');
  const [pendingAudio, setPendingAudio] = useState(null);
  const [reviewAudioUrl, setReviewAudioUrl] = useState('');
  const [pendingDuration, setPendingDuration] = useState(0);
  const [writeInstead, setWriteInstead] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [audioBusy, setAudioBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [voiceHint, setVoiceHint] = useState('');
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [exporting, setExporting] = useState(false);

  const entriesRef = useRef([]);
  const recorderRef = useRef(null);
  const micStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const tickRef = useRef(null);
  const startedTickRef = useRef(0);
  const accumulatedRef = useRef(0);
  const playerRef = useRef(null);
  const audioUrlRef = useRef('');
  const speechVersionRef = useRef(0);

  useEffect(() => {
    api('session').then(res => res.json()).then(data => {
      setSetupMissing(!data.configured);
      setAuth(data.authenticated ? 'signed-in' : 'locked');
    }).catch(() => setAuth('locked'));
    return () => stopPlayer();
  }, []);

  useEffect(() => {
    if (!pendingAudio) { setReviewAudioUrl(''); return; }
    const url = URL.createObjectURL(pendingAudio);
    setReviewAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingAudio]);

  useEffect(() => {
    const handler = event => {
      if (stage === 'recording' || entries.length > 0 || pendingAudio) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [stage, entries.length, pendingAudio]);

  function stopPlayer() {
    speechVersionRef.current += 1;
    if (playerRef.current) { playerRef.current.pause(); playerRef.current = null; }
    if (audioUrlRef.current) { URL.revokeObjectURL(audioUrlRef.current); audioUrlRef.current = ''; }
    setPlaying(false);
  }

  async function unlock(event) {
    event.preventDefault();
    setError('');
    setUnlockBusy(true);
    try {
      await api('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: passcode }) });
      setPasscode('');
      setAuth('signed-in');
    } catch (err) { setError(err.message); }
    finally { setUnlockBusy(false); }
  }

  async function logout() {
    stopPlayer();
    await api('logout', { method: 'POST' }).catch(() => {});
    setAuth('locked');
  }

  async function speak(text) {
    if (!voiceEnabled || !text) return;
    stopPlayer();
    const version = ++speechVersionRef.current;
    setAudioBusy(true);
    setVoiceHint('');
    try {
      const res = await api('speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
      const blob = await res.blob();
      if (version !== speechVersionRef.current) return;
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      playerRef.current = audio;
      audio.addEventListener('ended', () => setPlaying(false), { once: true });
      await audio.play();
      setPlaying(true);
    } catch (err) {
      if (version === speechVersionRef.current) setVoiceHint(err.status === 401 ? 'Session expired. Sign in again.' : 'Audio didn’t play automatically. You can still read the question or tap Listen.');
    } finally {
      if (version === speechVersionRef.current) setAudioBusy(false);
    }
  }

  async function replay() {
    if (!voiceEnabled || !question) return;
    if (playerRef.current) {
      try { playerRef.current.currentTime = 0; await playerRef.current.play(); setPlaying(true); setVoiceHint(''); }
      catch { setVoiceHint('Playback was blocked. Tap Listen again.'); }
    } else await speak(question);
  }

  async function nextQuestion(history = [], skip = false) {
    setStage('thinking');
    setError('');
    setVoiceHint('');
    try {
      const res = await api('question', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, history, skip })
      });
      const data = await res.json();
      setQuestion(data.question);
      setStage('ready');
      if (voiceEnabled) void speak(data.question);
    } catch (err) {
      if (err.status === 401) setAuth('locked');
      setStage('ready');
      setError(err.message);
    }
  }

  async function begin() {
    stopPlayer();
    entriesRef.current = [];
    setEntries([]);
    setQuestion('');
    setStartedAt(new Date().toISOString());
    setPhase('active');
    setPendingAudio(null);
    setWriteInstead(false);
    setAnswerBy(mode === 'mat' ? 'Mat' : mode === 'cozza' ? 'Cozza' : 'Unattributed');
    await nextQuestion([]);
  }

  async function skip() {
    if (stage !== 'ready' || !question) return;
    stopPlayer();
    await nextQuestion([...makeHistory(entriesRef.current), { role: 'assistant', content: question }], true);
  }

  function clearRecordingTimer() {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }

  function timerSnapshot() {
    return accumulatedRef.current + (startedTickRef.current ? performance.now() - startedTickRef.current : 0);
  }

  async function startRecording() {
    if (!question || stage !== 'ready') return;
    setError('');
    stopPlayer();
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setWriteInstead(true);
      setError('This browser does not support recording here. You can type your answer instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mimeType = mimeChoice();
      const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 32000 });
      chunksRef.current = [];
      recorderRef.current = recorder;
      micStreamRef.current = stream;
      accumulatedRef.current = 0;
      startedTickRef.current = performance.now();
      setElapsed(0);
      recorder.addEventListener('dataavailable', event => { if (event.data.size) chunksRef.current.push(event.data); });
      recorder.addEventListener('stop', () => {
        clearRecordingTimer();
        micStreamRef.current?.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
        startedTickRef.current = 0;
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setPendingAudio(blob);
        setPendingDuration(accumulatedRef.current);
        setDraft('');
        setRawTranscript('');
        void transcribe(blob);
      }, { once: true });
      recorder.start(1000);
      setStage('recording');
      tickRef.current = setInterval(() => setElapsed(timerSnapshot()), 250);
    } catch {
      setError('Microphone permission was denied or unavailable. Check browser permissions, or type your answer.');
      setWriteInstead(true);
    }
  }

  function pauseRecording() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    if (recorder.state === 'recording') {
      accumulatedRef.current = timerSnapshot();
      startedTickRef.current = 0;
      recorder.pause();
      setElapsed(accumulatedRef.current);
    } else if (recorder.state === 'paused') {
      startedTickRef.current = performance.now();
      recorder.resume();
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      accumulatedRef.current = timerSnapshot();
      startedTickRef.current = 0;
      clearRecordingTimer();
      setStage('transcribing');
      recorder.stop();
    }
  }

  async function transcribe(blob) {
    setError('');
    if (blob.size > 4_000_000) {
      setStage('review');
      setError('This answer is too large for automatic transcription. The original audio is still kept for your ZIP export. Type a short summary below to continue.');
      return;
    }
    try {
      const form = new FormData();
      form.append('audio', blob, blob.type.includes('mp4') ? 'answer.m4a' : blob.type.includes('ogg') ? 'answer.ogg' : 'answer.webm');
      const res = await api('transcribe', { method: 'POST', body: form });
      const data = await res.json();
      setRawTranscript(data.text || '');
      setDraft(data.text || '');
      setStage('review');
      if (!data.text) setError('No speech was detected. You can replay the answer and type what was said.');
    } catch (err) {
      if (err.status === 401) setAuth('locked');
      setStage('review');
      setError(err.message + ' Your audio recording is safe in this open tab.');
    }
  }

  async function acceptAnswer() {
    const answer = draft.trim();
    if (!answer || !question || (stage !== 'review' && stage !== 'ready')) {
      setError('Add an answer before continuing.');
      return;
    }
    stopPlayer();
    const source = pendingAudio ? 'recorded' : 'typed';
    const ext = pendingAudio?.type.includes('mp4') ? 'm4a' : pendingAudio?.type.includes('ogg') ? 'ogg' : 'webm';
    const entry = {
      question, speaker: mode === 'mat' ? 'Mat' : mode === 'cozza' ? 'Cozza' : answerBy,
      answer, rawTranscript, audio: pendingAudio, ext, source,
      durationMs: pendingDuration, time: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...entriesRef.current, entry];
    entriesRef.current = updated;
    setEntries(updated);
    setPendingAudio(null);
    setPendingDuration(0);
    setDraft('');
    setRawTranscript('');
    setWriteInstead(false);
    await nextQuestion(makeHistory(updated));
  }

  function finish() {
    if (stage === 'recording' || stage === 'transcribing') return;
    stopPlayer();
    setPhase('done');
    setError('');
  }

  async function exportSession() {
    if (!startedAt) return;
    setExporting(true);
    setError('');
    try {
      const zip = new JSZip();
      zip.file('interview-transcript.md', toMarkdown(mode, entriesRef.current, startedAt));
      const metadata = entriesRef.current.map(({ audio, ...rest }) => ({ ...rest, hasAudio: Boolean(audio) }));
      zip.file('interview-data.json', JSON.stringify({ title: 'The Yarn', mode, startedAt, exportedAt: new Date().toISOString(), entries: metadata }, null, 2));
      for (let i = 0; i < entriesRef.current.length; i++) {
        const entry = entriesRef.current[i];
        if (entry.audio) zip.file('audio/answer-' + String(i + 1).padStart(2, '0') + '.' + entry.ext, entry.audio);
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 3 } });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'the-yarn-' + mode + '-' + new Date(startedAt).toISOString().slice(0, 10) + '.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch {
      setError('Export could not be created in this browser. Keep this tab open and try again.');
    } finally { setExporting(false); }
  }

  function restart() {
    stopPlayer();
    setPhase('intro');
    setQuestion('');
    setStage('ready');
    setEntries([]);
    entriesRef.current = [];
    setStartedAt(null);
    setPendingAudio(null);
    setError('');
  }

  const isPaused = recorderRef.current?.state === 'paused';
  const progressLabel = stage === 'thinking' ? 'Finding the right question...' :
    stage === 'transcribing' ? 'Listening back...' :
    stage === 'recording' ? (isPaused ? 'Recording paused' : 'Recording your answer') :
    stage === 'review' ? 'Have we got that right?' : 'Over to you';
  const count = entries.length;

  if (auth === 'checking') return <main className="loading-screen"><span className="brand-small">MOOKA BOYS PRESENTS</span><h1>THE YARN.</h1><div className="loading-dot" aria-label="Checking session" /></main>;

  return <div className="app-shell">
    <aside className="brand-panel">
      <div className="brand-top"><div className="brand-kicker">MOOKA BOYS <span>✳</span></div><span className="brand-edition">INTERVIEW STUDIO / EST. 2026</span></div>
      <div className="brand-title-wrap">
        <div className="brand-spark" aria-hidden="true">✳</div>
        <p className="brand-eyebrow">GOOD STORIES. NO BULL.</p>
        <h1 className="brand-title">THE<br/><em>YARN.</em></h1>
        <p className="brand-tagline">Less interview.<br/>More having a yarn.</p>
      </div>
      <div className="brand-bottom"><span>ANDAMOOKA, SOUTH AUSTRALIA</span><span className="small-sun" aria-hidden="true">✺</span></div>
    </aside>
    <main className="workspace">
      <header className="workspace-header">
        <div className="workspace-label"><span className="tiny-dot" /> THE YARN <span className="mobile-secondary">/ PRIVATE STUDIO</span></div>
        {auth === 'signed-in'
          ? <div className="header-actions">
              {phase !== 'intro' && startedAt && <button className="top-link" onClick={exportSession} disabled={exporting || stage === 'recording'} title="Download interview ZIP"><Download size={15}/><span>Export</span></button>}
              <button className="top-link" onClick={logout} title="Sign out"><LockKeyhole size={15}/><span>Lock</span></button>
            </div>
          : <div className="workspace-label subtle">INVITE ONLY</div>}
      </header>

      {auth === 'locked' ? <section className="content-col intro-screen">
        <div className="section-tag">THE DOOR'S LOCKED, AS IT SHOULD BE</div>
        <h2>Come on in.</h2>
        <p className="lead">This is a private room for proper conversations with Mat and Cozza. Pop in the access code and we'll get started.</p>
        <form className="unlock-form" onSubmit={unlock}>
          <label htmlFor="passcode">Access code</label>
          <input id="passcode" type="password" autoComplete="current-password" value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Enter the studio code" minLength={1} required/>
          <button className="primary-btn" type="submit" disabled={!passcode || unlockBusy}><span>{unlockBusy ? 'Opening...' : 'Let me in'}</span><ArrowRight size={19}/></button>
        </form>
        {setupMissing && <div className="note warning"><CircleHelp size={16}/> First deploy? Add APP_ACCESS_CODE and SESSION_SECRET in Vercel's Environment Variables.</div>}
        {error && <div className="note error" role="alert">{error}</div>}
        <div className="privacy-strip"><ShieldCheck size={17}/> AI-generated interviewer. Real people and real recordings. Nothing is automatically published.</div>
      </section> : phase === 'intro' ? <section className="content-col intro-screen">
        <div className="section-tag">FIRST THINGS FIRST</div>
        <h2>Who's up<br/>for a yarn?</h2>
        <p className="lead">A few questions. A few stories. Probably a bit of mucking around. No scripts, no right answers.</p>
        <div className="people-grid" role="group" aria-label="Choose interviewees">
          {PEOPLE.map(person => <button type="button" className={'person-card ' + (mode === person.id ? 'selected' : '')} onClick={() => setMode(person.id)} aria-pressed={mode === person.id} key={person.id}>
            <span className="person-mark">{person.mark}</span>
            <span className="person-name">{person.name}</span>
            <span className="person-description">{person.description}</span>
            {mode === person.id && <Check className="person-check" size={17}/>}
          </button>)}
        </div>
        <div className="interview-options">
          <div><Volume2 size={19}/><div><strong>Questions in Lee's voice</strong><span>AI-powered, spoken with an authorised ElevenLabs voice clone.</span></div></div>
          <label className="switch" aria-label="Enable spoken interviewer">
            <input type="checkbox" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)}/>
            <span className="switch-track" />
          </label>
        </div>
        <button className="primary-btn big-start" onClick={begin}><span>Start the yarn</span><ArrowRight size={21}/></button>
        <p className="under-note">Make sure everyone knows their answers are being recorded and sent to the transcription service. AI questions use a familiar cloned voice; Lee isn't speaking live.</p>
        {error && <div className="note error" role="alert">{error}</div>}
      </section> : phase === 'active' ? <section className="content-col interview-screen">
        <div className="session-head">
          <div className="section-tag"><span className="online-dot"/> {mode === 'mat' ? 'WITH MAT' : mode === 'cozza' ? 'WITH COZZA' : 'WITH THE BOYS'}</div>
          <div className="session-count">{count === 0 ? 'JUST GETTING STARTED' : count + (count === 1 ? ' STORY CAPTURED' : ' STORIES CAPTURED')}</div>
        </div>
        <div className="question-area" aria-live="polite">
          <div className="question-label"><span className="line-dash"/> CURRENT QUESTION</div>
          {stage === 'thinking' && !question
            ? <h2 className="question waiting">Getting a good one...</h2>
            : <h2 className="question">{question || 'Something good is coming...'}</h2>}
          <div className="question-actions">
            <button className="text-btn" onClick={replay} disabled={!voiceEnabled || !question || audioBusy || stage === 'recording' || stage === 'transcribing'}><Volume2 size={17}/>{audioBusy ? 'Finding your voice...' : playing ? 'Play again' : 'Listen to question'}</button>
            <button className="text-btn" onClick={skip} disabled={stage !== 'ready' || !question}><SkipForward size={16}/> Different question</button>
          </div>
          {voiceHint && <p className="voice-hint" role="status">{voiceHint}</p>}
        </div>
        <div className="response-area">
          <div className="response-top"><span className="section-tag">YOUR TURN</span><span className={'status ' + (stage === 'recording' ? 'hot' : '')}>{stage === 'recording' && <span className="record-dot"/>}{progressLabel}</span></div>

          {stage === 'ready' && !writeInstead && <div className="record-start">
            <button className="record-button" onClick={startRecording} disabled={!question}><Mic2 size={27} strokeWidth={1.8}/><span className="sr-only">Record your answer</span></button>
            <div><strong>Tell us the whole story.</strong><span>Tap to record. No interruptions, no rush.</span></div>
          </div>}

          {stage === 'recording' && <div className="record-active">
            <div className="waveform" aria-hidden="true">{Array.from({length: 20}, (_,i) => <i key={i} style={{animationDelay: ((i * 73) % 900) + 'ms'}}/>)}</div>
            <div className="record-time">{displayTime(elapsed)} <span>REC</span></div>
            <div className="record-controls">
              <button className="outline-btn" onClick={pauseRecording}>{isPaused ? <Play size={17}/> : <Pause size={17}/>} {isPaused ? 'Resume' : 'Pause'}</button>
              <button className="primary-btn" onClick={stopRecording}><Square size={15} fill="currentColor"/> Finished talking</button>
            </div>
          </div>}

          {(stage === 'transcribing' || stage === 'thinking') && <div className="processing"><AudioLines size={29}/><span>{stage === 'thinking' ? 'Listening for the next good thread...' : 'Turning that yarn into words...'}</span><span className="processing-dots">•••</span></div>}

          {(stage === 'review' || (stage === 'ready' && writeInstead)) && <div className="review">
            {stage === 'review' && pendingAudio && reviewAudioUrl && <>
              <div className="review-label"><Headphones size={17}/> Original recording — {displayTime(pendingDuration)}</div>
              <audio controls preload="metadata" src={reviewAudioUrl} className="review-player">Your browser does not support playback.</audio>
            </>}
            {mode === 'both' && <div className="speaker-row">
              <label htmlFor="speaker">Who's speaking?</label>
              <select id="speaker" value={answerBy} onChange={e => setAnswerBy(e.target.value)}>
                <option value="Unattributed">Both / not sure</option><option value="Mat">Mat</option><option value="Cozza">Cozza</option>
              </select>
            </div>}
            <label className="review-label" htmlFor="draft"><Pencil size={16}/> {pendingAudio ? 'Check the transcript' : 'Type your answer'}</label>
            <textarea id="draft" rows="5" value={draft} onChange={e => setDraft(e.target.value)} placeholder="What happened? Go on, tell us..." />
            <p className="fine-print">{pendingAudio ? 'Correct names or any misheard bits. Your original recording stays untouched.' : 'You can tell it however you like. The AI will follow up.'}</p>
            <div className="review-actions">
              <button className="primary-btn" onClick={acceptAnswer} disabled={!draft.trim()}><span>That's right — carry on</span><ArrowRight size={18}/></button>
              {!pendingAudio && <button className="text-btn" onClick={() => setWriteInstead(false)}><ArrowLeft size={16}/> Back</button>}
            </div>
          </div>}

          {stage === 'ready' && !writeInstead && <div className="response-footer"><button className="text-btn" onClick={() => { stopPlayer(); setWriteInstead(true); setDraft(''); }}><Pencil size={15}/> Prefer to type?</button><span>Audio is kept in this tab until exported.</span></div>}
        </div>
        {error && <div className="note error" role="alert">{error}</div>}
        <div className="session-footer">
          <button className="text-btn" onClick={finish} disabled={stage === 'recording' || stage === 'transcribing'}><Square size={13}/> Finish this session</button>
          {count > 0 && <button className="text-btn" onClick={exportSession} disabled={exporting || stage === 'recording'}><Download size={16}/>{exporting ? 'Packaging...' : 'Save what we have'}</button>}
        </div>
      </section> : <section className="content-col done-screen">
        <div className="finish-stamp"><Check size={30}/></div>
        <div className="section-tag">THAT'S A WRAP</div>
        <h2>Good yarn.</h2>
        <p className="lead">We've got {count} {count === 1 ? 'story' : 'stories'} worth keeping. Grab the recording and transcript, then you can pull them apart with Gemini, Claude or ChatGPT whenever you like.</p>
        <div className="export-card"><div><strong>{mode === 'both' ? 'Mat & Cozza' : mode === 'mat' ? 'Mat' : 'Cozza'} — {startedAt ? form.format(new Date(startedAt)) : ''}</strong><span>{count} questions answered · transcript and original audio</span></div><Download size={22}/></div>
        <button className="primary-btn big-start" onClick={exportSession} disabled={exporting}><span>{exporting ? 'Packing it up...' : 'Download interview ZIP'}</span><Download size={19}/></button>
        <button className="text-btn restart-btn" onClick={restart}><RotateCcw size={16}/> Start another yarn</button>
        {error && <div className="note error" role="alert">{error}</div>}
        <div className="privacy-strip"><ShieldCheck size={17}/> Download before closing this tab. We don't keep interview audio in a database.</div>
      </section>}
      <footer className="workspace-footer"><span>MADE FOR THE MOOKA BOYS.</span><span>NO QUESTIONNAIRES. NO NONSENSE. <span aria-hidden="true">✳</span></span></footer>
    </main>
  </div>;
}
