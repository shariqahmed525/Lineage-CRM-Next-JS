// app/api/createNote/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSupabaseClient } from "@/utils/supabase/server";

import { TablesInsert } from "@/types/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { leadId, note }: Omit<
    TablesInsert<"notes">,
    "created_at" | "created_by" | "note_id"
  > = body;
  const cookieStore = cookies();
  const supabase = createSupabaseClient(cookieStore);
  // Retrieve the user from the Supabase auth session
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { data: noteData, error: noteError } = await supabase
    .from("notes")
    .insert({
      created_by: user.user.id,
      lead_id: leadId,
      note,
    })
    .select()
    .single();

  if (noteError) {
    console.error("Error creating note:", noteError);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create note." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  console.log("Note Data:", noteData);

  // Construct activity_metadata JSON object from the created note data
  const activityMetadata = {
    note_id: noteData?.note_id,
    lead_id: noteData?.lead_id,
    note: noteData?.note,
  };

  // Insert a new activity after successful note creation
  const { error: activityError } = await supabase
    .from("activity")
    .insert({
      action_type: "Create Note",
      created_by: user.user.id,
      lead_id: leadId,
      activity_metadata: activityMetadata,
    });

  if (activityError) {
    console.error("Error creating activity:", activityError);
    // Note: Not returning an error response here to not override the successful note creation response
  }

  return new NextResponse(JSON.stringify(noteData), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
