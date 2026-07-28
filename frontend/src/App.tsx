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

function App() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)

  const handlePrepare = () => {
    setIsPreparing(true)
    window.setTimeout(() => setIsPreparing(false), 1400)
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-2xl">
          <Badge variant="accent">Interview setup</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Let’s shape your next interview.
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
            Add your role details and source material. Your interviewer will use
            them to prepare focused, evidence-based questions.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card
            title="Interview details"
            description="Tell us what you are preparing for."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="company"
                label="Company"
                hint="Optional, but useful for company-specific context."
              >
                <Input id="company" placeholder="e.g. Wells Fargo" />
              </FormField>

              <FormField id="role" label="Target role" required>
                <Input
                  id="role"
                  placeholder="e.g. Senior GenAI Engineer"
                  required
                />
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
              <FormField
                id="context"
                label="Anything the interviewer should know?"
                hint="Add previous-round feedback, priorities, or topics to avoid."
              >
                <Textarea
                  id="context"
                  rows={4}
                  placeholder="The previous round focused heavily on RAG. I want deeper questions on LangGraph and production evaluation."
                />
              </FormField>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FileUpload
                id="resume"
                label="Resume"
                description="PDF or DOCX, up to 10 MB"
                accept=".pdf,.doc,.docx"
                file={resume}
                onFileChange={setResume}
              />
              <FileUpload
                id="job-description"
                label="Job description"
                description="PDF, DOCX, or TXT"
                accept=".pdf,.doc,.docx,.txt"
                file={jobDescription}
                onFileChange={setJobDescription}
              />
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
                    <p className="text-sm font-medium text-stone-900">
                      Analysing your inputs
                    </p>
                    <p className="mt-0.5 text-sm text-stone-500">
                      This usually takes a moment.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <EmptyState
                title="No interview prepared yet"
                description="Complete the details to generate your personalised interview plan."
              />
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

export default App
