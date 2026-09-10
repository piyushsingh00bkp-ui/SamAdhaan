from app.schemas.problem import ProblemAnalysis


def get_category(
    analysis: ProblemAnalysis
) -> str:
    """
    Return the category identified by the Problem Analyzer.
    """

    return analysis.category