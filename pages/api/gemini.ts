// pages/api/gemini.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing Gemini API key' });
  }

  try {
    const { userPrompt } = req.body;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ]
      })
    });

    const result = await geminiRes.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
}
