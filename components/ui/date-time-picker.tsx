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
  value?: Date
  onChange?: (date: Date | undefined) => void
  name?: string
  defaultValue?: string
}

// Generate hours array (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
// Generate minutes array (00, 15, 30, 45)
const MINUTES = ['00', '15', '30', '45']

export function DateTimePicker({ value, onChange, name, defaultValue }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (value) return value
    if (defaultValue) return new Date(defaultValue)
    return undefined
  })
  
  const [hour, setHour] = React.useState(() => {
    if (value) return format(value, 'HH')
    if (defaultValue) return format(new Date(defaultValue), 'HH')
    return '19'
  })
  
  const [minute, setMinute] = React.useState(() => {
    if (value) return format(value, 'mm')
    if (defaultValue) {
      const m = format(new Date(defaultValue), 'mm')
      // Round to nearest 15
      const num = parseInt(m)
      if (num < 8) return '00'
      if (num < 23) return '15'
      if (num < 38) return '30'
      if (num < 53) return '45'
      return '00'
    }
    return '00'
  })

  const updateDateTime = (newDate?: Date, newHour?: string, newMinute?: string) => {
    const d = newDate ?? date
    const h = newHour ?? hour
    const m = newMinute ?? minute
    
    if (d) {
      const updated = new Date(d)
      updated.setHours(parseInt(h), parseInt(m))
      setDate(updated)
      onChange?.(updated)
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      updateDateTime(selectedDate)
    }
  }

  const handleHourChange = (newHour: string) => {
    setHour(newHour)
    updateDateTime(undefined, newHour)
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute)
    updateDateTime(undefined, undefined, newMinute)
  }

  // Format the date for the hidden input (local ISO format without timezone conversion)
  const formattedValue = date ? 
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00` 
    : ''

  return (
    <div className="flex gap-2">
      {name && <input type="hidden" name={name} value={formattedValue} />}
      
      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 h-11 justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100 rounded-xl',
              !date && 'text-zinc-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
            {date ? format(date, 'MMMM do, yyyy') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-700" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="bg-zinc-900 text-zinc-100"
          />
        </PopoverContent>
      </Popover>

      {/* Time Picker */}
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
              <Select value={hour} onValueChange={handleHourChange}>
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
              <Select value={minute} onValueChange={handleMinuteChange}>
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
