import {
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'
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
  const navigate = useNavigate()
  const location = useLocation()
  const repeatedSession = (location.state ?? {}) as InterviewContext
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState(repeatedSession.company ?? '')
  const [role, setRole] = useState(repeatedSession.role ?? '')
  const [round, setRound] = useState(repeatedSession.round ?? 'technical')
  const [duration, setDuration] = useState(repeatedSession.duration ?? '45')
  const [context, setContext] = useState('')
  const [mode, setMode] = useState(repeatedSession.mode ?? 'text')
  const [difficulty, setDifficulty] = useState(
    repeatedSession.difficulty ?? 'adaptive',
  )
  const [focusAreas, setFocusAreas] = useState<string[]>([
    ...(repeatedSession.focusAreas ?? [
      'Technical depth',
      'Production thinking',
    ]),
  ])
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = ['Context', 'Preferences', 'Review']
  const progress = Math.round((step / steps.length) * 100)

  const roundLabel = useMemo(
    () =>
      ({
        recruiter: 'Recruiter screen',
        technical: 'Technical interview',
        'system-design': 'System design',
        behavioural: 'Behavioural interview',
      })[round] ?? round,
    [round],
  )

  const validateFile = (
    file: File | null,
    field: string,
    extensions: string[],
  ) => {
    if (!file) return `${field} is required.`
    if (file.size > 10 * 1024 * 1024) return `${field} must be smaller than 10 MB.`
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!extensions.includes(extension)) {
      return `${field} must be a ${extensions.map((item) => item.toUpperCase()).join(', ')} file.`
    }
    return ''
  }

  const validateContext = () => {
    const nextErrors: Record<string, string> = {}
    if (!role.trim()) nextErrors.role = 'Enter the role you are preparing for.'
    const resumeError = validateFile(resume, 'Resume', ['pdf', 'doc', 'docx'])
    const jdError = validateFile(jobDescription, 'Job description', [
      'pdf',
      'doc',
      'docx',
      'txt',
    ])
    if (resumeError) nextErrors.resume = resumeError
    if (jdError) nextErrors.jobDescription = jdError
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleContextSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (validateContext()) {
      setErrors({})
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const toggleFocusArea = (area: string) => {
    setFocusAreas((current) =>
      current.includes(area)
        ? current.filter((item) => item !== area)
        : [...current, area],
    )
  }

  const handlePreferencesSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (focusAreas.length === 0) {
      setErrors({ focusAreas: 'Select at least one coaching focus.' })
      return
    }
    setErrors({})
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrepare = () => {
    setIsPreparing(true)
    window.setTimeout(() => {
      navigate(`/interviews/interview-${Date.now()}/live`, {
        state: { company, role, round, duration, mode, difficulty, focusAreas },
      })
    }, 1400)
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

        <div className="mb-8 grid grid-cols-3 gap-2" aria-label="Setup steps">
          {steps.map((label, index) => {
            const number = index + 1
            const active = number === step
            const complete = number < step
            return (
              <button
                key={label}
                type="button"
                onClick={() => complete && setStep(number)}
                disabled={!complete}
                aria-current={active ? 'step' : undefined}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                  active
                    ? 'border-orange-300 bg-orange-50'
                    : complete
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-stone-200 bg-white'
                }`}
              >
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Step {number}
                </span>
                <span className="mt-1 block text-sm font-semibold text-stone-900">
                  {complete ? '✓ ' : ''}{label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {step === 1 && (
          <Card title="Add your context" description="Tell us what you are preparing for and provide both source documents.">
            <form onSubmit={handleContextSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="company" label="Company" hint="Optional, but useful for company-specific context.">
                <Input id="company" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Wells Fargo" />
              </FormField>
              <FormField id="role" label="Target role" error={errors.role} required>
                <Input id="role" value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Senior GenAI Engineer" required />
              </FormField>
              <FormField id="round" label="Interview round">
                <Select id="round" value={round} onChange={(event) => setRound(event.target.value)}>
                  <option value="recruiter">Recruiter screen</option>
                  <option value="technical">Technical interview</option>
                  <option value="system-design">System design</option>
                  <option value="behavioural">Behavioural interview</option>
                </Select>
              </FormField>
              <FormField id="duration" label="Duration">
                <Select id="duration" value={duration} onChange={(event) => setDuration(event.target.value)}>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </FormField>
            </div>
            <div className="mt-5">
              <FormField id="context" label="Anything the interviewer should know?" hint="Add previous-round feedback, priorities, or topics to avoid.">
                <Textarea id="context" value={context} onChange={(event) => setContext(event.target.value)} rows={4} placeholder="The previous round focused heavily on RAG. I want deeper questions on LangGraph and production evaluation." />
              </FormField>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><FileUpload id="resume" label="Resume" description="PDF or DOCX, up to 10 MB" accept=".pdf,.doc,.docx" file={resume} onFileChange={(file) => { setResume(file); setErrors((current) => ({ ...current, resume: '' })) }} />{errors.resume && <p className="mt-1.5 text-xs text-red-700">{errors.resume}</p>}</div>
              <div><FileUpload id="job-description" label="Job description" description="PDF, DOCX, or TXT, up to 10 MB" accept=".pdf,.doc,.docx,.txt" file={jobDescription} onFileChange={(file) => { setJobDescription(file); setErrors((current) => ({ ...current, jobDescription: '' })) }} />{errors.jobDescription && <p className="mt-1.5 text-xs text-red-700">{errors.jobDescription}</p>}</div>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-end">
              <Button type="submit">Continue to preferences</Button>
            </div>
            </form>
          </Card>
          )}

          {step === 2 && (
            <Card title="Choose your interview style" description="Set the experience and the areas where you want the strongest coaching.">
              <form onSubmit={handlePreferencesSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField id="mode" label="Response mode">
                    <Select id="mode" value={mode} onChange={(event) => setMode(event.target.value)}>
                      <option value="text">Text response</option>
                      <option value="voice">Voice response</option>
                      <option value="mixed">Mixed text and voice</option>
                    </Select>
                  </FormField>
                  <FormField id="difficulty" label="Difficulty">
                    <Select id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                      <option value="supportive">Supportive</option>
                      <option value="adaptive">Adaptive</option>
                      <option value="challenging">Challenging</option>
                    </Select>
                  </FormField>
                </div>
                <fieldset className="mt-7">
                  <legend className="text-sm font-medium text-stone-800">Coaching focus</legend>
                  <p className="mt-1 text-xs text-stone-500">Choose one or more areas. The interviewer will still assess your complete answer.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {['Technical depth', 'Production thinking', 'Communication', 'System design', 'Behavioural stories', 'Leadership'].map((area) => (
                      <label key={area} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium ${focusAreas.includes(area) ? 'border-orange-300 bg-orange-50 text-orange-950' : 'border-stone-200 bg-white text-stone-700'}`}>
                        <input type="checkbox" className="size-4 accent-orange-700" checked={focusAreas.includes(area)} onChange={() => toggleFocusArea(area)} />
                        {area}
                      </label>
                    ))}
                  </div>
                  {errors.focusAreas && <p className="mt-2 text-xs text-red-700">{errors.focusAreas}</p>}
                </fieldset>
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit">Review interview plan</Button>
                </div>
              </form>
            </Card>
          )}

          {step === 3 && (
            <Card title="Your interview plan" description="Review the setup before the interviewer begins.">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Target', company.trim() ? `${role} at ${company}` : role],
                  ['Interview', `${roundLabel} · ${duration} minutes`],
                  ['Experience', `${mode[0].toUpperCase() + mode.slice(1)} · ${difficulty}`],
                  ['Sources', `${resume?.name} · ${jobDescription?.name}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
                    <p className="mt-1 break-words text-sm font-semibold text-stone-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Coaching focus</p>
                <div className="mt-3 flex flex-wrap gap-2">{focusAreas.map((area) => <Badge key={area} variant="accent">{area}</Badge>)}</div>
              </div>
              {context.trim() && (
                <div className="mt-6 rounded-xl border border-stone-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Additional direction</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{context}</p>
                </div>
              )}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
                <Button variant="ghost" disabled={isPreparing} onClick={() => setStep(2)}>Back</Button>
                <Button loading={isPreparing} onClick={handlePrepare}>{isPreparing ? 'Preparing your interview' : 'Start mock interview'}</Button>
              </div>
            </Card>
          )}

          <aside className="space-y-6">
            <Card title="Preparation" compact>
              <Progress value={progress} label="Setup progress" />
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Context</span>
                  <Badge variant={step > 1 ? 'success' : 'warning'}>{step > 1 ? 'Ready' : 'In progress'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Preferences</span>
                  <Badge variant={step > 2 ? 'success' : step === 2 ? 'warning' : 'neutral'}>{step > 2 ? 'Ready' : step === 2 ? 'In progress' : 'Pending'}</Badge>
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
              <EmptyState title={step === 3 ? 'Ready to begin' : 'Building your interview'} description={step === 3 ? 'Your sources and preferences are ready. Start whenever you feel settled.' : 'Complete each step to generate your personalised interview plan.'} />
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

const dashboardSessions = [
  {
    id: 'session-genai-04',
    role: 'Senior Generative AI Engineer',
    company: 'Wells Fargo',
    type: 'Technical interview',
    date: '28 Jul',
    score: 84,
    duration: '38 min',
    status: 'Completed',
  },
  {
    id: 'session-agentic-03',
    role: 'Agentic AI Lead',
    company: 'Wealth Management',
    type: 'System design',
    date: '25 Jul',
    score: 81,
    duration: '44 min',
    status: 'Completed',
  },
  {
    id: 'session-behavioural-02',
    role: 'Senior AI Engineer',
    company: 'Enterprise platform',
    type: 'Behavioural interview',
    date: '22 Jul',
    score: 76,
    duration: '31 min',
    status: 'Completed',
  },
] as const

type HistorySession = {
  id: string
  role: string
  company: string
  type: string
  date: string
  timestamp: number
  score: number
  duration: string
  durationMinutes: string
  mode: string
  difficulty: string
  focusAreas: string[]
  competencies: [string, number][]
}

const historySessions: HistorySession[] = [
  {
    id: 'session-genai-04',
    role: 'Senior Generative AI Engineer',
    company: 'Wells Fargo',
    type: 'Technical interview',
    date: '28 Jul 2026',
    timestamp: Date.parse('2026-07-28'),
    score: 84,
    duration: '38 min',
    durationMinutes: '45',
    mode: 'text',
    difficulty: 'adaptive',
    focusAreas: ['Technical depth', 'Production thinking'],
    competencies: [['Technical depth', 88], ['Communication', 82], ['Role alignment', 85]],
  },
  {
    id: 'session-agentic-03',
    role: 'Agentic AI Lead',
    company: 'Wealth Management',
    type: 'System design',
    date: '25 Jul 2026',
    timestamp: Date.parse('2026-07-25'),
    score: 81,
    duration: '44 min',
    durationMinutes: '45',
    mode: 'text',
    difficulty: 'challenging',
    focusAreas: ['System design', 'Leadership'],
    competencies: [['System design', 85], ['Technical depth', 83], ['Communication', 76]],
  },
  {
    id: 'session-behavioural-02',
    role: 'Senior AI Engineer',
    company: 'Enterprise Platform',
    type: 'Behavioural interview',
    date: '22 Jul 2026',
    timestamp: Date.parse('2026-07-22'),
    score: 76,
    duration: '31 min',
    durationMinutes: '30',
    mode: 'voice',
    difficulty: 'adaptive',
    focusAreas: ['Behavioural stories', 'Leadership'],
    competencies: [['Answer structure', 79], ['Communication', 77], ['Role alignment', 73]],
  },
  {
    id: 'session-rag-01',
    role: 'GenAI Engineer',
    company: 'Deloitte',
    type: 'Technical interview',
    date: '18 Jul 2026',
    timestamp: Date.parse('2026-07-18'),
    score: 75,
    duration: '42 min',
    durationMinutes: '45',
    mode: 'text',
    difficulty: 'adaptive',
    focusAreas: ['Technical depth', 'Communication'],
    competencies: [['RAG & evaluation', 82], ['Technical depth', 77], ['Communication', 68]],
  },
  {
    id: 'session-architecture-05',
    role: 'AI Platform Engineer',
    company: 'Verizon',
    type: 'System design',
    date: '13 Jul 2026',
    timestamp: Date.parse('2026-07-13'),
    score: 72,
    duration: '53 min',
    durationMinutes: '60',
    mode: 'mixed',
    difficulty: 'challenging',
    focusAreas: ['System design', 'Production thinking'],
    competencies: [['System design', 78], ['Production thinking', 74], ['Communication', 64]],
  },
  {
    id: 'session-recruiter-06',
    role: 'Senior GenAI Engineer',
    company: 'FinTech Team',
    type: 'Recruiter screen',
    date: '8 Jul 2026',
    timestamp: Date.parse('2026-07-08'),
    score: 68,
    duration: '24 min',
    durationMinutes: '30',
    mode: 'voice',
    difficulty: 'supportive',
    focusAreas: ['Communication', 'Behavioural stories'],
    competencies: [['Role alignment', 73], ['Communication', 69], ['Answer structure', 62]],
  },
  {
    id: 'session-azure-07',
    role: 'Azure GenAI Developer',
    company: 'Banking Platform',
    type: 'Technical interview',
    date: '2 Jul 2026',
    timestamp: Date.parse('2026-07-02'),
    score: 70,
    duration: '36 min',
    durationMinutes: '45',
    mode: 'text',
    difficulty: 'adaptive',
    focusAreas: ['Technical depth', 'Production thinking'],
    competencies: [['Technical depth', 75], ['Role alignment', 71], ['Communication', 64]],
  },
  {
    id: 'session-leadership-08',
    role: 'AI Engineering Lead',
    company: 'Healthcare AI',
    type: 'Behavioural interview',
    date: '27 Jun 2026',
    timestamp: Date.parse('2026-06-27'),
    score: 66,
    duration: '29 min',
    durationMinutes: '30',
    mode: 'voice',
    difficulty: 'supportive',
    focusAreas: ['Leadership', 'Behavioural stories'],
    competencies: [['Leadership', 72], ['Communication', 67], ['Answer structure', 59]],
  },
]

function HistoryPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All interview types')
  const [sortBy, setSortBy] = useState('Newest first')
  const [page, setPage] = useState(1)
  const pageSize = 4

  const filteredSessions = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase()
    return historySessions
      .filter((session) => {
        const matchesQuery =
          !normalisedQuery ||
          [session.role, session.company, session.type].some((value) =>
            value.toLowerCase().includes(normalisedQuery),
          )
        const matchesType =
          typeFilter === 'All interview types' || session.type === typeFilter
        return matchesQuery && matchesType
      })
      .sort((a, b) => {
        if (sortBy === 'Oldest first') return a.timestamp - b.timestamp
        if (sortBy === 'Highest score') return b.score - a.score
        if (sortBy === 'Lowest score') return a.score - b.score
        if (sortBy === 'Role A–Z') return a.role.localeCompare(b.role)
        return b.timestamp - a.timestamp
      })
  }, [query, sortBy, typeFilter])

  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / pageSize))
  const visibleSessions = filteredSessions.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  useEffect(() => {
    setPage(1)
  }, [query, sortBy, typeFilter])

  const repeatSession = (session: HistorySession) => {
    navigate('/interviews/new', {
      state: {
        company: session.company,
        role: session.role,
        round:
          session.type === 'System design'
            ? 'system-design'
            : session.type === 'Behavioural interview'
              ? 'behavioural'
              : session.type === 'Recruiter screen'
                ? 'recruiter'
                : 'technical',
        duration: session.durationMinutes,
        mode: session.mode,
        difficulty: session.difficulty,
        focusAreas: session.focusAreas,
      } satisfies InterviewContext,
    })
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-stone-100/70">
      <section className="border-b border-stone-200 bg-white">
        <div className="page-shell flex flex-col gap-6 py-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent">Interview history</Badge>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Your practice, in context.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Review every session, compare competency signals and repeat the
              interview configurations that matter most.
            </p>
          </div>
          <Link className="button-link button-link-primary" to="/interviews/new">
            Start a new interview <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="page-shell space-y-6 py-8 sm:py-12">
        <section className="grid gap-4 sm:grid-cols-3" aria-label="History summary">
          {[
            ['Total sessions', String(historySessions.length), 'Across four interview types'],
            ['Average score', '74', '+6 points since June'],
            ['Best performance', '84', 'Technical interview · 28 Jul'],
          ].map(([label, value, note]) => (
            <Card key={label} compact>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p>
              <p className="mt-2 font-serif text-3xl font-semibold text-stone-950">{value}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{note}</p>
            </Card>
          ))}
        </section>

        <Card>
          <div className="grid gap-4 border-b border-stone-200 pb-6 lg:grid-cols-[minmax(15rem,1fr)_14rem_12rem]">
            <FormField id="history-search" label="Search sessions">
              <Input
                id="history-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by role, company or type"
              />
            </FormField>
            <FormField id="history-type" label="Interview type">
              <Select id="history-type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option>All interview types</option>
                <option>Technical interview</option>
                <option>System design</option>
                <option>Behavioural interview</option>
                <option>Recruiter screen</option>
              </Select>
            </FormField>
            <FormField id="history-sort" label="Sort by">
              <Select id="history-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Highest score</option>
                <option>Lowest score</option>
                <option>Role A–Z</option>
              </Select>
            </FormField>
          </div>

          {visibleSessions.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No matching interviews"
                description="Try a broader search or reset the interview-type filter."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('')
                      setTypeFilter('All interview types')
                      setSortBy('Newest first')
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-stone-200">
              {visibleSessions.map((session) => (
                <article key={session.id} className="py-6">
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)_auto] lg:items-center">
                    <div className="flex min-w-0 gap-4">
                      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-stone-950 font-serif text-xl font-semibold text-white">
                        {session.score}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold text-stone-950">{session.role}</h2>
                          <Badge variant={session.score >= 80 ? 'success' : session.score >= 70 ? 'warning' : 'neutral'}>
                            {session.score >= 80 ? 'Strong' : session.score >= 70 ? 'Developing' : 'Foundation'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-stone-500">{session.company} · {session.type}</p>
                        <p className="mt-2 text-xs text-stone-400">{session.date} · {session.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {session.competencies.map(([label, score]) => (
                        <div key={label} className="flex items-center justify-between gap-4 text-xs">
                          <span className="truncate text-stone-500">{label}</span>
                          <span className="font-semibold text-stone-800">{score}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 lg:flex-col">
                      <Link className="button-link button-link-secondary" to={`/interviews/${session.id}/feedback`}>
                        View feedback
                      </Link>
                      <Button variant="ghost" onClick={() => repeatSession(session)}>
                        Repeat setup
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-500">
              {filteredSessions.length === 0
                ? 'No sessions'
                : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filteredSessions.length)} of ${filteredSessions.length} sessions`}
            </p>
            <nav className="flex items-center gap-2" aria-label="History pagination">
              <Button variant="outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <span className="px-2 text-sm font-semibold text-stone-700">
                Page {page} of {pageCount}
              </span>
              <Button variant="outline" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>
                Next
              </Button>
            </nav>
          </div>
        </Card>

        <p className="text-center text-xs leading-5 text-stone-500">
          History data is illustrative until account persistence and backend
          evaluation are connected.
        </p>
      </div>
    </main>
  )
}

