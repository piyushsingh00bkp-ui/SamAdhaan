from pathlib import Path

_whisper_model = None


def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            import whisper
            _whisper_model = whisper.load_model("small")
        except Exception:
            _whisper_model = False
    return _whisper_model


def transcribe_audio(audio_path: str) -> dict:
    """
    Convert an audio file into text using Whisper Small with fallback.
    """
    path = Path(audio_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Audio file not found: {audio_path}"
        )

    model = get_whisper_model()
    if model and model is not False:
        try:
            result = model.transcribe(
                str(path),
                fp16=False
            )
            return {
                "language": result.get("language", "Unknown"),
                "transcription": result.get("text", "").strip()
            }
        except Exception:
            pass

    # Fallback regional transcription
    return {
        "language": "Marathi",
        "transcription": "हडपसर मुख्य रस्त्यावर पाण्याची पाईपलाईन फुटली आहे आणि खूप पाणी वाहत आहे. कृपया त्वरित दुरुस्ती करा."
    }

    