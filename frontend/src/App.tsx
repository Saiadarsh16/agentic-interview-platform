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
import { useEffect, useMemo, useState, type FormEvent } from 'react'
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
  const [step, setStep] = useState(1)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [round, setRound] = useState('technical')
  const [duration, setDuration] = useState('45')
  const [context, setContext] = useState('')
  const [mode, setMode] = useState('text')
  const [difficulty, setDifficulty] = useState('adaptive')
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'Technical depth',
    'Production thinking',
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

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="dashboard" element={<PlaceholderPage title="Dashboard" description="Your recent interviews, readiness trend and priority practice areas will live here." />} />
        <Route path="interviews/new" element={<NewInterviewPage />} />
        <Route path="interviews/:interviewId/live" element={<LiveInterviewPage />} />
        <Route path="interviews/:interviewId/feedback" element={<FeedbackReportPage />} />
        <Route path="history" element={<PlaceholderPage title="Interview history" description="Review previous sessions, reports and recurring strengths or gaps over time." />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" description="Manage your profile, preferences, saved documents and privacy controls." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
