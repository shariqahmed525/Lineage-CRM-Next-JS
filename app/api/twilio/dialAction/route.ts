import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Josh Lyman')
    // Your code here
    let body = '';
    const reader = request.body?.getReader();
    if (reader) {
      let result = await reader.read();
      while (!result.done) {
        body += new TextDecoder("utf-8").decode(result.value);
        result = await reader.read();
      }
    }
    console.log('Body:', body);

    const params = new URLSearchParams(body);
    console.log('Search Params:', params);

    return new NextResponse(`<Response><Message>Request processed.</Message></Response>`, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new NextResponse(`<Response><Message>Error: Failed to process request.</Message></Response>`, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}
