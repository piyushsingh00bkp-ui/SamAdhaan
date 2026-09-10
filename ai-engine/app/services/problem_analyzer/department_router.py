from app.schemas.problem import ProblemAnalysis


def get_department(
    analysis: ProblemAnalysis
) -> str:
    """
    Return the government department identified by the analyzer.
    """

    return analysis.department