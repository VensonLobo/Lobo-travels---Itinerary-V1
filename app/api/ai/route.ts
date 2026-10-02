import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, destination, attractions, currentText, tourName, daysSummary, style } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback response generator if API key is absent or offline
    const getLocalFallback = () => {
      if (action === 'day-description') {
        const attractionList = Array.isArray(attractions) && attractions.length > 0
          ? attractions.join(', ')
          : 'the primary historic monuments and local highlights';
        return `Begin your exploration of ${destination || 'the city'} taking in ${attractionList}. Immerse yourself in the remarkable heritage and cultural atmosphere, accompanied by your chauffeur and local guide before retiring for the evening.`;
      }
      if (action === 'tour-summary') {
        return `A handcrafted private journey through the iconic destinations of North India. Experience imperial Mughal architecture, vibrant royal Rajasthani palaces, and authentic cultural hospitality with personalized private chauffeur transfers throughout.`;
      }
      if (action === 'tour-highlights') {
        return Array.isArray(attractions) && attractions.length > 0
          ? attractions.slice(0, 6)
          : ['Iconic Monument Sightseeing', 'Private AC Chauffeur Transfers', 'Heritage Palaces & Fortresses', 'Handcrafted Curated Itinerary'];
      }
      if (action === 'edit-text') {
        if (style === 'shorter') {
          return currentText.split('.').slice(0, 2).join('. ') + '.';
        }
        return currentText;
      }
      return 'Completed.';
    };

    if (!apiKey) {
      return NextResponse.json({ result: getLocalFallback(), isFallback: true });
    }

    const ai = new GoogleGenAI({ apiKey });

    if (action === 'day-description') {
      const prompt = `You are a professional travel itinerary copywriter for Lobo Travels, an elite Indian tour operator.
Write a polished, factual, concise travel narrative (1 to 2 paragraphs, max 110 words) for Day sightseeing in ${destination}.
Selected attractions to cover: ${Array.isArray(attractions) ? attractions.join(', ') : 'City highlights'}.
RULES:
- Be factual, elegant, and concise.
- Avoid fake facts, exaggerated superlatives, or made-up ticket prices/timings.
- Only mention the attractions specifically listed.
- Written in second person ("you" / "your").
- Tone: Premium, warm, professional, client-friendly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return NextResponse.json({ result: response.text?.trim() || getLocalFallback() });
    }

    if (action === 'tour-summary') {
      const prompt = `You are an expert luxury travel consultant for Lobo Travels.
Write a crisp 2-sentence summary (max 60 words) for the tour titled "${tourName || 'India Tour'}".
Circuit / Days summary: ${daysSummary || 'Delhi, Agra, Jaipur'}.
Tone: Refined, clear, inviting, professional.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return NextResponse.json({ result: response.text?.trim() || getLocalFallback() });
    }

    if (action === 'tour-highlights') {
      const prompt = `Given the following tour itinerary attractions and locations: ${Array.isArray(attractions) ? attractions.join(', ') : daysSummary}.
Extract the top 5 to 7 most prominent, iconic tour highlights as a JSON array of strings (e.g. ["Taj Mahal Sunrise Tour", "Amber Fort & Palace", "Qutub Minar Complex"]).
Return ONLY valid JSON array of strings.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      let parsed: string[] = [];
      try {
        parsed = JSON.parse(response.text || '[]');
      } catch {
        parsed = getLocalFallback() as string[];
      }
      return NextResponse.json({ result: parsed });
    }

    if (action === 'edit-text') {
      let instruction = 'Improve clarity, flow, and elegance for a luxury travel itinerary.';
      if (style === 'shorter') instruction = 'Make this itinerary description significantly more concise (under 50 words) while keeping all key sights.';
      if (style === 'premium') instruction = 'Elevate the vocabulary to sound like a high-end luxury private bespoke journey, while remaining factual and grounded.';
      if (style === 'simplify') instruction = 'Simplify the language for easy reading by international travelers whose second language is English.';
      if (style === 'grammar') instruction = 'Fix any grammar, punctuation, and flow errors.';

      const prompt = `Original text:
"${currentText}"

Task: ${instruction}
Return only the edited text without quotation marks or explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return NextResponse.json({ result: response.text?.trim() || currentText });
    }

    return NextResponse.json({ result: getLocalFallback() });
  } catch (error) {
    console.error('Error in /api/ai:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
