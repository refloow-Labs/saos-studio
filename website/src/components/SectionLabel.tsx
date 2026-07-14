interface Props {
  text: string
  delay?: number
  align?: 'center' | 'left'
}

export default function SectionLabel({ text, align = 'center' }: Props) {
  return (
    <div
      className={`flex items-center gap-3 mb-6 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      }`}
    >
      <span className="inline-block w-2 h-2 rounded-full bg-ink" />
      <span className="text-[0.7rem] tracking-[0.18em] uppercase font-bold text-muted font-body">
        {text}
      </span>
    </div>
  )
}
