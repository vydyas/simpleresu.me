import { NextResponse } from "next/server";

/**
 * @openapi
 * /linkedin/getAccessToken:
 *   post:
 *     summary: Exchange LinkedIn authorization code for access token
 *     description: Exchanges the authorization code received from LinkedIn OAuth callback for an access token. Does not require Clerk authentication.
 *     tags: [LinkedIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from LinkedIn OAuth callback
 *                 example: AQT...abc123
 *     responses:
 *       200:
 *         description: Access token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: LinkedIn access token
 *                   example: AQV...xyz789
 *                 expires_in:
 *                   type: integer
 *                   description: Token expiration time in seconds
 *                   example: 5184000
 *       500:
 *         description: Internal server error or LinkedIn API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/linkedin-callback`;

    if (!clientId || !clientSecret) {
      throw new Error("LinkedIn client ID or secret is missing");
    }

    const response = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn API error:", errorText);
      throw new Error(
        `LinkedIn API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in getAccessToken:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
