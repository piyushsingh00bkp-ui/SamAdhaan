# SAMADHAAN AI Engine Integration

## Architecture

The AI Engine is developed as an independent service using **Python + FastAPI**.
The Node.js backend communicates with it via an asynchronous, resilient Axios HTTP client layer.

```
                    Citizen Submits Problem
                              |
                              v
                 Node.js Challenge Service
                              |
                      [Stores Challenge]
                              |
             (Async non-blocking background task)
                              |
                              v
               FastAPI AI Engine Client (Axios)
            POST http://127.0.0.1:8000/api/v1/problem/analyze
                              |
                     +--------+--------+
                     |                 |
                  Success           Timeout / 5xx
                     |                 |
                     v                 v
             Stores AIAnalysis     Heuristic Fallback
             + Updates Severity    + Logs Warning
                     |                 |
                     +--------+--------+
                              |
                              v
                   Dispatches Notification
```

---

## AI Endpoints Contract
- `POST /api/v1/problem/analyze` — Multilingual NLP triage, severity scoring (0–100), duplicate probability.
- `POST /api/v1/matching/find` — Recommendations for matching universities, experts, and CSR partners.
- `POST /api/v1/solution/generate` — Technical blueprint drafting.
- `POST /api/v1/trends/analyze` — 30-day predictive hotspot projections.
- `POST /api/v1/copilot/chat` — Civic copilot assistant.
