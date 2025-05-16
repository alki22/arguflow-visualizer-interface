
// API endpoints for Supabase Edge Functions
const API_ENDPOINTS = {
  'text-similarity': 'https://your-project-ref.supabase.co/functions/v1/text-similarity',
  'topic-similarity': 'https://your-project-ref.supabase.co/functions/v1/topic-similarity',
  'stance-classification': 'https://your-project-ref.supabase.co/functions/v1/stance-classification'
};

export type AnalysisType = 'text-similarity' | 'topic-similarity' | 'stance-classification';

// Mock results for testing (to be replaced with actual API calls)
const mockResults = {
  'text-similarity': `The texts show a 42% similarity coefficient.`,
  'topic-similarity': `The texts share 65% topic similarity, with key shared terms including 'argumentation' and 'analysis'.`,
  'stance-classification': `The analysis indicates a 'Neutral' stance between the texts.`
};

export async function analyzeTexts(type: AnalysisType, text1: string, text2: string): Promise<string> {
  const endpoint = API_ENDPOINTS[type];
  
  // For testing before Supabase is set up, use a timeout to simulate API call
  if (endpoint.includes('your-project-ref')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockResults[type]);
      }, 2000);
    });
  }
  
  // Real API call for when Supabase is configured
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text1, text2 }),
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.result;
}
