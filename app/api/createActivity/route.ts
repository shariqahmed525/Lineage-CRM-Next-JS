import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { createSupabaseClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { leadId, actionType, activityMetadata } = body;
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

  const { error: activityError } = await supabase
    .from("activity")
    .insert({
      action_type: actionType,
      created_by: user.user.id,
      lead_id: leadId,
      activity_metadata: activityMetadata,
    });

  if (activityError) {
    console.error("Error creating activity:", activityError);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create activity" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  return new NextResponse(
    JSON.stringify({ message: "Activity created successfully" }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
