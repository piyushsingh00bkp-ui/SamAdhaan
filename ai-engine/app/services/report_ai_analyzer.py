def analyze_report_data(
    total_problems: int,
    high_priority: int,
    projects_active: int,
    solutions_deployed: int,
    citizens_impacted: int,
    top_category: str
) -> dict:

    if total_problems > 500000:
        problem_status = "Extremely High"
    elif total_problems > 100000:
        problem_status = "Very High"
    elif total_problems > 50000:
        problem_status = "High"
    elif total_problems > 10000:
        problem_status = "Moderate"
    else:
        problem_status = "Low"

    if total_problems > 0:
        high_priority_percentage = round(
            (high_priority / total_problems) * 100,
            1
        )
    else:
        high_priority_percentage = 0

    if projects_active > 0:
        solution_deployment_rate = round(
            (solutions_deployed / projects_active) * 100,
            1
        )
    else:
        solution_deployment_rate = 0

    if high_priority_percentage >= 20:
        priority_status = "Critical"
    elif high_priority_percentage >= 10:
        priority_status = "High"
    elif high_priority_percentage > 0:
        priority_status = "Moderate"
    else:
        priority_status = "Low"

    if solution_deployment_rate >= 50:
        implementation_status = "Strong"
    elif solution_deployment_rate >= 25:
        implementation_status = "Moderate"
    else:
        implementation_status = "Needs Improvement"

    executive_summary = (
        f"The district recorded {total_problems:,} civic problems, "
        f"with {high_priority:,} classified as high priority. "
        f"The leading civic issue is {top_category}. "
        f"An estimated {citizens_impacted:,} citizens are affected. "
        f"The current problem volume is {problem_status.lower()}."
    )

    key_findings = [
        f"{high_priority_percentage}% of reported problems are high priority.",
        f"{projects_active:,} projects are currently active.",
        f"{solutions_deployed:,} solutions have been deployed.",
        f"The solution deployment rate is {solution_deployment_rate}%."
    ]

    critical_areas = []

    if priority_status == "Critical":
        critical_areas.append(
            "A significant proportion of complaints require urgent attention."
        )

    if implementation_status == "Needs Improvement":
        critical_areas.append(
            "Solution deployment is low compared with active projects."
        )

    if total_problems > 100000:
        critical_areas.append(
            "The overall complaint volume requires large-scale administrative planning."
        )

    if not critical_areas:
        critical_areas.append(
            "No major structural risk was identified from the supplied statistics."
        )

    recommendations = [
        f"Prioritize {top_category} complaints for immediate intervention.",
        "Monitor high-priority complaints through a dedicated dashboard.",
        "Increase coordination between departments handling active projects.",
        "Track deployed solutions and measure their citizen impact."
    ]

    return {
        "executive_summary": executive_summary,
        "key_findings": key_findings,
        "critical_areas": critical_areas,
        "recommendations": recommendations,
        "problem_status": problem_status,
        "high_priority_percentage": high_priority_percentage,
        "solution_deployment_rate": solution_deployment_rate,
        "priority_status": priority_status,
        "implementation_status": implementation_status
    }