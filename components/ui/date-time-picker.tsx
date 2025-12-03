'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  name?: string
  defaultValue?: string
}

export function DateTimePicker({ value, onChange, name, defaultValue }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (value) return value
    if (defaultValue) return new Date(defaultValue)
    return undefined
  })
  const [time, setTime] = React.useState(() => {
    if (value) return format(value, 'HH:mm')
    if (defaultValue) return format(new Date(defaultValue), 'HH:mm')
    return '19:00'
  })

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number)
      selectedDate.setHours(hours, minutes)
      setDate(selectedDate)
      onChange?.(selectedDate)
    }
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(':').map(Number)
      const newDate = new Date(date)
      newDate.setHours(hours, minutes)
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  // Format the date for the hidden input (ISO format for form submission)
  const formattedValue = date ? date.toISOString() : ''

  return (
    <div className="flex gap-2">
      {name && <input type="hidden" name={name} value={formattedValue} />}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'flex-1 justify-start text-left font-normal bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-100',
              !date && 'text-zinc-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-32 bg-zinc-800 border-zinc-700 text-zinc-100"
      />
    </div>
  )
}