const readinessTrend = [
  { label: '8 Jul', score: 68 },
  { label: '13 Jul', score: 72 },
  { label: '18 Jul', score: 75 },
  { label: '22 Jul', score: 76 },
  { label: '25 Jul', score: 81 },
  { label: '28 Jul', score: 84 },
] as const

function DashboardPage() {
  const [sessionFilter, setSessionFilter] = useState('All sessions')
  const filteredSessions = dashboardSessions.filter(
    (session) =>
      sessionFilter === 'All sessions' || session.type === sessionFilter,
  )

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-stone-100/70">
      <section className="border-b border-stone-200 bg-white">
        <div className="page-shell flex flex-col gap-6 py-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent">Practice dashboard</Badge>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Good morning, Adarsh.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
              Your technical depth is improving. Focus next on concise answer
              structure and measurable outcomes.
            </p>
          </div>
          <Link className="button-link button-link-primary" to="/interviews/new">
            Start a new interview <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="page-shell space-y-8 py-8 sm:py-12">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Readiness summary">
          {[
            ['Overall readiness', '84', '+8 points', 'Since your first session'],
            ['Practice sessions', '6', '3 this week', 'Across three interview types'],
            ['Questions answered', '29', '86% complete', 'Average response: 148 words'],
            ['Practice time', '3h 42m', '+1h 18m', 'During the past seven days'],
          ].map(([label, value, change, note], index) => (
            <Card key={label} compact>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {label}
                  </p>
                  <p className="mt-3 font-serif text-4xl font-semibold text-stone-950">
                    {value}
                    {index === 0 && <span className="text-lg text-stone-400">/100</span>}
                  </p>
                </div>
                {index === 0 && (
                  <span className="grid size-12 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                    84
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-700">{change}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{note}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <Card
            title="Readiness trend"
            description="Illustrative scores from your six most recent practice sessions."
          >
            <div className="mt-2 flex h-64 items-end gap-2 border-b border-stone-200 sm:gap-4" aria-label="Readiness scores over time">
              {readinessTrend.map((point, index) => (
                <div key={point.label} className="flex h-full flex-1 flex-col justify-end">
                  <div className="group relative flex flex-1 items-end justify-center">
                    <span className="absolute bottom-[calc(var(--bar-height)+0.5rem)] text-xs font-semibold text-stone-600" style={{ '--bar-height': `${point.score}%` } as CSSProperties}>
                      {point.score}
                    </span>
                    <div
                      className={`w-full max-w-12 rounded-t-lg transition-colors ${
                        index === readinessTrend.length - 1
                          ? 'bg-orange-700'
                          : 'bg-orange-200 group-hover:bg-orange-300'
                      }`}
                      style={{ height: `${point.score}%` }}
                    />
                  </div>
                  <span className="py-3 text-center text-[0.68rem] font-medium text-stone-500 sm:text-xs">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-6 text-stone-600">
                Readiness has increased by <strong className="text-stone-900">16 points</strong> across six sessions.
              </p>
              <Badge variant="success">Improving steadily</Badge>
            </div>
          </Card>

          <Card title="Competency snapshot" description="Your latest practice signals.">
            <div className="space-y-5">
              {[
                ['Technical depth', 88],
                ['Role alignment', 85],
                ['Communication', 82],
                ['Answer structure', 76],
              ].map(([label, score]) => (
                <Progress key={label} value={Number(score)} label={`${label} · ${score}%`} />
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-orange-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-800">
                Highest-leverage focus
              </p>
              <p className="mt-2 text-sm leading-6 text-orange-950">
                Use Context → Decision → Execution → Result to keep strong
                technical answers under two minutes.
              </p>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(19rem,0.7fr)]">
          <Card>
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-stone-950">Recent interviews</h2>
                <p className="mt-1 text-sm text-stone-500">Review your latest sessions and feedback.</p>
              </div>
              <Select
                aria-label="Filter recent interviews"
                value={sessionFilter}
                onChange={(event) => setSessionFilter(event.target.value)}
                className="sm:w-52"
              >
                <option>All sessions</option>
                <option>Technical interview</option>
                <option>System design</option>
                <option>Behavioural interview</option>
              </Select>
            </div>
            <div className="divide-y divide-stone-200">
              {filteredSessions.map((session) => (
                <article key={session.id} className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="flex min-w-0 gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-stone-100 font-serif text-lg font-semibold text-stone-700">
                      {session.score}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-stone-950">{session.role}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {session.company} · {session.type}
                      </p>
                      <p className="mt-2 text-xs text-stone-400">
                        {session.date} · {session.duration}
                      </p>
                    </div>
                  </div>
                  <Link
                    className="text-sm font-semibold text-orange-800 underline decoration-orange-300 underline-offset-4"
                    to={`/interviews/${session.id}/feedback`}
                  >
                    View feedback
                  </Link>
                </article>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-5">
              <Link className="text-sm font-semibold text-stone-700" to="/history">
                View complete history <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Recommended next" compact>
              <Badge variant="warning">Priority practice</Badge>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-stone-950">
                Production AI system design
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Practise explaining observability, failure recovery and
                guardrails with clear architectural trade-offs.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>20 minutes</Badge>
                <Badge>Challenging</Badge>
              </div>
              <Link className="button-link button-link-primary mt-6 w-full" to="/interviews/new">
                Start focused practice
              </Link>
            </Card>

            <Card title="This week’s focus" compact>
              <ol className="space-y-4 text-sm">
                {[
                  ['1', 'Add one metric to every project answer'],
                  ['2', 'Complete one system-design session'],
                  ['3', 'Revisit two skipped questions'],
                ].map(([number, item]) => (
                  <li key={item} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                      {number}
                    </span>
                    <span className="leading-6 text-stone-700">{item}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </section>

        <p className="text-center text-xs leading-5 text-stone-500">
          Dashboard data is illustrative until account persistence and backend
          evaluation are connected.
        </p>
      </div>
    </main>
  )
}

type InterviewContext = {
  company?: string
  role?: string
  round?: string
  duration?: string
  mode?: string
  difficulty?: string
  focusAreas?: string[]
}

const sampleQuestions = [
  {
    category: 'Architecture',
    question:
      'Walk me through an agentic AI system you designed. What made an agentic workflow necessary instead of a simpler deterministic pipeline?',
    guidance: 'Explain the business need, orchestration, tools, state and measurable result.',
  },
  {
    category: 'RAG & evaluation',
    question:
      'How would you evaluate a retrieval-augmented generation system before releasing it to production?',
    guidance: 'Separate retrieval, generation, safety and production monitoring.',
  },
  {
    category: 'Production thinking',
    question:
      'An agent is repeatedly calling an expensive tool without improving its answer. How would you diagnose and prevent that behaviour?',
    guidance: 'Discuss observability, limits, state transitions and graceful fallback.',
  },
  {
    category: 'System design',
    question:
      'Design a secure interview-coaching platform that personalises questions from a resume and job description.',
    guidance: 'Cover data flow, privacy, model orchestration, storage and scaling.',
  },
  {
    category: 'Behavioural',
    question:
      'Tell me about a technical decision you changed after receiving new evidence. What did you learn?',
    guidance: 'Use a clear situation, decision, evidence, action and result.',
  },
]

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function LiveInterviewPage() {
  const { interviewId = 'practice-session' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const context = (location.state ?? {}) as InterviewContext
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(sampleQuestions.length).fill(''),
  )
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showCoachNote, setShowCoachNote] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const currentQuestion = sampleQuestions[questionIndex]
  const answeredCount = answers.filter((answer) => answer.trim()).length
  const role = context.role || 'Senior GenAI Engineer'
  const company = context.company?.trim()
  const totalMinutes = Number(context.duration) || 45

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(
      () => setSecondsElapsed((seconds) => seconds + 1),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [isPaused])

  const updateAnswer = (answer: string) => {
    setAnswers((current) =>
      current.map((value, index) => (index === questionIndex ? answer : value)),
    )
    setStatusMessage('')
  }

  const goToQuestion = (index: number) => {
    setQuestionIndex(index)
    setShowCoachNote(false)
    setStatusMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    if (!answers[questionIndex].trim()) {
      setStatusMessage('Add an answer before continuing, or use Skip for now.')
      return
    }
    if (questionIndex < sampleQuestions.length - 1) {
      goToQuestion(questionIndex + 1)
    } else {
      navigate(`/interviews/${interviewId}/feedback`, {
        state: { ...context, answers, elapsedSeconds: secondsElapsed },
      })
    }
  }

  const handleEndInterview = () => {
    if (
      window.confirm(
        'End this practice interview and continue to your feedback summary?',
      )
    ) {
      navigate(`/interviews/${interviewId}/feedback`, {
        state: { ...context, answers, elapsedSeconds: secondsElapsed },
      })
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-stone-100/70">
      <div className="border-b border-stone-200 bg-white">
        <div className="page-shell flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">Live practice</Badge>
              <span className="text-sm text-stone-500">
                {context.round
                  ? context.round.replace('-', ' ')
                  : 'Technical interview'}
              </span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-semibold text-stone-950">
              {role}
              {company ? ` at ${company}` : ''}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-center"
              aria-label={`${formatTime(secondsElapsed)} elapsed`}
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-stone-500">
                Elapsed
              </p>
              <p className="font-mono text-lg font-semibold text-stone-900">
                {formatTime(secondsElapsed)}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsPaused((paused) => !paused)}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="ghost" onClick={handleEndInterview}>
              End interview
            </Button>
          </div>
        </div>
      </div>

      <div className="page-shell grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="min-w-0">
          {isPaused && (
            <div
              className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
              role="status"
            >
              <strong>Interview paused.</strong> Your answer is safe and the
              timer has stopped.
            </div>
          )}

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                  Question {questionIndex + 1} of {sampleQuestions.length}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  {currentQuestion.category}
                </p>
              </div>
              <Badge variant="accent">
                {context.difficulty || 'Adaptive'} difficulty
              </Badge>
            </div>

            <h2 className="mt-7 max-w-3xl font-serif text-3xl font-semibold leading-tight text-stone-950 sm:text-4xl">
              {currentQuestion.question}
            </h2>

            <button
              type="button"
              className="mt-5 text-sm font-semibold text-orange-800 underline decoration-orange-300 underline-offset-4"
              onClick={() => setShowCoachNote((visible) => !visible)}
              aria-expanded={showCoachNote}
            >
              {showCoachNote ? 'Hide answer framework' : 'Need a thinking prompt?'}
            </button>
            {showCoachNote && (
              <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-950">
                {currentQuestion.guidance}
              </div>
            )}

            <div className="mt-8">
              <FormField
                id="live-answer"
                label="Your answer"
                hint="Structure your reasoning clearly. You can revise this response before moving on."
              >
                <Textarea
                  id="live-answer"
                  rows={10}
                  value={answers[questionIndex]}
                  disabled={isPaused}
                  onChange={(event) => updateAnswer(event.target.value)}
                  placeholder="Start with the context and your decision, then explain the technical execution, trade-offs and measurable outcome..."
                />
              </FormField>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                <span>{answers[questionIndex].trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>Draft saved in this session</span>
              </div>
              {statusMessage && (
                <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                  {statusMessage}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  disabled={questionIndex === 0}
                  onClick={() => goToQuestion(questionIndex - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  disabled={questionIndex === sampleQuestions.length - 1}
                  onClick={() => goToQuestion(questionIndex + 1)}
                >
                  Skip for now
                </Button>
              </div>
              <Button disabled={isPaused} onClick={handleNext}>
                {questionIndex === sampleQuestions.length - 1
                  ? 'Finish interview'
                  : 'Submit & continue'}
              </Button>
            </div>
          </Card>
        </section>

        <aside className="space-y-5">
          <Card title="Interview progress" compact>
            <Progress
              value={Math.round(
                ((questionIndex + 1) / sampleQuestions.length) * 100,
              )}
              label={`${answeredCount} of ${sampleQuestions.length} answered`}
            />
            <ol className="mt-5 space-y-2" aria-label="Interview questions">
              {sampleQuestions.map((question, index) => {
                const active = index === questionIndex
                const answered = Boolean(answers[index].trim())
                return (
                  <li key={question.category}>
                    <button
                      type="button"
                      onClick={() => goToQuestion(index)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
                        active
                          ? 'border-orange-300 bg-orange-50 text-orange-950'
                          : 'border-transparent text-stone-600 hover:border-stone-200 hover:bg-stone-50'
                      }`}
                      aria-current={active ? 'step' : undefined}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          answered
                            ? 'bg-emerald-100 text-emerald-800'
                            : active
                              ? 'bg-orange-700 text-white'
                              : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {answered ? '✓' : index + 1}
                      </span>
                      <span className="line-clamp-2">{question.category}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </Card>

          <Card title="Session plan" compact>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500">Planned time</dt>
                <dd className="font-semibold text-stone-800">{totalMinutes} min</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-500">Response mode</dt>
                <dd className="capitalize font-semibold text-stone-800">
                  {context.mode || 'Text'}
                </dd>
              </div>
            </dl>
            {context.focusAreas && context.focusAreas.length > 0 && (
              <div className="mt-5 border-t border-stone-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Coaching focus
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {context.focusAreas.map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <p className="px-1 text-xs leading-5 text-stone-500">
            This milestone uses sample questions and keeps responses in your
            browser session. Adaptive AI follow-ups, voice capture and server
            persistence will be connected in a later backend milestone.
          </p>
        </aside>
      </div>
    </main>
  )
}

type FeedbackContext = InterviewContext & {
  answers?: string[]
  elapsedSeconds?: number
}

const scoreLabels = [
  ['Technical depth', 86],
  ['Answer structure', 79],
  ['Communication', 82],
  ['Role alignment', 84],
] as const

const answerFeedback = [
  { strength: 'You establish the business need before describing the agent workflow.', improvement: 'Name the orchestration guardrails and quantify the production result.' },
  { strength: 'You separate retrieval quality from response quality.', improvement: 'Add concrete offline metrics, thresholds and a production monitoring loop.' },
  { strength: 'You recognise the need for observability and bounded execution.', improvement: 'Explain the exact stop condition, retry policy and fallback path.' },
  { strength: 'Your design covers the main platform layers and privacy concerns.', improvement: 'Make the data-retention model and scaling trade-offs more explicit.' },
  { strength: 'You show that new evidence can change a technical decision.', improvement: 'Close with a measurable result and the principle you carried forward.' },
]

function FeedbackReportPage() {
  const { interviewId = 'practice-session' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const context = (location.state ?? {}) as FeedbackContext
  const [expandedAnswer, setExpandedAnswer] = useState(0)

  const answers = sampleQuestions.map((_, index) => context.answers?.[index] ?? '')
  const answeredCount = answers.filter((answer) => answer.trim()).length
  const wordCount = answers.reduce(
    (total, answer) => total + answer.trim().split(/\s+/).filter(Boolean).length,
    0,
  )
  const completenessScore = Math.round((answeredCount / sampleQuestions.length) * 100)
  const overallScore = Math.round(
    scoreLabels.reduce((total, [, score]) => total + score, 0) / scoreLabels.length,
  )
  const role = context.role || 'Senior GenAI Engineer'
  const company = context.company?.trim()
  const elapsedSeconds = context.elapsedSeconds ?? 0

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-stone-100/70">
      <section className="border-b border-stone-200 bg-stone-950 text-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-400/10 text-emerald-300 ring-emerald-400/20">
                  Practice complete
                </Badge>
                <span className="text-sm text-stone-400">Session {interviewId}</span>
              </div>
              <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                Your interview feedback
              </h1>
              <p className="mt-3 text-base capitalize leading-7 text-stone-300">
                {role}{company ? ' at ' + company : ''} ·{' '}
                {context.round ? context.round.replace('-', ' ') : 'Technical interview'}
              </p>
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Readiness score
                </p>
                <p className="mt-1 font-serif text-6xl font-semibold text-orange-300">
                  {overallScore}<span className="text-xl text-stone-500">/100</span>
                </p>
              </div>
              <Badge variant="success">Strong foundation</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell space-y-8 py-8 sm:py-12">
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Session summary">
          {[
            ['Answered', answeredCount + '/' + sampleQuestions.length],
            ['Total words', String(wordCount)],
            ['Practice time', formatTime(elapsedSeconds)],
          ].map(([label, value]) => (
            <Card key={label} compact>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p>
              <p className="mt-2 font-serif text-3xl font-semibold text-stone-950">{value}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <Card title="Competency breakdown" description="A clear view of the signals demonstrated across this practice session.">
            <div className="space-y-6">
              {scoreLabels.map(([label, score]) => (
                <Progress key={label} value={score} label={label + ' · ' + score + '%'} />
              ))}
            </div>
            <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              These are illustrative frontend scores based on the current sample session.
              Model-based evaluation and evidence scoring will be connected through the backend later.
            </p>
          </Card>

          <div className="space-y-6">
            <Card title="What worked" compact>
              <ul className="space-y-4 text-sm leading-6 text-stone-700">
                {[
                  'You organise technical answers around the business problem.',
                  'Your responses show strong production and risk awareness.',
                  'You communicate trade-offs instead of listing tools alone.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Priority improvement" compact>
              <p className="text-sm leading-6 text-stone-700">
                Strengthen every answer with one measurable outcome and one explicit
                decision trade-off. This will make your experience sound more senior and credible.
              </p>
              <div className="mt-5">
                <Progress value={completenessScore} label="Response completeness" />
              </div>
            </Card>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <p className="eyebrow">Answer review</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-stone-950">
              Evidence behind the feedback
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Open each question to compare your response with focused coaching.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {sampleQuestions.map((item, index) => {
              const expanded = expandedAnswer === index
              const answer = answers[index].trim()
              return (
                <article key={item.category} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-5 p-5 text-left sm:p-6"
                    onClick={() => setExpandedAnswer(expanded ? -1 : index)}
                    aria-expanded={expanded}
                  >
                    <span className="flex min-w-0 gap-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">{index + 1}</span>
                      <span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{item.category}</span>
                        <span className="mt-1 block font-serif text-lg font-semibold leading-6 text-stone-950">{item.question}</span>
                      </span>
                    </span>
                    <span className="text-2xl leading-none text-stone-400" aria-hidden="true">{expanded ? '−' : '+'}</span>
                  </button>
                  {expanded && (
                    <div className="border-t border-stone-200 p-5 sm:p-6">
                      <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Your response</p>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-700">
                            {answer || 'No response was submitted for this question.'}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Strong signal</p>
                            <p className="mt-2 text-sm leading-6 text-emerald-950">
                              {answer ? answerFeedback[index].strength : 'Revisit this question to create a complete response.'}
                            </p>
                          </div>
                          <div className="rounded-xl bg-orange-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-800">Make it stronger</p>
                            <p className="mt-2 text-sm leading-6 text-orange-950">{answerFeedback[index].improvement}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <Card title="Your next practice plan" description="A focused sequence for turning this feedback into stronger interview performance.">
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                ['01', 'Add measurable outcomes', 'Revise two answers with scale, latency, quality or business-impact metrics.'],
                ['02', 'Practise concise structure', 'Use Context → Decision → Execution → Result and stay under two minutes.'],
                ['03', 'Repeat under pressure', 'Run another adaptive session and compare the competency scores.'],
              ].map(([number, title, copy]) => (
                <li key={number} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                  <span className="font-serif text-sm font-semibold text-orange-700">{number}</span>
                  <p className="mt-3 font-semibold text-stone-950">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{copy}</p>
                </li>
              ))}
            </ol>
          </Card>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/interviews/new')}>Practise again</Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
          </div>
        </section>
      </div>
    </main>
  )
}

type SettingsState = {
  name: string
  email: string
  targetRole: string
  defaultMode: string
  defaultDifficulty: string
  defaultDuration: string
  coachingStyle: string
  showFrameworks: boolean
  reduceMotion: boolean
  largerText: boolean
  practiceReminders: boolean
  weeklySummary: boolean
}

const defaultSettings: SettingsState = {
  name: 'Sai Adarsh Malla',
  email: 'sai.adarsh@example.com',
  targetRole: 'Senior Generative AI Engineer',
  defaultMode: 'text',
  defaultDifficulty: 'adaptive',
  defaultDuration: '30',
  coachingStyle: 'balanced',
  showFrameworks: true,
  reduceMotion: false,
  largerText: false,
  practiceReminders: true,
  weeklySummary: true,
}

function SettingsToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-5 border-b border-stone-200 py-5 last:border-0">
      <span>
        <span className="block text-sm font-semibold text-stone-950">{label}</span>
        <span className="mt-1 block max-w-xl text-sm leading-6 text-stone-500">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-stone-300 transition-colors peer-checked:bg-orange-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-700"
      >
        <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = window.localStorage.getItem('agentic-interview-settings')
      return saved
        ? { ...defaultSettings, ...(JSON.parse(saved) as Partial<SettingsState>) }
        : defaultSettings
    } catch {
      return defaultSettings
    }
  })
  const [savedSettings, setSavedSettings] = useState(settings)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  function updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }))
    setStatus('idle')
  }

  function saveSettings(event: FormEvent) {
    event.preventDefault()
    setStatus('saving')
    window.setTimeout(() => {
      window.localStorage.setItem(
        'agentic-interview-settings',
        JSON.stringify(settings),
      )
      setSavedSettings(settings)
      setStatus('saved')
    }, 450)
  }

  function resetSettings() {
    setSettings(defaultSettings)
    setStatus('idle')
  }

  return (
    <main className={settings.largerText ? 'text-[1.075rem]' : undefined}>
      <section className="border-b border-stone-200 bg-white">
        <div className="page-shell py-10 sm:py-14">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Your workspace</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
                Settings
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-stone-600">
                Shape how your interviews feel, what your coach prioritises and
                which practice updates you receive.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetSettings} disabled={!hasChanges}>
                Reset changes
              </Button>
              <Button
                type="submit"
                form="settings-form"
                loading={status === 'saving'}
                disabled={!hasChanges && status !== 'saving'}
              >
                Save settings
              </Button>
            </div>
          </div>
          <div aria-live="polite" className="mt-4 min-h-6">
            {status === 'saved' && (
              <p className="text-sm font-medium text-emerald-700">
                ✓ Your preferences have been saved on this device.
              </p>
            )}
          </div>
        </div>
      </section>

      <form
        id="settings-form"
        onSubmit={saveSettings}
        className="page-shell grid gap-8 py-8 sm:py-12 lg:grid-cols-[14rem_minmax(0,1fr)]"
      >
        <aside>
          <nav
            aria-label="Settings sections"
            className="sticky top-24 flex gap-2 overflow-x-auto rounded-xl border border-stone-200 bg-white p-2 lg:flex-col"
          >
            {[
              ['profile', 'Profile'],
              ['interview', 'Interview defaults'],
              ['coaching', 'Coaching'],
              ['accessibility', 'Accessibility'],
              ['notifications', 'Notifications'],
              ['privacy', 'Privacy & data'],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-orange-700"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-6">
          <Card
            id="profile"
            className="scroll-mt-28"
            title="Profile"
            description="Used to personalise your workspace and interview introductions."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="settings-name" label="Full name">
                <Input
                  id="settings-name"
                  value={settings.name}
                  onChange={(event) => updateSetting('name', event.target.value)}
                />
              </FormField>
              <FormField
                label="Email address"
                id="settings-email"
                hint="Account sign-in will be connected with the backend later."
              >
                <Input
                  id="settings-email"
                  type="email"
                  value={settings.email}
                  onChange={(event) => updateSetting('email', event.target.value)}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField id="settings-role" label="Primary target role">
                  <Input
                    id="settings-role"
                    value={settings.targetRole}
                    onChange={(event) => updateSetting('targetRole', event.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </Card>

          <Card
            id="interview"
            className="scroll-mt-28"
            title="Interview defaults"
            description="Pre-fill new interview setups while keeping every choice editable."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <FormField id="settings-mode" label="Mode">
                <Select
                  id="settings-mode"
                  value={settings.defaultMode}
                  onChange={(event) => updateSetting('defaultMode', event.target.value)}
                >
                  <option value="text">Text interview</option>
                  <option value="voice" disabled>Voice · Coming later</option>
                  <option value="coding" disabled>Coding · Planned</option>
                </Select>
              </FormField>
              <FormField id="settings-difficulty" label="Difficulty">
                <Select
                  id="settings-difficulty"
                  value={settings.defaultDifficulty}
                  onChange={(event) =>
                    updateSetting('defaultDifficulty', event.target.value)
                  }
                >
                  <option value="adaptive">Adaptive</option>
                  <option value="foundational">Foundational</option>
                  <option value="challenging">Challenging</option>
                </Select>
              </FormField>
              <FormField id="settings-duration" label="Duration">
                <Select
                  id="settings-duration"
                  value={settings.defaultDuration}
                  onChange={(event) =>
                    updateSetting('defaultDuration', event.target.value)
                  }
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </FormField>
            </div>
          </Card>

          <Card
            id="coaching"
            className="scroll-mt-28"
            title="Coaching experience"
            description="Choose how much guidance you want while practising."
          >
            <FormField id="settings-coaching" label="Feedback style">
              <Select
                id="settings-coaching"
                value={settings.coachingStyle}
                onChange={(event) =>
                  updateSetting('coachingStyle', event.target.value)
                }
              >
                <option value="supportive">Supportive · Encourage first</option>
                <option value="balanced">Balanced · Direct and constructive</option>
                <option value="challenging">Challenging · Interviewer-style pressure</option>
              </Select>
            </FormField>
            <div className="mt-3">
              <SettingsToggle
                checked={settings.showFrameworks}
                onChange={(checked) => updateSetting('showFrameworks', checked)}
                label="Show answer frameworks"
                description="Offer optional structure prompts such as STAR or Context → Decision → Result during practice."
              />
            </div>
          </Card>

          <Card
            id="accessibility"
            className="scroll-mt-28"
            title="Accessibility"
            description="Adjust the practice environment for more comfortable use."
          >
            <SettingsToggle
              checked={settings.reduceMotion}
              onChange={(checked) => updateSetting('reduceMotion', checked)}
              label="Reduce motion"
              description="Minimise decorative movement and non-essential transitions."
            />
            <SettingsToggle
              checked={settings.largerText}
              onChange={(checked) => updateSetting('largerText', checked)}
              label="Larger interface text"
              description="Increase the base text size across this settings experience."
            />
          </Card>

          <Card
            id="notifications"
            className="scroll-mt-28"
            title="Notifications"
            description="These choices are ready for the future account service; no emails are sent yet."
          >
            <SettingsToggle
              checked={settings.practiceReminders}
              onChange={(checked) => updateSetting('practiceReminders', checked)}
              label="Practice reminders"
              description="Receive a gentle reminder when your planned practice window is approaching."
            />
            <SettingsToggle
              checked={settings.weeklySummary}
              onChange={(checked) => updateSetting('weeklySummary', checked)}
              label="Weekly progress summary"
              description="Get a short recap of completed sessions, readiness movement and the next priority."
            />
          </Card>

          <Card
            id="privacy"
            className="scroll-mt-28"
            title="Privacy & data"
            description="Your documents and interview data will remain under your control."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm font-semibold text-stone-950">Saved documents</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Resume and job-description storage will become available after
                  secure backend persistence is connected.
                </p>
                <Button variant="outline" className="mt-5" disabled>
                  Manage documents
                </Button>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
                <p className="text-sm font-semibold text-red-950">Delete practice data</p>
                <p className="mt-2 text-sm leading-6 text-red-800">
                  Permanent account-data controls will be enabled with authentication
                  and backend storage.
                </p>
                <Button variant="danger" className="mt-5" disabled>
                  Delete data
                </Button>
              </div>
            </div>
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              For this frontend milestone, settings are stored only in this browser.
              No profile, document or interview data is sent to a server.
            </p>
          </Card>
        </div>
      </form>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="interviews/new" element={<NewInterviewPage />} />
        <Route path="interviews/:interviewId/live" element={<LiveInterviewPage />} />
        <Route path="interviews/:interviewId/feedback" element={<FeedbackReportPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
