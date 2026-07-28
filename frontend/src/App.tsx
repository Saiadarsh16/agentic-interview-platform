import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FileUpload,
  FormField,
  Input,
  Progress,
  Select,
  Spinner,
  Textarea,
} from './components/ui'

const navItems = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Interview modes', href: '/#modes' },
  { label: 'Why it works', href: '/#why-it-works' },
]

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label="Agentic Interview Platform home"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-orange-700 text-sm font-bold text-white shadow-sm">
        AI
      </span>
      <span className="font-serif text-xl font-semibold tracking-tight text-stone-950">
        Agentic Interview
      </span>
    </Link>
  )
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fbfaf6]/90 backdrop-blur-xl">
      <div className="page-shell flex min-h-18 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <NavLink className="text-sm font-semibold text-stone-700" to="/dashboard">
            Sign in
          </NavLink>
          <Link className="button-link button-link-primary" to="/interviews/new">
            Start practising
          </Link>
        </div>
        <button
          className="grid size-10 place-items-center rounded-lg border border-stone-300 bg-white text-xl text-stone-800 md:hidden"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '×' : '≡'}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="page-shell border-t border-stone-200 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="grid gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <NavLink
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-white"
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </NavLink>
            <Link
              className="button-link button-link-primary mt-2"
              to="/interviews/new"
              onClick={() => setMenuOpen(false)}
            >
              Start practising
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-stone-900">
      <SiteHeader />
      <Outlet />
    </div>
  )
}

function InterviewPreview() {
  return (
    <div className="relative mx-auto max-w-xl">
      <div className="absolute -left-12 top-16 hidden h-28 w-28 rounded-full bg-orange-200/60 blur-2xl sm:block" />
      <div className="absolute -right-10 bottom-4 h-32 w-32 rounded-full bg-emerald-200/50 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white p-3 shadow-[0_30px_80px_-35px_rgba(63,48,35,0.35)]">
        <div className="rounded-[1.35rem] bg-stone-950 p-5 text-white">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-orange-200 font-serif font-bold text-orange-950">
                AI
              </span>
              <div>
                <p className="text-sm font-semibold">Technical interview</p>
                <p className="text-xs text-stone-400">Senior GenAI Engineer</p>
              </div>
            </div>
            <Badge className="bg-emerald-400/10 text-emerald-300 ring-emerald-400/20">
              Live
            </Badge>
          </div>
          <div className="py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              Question 04
            </p>
            <p className="mt-3 font-serif text-2xl leading-snug">
              How would you evaluate a RAG system before releasing it to
              production?
            </p>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs text-stone-400">
              <span className="size-2 rounded-full bg-orange-400" />
              Your response
            </div>
            <p className="text-sm leading-6 text-stone-300">
              I would separate retrieval quality from generation quality and
              evaluate both offline and in production...
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-stone-500">02:14</span>
              <span className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold">
                Submit answer
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-xl sm:-left-10">
        <p className="text-xs font-medium text-stone-500">Answer strength</p>
        <p className="mt-1 font-serif text-2xl font-semibold text-stone-950">
          86<span className="text-sm text-stone-400">/100</span>
        </p>
      </div>
    </div>
  )
}

