'use client'

import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartConfig = {
  paid: {
    label: 'Paid',
    color: '#10b981',
  },
  unpaid: {
    label: 'Unpaid',
    color: '#f59e0b',
  },
} satisfies ChartConfig

export default function PaymentChart({ 
  paidCount, 
  unpaidCount 
}: { 
  paidCount: number
  unpaidCount: number
}) {
  const data = [
    { name: 'paid', value: paidCount, fill: '#10b981' },
    { name: 'unpaid', value: unpaidCount, fill: '#ef4444' },
  ]

  const total = paidCount + unpaidCount

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-zinc-500">
        No attendees yet
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-0.5em" className="fill-zinc-100 text-2xl font-bold">
            {total}
          </tspan>
          <tspan x="50%" dy="1.5em" className="fill-zinc-500 text-sm">
            Total
          </tspan>
        </text>
      </PieChart>
    </ChartContainer>
  )
}

