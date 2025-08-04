import { useQuery } from '@tanstack/react-query'

export const useAppointments = (q: string | undefined) => {
  return useQuery<Appointment[], Error>({ 
    queryKey: ['appointments', q ? new Date(q).toLocaleDateString() : undefined], 
    queryFn: async () => {
      const res = await fetch(`/api/getAppointments?q=${q}`)
      const { data } = await res.json()
      return data
    },
    enabled: !!q,
  })
}