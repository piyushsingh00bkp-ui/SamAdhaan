from google import genai
import os
import json


def analyze_voice_problem(translated_text: str) -> dict:
    """
    Analyze an English-translated civic complaint using Gemini.

    Input:
        translated_text: English version of the citizen's complaint

    Output:
        problem
        category
        severity
        department
    """

    if not translated_text or not translated_text.strip():
        return {
            "problem": "",
            "category": "Other",
            "severity": 0,
            "department": ""
        }

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured"
        )

    client = genai.Client(api_key=api_key)

    prompt = f"""
You are SamAdhaan AI, an intelligent civic complaint analysis system.

Analyze this citizen complaint:

"{translated_text}"

Your task is to identify:

1. problem
   Give a short and specific description of the civic problem.

2. category
   Select ONE category from:
   - Water & Sanitation
   - Roads & Transport
   - Waste Management
   - Electricity
   - Public Safety
   - Environment
   - Healthcare
   - Education
   - Other

3. severity
   Give an integer from 0 to 100.

   0-20   = Very Low
   21-40  = Low
   41-60  = Moderate
   61-80  = High
   81-100 = Critical

   Consider:
   - danger to people
   - health risks
   - property damage
   - duration
   - number of people affected
   - urgency

4. department
   Identify the most appropriate authority that should handle the complaint.

Examples:
- Road problems → Municipal Corporation / PWD
- Garbage → Municipal Corporation / Waste Management Department
- Water supply → Water & Sanitation Department
- Electricity → Electricity Department / DISCOM
- Street safety → Police / Public Safety Department
- Drainage → Municipal Corporation / Water & Sanitation Department
- School problems → Education Department
- Hospital problems → Health Department

Return ONLY valid JSON.

Required format:

{{
    "problem": "short problem description",
    "category": "category",
    "severity": 0,
    "department": "responsible department"
}}
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        response_text = response.text.strip()

        print("GEMINI RAW RESPONSE:")
        print(response_text)

        # Remove markdown code fences if Gemini returns them
        if response_text.startswith("```"):

            response_text = response_text.replace(
                "```json",
                ""
            )

            response_text = response_text.replace(
                "```",
                ""
            )

            response_text = response_text.strip()

        result = json.loads(response_text)

        severity = int(
            result.get("severity", 0)
        )

        # Keep severity safely between 0 and 100
        severity = max(
            0,
            min(100, severity)
        )

        return {
            "problem": str(
                result.get("problem", "")
            ),

            "category": str(
                result.get("category", "Other")
            ),

            "severity": severity,

            "department": str(
                result.get("department", "")
            )
        }

    except Exception as e:

        print(
            "VOICE ANALYZER ERROR:",
            repr(e)
        )

        raise RuntimeError(
            f"Voice problem analysis failed: {str(e)}"
        )