import { useState, useEffect, useRef } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval,
         startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Always parse yyyy-MM-dd strings with parseISO to avoid UTC/local timezone issues
function parseDate(d) {
  try {
    if (!d || typeof d !== 'string') return new Date()
    // parseISO handles yyyy-MM-dd correctly in local time
    const parsed = parseISO(d)
    if (!parsed || isNaN(parsed.getTime())) return new Date()
    return parsed
  } catch {
    return new Date()
  }
}

function safeFormat(date, fmt) {
  try {
    if (!date || isNaN(date.getTime())) return ''
    return format(date, fmt)
  } catch {
    return ''
  }
}

export default function DatePicker({ selected, onChange, onClose }) {
  const today                 = new Date()
  const [viewing, setViewing] = useState(() => {
    const d = parseDate(selected)
    return isNaN(d.getTime()) ? new Date() : d
  })
  const [openUp, setOpenUp]   = useState(false)
  const ref                   = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    // Open upward only if not enough space below AND enough space above
    setOpenUp(spaceBelow < 320 && spaceAbove > 320)
  }, [])

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  const monthStart = startOfMonth(viewing)
  const monthEnd   = endOfMonth(viewing)
  const days       = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) })

  function prevMonth() {
    setViewing(v => new Date(v.getFullYear(), v.getMonth() - 1, 1))
  }
  function nextMonth() {
    const next = new Date(viewing.getFullYear(), viewing.getMonth() + 1, 1)
    if (next <= today) setViewing(next)
  }

  const selectedDate = parseDate(selected)
  const canGoNext    = new Date(viewing.getFullYear(), viewing.getMonth() + 1, 1) <= today

  return (
    <div
      ref={ref}
      className={`absolute ${openUp ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 z-50 bg-bg-card border border-border rounded-xl p-4 shadow-xl w-72`}
    >
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-bg-input transition-colors cursor-pointer">
          <ChevronLeft size={16} className="text-text-muted" />
        </button>
        <span className="text-base font-semibold text-text-primary">
          {safeFormat(viewing, 'MMMM yyyy')}
        </span>
        <button onClick={nextMonth} disabled={!canGoNext} className="p-1 rounded-lg hover:bg-bg-input transition-colors cursor-pointer disabled:opacity-30">
          <ChevronRight size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-xs text-text-muted py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, viewing)
          const isSelected     = isSameDay(day, selectedDate)
          const isTodayDay     = isSameDay(day, today)
          const isFuture       = isAfter(day, today)

          return (
            <button
              key={day.toISOString()}
              disabled={isFuture || !isCurrentMonth}
              onClick={() => { onChange(format(day, 'yyyy-MM-dd')); onClose() }}
              className={`
                h-8 w-full rounded-lg text-sm transition-colors cursor-pointer
                ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                ${isFuture ? 'opacity-20 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-green text-white font-semibold' : ''}
                ${isTodayDay && !isSelected ? 'border border-green text-green' : ''}
                ${!isSelected && !isTodayDay && isCurrentMonth && !isFuture ? 'text-text-secondary hover:bg-bg-input' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}