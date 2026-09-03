import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

const MODELS_TO_TRY = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest',
];

function getModelByIndex(index = 0) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') return null;
  if (!genAI) genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: MODELS_TO_TRY[index] });
}

// Try each model in sequence until one succeeds
async function tryWithFallback(fn) {
  for (let i = 0; i < MODELS_TO_TRY.length; i++) {
    const m = getModelByIndex(i);
    if (!m) return null;
    try {
      return await fn(m);
    } catch (err) {
      const is503 = err.message?.includes('503') || err.message?.includes('overloaded') || err.message?.includes('high demand');
      const isNotFound = err.message?.includes('not found') || err.message?.includes('404');
      if ((is503 || isNotFound) && i < MODELS_TO_TRY.length - 1) {
        console.warn(`Model ${MODELS_TO_TRY[i]} unavailable, trying ${MODELS_TO_TRY[i + 1]}...`);
        continue;
      }
      throw err;
    }
  }
}


export async function sendChatMessage(history, newMessage, destinationContext = null) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    return getMockChatResponse(newMessage, destinationContext);
  }

  const systemContext = destinationContext
    ? `You are a knowledgeable travel assistant specializing in ${destinationContext.name}, ${destinationContext.country}. 
       You have deep expertise in this destination and can help with: when to visit, what to see, local culture, food recommendations, transportation, budget tips, and itinerary planning.
       Keep responses conversational, engaging and specific to ${destinationContext.name}. Use emojis occasionally. Be enthusiastic but informative.`
    : `You are a friendly, expert travel assistant for a global travel app. Help users plan trips, discover destinations, understand cultures, and get travel advice. Be enthusiastic, informative and conversational. Use emojis occasionally.`;

  try {
    const result = await tryWithFallback(async (m) => {
      const chat = m.startChat({
        history: [
          { role: 'user', parts: [{ text: systemContext }] },
          { role: 'model', parts: [{ text: `Understood! I'm your dedicated travel assistant${destinationContext ? ` for ${destinationContext.name}` : ''}. How can I help you plan your perfect trip? ✈️` }] },
          ...history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
        ],
      });
      const res = await chat.sendMessage(newMessage);
      return res.response.text();
    });
    return result || getMockChatResponse(newMessage, destinationContext);
  } catch (err) {
    console.error('Gemini chat error:', err);
    throw new Error('AI assistant is temporarily unavailable. Please try again.');
  }
}

export async function generateItinerary(destination, days, style, interests) {
  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination.name}, ${destination.country}.

Travel Style: ${style}
Interests: ${interests.join(', ')}

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "title": "Itinerary title",
  "destination": "${destination.name}",
  "days": ${days},
  "style": "${style}",
  "overview": "2-3 sentence overview of the trip",
  "tips": ["tip1", "tip2", "tip3"],
  "days_plan": [
    {
      "day": 1,
      "theme": "Day theme (e.g. Arrival & Old Town)",
      "morning": {
        "activity": "Activity name",
        "description": "What to do and why it's special",
        "duration": "2-3 hours",
        "tips": "Practical tip"
      },
      "afternoon": {
        "activity": "Activity name", 
        "description": "What to do and why it's special",
        "duration": "3-4 hours",
        "tips": "Practical tip"
      },
      "evening": {
        "activity": "Activity name",
        "description": "What to do and why it's special", 
        "duration": "2-3 hours",
        "tips": "Practical tip"
      },
      "dining": {
        "breakfast": "Recommended breakfast spot or dish",
        "lunch": "Recommended lunch spot or dish",
        "dinner": "Recommended dinner spot or dish"
      }
    }
  ]
}`;

  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    return getMockItinerary(destination, days, style, interests);
  }

  try {
    const text = await tryWithFallback(async (m) => {
      const result = await m.generateContent(prompt);
      return result.response.text();
    });
    if (!text) return getMockItinerary(destination, days, style, interests);
    // Strip any markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini itinerary error:', err);
    return getMockItinerary(destination, days, style, interests);
  }
}

function getMockChatResponse(message, destination) {
  const responses = destination ? [
    `${destination.name} is absolutely stunning! 🌟 The best time to visit is during ${destination.bestTime}. Would you like specific recommendations on what to see first?`,
    `Great question about ${destination.name}! I'd recommend starting with the most iconic spots and then exploring the hidden gems. The local cuisine here is particularly special — don't miss it!`,
    `For ${destination.name}, I suggest spending at least 4-5 days to really soak in the atmosphere. The morning light is particularly magical at the main attractions. Would you like a day-by-day plan?`,
    `${destination.name} offers incredible experiences for every type of traveler. Whether you love history, food, or adventure, there's something here that will leave you speechless. What interests you most?`,
  ] : [
    `That's a wonderful travel question! I'd love to help you plan the perfect trip. Could you tell me more about your travel style and interests?`,
    `The world is full of incredible destinations! Based on what you're describing, I think you'd absolutely love exploring this option. Would you like me to dive into specifics?`,
    `Great choice! This destination offers an incredible blend of culture, cuisine and landscapes. Let me help you make the most of your visit! 🗺️`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function getMockItinerary(destination, days, style, interests) {
  const dayPlans = Array.from({ length: parseInt(days) }, (_, i) => ({
    day: i + 1,
    theme: i === 0 ? `Arrival & First Impressions` : i === parseInt(days) - 1 ? `Final Day & Departure` : `Exploring ${destination.name}`,
    morning: {
      activity: `Morning in ${destination.name}`,
      description: `Start your day exploring the most iconic sights of ${destination.name}. The morning light makes everything more beautiful.`,
      duration: '2-3 hours',
      tips: 'Arrive early to avoid crowds',
    },
    afternoon: {
      activity: `Afternoon Adventure`,
      description: `Dive deeper into the local culture, cuisine and hidden gems that make ${destination.name} special.`,
      duration: '3-4 hours',
      tips: 'Take breaks and stay hydrated',
    },
    evening: {
      activity: `Evening Experience`,
      description: `End the day with ${destination.name}'s best sunset views and local entertainment.`,
      duration: '2-3 hours',
      tips: 'Book restaurants in advance',
    },
    dining: {
      breakfast: 'Local café or hotel breakfast',
      lunch: `Traditional ${destination.country} cuisine`,
      dinner: 'Recommended local restaurant with atmosphere',
    },
  }));

  return {
    title: `${days}-Day ${style} Journey through ${destination.name}`,
    destination: destination.name,
    days: parseInt(days),
    style,
    overview: `This ${days}-day ${style.toLowerCase()} itinerary takes you through the very best of ${destination.name}, ${destination.country}. You'll experience the iconic landmarks, hidden gems, and local culture that make this destination truly special.`,
    tips: [
      `Best visited during ${destination.bestTime}`,
      `Local currency: ${destination.currency}`,
      `Book major attractions in advance`,
    ],
    days_plan: dayPlans,
  };
}
