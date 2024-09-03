import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.MULTION_API_KEY;
const orgId = process.env.NEXT_PUBLIC_MULTION_ORG_ID;

if (!apiKey || !orgId) {
  console.error("MULTION_API_KEY or MULTION_ORG_ID is not set in the environment variables");
}

export async function POST(req: NextRequest) {
  if (!apiKey) {
    console.error('API key is not configured');
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    const { userId, query, url, optional_params } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const endpoint = "https://api.multion.ai/v1/web/browse";
    const headers = {
      "X_MULTION_API_KEY": apiKey,
      "Content-Type": "application/json"
    };
    const payload = {
      url: url,
      cmd: query,
      user_id: userId,
      optional_params: optional_params || { source: "playground" }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

    console.log('Sending request to Multion API:', JSON.stringify(payload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Multion API error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Multion API response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://platform.multion.ai/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: orgId,
        client_secret: apiKey,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`HTTP error! status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    // You might want to store the access token securely here

    return NextResponse.json({ success: true, userId: tokenData.user_id });
  } catch (error) {
    console.error('Error during token exchange:', error);
    return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
  }
}