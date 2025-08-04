import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseClient = (request: NextRequest) => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

// Create a new supabase server client on server with cookies
export const createClient = () => {
  `use server`;
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  return supabase;
};

// Check to see if the user is logged in return a boolean response
export const isUserLoggedIn = async () => {
  `use server`;
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? true : false;
};

/**
 * Get the user from the supabase client if they are authenticated. Below is an example response
 *
 *
 {
  id: '743a25db-99aa-4bfd-a39d-25e198ba9d9d',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'kpatt1011@gmail.com',
  email_confirmed_at: '2023-12-04T22:09:39.926069Z',
  phone: '',
  confirmation_sent_at: '2023-12-04T22:09:24.704232Z',
  confirmed_at: '2023-12-04T22:09:39.926069Z',
  last_sign_in_at: '2023-12-04T22:09:52.060901Z',
  app_metadata: { provider: 'email', providers: [ 'email' ] },
  user_metadata: {},
  identities: [
    {
      id: '743a25db-99aa-4bfd-a39d-25e198ba9d9d',
      user_id: '743a25db-99aa-4bfd-a39d-25e198ba9d9d',
      identity_data: [Object],
      provider: 'email',
      last_sign_in_at: '2023-12-04T22:09:24.699881Z',
      created_at: '2023-12-04T22:09:24.699922Z',
      updated_at: '2023-12-04T22:09:24.699922Z'
    }
  ],
  created_at: '2023-12-04T22:09:24.688547Z',
  updated_at: '2023-12-04T23:47:51.244779Z'
}
 * @returns
 */
export const getUser = async () => {
  `use server`;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Signout the current user if they exist
export const signOut = async () => {
  `use server`;
  const supabase = createClient();
  await supabase.auth.signOut();
};

/**
 * Fetches all rows from a Supabase table.
 *
 * @param {string} tableName - The name of the table to query.
 * @returns {Promise<Array<object>>} - A promise that resolves to the array of rows.
 */

export const getTable = async (tableName: string) => {
  `use server`;
  const supabase = createClient();

  const { data, error } = await supabase.from(tableName).select();
  if (error) {
    throw error;
  }
  return data;
};

/**
 * Fetches rows from a Supabase table where a specific column matches a given value.
 *
 * @param {string} tableName - The name of the table to query.
 * @param {string} columnName - The name of the column to match.
 * @param {any} columnValue - The value to match in the specified column.
 * @returns {Promise<Array<object>>} - A promise that resolves to the array of matching rows.
 */
export const getTableByColumnValue = async (
  tableName: string,
  columnName: string,
  columnValue: any,
) => {
  `use server`;
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tableName)
    .select()
    .eq(columnName, columnValue);

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Fetches a row from a Supabase table where a specific column matches a given value.
 *
 * @param {string} tableName - The name of the table to query.
 * @param {string} columnName - The name of the column to match.
 * @param {any} columnValue - The value to match in the specified column.
 * @returns {Promise<object>} - A promise that resolves to the matching row.
 */
export const addRowToTable = async (row: object, tableName: string) => {
  `use server`;
  const supabase = createClient();

  const { data, error } = await supabase.from(tableName).insert({ ...row });
  if (error) {
    throw error;
  }
  return data;
};

/*
  Upsert a row to a table. If the row already exists, update it. Otherwise, insert it.
*/
export const upsertRowToTable = async (row: object, tableName: string) => {
  `use server`;
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).upsert({ ...row })
    .select();
  if (error) {
    throw error;
  }
  return data;
};
