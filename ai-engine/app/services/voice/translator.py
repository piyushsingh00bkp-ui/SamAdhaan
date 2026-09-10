try:
    from deep_translator import GoogleTranslator
except ImportError:
    GoogleTranslator = None



def translate_to_english(text: str, source_language: str) -> str:
    """
    Translate any detected speech into English.
    """

    if not text or not text.strip():
        return ""

    # Whisper returns language codes such as:
    # en, hi, bn, ta, te, mr, etc.
    source_language = (source_language or "").strip().lower()

    # Already English
    if source_language == "en":
        return text.strip()

    # Unknown language
    if not source_language:
        return text.strip()

    try:
        translated = GoogleTranslator(
            source=source_language,
            target="en"
        ).translate(text.strip())

        if translated:
            return translated.strip()

        return text.strip()

    except Exception as e:
        print("TRANSLATION ERROR:", repr(e))

        # Don't crash the complete voice pipeline
        return text.strip()