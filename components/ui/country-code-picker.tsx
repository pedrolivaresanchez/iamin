'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { COUNTRY_CODES } from '@/lib/country-codes'

interface CountryCodePickerProps {
  value: string
  onChange: (value: string) => void
  name?: string
}

export function CountryCodePicker({ value, onChange, name }: CountryCodePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const selectedCountry = COUNTRY_CODES.find(c => c.code === value)

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[120px] h-12 justify-between bg-zinc-800/50 border-zinc-700/50 text-zinc-100 rounded-xl hover:bg-zinc-700/50"
          >
            <span className="flex items-center gap-1.5 truncate">
              {selectedCountry ? (
                <>
                  <span>{selectedCountry.flag}</span>
                  <span className="text-zinc-300">{selectedCountry.code}</span>
                </>
              ) : (
                '+971'
              )}
            </span>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-zinc-900 border-zinc-700">
          <Command className="bg-zinc-900">
            <CommandInput 
              placeholder="Search country..." 
              className="h-10 text-zinc-100"
            />
            <CommandList>
              <CommandEmpty className="text-zinc-500 text-sm py-4 text-center">
                No country found.
              </CommandEmpty>
              <CommandGroup>
                {COUNTRY_CODES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.country} ${country.code}`}
                    onSelect={() => {
                      onChange(country.code)
                      setOpen(false)
                    }}
                    className="text-zinc-100 hover:bg-zinc-800 aria-selected:bg-zinc-800"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2">{country.flag}</span>
                    <span className="flex-1">{country.country}</span>
                    <span className="text-zinc-500">{country.code}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

