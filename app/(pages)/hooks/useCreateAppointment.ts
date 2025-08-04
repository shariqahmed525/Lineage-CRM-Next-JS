import { useMutation, useQueryClient } from "@tanstack/react-query"

interface NewAppointmentPayload {
  title: string;
  start_date: string
  end_date: string
  note: string
  lead_id: string | null
}

const createAppointment = async (payload: NewAppointmentPayload) => {
  const response = await fetch('/api/createAppointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return response.json()
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  const mutationKey = ['create-appointment']

  return useMutation({
    mutationKey,
    mutationFn: (payload: NewAppointmentPayload) => createAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}