import { useMutation, useQueryClient } from "@tanstack/react-query"

const execSatMigration = async () => {
  const response = await fetch('/api/satMigration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

  return response.json()
}

export const useSatMigration = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['sat-migration'],
    mutationFn: () => execSatMigration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sat-migration'] })
    },
  })

}