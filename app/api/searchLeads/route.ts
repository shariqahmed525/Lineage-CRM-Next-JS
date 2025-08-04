// app/api/searchLeads/route.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createSupabaseClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const supabase = createSupabaseClient(cookieStore);
    const body = await request.json();
    let searchTerm = body.q || ''; // Get the search term from body

    // If the search term is empty, return all the leads
    if (searchTerm.trim().length <= 1) {
        const { data, error } = await supabase
            .from('leads')
            .select('*');

        if (error) {
            console.error('Error fetching all leads:', error);
            return new NextResponse(JSON.stringify({ error: 'Failed to fetch all leads.' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Modify the search term for fuzzy search using prefix matching
    searchTerm = searchTerm.split(' ')?.map((word: string) => `${word}:*`).join(' & ');

    // Perform the full text search using the searchable_text column
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .textSearch('searchable_text', searchTerm);

    if (error) {
        console.error('Error searching leads:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to search leads.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
