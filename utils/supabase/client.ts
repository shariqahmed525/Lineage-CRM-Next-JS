import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Get User from the browser client
export const getUser = async () => {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  return user
}
