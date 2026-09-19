export const COMMON_WORDS = [
  'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it',
  'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by',
  'this', 'we', 'you', 'do', 'but', 'his', 'from', 'they', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
  'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most',
  'us', 'is', 'are', 'was', 'were', 'been', 'has', 'had', 'may', 'part',
  'find', 'world', 'school', 'still', 'try', 'last', 'ask', 'need', 'too', 'feel',
  'three', 'state', 'never', 'become', 'between', 'high', 'really', 'something', 'most', 'another',
  'much', 'family', 'own', 'leave', 'put', 'old', 'while', 'mean', 'keep', 'student',
  'why', 'let', 'great', 'same', 'big', 'group', 'begin', 'seem', 'country', 'help',
  'talk', 'where', 'turn', 'problem', 'every', 'start', 'hand', 'might', 'american', 'show',
  'part', 'about', 'against', 'place', 'over', 'such', 'again', 'few', 'case', 'most',
  'week', 'company', 'system', 'each', 'right', 'program', 'hear', 'so', 'question', 'during',
  'work', 'play', 'government', 'run', 'small', 'number', 'off', 'always', 'move', 'night',
  'live', 'point', 'believe', 'hold', 'today', 'bring', 'happen', 'next', 'without', 'before',
  'large', 'million', 'must', 'home', 'under', 'water', 'room', 'write', 'mother', 'area',
  'national', 'money', 'story', 'young', 'fact', 'month', 'different', 'lot', 'study', 'book',
  'eye', 'job', 'word', 'though', 'business', 'issue', 'side', 'kind', 'four', 'head',
  'far', 'black', 'long', 'both', 'little', 'house', 'yes', 'since', 'provide', 'service',
  'around', 'friend', 'important', 'father', 'sit', 'away', 'until', 'power', 'hour', 'game',
  'often', 'yet', 'line', 'political', 'end', 'among', 'ever', 'stand', 'bad', 'lose',
  'however', 'member', 'pay', 'law', 'meet', 'car', 'city', 'almost', 'include', 'continue',
  'set', 'later', 'community', 'name', 'five', 'once', 'white', 'least', 'president', 'learn',
  'real', 'change', 'team', 'minute', 'best', 'several', 'idea', 'kid', 'body', 'information',
  'nothing', 'ago', 'right', 'lead', 'social', 'understand', 'whether', 'back', 'watch', 'together',
  'follow', 'around', 'parent', 'only', 'stop', 'face', 'anything', 'create', 'public', 'already',
  'speak', 'others', 'read', 'level', 'allow', 'add', 'office', 'spend', 'door', 'health',
  'person', 'art', 'sure', 'such', 'war', 'history', 'party', 'within', 'grow', 'result',
  'open', 'change', 'morning', 'walk', 'reason', 'low', 'win', 'research', 'girl', 'guy',
  'early', 'food', 'before', 'moment', 'himself', 'air', 'teacher', 'force', 'offer', 'enough'
];

/**
 * Generates an array of words avoiding adjacent repetitions.
 */
export function generateWords(count: number): string[] {
  const result: string[] = [];
  let prevWord = '';

  for (let i = 0; i < count; i++) {
    let candidate = '';
    do {
      const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
      candidate = COMMON_WORDS[randomIndex];
    } while (candidate === prevWord);

    result.push(candidate);
    prevWord = candidate;
  }

  return result;
}
