'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DateTimePickerProps {
  name?: string
  defaultValue?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

export function DateTimePicker({ name, defaultValue }: DateTimePickerProps) {
  // Parse defaultValue: "2025-12-04T16:00:00" -> dateStr="2025-12-04", hour="16", minute="00"
  const [dateStr, setDateStr] = React.useState(() => {
    if (defaultValue) {
      const match = defaultValue.match(/^(\d{4}-\d{2}-\d{2})/)
      return match ? match[1] : ''
    }
    return ''
  })
  
  const [hour, setHour] = React.useState(() => {
    if (defaultValue) {
      const match = defaultValue.match(/T(\d{2}):/)
      return match ? match[1] : '19'
    }
    return '19'
  })
  
  const [minute, setMinute] = React.useState(() => {
    if (defaultValue) {
      const match = defaultValue.match(/T\d{2}:(\d{2})/)
      if (match) {
        const num = parseInt(match[1])
        if (num < 8) return '00'
        if (num < 23) return '15'
        if (num < 38) return '30'
        if (num < 53) return '45'
        return '00'
      }
    }
    return '00'
  })

  // For calendar display only
  const displayDate = dateStr ? new Date(dateStr + 'T12:00:00') : undefined

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      const y = selected.getFullYear()
      const m = String(selected.getMonth() + 1).padStart(2, '0')
      const d = String(selected.getDate()).padStart(2, '0')
      setDateStr(`${y}-${m}-${d}`)
    }
  }

  // Build final value directly from strings
  const formattedValue = dateStr ? `${dateStr}T${hour}:${minute}:00` : ''

  return (
    <div className="flex gap-2">
      {name && <input type="hidden" name={name} value={formattedValue} />}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 h-11 justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100 rounded-xl',
              !dateStr && 'text-zinc-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
            {displayDate ? format(displayDate, 'MMMM do, yyyy') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-zinc-900 text-zinc-100"
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-28 h-11 justify-center font-normal bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100 rounded-xl"
          >
            <Clock className="mr-2 h-4 w-4 text-zinc-500" />
            {hour}:{minute}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-zinc-900 border-zinc-700" align="end">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-500 mb-1">Hour</span>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="w-20 h-10 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 max-h-48">
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={h} className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-zinc-500 text-xl font-light mt-5">:</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-500 mb-1">Min</span>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="w-20 h-10 bg-zinc-800 border-zinc-700 text-zinc-100 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={m} className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
