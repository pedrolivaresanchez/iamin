'use client'

import { updateAttendeePaymentStatus, deleteAttendee, updateAttendee } from '@/app/actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Attendee = {
  id: string
  full_name: string
  phone: string
  status: string
  payment_confirmed: boolean
  registered_at: string
}

function formatDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, year, month, day] = match
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return dateString
}

export default function AttendeeTable({ attendees, eventId }: { attendees: Attendee[]; eventId: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800/50">
            <TableHead className="text-zinc-400 font-medium">Attendee</TableHead>
            <TableHead className="text-zinc-400 font-medium">Registered</TableHead>
            <TableHead className="text-zinc-400 font-medium">Status</TableHead>
            <TableHead className="text-zinc-400 font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((attendee) => (
            <AttendeeRow key={attendee.id} attendee={attendee} eventId={eventId} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AttendeeRow({ attendee, eventId }: { attendee: Attendee; eventId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Edit form state
  const [editName, setEditName] = useState(attendee.full_name)
  const [editPhone, setEditPhone] = useState(attendee.phone)

  const handleToggle = () => {
    startTransition(async () => {
      await updateAttendeePaymentStatus(attendee.id, !attendee.payment_confirmed)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const result = await deleteAttendee(attendee.id, eventId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Attendee removed')
        router.refresh()
      }
      setDeleteDialogOpen(false)
    })
  }

  const handleEdit = () => {
    startUpdateTransition(async () => {
      const result = await updateAttendee(attendee.id, {
        full_name: editName,
        phone: editPhone,
      }, eventId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Attendee updated')
        router.refresh()
        setEditDialogOpen(false)
      }
    })
  }

  const openEditDialog = () => {
    setEditName(attendee.full_name)
    setEditPhone(attendee.phone)
    setEditDialogOpen(true)
  }

  return (
    <>
      <TableRow className={`border-zinc-800/50 ${isPending || isDeleting || isUpdating ? 'opacity-50' : ''}`}>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-zinc-100">{attendee.full_name}</span>
            <a 
              href={`tel:${attendee.phone}`}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {attendee.phone}
            </a>
          </div>
        </TableCell>
        <TableCell>
          <span className="text-zinc-400 text-sm">
            {attendee.registered_at ? formatDate(attendee.registered_at) : '-'}
          </span>
        </TableCell>
        <TableCell>
          {attendee.payment_confirmed ? (
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10">
              ✓ Paid
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-500/10 text-red-400 border border-red-500/20">
              ✗ Not Paid
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={handleToggle}
              disabled={isPending || isDeleting || isUpdating}
              size="sm"
              className={
                attendee.payment_confirmed
                  ? 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 border-0'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 border-0'
              }
            >
              {isPending ? (
                <Spinner className="h-4 w-4" />
              ) : attendee.payment_confirmed ? (
                'Undo'
              ) : (
                '💰 Mark Paid'
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                <DropdownMenuItem 
                  onClick={openEditDialog}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-400 focus:bg-red-950/50 focus:text-red-300 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Edit Attendee</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update the attendee&apos;s information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-zinc-400">Full Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-zinc-400">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isUpdating}
              className="bg-zinc-100 text-zinc-900 hover:bg-white"
            >
              {isUpdating ? <Spinner className="mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Remove Attendee</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to remove <span className="font-medium text-zinc-300">{attendee.full_name}</span> from the guest list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {isDeleting ? <Spinner className="mr-2" /> : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
