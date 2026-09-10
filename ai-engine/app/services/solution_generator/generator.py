import json
from datetime import datetime
from google import genai
from app.config import settings
from app.schemas.solution import SolutionRequest, SolutionResponse, SolutionItem

def generate_solutions(problem: str, category: str = "Infrastructure", location: str = "Pune, Maharashtra", gemini_api_key: str = None) -> SolutionResponse:
    prompt = f"""
You are an expert GovTech & Civic Engineering Consultant for the SamAdhaan civic problem platform.
A citizen or municipal officer has reported the following civic challenge:

PROBLEM DESCRIPTION: {problem}
CATEGORY: {category}
LOCATION: {location}

Generate 3 realistic, high-impact, and technically sound solution options:
1. "Rapid Triage & Stabilization" (Deployable in 24-72 hours with quick-fix municipal engineering)
2. "Long-term Sustainable Infrastructure" (Engineered solution with university R&D or CSR sponsorship)
3. "Smart Citizen-Driven / IoT Technology Intervention" (Low-cost sensor, modular bio-filtration, or community reporting)

Return strict JSON matching this structure:
{{
  "solutions": [
    {{
      "title": "Solution Title",
      "description": "Comprehensive implementation details",
      "approach_type": "Rapid Triage / Sustainable R&D / Smart IoT",
      "estimated_cost": "₹X,XX,XXX",
      "timeline": "X-Y Days / Weeks",
      "feasibility_score": 88,
      "key_steps": ["Step 1", "Step 2", "Step 3"],
      "required_stakeholders": ["Municipal Ward Dept", "COEP Tech Lab", "CSR Fund"]
    }}
  ]
}}
"""
    key = gemini_api_key or settings.GEMINI_API_KEY
    if key:
        models = [settings.GEMINI_MODEL, "gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash"]
        try:
            client = genai.Client(api_key=key)
            for m in models:
                try:
                    res = client.models.generate_content(
                        model=m,
                        contents=prompt,
                        config={"response_mime_type": "application/json", "temperature": 0.2}
                    )
                    if res.text:
                        clean = res.text.strip()
                        if clean.startswith('```json'): clean = clean[7:]
                        if clean.startswith('```'): clean = clean[3:]
                        if clean.endswith('```'): clean = clean[:-3]
                        d = json.loads(clean.strip())
                        items = [SolutionItem(**s) for s in d.get("solutions", [])]
                        if items:
                            return SolutionResponse(
                                problem=problem,
                                category=category,
                                solutions=items,
                                generated_at=datetime.utcnow().isoformat()
                            )
                except Exception:
                    continue
        except Exception:
            pass

    # Heuristic Fallback Solutions
    text = problem.lower()
    if "water" in text or "drain" in text or "pipe" in text or "sewage" in text or "flood" in text:
        sols = [
            SolutionItem(
                title="Emergency Desilting & High-Capacity Suction Bypass",
                description="Deploy mobile municipal vacuum trucks to evacuate clogged stormwater catchments and install high-volume temporary submersible pumps.",
                approach_type="Rapid Triage",
                estimated_cost="₹1,20,000",
                timeline="24-48 Hours",
                feasibility_score=94,
                key_steps=[
                    "Deploy suction jetting machines to clear upstream debris chokes",
                    "Install temporary sandbag barrier bunds to prevent carriageway flooding",
                    "Conduct dye-tracer inspection to locate subterranean pipe fractures"
                ],
                required_stakeholders=["Municipal Drainage Division", "Disaster Response Cell"]
            ),
            SolutionItem(
                title="Geopolymer Reinforced Pre-cast Culvert Overlay",
                description="Replace deteriorated concrete pipes with high-density polyethylene (HDPE) corrugated double-wall storm conduits with 25-year service life.",
                approach_type="Sustainable Infrastructure",
                estimated_cost="₹8,50,000",
                timeline="14-21 Days",
                feasibility_score=89,
                key_steps=[
                    "Excavate trench with geotextile base stabilization",
                    "Lay twin 900mm reinforced NP3 pipeline segments",
                    "Backfill with aggregate and reinstate bituminous topcoat"
                ],
                required_stakeholders=["COEP Civil Engineering Lab", "Public Works Dept", "CSR Partner"]
            ),
            SolutionItem(
                title="Ultrasonic Water Level IoT Telemetry Network",
                description="Install solar-powered ultrasonic telemetry nodes at 5 critical manholes to send real-time SMS flood alerts to ward engineers before overflow occurs.",
                approach_type="Smart IoT Intervention",
                estimated_cost="₹2,80,000",
                timeline="7 Days",
                feasibility_score=92,
                key_steps=[
                    "Mount IP68 waterproof sensor modules under manhole covers",
                    "Integrate telemetry feed into SamAdhaan Municipal Command Dashboard",
                    "Set automated SMS escalation triggers when water reaches 80% capacity"
                ],
                required_stakeholders=["Academic IoT Hub", "Smart City Operations Centre"]
            )
        ]
    elif "road" in text or "pothole" in text or "asphalt" in text or "traffic" in text:
        sols = [
            SolutionItem(
                title="Rapid Cold-Mix Polymer Bituminous Patching",
                description="Apply all-weather cold polymer asphalt emulsion to immediately restore carriageway smoothness without requiring heavy road roller machinery.",
                approach_type="Rapid Triage",
                estimated_cost="₹85,000",
                timeline="12-24 Hours",
                feasibility_score=96,
                key_steps=[
                    "Clean debris and moisture from cavity using compressed air lance",
                    "Tack coat application and polymer cold-mix compaction",
                    "Immediate opening to vehicular traffic with zero curing downtime"
                ],
                required_stakeholders=["Ward Road Maintenance Squad", "Traffic Police"]
            ),
            SolutionItem(
                title="Waste-Plastic Modified Bitumen Resurfacing",
                description="Milling and overlay of 500-meter corridor using shredded post-consumer plastic waste blend (8% bitumen replacement) for 3x water resistance.",
                approach_type="Sustainable Infrastructure",
                estimated_cost="₹6,20,000",
                timeline="10-14 Days",
                feasibility_score=91,
                key_steps=[
                    "Source segregated plastic waste through local recycling aggregators",
                    "Hot-mix plant formulation with 60/70 grade bitumen",
                    "Paver compaction with thermal gradient monitoring"
                ],
                required_stakeholders=["IIT Bombay Civil Engineering", "CSR Green Fund", "Municipal Roads Dept"]
            ),
            SolutionItem(
                title="Computer Vision Crowdsourced Pothole Mapping",
                description="Deploy dashcam-based computer vision defect detection on public city buses to continuously survey asphalt health across all transit corridors.",
                approach_type="Smart IoT Intervention",
                estimated_cost="₹1,50,000",
                timeline="5 Days",
                feasibility_score=93,
                key_steps=[
                    "Mount AI edge camera units on 10 municipal transit buses",
                    "Automate GPS bounding-box defect classification",
                    "Feed dynamic work-order queue to road engineers"
                ],
                required_stakeholders=["GovTech Innovation Cell", "Public Transit Authority"]
            )
        ]
    else:
        sols = [
            SolutionItem(
                title="Immediate Municipal Taskforce Intervention",
                description="Dispatch a multidisciplinary quick-response crew with necessary equipment to remediate primary hazards within 48 hours.",
                approach_type="Rapid Triage",
                estimated_cost="₹95,000",
                timeline="48 Hours",
                feasibility_score=95,
                key_steps=["Field inspection", "Site perimeter stabilization", "Civic resolution"],
                required_stakeholders=["Municipal Ward Cell"]
            ),
            SolutionItem(
                title="University-Supported Sustainable Upgradation",
                description="Partner with university faculty researchers to conduct root-cause diagnosis and execute resilient long-term infrastructure upgrades.",
                approach_type="Sustainable Infrastructure",
                estimated_cost="₹4,50,000",
                timeline="14 Days",
                feasibility_score=88,
                key_steps=["Structural analysis", "Procurement of durable materials", "Commissioning"],
                required_stakeholders=["Engineering Faculty", "CSR Foundation", "Municipal Authority"]
            ),
            SolutionItem(
                title="Smart Sensor & Community Monitoring Pilot",
                description="Deploy digital monitoring nodes and community reporting checkpoints to ensure zero recurrence of the issue.",
                approach_type="Smart IoT Intervention",
                estimated_cost="₹1,75,000",
                timeline="7 Days",
                feasibility_score=92,
                key_steps=["Hardware deployment", "Dashboard integration", "Citizen alert setup"],
                required_stakeholders=["Smart City Operations", "Resident Welfare Association"]
            )
        ]

    return SolutionResponse(
        problem=problem,
        category=category,
        solutions=sols,
        generated_at=datetime.utcnow().isoformat()
    )
