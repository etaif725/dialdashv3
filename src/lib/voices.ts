export interface Voice {
  name: string;
  gender: 'male' | 'female';
  accent: string;
  description: string;
  preview_url?: string;
  model_id: string;
  language: string;
  age_range: string;
  tone: string[];
  use_cases: string[];
}

export const voices: Record<string, Voice> = {
  'eleven_josh': {
    name: 'Josh',
    gender: 'male',
    accent: 'American',
    description: 'A friendly and professional male voice with a natural American accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-US',
    age_range: '30-40',
    tone: ['friendly', 'professional', 'natural'],
    use_cases: ['customer service', 'business', 'narration']
  },
  'eleven_rachel': {
    name: 'Rachel',
    gender: 'female',
    accent: 'American',
    description: 'A warm and engaging female voice with a clear American accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-US',
    age_range: '25-35',
    tone: ['warm', 'engaging', 'professional'],
    use_cases: ['customer service', 'education', 'healthcare']
  },
  'eleven_emily': {
    name: 'Emily',
    gender: 'female',
    accent: 'British',
    description: 'A sophisticated female voice with a refined British accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-GB',
    age_range: '30-40',
    tone: ['sophisticated', 'professional', 'refined'],
    use_cases: ['business', 'luxury brands', 'narration']
  },
  'eleven_james': {
    name: 'James',
    gender: 'male',
    accent: 'British',
    description: 'A distinguished male voice with a polished British accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-GB',
    age_range: '35-45',
    tone: ['distinguished', 'authoritative', 'trustworthy'],
    use_cases: ['business', 'documentary', 'corporate']
  },
  'eleven_michael': {
    name: 'Michael',
    gender: 'male',
    accent: 'American',
    description: 'A confident and authoritative male voice with a clear American accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-US',
    age_range: '40-50',
    tone: ['confident', 'authoritative', 'professional'],
    use_cases: ['business', 'corporate', 'announcements']
  },
  'eleven_sophia': {
    name: 'Sophia',
    gender: 'female',
    accent: 'American',
    description: 'A young and energetic female voice with a modern American accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-US',
    age_range: '20-30',
    tone: ['energetic', 'friendly', 'modern'],
    use_cases: ['social media', 'entertainment', 'youth-oriented']
  },
  'eleven_david': {
    name: 'David',
    gender: 'male',
    accent: 'Australian',
    description: 'A laid-back male voice with a friendly Australian accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-AU',
    age_range: '30-40',
    tone: ['casual', 'friendly', 'approachable'],
    use_cases: ['casual business', 'entertainment', 'lifestyle']
  },
  'eleven_olivia': {
    name: 'Olivia',
    gender: 'female',
    accent: 'Australian',
    description: 'A cheerful female voice with a warm Australian accent',
    model_id: 'eleven_turbo_v2',
    language: 'en-AU',
    age_range: '25-35',
    tone: ['cheerful', 'warm', 'friendly'],
    use_cases: ['customer service', 'lifestyle', 'tourism']
  }
};

// Helper function to get voice by ID
export function getVoiceById(id: string): Voice | undefined {
  return voices[id];
}

// Helper function to filter voices by language
export function getVoicesByLanguage(language: string): Voice[] {
  return Object.values(voices).filter(voice => voice.language === language.toLowerCase());
}

// Helper function to filter voices by gender
export function getVoicesByGender(gender: 'male' | 'female'): Voice[] {
  return Object.values(voices).filter(voice => voice.gender === gender);
}

// Helper function to filter voices by accent
export function getVoicesByAccent(accent: string): Voice[] {
  return Object.values(voices).filter(voice => voice.accent === accent);
}
