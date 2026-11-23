import React from "react"

/** Tiny, safe markdown: paragraphs, "- " lists, "1. " lists, **bold**, `code`, [text](url), ```code blocks``` */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    const k = `${keyBase}-${i++}`
    if (tok.startsWith("**")) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>)
    else if (tok.startsWith("`")) out.push(<code key={k}>{tok.slice(1, -1)}</code>)
    else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!
      out.push(
        <a key={k} href={mm[2]} target="_blank" rel="noreferrer">
          {mm[1]}
        </a>,
      )
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Md({ text, className = "" }: { text: string; className?: string }) {
  const blocks: React.ReactNode[] = []
  const lines = text.trim().split("\n")
  let i = 0
  let b = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith("```")) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++])
      i++
      blocks.push(
        <pre key={b++} className="term rounded-md p-3 text-[12.5px] overflow-x-auto mb-3 leading-relaxed">
          {code.join("\n")}
        </pre>,
      )
      continue
    }
    if (/^\s*- /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*- /.test(lines[i])) items.push(lines[i++].replace(/^\s*- /, ""))
      blocks.push(
        <ul key={b++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `${b}-${j}`)}</li>
          ))}
        </ul>,
      )
      continue
    }
    if (/^\s*\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\. /, ""))
      blocks.push(
        <ol key={b++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, `${b}-${j}`)}</li>
          ))}
        </ol>,
      )
      continue
    }
    if (!line.trim()) {
      i++
      continue
    }
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*- /.test(lines[i]) &&
      !/^\s*\d+\. /.test(lines[i]) &&
      !lines[i].trim().startsWith("```")
    )
      para.push(lines[i++])
    blocks.push(<p key={b++}>{inline(para.join(" "), `p${b}`)}</p>)
  }
  return <div className={`prose-lesson ${className}`}>{blocks}</div>
}
