from app.knowledge.department_rules import (
    get_department_by_category,
    detect_department_from_text
)


def route_department(
    problem: str,
    category: str = "",
    ai_department: str = ""
) -> dict:
    """
    Route a civic complaint to the most appropriate
    government department.

    Routing strategy:

    1. Deterministic category rule
    2. Deterministic keyword rule
    3. AI suggestion as a secondary signal
    4. Safe fallback
    """

    problem = (problem or "").strip()
    category = (category or "").strip()
    ai_department = (ai_department or "").strip()

    # --------------------------------------------------
    # STEP 1: Category-based deterministic routing
    # --------------------------------------------------

    if category:

        category_department = get_department_by_category(
            category
        )

        if category_department != "Relevant Local Authority":

            # If AI suggested the same department,
            # confidence in the routing is higher.
            if ai_department:
                if ai_department.lower() == category_department.lower():

                    return {
                        "department": category_department,
                        "routing_method": "AI + Deterministic Verification",
                        "verified": True
                    }

            return {
                "department": category_department,
                "routing_method": "Deterministic Category Rule",
                "verified": True
            }

    # --------------------------------------------------
    # STEP 2: Keyword-based deterministic routing
    # --------------------------------------------------

    rule_department = detect_department_from_text(
        problem
    )

    if rule_department != "Relevant Local Authority":

        return {
            "department": rule_department,
            "routing_method": "Deterministic Keyword Rule",
            "verified": True
        }

    # --------------------------------------------------
    # STEP 3: AI suggestion
    # --------------------------------------------------

    if ai_department:

        return {
            "department": ai_department,
            "routing_method": "AI Suggestion",
            "verified": False
        }

    # --------------------------------------------------
    # STEP 4: Safe fallback
    # --------------------------------------------------

    return {
        "department": "Relevant Local Authority",
        "routing_method": "Fallback",
        "verified": False
    }