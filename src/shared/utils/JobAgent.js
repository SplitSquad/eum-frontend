export async function callJobAgent(query, uid) {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDY1OTc2MjMsImV4cCI6MTc0NjYzMzYyM30.fYB_vGhI7YXc9nW3iHkPM1nU3A8rzAr4i8olcrRitMI';
    const res = await fetch('http://127.0.0.1:8001/api/v1/agentic/cover-letter/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ user_id: uid }),
    });
    if (!res.ok) {
        throw new Error(`Agentic API error ${res.status}`);
    }
    return res.json();
}
export async function processCoverLetterResponse(response, state) {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDY1OTc2MjMsImV4cCI6MTc0NjYzMzYyM30.fYB_vGhI7YXc9nW3iHkPM1nU3A8rzAr4i8olcrRitMI';
    const res = await fetch('http://127.0.0.1:8001/api/v1/agentic/cover-letter/response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({
            response,
            state,
        }),
    });
    if (!res.ok) {
        throw new Error(`Agentic API error ${res.status}`);
    }
    return res.json();
}
