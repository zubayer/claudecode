import { useState } from "react"
import type { QuizQ } from "@/data/types"
import { Quiz } from "./Quiz"
import { Button } from "@/components/ui/button"

export const EXAM_SIZE = 20
export const EXAM_PASS = 16

export function ExamView({
  pool,
  best,
  onFinish,
  onBack,
}: {
  pool: QuizQ[]
  best: number
  onFinish: (score: number) => void
  onBack: () => void
}) {
  const [qs, setQs] = useState<QuizQ[] | null>(null)
  const [last, setLast] = useState<number | null>(null)

  if (!qs) {
    return (
      <div className="pb-24">
        <button onClick={onBack} className="text-sm text-muted-foreground mb-3">
          ← Path
        </button>
        <div className="text-[11px] font-mono text-primary uppercase">Certification</div>
        <h1 className="font-display text-3xl leading-tight mt-1">Final exam</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {EXAM_SIZE} questions drawn at random from all seven core levels. Score {EXAM_PASS} or more ({Math.round((EXAM_PASS / EXAM_SIZE) * 100)}%) to pass.
          Pass the exam and finish every core lesson to unlock your certificate. You can retake it as often as you like; a new
          set of questions is drawn each time.
        </p>
        <div className="mt-4 rounded-md border bg-card p-3 text-sm">
          Best score: <span className="font-semibold">{best}/{EXAM_SIZE}</span>{" "}
          {best >= EXAM_PASS ? <span className="text-sage">· passed ✓</span> : <span className="text-muted-foreground">· not passed yet</span>}
        </div>
        <Button size="lg" className="w-full mt-4" onClick={() => setQs([...pool].sort(() => Math.random() - 0.5).slice(0, EXAM_SIZE))}>
          Start exam
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="text-[11px] font-mono text-primary uppercase mb-2">Final exam</div>
      <Quiz
        mode="test"
        key={qs.map((q) => q.q).join("|").length}
        questions={qs}
        onFinish={(s) => {
          setLast(s)
          onFinish(s)
        }}
      />
      {last !== null && (
        <div className="mt-4 text-center">
          <div className={last >= EXAM_PASS ? "text-sage font-semibold" : "text-destructive font-semibold"}>
            {last >= EXAM_PASS ? "Exam passed." : `Need ${EXAM_PASS} to pass. Review weak levels in Grill Me, then retry.`}
          </div>
          <Button variant="outline" className="mt-3" onClick={() => { setQs(null); setLast(null) }}>
            Back to exam home
          </Button>
        </div>
      )}
    </div>
  )
}
