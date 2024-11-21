"use client"

import { useToast } from "@/components/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"

export function Toast({ title, description, action }) {
  const { toast } = useToast()
  toast({
    title,
    description,
    action,
  });
}