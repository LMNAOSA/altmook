# THE YARN
**An AI interviewer for the Mooka Boys.** Good stories, no questionnaires.

The interviewer asks one question at a time, speaks in Lee's authorised ElevenLabs cloned voice, records Mat and/or Cozza, transcribes each answer, asks context-aware follow-ups, and exports the session as a ZIP with audio, an editable transcript and JSON. There is no personality analysis, account system, or database.

## Status
This is a first functional implementation. API responses and the deployment have not yet been live-tested against your accounts. See the smoke-test checklist below.

## Stack
- React 18 + Vite — interface
- Vercel Functions under api/ — private server-side API proxy and password gate
- OpenAI Responses API — interviewer; default model gpt-6.1-sol
- OpenAI transcription — default gpt-4o-transcribe
- ElevenLabs Text to Speech — multilingual_v2 with existing Voice ID
- JSZip — downloads all recordings and interview materials locally

## Safety and privacy
- The interviewees must consent to audio recording and AI processing.
- The ElevenLabs voice is synthetic, based on Lee's authorised clone; it is not Lee speaking live.
- Real API keys belong only in server-side environment variables.
- Add a long private APP_ACCESS_CODE and a random SESSION_SECRET.
- API routes use a signed HttpOnly session cookie, valid for up to 12 hours.
- Audio and interview records are kept in memory in the open browser tab until exported. This is intentional: no server storage, no automatic permanent retention. Closing or refreshing the tab will lose that session.
- Audio is sent to OpenAI for transcription; interviewer text is sent to OpenAI; question text is sent to ElevenLabs for speech synthesis. Check those providers' current data controls.
- A transcript can be corrected manually without changing the original audio.
- Speaker identification for a joint Mat+Cozza answer is manual; the app does not claim automatic diarisation.

## Environment variables
Set these in Vercel > Project > Settings > Environment Variables and apply to the environment used for testing/deployment:

| Name | Required | Value |
| --- | --- | --- |
| OPENAI_API_KEY | Yes | Real OpenAI API key |
| ELEVENLABS_API_KEY | Yes for voice | Real ElevenLabs key, Text to Speech access |
| ELEVENLABS_VOICE_ID | Yes for voice | UlA7wZyMM2C1YQuvzO1M |
| APP_ACCESS_CODE | Yes | Choose a unique passphrase 12+ characters |
| SESSION_SECRET | Yes | Cryptographically random 24+ characters |
| OPENAI_INTERVIEW_MODEL | Optional | gpt-6.1-sol |
| OPENAI_TRANSCRIBE_MODEL | Optional | gpt-4o-transcribe |
| ELEVENLABS_MODEL_ID | Optional | eleven_multilingual_v2 |

Don't paste credentials into source files or commit a real .env. If the cloned ElevenLabs voice is unavailable to your key, speech will fail, but text interviews can still continue.

## Local development
Install Node.js 20 or newer, Vercel CLI, and dependencies:

    npm install
    npx vercel login
    npx vercel link
    npx vercel env pull .env.local
    npx vercel dev

Use the local address printed by Vercel. Run vercel dev, not plain vite, when testing the /api routes.

If developing without a linked Vercel project, make a local .env.local from .env.example and fill all values. Vercel CLI can access those while running locally.

## Deploying as a separate Vercel project
These files currently live under the isolated branch **feature/the-yarn-standalone** in the Mooka Boys repository **LMNAOSA/altmook**, within the subfolder **the-yarn/**. The live/default **main** branch was not modified.

1. In Vercel, choose Add New > Project, connect LMNAOSA/altmook to a new project (not the existing website deployment).
2. Set Root Directory to the-yarn.
3. Select Vite as the framework, npm run build as Build Command and dist as Output Directory (normally detected).
4. Select/deploy the feature/the-yarn-standalone branch as a Preview deployment. To use a production URL, promote the verified preview or choose that branch as the production branch according to Vercel project's Git settings.
5. Add the environment variables above to the Preview environment (and Production when used), then redeploy.
6. For a completely independent repo, move the contents of the-yarn/ into a dedicated repository and connect that instead.

### Why it is in a branch
The execution environment could not produce a local ZIP archive. Rather than altering the live website, the application was delivered in a separate GitHub branch. It can be extracted into a dedicated repository at any time.

## Quick test before giving it to the boys
- [ ] Open the URL; confirm password is required.
- [ ] Sign in; select Mat, Cozza or Both.
- [ ] Start a session; one relevant question appears.
- [ ] With voice on, question plays through ElevenLabs; if autoplay is blocked, tap Listen.
- [ ] Allow microphone; record a 20-second answer. Pause/resume and stop work.
- [ ] Check the transcription and correct an intentionally misheard name.
- [ ] Confirm the next question actually responds to the preceding story.
- [ ] Choose Different question; it should not repeat the skipped one.
- [ ] Check Prefer to type and submit one typed response.
- [ ] Finish and download a ZIP containing Markdown, JSON and original audio.
- [ ] Test on iPhone Safari and desktop Chrome before use.
- [ ] Make sure no secrets are visible in source or DevTools.

## Limits and decisions
- The Vercel request-body ceiling is about 4.5 MB. The app requests compressed audio at 32kb/s to keep individual answers under ~4 MB, but browsers can ignore that rate. Oversized recordings remain available for export; enter a short typed summary to continue the AI interview.
- Audio can still be lost if the tab crashes or closes before exporting. Use Save what we have during a session. For particularly important interviews, record a backup independently.
- For a joint interview, speaker attribution is best checked manually after exporting.
- Internet access, browser microphone permission, and HTTPS are required. Localhost is also supported.
- Model names and prices can change. If a model becomes unavailable, set its override environment variable to another supported model and redeploy.
- The app deliberately uses turn-taking, not realtime interruption handling. This makes long stories easier to record without AI talking over the brothers.
- Questions and transcripts are sent to external providers.

## Interviewer prompt
The authoritative interviewer prompt is in server/interviewer.js. To change its tone, questions or research objectives, edit that file; Mat and Cozza never need to see it.

## Troubleshooting
- App access is not configured: Add APP_ACCESS_CODE and SESSION_SECRET to the correct Vercel environment; redeploy.
- Wrong access code: Check that the code matches the server env variable exactly.
- No voice: Check ELEVENLABS_API_KEY, Text-to-Speech permission, Voice ID and credit balance. Text-only mode can still work.
- Model not found: Confirm OPENAI_INTERVIEW_MODEL and OPENAI_TRANSCRIBE_MODEL are available to your API project.
- Microphone unavailable: Use HTTPS, allow microphone permissions and try Chrome or Safari.
- Transcription too large: Your original answer is available in the ZIP. Type a short summary to keep going, or use shorter answers.
- Preview deploy doesn't have API keys: Add them to the Preview environment, not just Production.
- Next question failed: A Retry button appears; your already saved answers are preserved in the tab.
