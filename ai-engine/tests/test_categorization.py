from app.schemas.categorization import (
    CategorizationResult
)


def test_categorization_schema():

    result = CategorizationResult(

        domain="Waste Management",

        category="Solid Waste",

        subcategory="Garbage Collection",

        confidence=96,

        keywords=[
            "garbage",
            "waste collection",
            "locality"
        ],

        reason=(
            "The complaint concerns failure of "
            "municipal garbage collection."
        )
    )

    assert result.domain == "Waste Management"

    assert result.category == "Solid Waste"

    assert result.confidence == 96