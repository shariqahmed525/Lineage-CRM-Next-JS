import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies.getAll();
    console.log('Jeb Bartlett', cookies);
    let body = '';
    const reader = request.body?.getReader();
    if (reader) {
      let result = await reader.read();
      while (!result.done) {
        body += new TextDecoder("utf-8").decode(result.value);
        result = await reader.read();
      }
    }


    // Log the request search params which is how we pass custom data through the request
    const params = new URLSearchParams(body);
    const toCaller = params.get('toCaller');
    const fromCaller = params.get('fromCaller');
    const recordCall = params.get('recordCall');
    console.log(`toCaller: ${toCaller}`);
    console.log(`fromCaller: ${fromCaller}`);
    console.log(`recordCall: ${recordCall}`);


    const VoiceResponse = twilio.twiml.VoiceResponse;
    console.log('Sam')
    const twiml = new VoiceResponse();

    let recordObject = {}
    if (recordCall === 'true') {
      console.log('This call is going to be recorded!')
      recordObject = {
        record: 'record-from-answer',
        recordingStatusCallback: process.env.TWILIO_RECORDING_STATUS_CALLBACK_URL || '',
        recordingStatusCallbackMethod: 'POST',
        recordingStatusCallbackEvent: ['completed'],
        trim: 'trim-silence',
        recordingTrack: 'outbound',
      }
    }


    twiml.dial({
        ...recordObject,
        answerOnBridge: true,
        callerId: fromCaller || '',
        // Commenting out the action bexause I think it is making the call run twice
        // action: process.env.TWILIO_DIAL_ACTION_URL || '',
      },
      toCaller || ''
    );

    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml', 
      },
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to process request.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
