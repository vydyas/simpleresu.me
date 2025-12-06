import { NextResponse } from "next/server";

interface LinkedInProfileData {
  firstName?: { localized?: { en_US?: string } };
  lastName?: { localized?: { en_US?: string } };
  headline?: { localized?: { en_US?: string } };
  profilePicture?: {
    "displayImage~"?: {
      elements?: Array<{
        identifiers?: Array<{ identifier?: string }>;
      }>;
    };
  };
}

interface LinkedInPosition {
  title?: { localized?: { en_US?: string } };
  company?: { localized?: { en_US?: string } };
  startDate?: { year: number; month: number };
  endDate?: { year: number; month: number };
  description?: { localized?: { en_US?: string } };
}

interface LinkedInEducation {
  schoolName?: { localized?: { en_US?: string } };
  degree?: { localized?: { en_US?: string } };
  fieldOfStudy?: { localized?: { en_US?: string } };
  startDate?: { year: number };
  endDate?: { year: number };
}

interface LinkedInSkill {
  name?: { localized?: { en_US?: string } };
}

/**
 * @openapi
 * /linkedin/getProfile:
 *   post:
 *     summary: Fetch LinkedIn profile data
 *     description: Retrieves user's LinkedIn profile including personal info, work experience, education, and skills using the access token. Does not require Clerk authentication.
 *     tags: [LinkedIn]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - access_token
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: LinkedIn access token obtained from /api/linkedin/getAccessToken
 *                 example: AQV...xyz789
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LinkedInProfile'
 *       500:
 *         description: Internal server error or LinkedIn API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      throw new Error("Access token is missing");
    }

    const profileResponse = await fetch(
      "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline)",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("LinkedIn API error (profile):", errorText);
      throw new Error(
        `LinkedIn API error: ${profileResponse.status} ${profileResponse.statusText}`
      );
    }

    const profileData: LinkedInProfileData = await profileResponse.json();

    const emailResponse = await fetch(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("LinkedIn API error (email):", errorText);
      throw new Error(
        `LinkedIn API error: ${emailResponse.status} ${emailResponse.statusText}`
      );
    }

    const emailData = await emailResponse.json();

    const skillsResponse = await fetch(
      "https://api.linkedin.com/v2/skills?projection=(elements*(name))",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!skillsResponse.ok) {
      const errorText = await skillsResponse.text();
      console.error("LinkedIn API error (skills):", errorText);
      throw new Error(
        `LinkedIn API error: ${skillsResponse.status} ${skillsResponse.statusText}`
      );
    }

    const skillsData: { elements?: LinkedInSkill[] } =
      await skillsResponse.json();

    const positionsResponse = await fetch(
      "https://api.linkedin.com/v2/positions?projection=(elements*(title,company,startDate,endDate,description))",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!positionsResponse.ok) {
      const errorText = await positionsResponse.text();
      console.error("LinkedIn API error (positions):", errorText);
      throw new Error(
        `LinkedIn API error: ${positionsResponse.status} ${positionsResponse.statusText}`
      );
    }

    const positionsData: { elements?: LinkedInPosition[] } =
      await positionsResponse.json();

    const educationsResponse = await fetch(
      "https://api.linkedin.com/v2/educations?projection=(elements*(schoolName,degree,fieldOfStudy,startDate,endDate))",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    if (!educationsResponse.ok) {
      const errorText = await educationsResponse.text();
      console.error("LinkedIn API error (educations):", errorText);
      throw new Error(
        `LinkedIn API error: ${educationsResponse.status} ${educationsResponse.statusText}`
      );
    }

    const educationsData: { elements?: LinkedInEducation[] } =
      await educationsResponse.json();

    const userData = {
      firstName: profileData.firstName?.localized?.en_US || "",
      lastName: profileData.lastName?.localized?.en_US || "",
      email: emailData.elements?.[0]?.["handle~"]?.emailAddress || "",
      headline: profileData.headline?.localized?.en_US || "",
      profilePicture:
        profileData.profilePicture?.["displayImage~"]?.elements?.[0]
          ?.identifiers?.[0]?.identifier || "",
      summary: "", // LinkedIn API doesn't provide summary in basic profile
      positions:
        positionsData.elements?.map((position: LinkedInPosition) => ({
          title: position.title?.localized?.en_US || "",
          company: position.company?.localized?.en_US || "",
          startDate: position.startDate
            ? `${position.startDate.year}-${position.startDate.month}`
            : "",
          endDate: position.endDate
            ? `${position.endDate.year}-${position.endDate.month}`
            : "Present",
          description: position.description?.localized?.en_US || "",
        })) || [],
      educations:
        educationsData.elements?.map((education: LinkedInEducation) => ({
          schoolName: education.schoolName?.localized?.en_US || "",
          degree: education.degree?.localized?.en_US || "",
          fieldOfStudy: education.fieldOfStudy?.localized?.en_US || "",
          startDate: education.startDate ? `${education.startDate.year}` : "",
          endDate: education.endDate ? `${education.endDate.year}` : "Present",
        })) || [],
      skills:
        skillsData.elements?.map((skill: LinkedInSkill) => ({
          name: skill.name?.localized?.en_US || "",
        })) || [],
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in getProfile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
