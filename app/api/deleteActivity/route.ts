import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSupabaseClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const activityMetadataNoteId = searchParams.get("activityId");
    const activityLeadId = searchParams.get("leadId");
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

    if (!activityMetadataNoteId) {
        return new NextResponse(
            JSON.stringify({ error: "Note ID is required" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    // Delete the note from the notes table
    const { error: noteError } = await supabase
        .from("notes")
        .delete()
        .eq("lead_id", activityLeadId);

    if (noteError) {
        console.error("Error deleting note:", noteError);
        return new NextResponse(
            JSON.stringify({ error: "Failed to delete note" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    // Delete the activity from the activity table
    const { error: activityError } = await supabase
        .from("activity")
        .delete()
        .eq("activity_metadata->>note_id", activityMetadataNoteId);

    if (activityError) {
        console.error("Error deleting activity:", activityError);
        return new NextResponse(
            JSON.stringify({ error: "Failed to delete activity" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    return new NextResponse(
        JSON.stringify({ message: "Activity and note deleted successfully" }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}
