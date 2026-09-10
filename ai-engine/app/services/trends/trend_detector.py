from collections import Counter


def detect_trends(complaints: list[dict]) -> dict:
    """
    Detect the most common civic complaint categories.

    Prototype version using simple frequency analysis.
    """

    if not complaints:
        return {
            "total_complaints": 0,
            "emerging_issue": "No Data",
            "complaint_count": 0,
            "trend_percentage": 0,
            "status": "No Data"
        }

    categories = []

    for complaint in complaints:
        category = complaint.get("category", "Other")

        if category:
            categories.append(category)

    if not categories:
        return {
            "total_complaints": len(complaints),
            "emerging_issue": "Other",
            "complaint_count": 0,
            "trend_percentage": 0,
            "status": "No Data"
        }

    category_counts = Counter(categories)

    most_common_category, count = category_counts.most_common(1)[0]

    total = len(complaints)

    trend_percentage = round(
        (count / total) * 100
    )

    if trend_percentage >= 50:
        status = "Critical Trend"
    elif trend_percentage >= 30:
        status = "Emerging Issue"
    elif trend_percentage >= 15:
        status = "Moderate Trend"
    else:
        status = "Low Trend"

    return {
        "total_complaints": total,
        "emerging_issue": most_common_category,
        "complaint_count": count,
        "trend_percentage": trend_percentage,
        "status": status
    }