'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value?: { hour: string; minute: string }
  onChange?: (value: { hour: string; minute: string }) => void
  className?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, setHour] = React.useState(value?.hour || '19')
  const [minute, setMinute] = React.useState(value?.minute || '00')

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    onChange?.({ hour: newHour, minute })
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    onChange?.({ hour, minute: newMinute })
  }

  // Format hour for display (12-hour format with AM/PM)
  const formatHourDisplay = (h: string) => {
    const hourNum = parseInt(h, 10)
    if (hourNum === 0) return '12 AM'
    if (hourNum === 12) return '12 PM'
    if (hourNum > 12) return `${hourNum - 12} PM`
    return `${hourNum} AM`
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={hour} onValueChange={handleHourChange}>
        <SelectTrigger className="w-[100px] bg-zinc-800 border-zinc-700 text-zinc-100">
          <SelectValue>{formatHourDisplay(hour)}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700 max-h-[200px]">
          {HOURS.map((h) => (
            <SelectItem 
              key={h} 
              value={h}
              className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
            >
              {formatHourDisplay(h)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={minute} onValueChange={handleMinuteChange}>
        <SelectTrigger className="w-[80px] bg-zinc-800 border-zinc-700 text-zinc-100">
          <SelectValue>{minute}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {MINUTES.map((m) => (
            <SelectItem 
              key={m} 
              value={m}
              className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

