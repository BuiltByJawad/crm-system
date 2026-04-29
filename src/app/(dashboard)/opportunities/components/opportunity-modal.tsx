"use client"

import * as React from "react"
import { opportunitiesApi, Opportunity } from "@/lib/api/opportunities"
import { contactsApi, Contact } from "@/lib/api/contacts"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface OpportunityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity?: Opportunity | null
  initialStage?: Opportunity["stage"]
  onSuccess: () => void
}

export function OpportunityModal({
  open,
  onOpenChange,
  opportunity,
  initialStage,
  onSuccess,
}: OpportunityModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const isEditing = !!opportunity

  React.useEffect(() => {
    if (open) {
      loadContacts()
    }
  }, [open])

  const loadContacts = async () => {
    try {
      const response = await contactsApi.getContacts()
      if (response.success && response.data) {
        setContacts(response.data)
      }
    } catch (error) {
      console.error("Failed to load contacts:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const contactId = formData.get("contactId") as string
    const selectedContact = contacts.find(c => c.id === contactId)

    const data = {
      title: formData.get("title") as string,
      value: Number(formData.get("value")),
      stage: (formData.get("stage") as Opportunity["stage"]) || "PROSPECT",
      contactId: contactId,
      contact: selectedContact ? {
        id: selectedContact.id,
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        company: selectedContact.company || ""
      } : undefined
    }

    try {
      if (isEditing && opportunity) {
        await opportunitiesApi.updateOpportunity(opportunity.id, data as any)
        toast.success("Opportunity updated successfully")
      } else {
        await opportunitiesApi.createOpportunity(data as any)
        toast.success("Opportunity created successfully")
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEditing ? "Failed to update opportunity" : "Failed to create opportunity")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Opportunity" : "New Opportunity"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the opportunity details below."
                : "Enter the details for the new sales deal."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={opportunity?.title}
                placeholder="Enterprise License"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  defaultValue={opportunity?.value}
                  placeholder="50000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <select
                  id="stage"
                  name="stage"
                  defaultValue={opportunity?.stage || initialStage || "PROSPECT"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PROSPECT">Prospect</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactId">Related Contact</Label>
              <select
                id="contactId"
                name="contactId"
                defaultValue={opportunity?.contact.id}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a contact</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName} ({contact.company})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Deal" : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
