import os
import json
import re
from typing import Optional
from app.config import settings

def get_gemini_client(custom_api_key: Optional[str] = None):
    api_key = custom_api_key or settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print("GENAI CLIENT INIT ERROR:", repr(e))
        return None

def clean_json_response(text: str) -> dict:
    clean = text.strip()
    clean = re.sub(r"^```json\s*", "", clean, flags=re.IGNORECASE)
    clean = re.sub(r"^```\s*", "", clean)
    clean = re.sub(r"\s*```$", "", clean)
    return json.loads(clean.strip())

def generate_gemini_problem_report(
    problem_id: str,
    title: str,
    category: str,
    description: str,
    ward: str = "Ward 47",
    city: str = "Pune",
    district: str = "Pune",
    custom_api_key: Optional[str] = None
) -> dict:
    client = get_gemini_client(custom_api_key)
    if not client:
        return {"success": False, "error": "GEMINI_API_KEY not configured"}

    prompt = f"""
You are an expert Chief Municipal Commissioner & Urban Infrastructure AI Policy Advisor in India.
Generate a comprehensive, highly realistic, actionable, and data-backed Municipal Executive Dossier for this SPECIFIC civic problem:

PROBLEM ID: {problem_id}
TITLE: {title}
CATEGORY: {category}
LOCATION: {ward}, {district}, {city}
DESCRIPTION: {description}

Produce an official government municipal intelligence directive in valid JSON format.
Analyze the exact problem described above (do NOT return generic placeholders).
Return ONLY raw JSON with this exact schema (no surrounding markdown, no ```json tags):

{{
  "executive_summary": "High-level 3-4 sentence official executive briefing for the District Magistrate / Municipal Commissioner specifying immediate hazard level, public safety implications, and justification for rapid intervention for {title}.",
  "root_cause_analysis": [
    "Specific engineering/geotechnical or structural root cause relating to {title}",
    "Specific environmental/seasonal or operational compounding factor",
    "Specific demographic or economic impact on local citizens/commuters"
  ],
  "departmental_directives": [
    {{
      "department": "Primary Municipal Department (e.g., Road Engineering Division / Water Supply Board / Sanitation Dept)",
      "officer": "Nodal Officer Designation (e.g., Executive Engineer)",
      "action": "Immediate tactical field directive for {title}",
      "sla_hours": "24-48 Hours",
      "priority": "CRITICAL"
    }},
    {{
      "department": "Secondary Inter-Agency Department (e.g., Traffic Police / Public Health Dept / Disaster Management Cell)",
      "officer": "Nodal Officer Designation",
      "action": "Containment or citizen safety measure",
      "sla_hours": "48-72 Hours",
      "priority": "HIGH"
    }},
    {{
      "department": "Academic Research / CSR Innovation Partner (e.g., COEP Tech Civil Dept / IIT Civic Tech Lab)",
      "officer": "Lead Academic Investigator / CSR Director",
      "action": "Long-term R&D, sensor telemetry or permanent remediation pilot",
      "sla_hours": "7-14 Days",
      "priority": "MEDIUM"
    }}
  ],
  "financial_and_csr_sanction": {{
    "recommended_budget": "Estimated budget (e.g. ₹18.50 Lakhs)",
    "csr_grant_opportunity": "CSR grant allocation eligible under Schedule VII (e.g. ₹10.00 Lakhs)",
    "ulb_emergency_fund": "Urban Local Body emergency allocation (e.g. ₹8.50 Lakhs)",
    "sroi_multiplier": "Social ROI multiplier (e.g. 4.6x Social Return on Investment)"
  }},
  "kpi_targets": {{
    "resolution_target": "e.g. 14 Days",
    "beneficiaries_protected": "e.g. 15,000+ Citizens",
    "accident_reduction_estimate": "e.g. 75%",
    "public_safety_index_improvement": "+35 Points"
  }}
}}
"""

    models_to_try = [settings.GEMINI_MODEL, "gemini-3.7-flash", "gemini-3.5-flash-lite"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                result = clean_json_response(response.text)
                return {"success": True, "data": result}
        except Exception as e:
            print(f"GEMINI REPORT GENERATION with {model_name} failed: {repr(e)}")
            continue

    return {"success": False, "error": "All Gemini models failed or timed out"}

def generate_gemini_report(
    total_problems: int,
    high_priority: int,
    projects_active: int,
    solutions_deployed: int,
    citizens_impacted: int,
    top_category: str
) -> dict:
    client = get_gemini_client()
    if not client:
        return {"success": False, "error": "GEMINI_API_KEY not configured"}

    prompt = f"""
You are an AI civic administration analyst.
Analyze the following district-level civic data:

Total Problems: {total_problems}
High Priority Problems: {high_priority}
Active Projects: {projects_active}
Solutions Deployed: {solutions_deployed}
Estimated Citizens Impacted: {citizens_impacted}
Top Category: {top_category}

Generate a concise government-style district innovation analysis.
Return ONLY valid JSON in exactly this structure:
{{
    "executive_summary": "string",
    "key_findings": [
        "finding 1",
        "finding 2",
        "finding 3",
        "finding 4"
    ],
    "critical_areas": [
        "area 1",
        "area 2"
    ],
    "recommendations": [
        "recommendation 1",
        "recommendation 2",
        "recommendation 3",
        "recommendation 4"
    ]
}}
"""
    models_to_try = [settings.GEMINI_MODEL, "gemini-3.7-flash", "gemini-3.5-flash-lite"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                result = clean_json_response(response.text)
                return {"success": True, "data": result}
        except Exception as e:
            print(f"GEMINI DISTRICT REPORT with {model_name} failed: {repr(e)}")
            continue

    return {"success": False, "error": "Gemini report generation failed"}