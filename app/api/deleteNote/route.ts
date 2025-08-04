import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createSupabaseClient } from "@/utils/supabase/server";

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");
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

    if (!leadId) {
        return new NextResponse(
            JSON.stringify({ error: "Lead ID is required" }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    // Find the note_id matching the lead_id
    const { data: note, error: noteError } = await supabase
        .from("notes")
        .select("note_id")
        .eq("lead_id", leadId)
        .single();

    if (noteError || !note) {
        console.error("Error finding note:", noteError);
        return new NextResponse(
            JSON.stringify({ error: "Failed to find note" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    // Delete the note
    const { error: deleteError } = await supabase
        .from("notes")
        .delete()
        .eq("note_id", note.note_id);

    if (deleteError) {
        console.error("Error deleting note:", deleteError);
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

    return new NextResponse(
        JSON.stringify({ message: "Note deleted successfully" }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}
