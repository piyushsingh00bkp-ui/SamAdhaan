def detect_trends(
    current_complaints: list[dict],
    previous_complaints: list[dict]
) -> dict:

    """
    Detect emerging civic complaint trends by comparing
    the current period with the previous period.

    Prototype version.
    """

    current_counts = {}

    previous_counts = {}

    # ---------------------------------------------
    # Count current-period complaints
    # ---------------------------------------------

    for complaint in current_complaints:

        category = complaint.get("category", "Other")

        if category:
            category = category.strip()

            current_counts[category] = (
                current_counts.get(category, 0) + 1
            )

    # ---------------------------------------------
    # Count previous-period complaints
    # ---------------------------------------------

    for complaint in previous_complaints:

        category = complaint.get("category", "Other")

        if category:
            category = category.strip()

            previous_counts[category] = (
                previous_counts.get(category, 0) + 1
            )

    # ---------------------------------------------
    # No data
    # ---------------------------------------------

    if not current_counts:

        return {
            "emerging_issue": "No Data",
            "current_count": 0,
            "previous_count": 0,
            "change_percentage": 0,
            "trend_direction": "No Data",
            "status": "No Data"
        }

    # ---------------------------------------------
    # Find category with highest growth
    # ---------------------------------------------

    best_category = None
    best_change = None

    for category, current_count in current_counts.items():

        previous_count = previous_counts.get(category, 0)

        # If this category didn't exist previously,
        # treat it as a new emerging issue.
        if previous_count == 0:

            change_percentage = 100

        else:

            change_percentage = (
                (current_count - previous_count)
                / previous_count
            ) * 100

        if best_change is None or change_percentage > best_change:

            best_category = category
            best_change = change_percentage

    # ---------------------------------------------
    # Get counts
    # ---------------------------------------------

    current_count = current_counts[best_category]

    previous_count = previous_counts.get(
        best_category,
        0
    )

    change_percentage = round(best_change, 1)

    # ---------------------------------------------
    # Determine trend direction
    # ---------------------------------------------

    if change_percentage > 0:

        trend_direction = "Rising"

    elif change_percentage < 0:

        trend_direction = "Falling"

    else:

        trend_direction = "Stable"

    # ---------------------------------------------
    # Determine status
    # ---------------------------------------------

    if change_percentage >= 50:

        status = "Critical Trend"

    elif change_percentage >= 25:

        status = "Emerging Issue"

    elif change_percentage > 0:

        status = "Moderate Trend"

    else:

        status = "No Increase"

    # ---------------------------------------------
    # Return result
    # ---------------------------------------------

    return {
        "emerging_issue": best_category,
        "current_count": current_count,
        "previous_count": previous_count,
        "change_percentage": change_percentage,
        "trend_direction": trend_direction,
        "status": status
    }