function LandingPage() {
  return (
    <>
      <main>
        <section className="relative overflow-hidden border-b border-stone-200">
          <div className="paper-grid absolute inset-0 opacity-50" />
          <div className="page-shell relative grid items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div>
              <Badge variant="accent">Personalised AI interview practice</Badge>
              <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-stone-950 sm:text-6xl lg:text-7xl">
                Practise the interview that’s actually waiting for you.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
                The platform studies your resume and target role, then runs an adaptive
                mock interview that challenges your thinking and turns every
                answer into a clear improvement plan.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="button-link button-link-primary" to="/interviews/new">
                  Start a mock interview <span aria-hidden="true">→</span>
                </Link>
                <a className="button-link button-link-secondary" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-stone-600">
                <span>✓ No generic question bank</span>
                <span>✓ Evidence-based feedback</span>
                <span>✓ Text, voice & coding</span>
              </div>
            </div>
            <InterviewPreview />
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="page-shell grid divide-y divide-stone-200 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ['Role-aware', 'Questions grounded in your exact job description'],
              ['Adaptive', 'Follow-ups change based on the depth of your answer'],
              ['Actionable', 'Every score links to specific evidence and coaching'],
            ].map(([title, copy]) => (
              <div key={title} className="py-5 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <p className="font-serif text-xl font-semibold text-stone-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-24">
          <div className="page-shell">
            <div className="max-w-2xl">
              <p className="eyebrow">How it works</p>
              <h2 className="section-title">From job description to interview-ready.</h2>
              <p className="section-copy">
                Three focused steps turn your real experience and target role
                into practice that feels relevant from the first question.
              </p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Add your context',
                  copy: 'Upload your resume and job description, then choose the round, duration and areas you want to sharpen.',
                },
                {
                  number: '02',
                  title: 'Interview adaptively',
                  copy: 'Answer realistic questions while the interviewer adjusts difficulty, probes gaps and follows your reasoning.',
                },
                {
                  number: '03',
                  title: 'Improve with evidence',
                  copy: 'See exactly what worked, what was missing and how to give a stronger answer in the next round.',
                },
              ].map((step) => (
                <article
                  key={step.number}
                  className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm"
                >
                  <span className="font-serif text-sm font-semibold text-orange-700">
                    {step.number}
                  </span>
                  <h3 className="mt-10 font-serif text-2xl font-semibold text-stone-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="modes" className="scroll-mt-24 bg-stone-950 py-24 text-white">
          <div className="page-shell">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="eyebrow text-orange-300">Interview modes</p>
                <h2 className="section-title text-white">
                  One coach for every kind of round.
                </h2>
                <p className="section-copy text-stone-400">
                  Start with text, then practise the delivery and problem-solving
                  format your interview demands.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Text interview', 'Think clearly, answer at your pace and inspect the full transcript.', 'Available now'],
                  ['Voice interview', 'Practise presence, pacing and spoken communication in real time.', 'Coming next'],
                  ['Coding round', 'Solve Python and SQL tasks with execution-based evaluation.', 'Planned'],
                  ['System design', 'Work through architecture decisions, trade-offs and follow-up pressure.', 'Planned'],
                ].map(([title, copy, status]) => (
                  <article
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-xl font-semibold">{title}</h3>
                      <span className="whitespace-nowrap rounded-full bg-white/8 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-stone-300">
                        {status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-stone-400">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="why-it-works" className="scroll-mt-24 py-24">
          <div className="page-shell grid items-center gap-14 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-[#efe8dd] p-6 sm:p-10">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-950">Readiness report</p>
                    <p className="text-xs text-stone-500">Senior GenAI Engineer</p>
                  </div>
                  <span className="font-serif text-3xl font-semibold text-orange-700">82</span>
                </div>
                <div className="mt-6 space-y-5">
                  {[
                    ['Technical depth', 88],
                    ['Communication', 79],
                    ['JD coverage', 84],
                    ['Answer structure', 76],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-medium text-stone-700">{label}</span>
                        <span className="text-stone-500">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-orange-700"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-7 rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    Strongest signal
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-950">
                    You explain production RAG trade-offs with clear examples
                    and measurable outcomes.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow">Why it works</p>
              <h2 className="section-title">Feedback you can defend—and use.</h2>
              <p className="section-copy">
                The platform does not hide your performance behind one vague score. It
                connects every recommendation to the interview evidence that
                produced it.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  ['Grounded in your materials', 'Questions reflect your resume, role requirements and previous-round context.'],
                  ['Evaluated across competencies', 'Technical depth, communication, structure and requirement coverage are scored separately.'],
                  ['Built for the next attempt', 'You leave with better-answer examples and a prioritised practice plan.'],
                ].map(([title, copy]) => (
                  <li key={title} className="flex gap-4">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-orange-100 text-xs font-bold text-orange-800">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-stone-950">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="page-shell">
            <div className="relative overflow-hidden rounded-[2rem] bg-orange-700 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
              <div className="absolute inset-0 opacity-20 paper-grid-dark" />
              <div className="relative mx-auto max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-100">
                  Your next round starts here
                </p>
                <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                  Walk in prepared for the questions that matter.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-orange-50/90">
                  Build a personalised mock interview from your real role and
                  experience. Your first setup takes only a few minutes.
                </p>
                <Link
                  className="button-link mt-8 bg-white text-orange-800 hover:bg-orange-50"
                  to="/interviews/new"
                >
                  Create my interview <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="page-shell flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-sm text-stone-500">
            Purposeful practice for your next interview.
          </p>
          <div className="flex gap-5 text-sm font-medium text-stone-600">
            <Link to="/settings">Privacy</Link>
            <Link to="/settings">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  )
}

function NewInterviewPage() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)

  const handlePrepare = () => {
    setIsPreparing(true)
    window.setTimeout(() => setIsPreparing(false), 1400)
  }

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-2xl">
          <Badge variant="accent">Interview setup</Badge>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Let’s shape your next interview.
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
            Add your role details and source material. Your interviewer will use
            them to prepare focused, evidence-based questions.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card title="Interview details" description="Tell us what you are preparing for.">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="company" label="Company" hint="Optional, but useful for company-specific context.">
                <Input id="company" placeholder="e.g. Wells Fargo" />
              </FormField>
              <FormField id="role" label="Target role" required>
                <Input id="role" placeholder="e.g. Senior GenAI Engineer" required />
              </FormField>
              <FormField id="round" label="Interview round">
                <Select id="round" defaultValue="technical">
                  <option value="recruiter">Recruiter screen</option>
                  <option value="technical">Technical interview</option>
                  <option value="system-design">System design</option>
                  <option value="behavioural">Behavioural interview</option>
                </Select>
              </FormField>
              <FormField id="duration" label="Duration">
                <Select id="duration" defaultValue="45">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </FormField>
            </div>
            <div className="mt-5">
              <FormField id="context" label="Anything the interviewer should know?" hint="Add previous-round feedback, priorities, or topics to avoid.">
                <Textarea id="context" rows={4} placeholder="The previous round focused heavily on RAG. I want deeper questions on LangGraph and production evaluation." />
              </FormField>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FileUpload id="resume" label="Resume" description="PDF or DOCX, up to 10 MB" accept=".pdf,.doc,.docx" file={resume} onFileChange={setResume} />
              <FileUpload id="job-description" label="Job description" description="PDF, DOCX, or TXT" accept=".pdf,.doc,.docx,.txt" file={jobDescription} onFileChange={setJobDescription} />
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
              <Button variant="ghost">Save for later</Button>
              <Button loading={isPreparing} onClick={handlePrepare}>
                {isPreparing ? 'Preparing interview' : 'Prepare interview'}
              </Button>
            </div>
          </Card>
          <aside className="space-y-6">
            <Card title="Preparation" compact>
              <Progress value={35} label="Setup progress" />
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Interview details</span>
                  <Badge variant="success">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Source documents</span>
                  <Badge>Pending</Badge>
                </div>
              </div>
            </Card>
            {isPreparing ? (
              <Card compact>
                <div className="flex items-center gap-3" role="status">
                  <Spinner />
                  <div>
                    <p className="text-sm font-medium text-stone-900">Analysing your inputs</p>
                    <p className="mt-0.5 text-sm text-stone-500">This usually takes a moment.</p>
                  </div>
                </div>
              </Card>
            ) : (
              <EmptyState title="No interview prepared yet" description="Complete the details to generate your personalised interview plan." />
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  const { interviewId } = useParams()
  return (
    <main className="page-shell py-16">
      <Badge variant="accent">Platform route</Badge>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-stone-950">{title}</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">{description}</p>
      {interviewId && (
        <p className="mt-4 text-sm text-stone-500">Interview ID: {interviewId}</p>
      )}
      <Link className="button-link button-link-secondary mt-8" to="/">
        Return home
      </Link>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<PlaceholderPage title="Dashboard" description="Your recent interviews, readiness trend and priority practice areas will live here." />} />
        <Route path="interviews/new" element={<NewInterviewPage />} />
        <Route path="interviews/:interviewId/live" element={<PlaceholderPage title="Live interview" description="This focused space will host the adaptive text, voice and coding interview experience." />} />
        <Route path="interviews/:interviewId/feedback" element={<PlaceholderPage title="Feedback report" description="Detailed scoring, transcript evidence and your personalised improvement plan will appear here." />} />
        <Route path="history" element={<PlaceholderPage title="Interview history" description="Review previous sessions, reports and recurring strengths or gaps over time." />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" description="Manage your profile, preferences, saved documents and privacy controls." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
