# Department routing knowledge base for SamAdhaan.
#
# The AI may suggest a department, but these deterministic
# rules provide a reliable fallback and verification layer.


DEPARTMENT_RULES = {
    "Water & Sanitation": {
        "keywords": [
            "water",
            "drinking water",
            "water supply",
            "water leakage",
            "pipeline",
            "tap",
            "drainage",
            "drain",
            "sewage",
            "sewer",
            "toilet",
            "sanitation",
            "flooding",
            "waterlogging",
        ],
        "department": "Drinking Water & Sanitation Department",
    },

    "Roads & Transport": {
        "keywords": [
            "road",
            "pothole",
            "street",
            "highway",
            "bridge",
            "traffic",
            "footpath",
            "sidewalk",
            "road damage",
            "road collapse",
        ],
        "department": "Public Works Department",
    },

    "Agriculture": {
        "keywords": [
            "agriculture",
            "farmer",
            "farming",
            "crop",
            "irrigation",
            "fertilizer",
            "pesticide",
            "harvest",
            "field",
            "livestock",
        ],
        "department": "Agriculture Department",
    },

    "Education": {
        "keywords": [
            "school",
            "college",
            "university",
            "teacher",
            "student",
            "education",
            "classroom",
            "exam",
            "scholarship",
            "laboratory",
        ],
        "department": "Education Department",
    },

    "Healthcare": {
        "keywords": [
            "hospital",
            "doctor",
            "health",
            "healthcare",
            "medicine",
            "medical",
            "clinic",
            "ambulance",
            "patient",
            "pharmacy",
        ],
        "department": "Health Department",
    },

    "Waste Management": {
        "keywords": [
            "garbage",
            "waste",
            "trash",
            "litter",
            "dump",
            "dustbin",
            "rubbish",
            "solid waste",
            "waste collection",
        ],
        "department": "Municipal Waste Management Department",
    },

    "Electricity": {
        "keywords": [
            "electricity",
            "power",
            "electric",
            "transformer",
            "wire",
            "pole",
            "power cut",
            "blackout",
            "voltage",
            "street light",
        ],
        "department": "Electricity Department / DISCOM",
    },

    "Public Safety": {
        "keywords": [
            "crime",
            "theft",
            "police",
            "accident",
            "unsafe",
            "violence",
            "security",
            "danger",
            "street safety",
            "emergency",
        ],
        "department": "Police / Public Safety Department",
    },

    "Environment": {
        "keywords": [
            "pollution",
            "air pollution",
            "noise pollution",
            "water pollution",
            "forest",
            "tree",
            "environment",
            "smoke",
            "industrial pollution",
        ],
        "department": "Environment Department",
    },

    "Other": {
        "keywords": [],
        "department": "Relevant Local Authority",
    },
}


def get_department_by_category(category: str) -> str:
    """
    Return the default department for a known category.
    """

    if not category:
        return DEPARTMENT_RULES["Other"]["department"]

    category = category.strip()

    for rule_category, data in DEPARTMENT_RULES.items():
        if rule_category.lower() == category.lower():
            return data["department"]

    return DEPARTMENT_RULES["Other"]["department"]


def detect_department_from_text(text: str) -> str:
    """
    Determine a department directly from problem text
    using deterministic keyword matching.
    """

    if not text:
        return DEPARTMENT_RULES["Other"]["department"]

    text = text.lower()

    scores = {}

    for category, data in DEPARTMENT_RULES.items():

        if category == "Other":
            continue

        score = 0

        for keyword in data["keywords"]:
            if keyword.lower() in text:
                score += 1

        if score > 0:
            scores[category] = score

    if not scores:
        return DEPARTMENT_RULES["Other"]["department"]

    best_category = max(
        scores,
        key=scores.get
    )

    return DEPARTMENT_RULES[best_category]["department"]