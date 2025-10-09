// 配置每个 CEFR 级别的主题、场景和其他参数
const levelConfig = {
  A1: {
    themes: [
      "family",
      "pets",
      "school life",
      "a fun day",
      "food",
      "home activities",
      "friends",
      "simple shopping",
      "colors and shapes",
      "my favorite toy",
      "seasons",
      "morning routine",
      "a birthday party",
      "animals at home",
      "playing games",
      "my clothes",
      "a sunny day",
      "drawing pictures",
      "helping mom",
      "story time",
    ],
    settings: [
      "a small house",
      "a school",
      "a park",
      "a shop",
      "a garden",
      "a classroom",
      "a playground",
      "a kitchen",
      "a bedroom",
      "a living room",
      "a backyard",
      "a street",
      "a farm",
      "a lake",
      "a toy store",
      "a picnic area",
    ],
    protagonistNames: ["Tom", "Anna", "Sam", "Lisa", "Ben", "Emma"],
    protagonistDescription: [
      "boy or girl",
      "happy child",
      "curious kid",
      "playful sibling",
      "young explorer",
      "smiling student",
    ],
    wordCount: "100-130",
    vocabLevel: "basic (first 500-1000 words of the Oxford 3000 list)",
    sentenceLength: "5-8 words",
    tense: "present tense only",
    avoidStructures: "subordinate clauses, idioms, phrasal verbs",
    numQuestions: "4",
    questionFocus: "literal details",
  },
  A2: {
    themes: [
      "hobbies",
      "travel",
      "food",
      "sports",
      "animals",
      "shopping",
      "weather",
      "friends",
      "a school trip",
      "a family party",
      "daily meals",
      "favorite books",
      "a rainy day",
      "helping at home",
      "visiting grandparents",
      "simple games",
      "summer vacation",
      "my neighborhood",
      "cooking with family",
      "a new friend",
    ],
    settings: [
      "a small town",
      "a park",
      "a shop",
      "a beach",
      "a zoo",
      "a sports field",
      "a market",
      "a bus",
      "a classroom",
      "a house",
      "a restaurant",
      "a library",
      "a swimming pool",
      "a forest path",
      "a birthday venue",
      "a neighbor's yard",
      "a train station",
      "a playground at night",
    ],
    protagonistNames: ["Tom", "Anna", "Sam", "Lisa", "Ben", "Emma"],
    protagonistDescription: [
      "student",
      "eager learner",
      "active teenager",
      "helpful classmate",
      "adventurous pupil",
      "friendly schoolkid",
      "curious explorer",
    ],
    wordCount: "150-180",
    vocabLevel: "elementary (1000-2000 words of the Oxford 3000 list)",
    sentenceLength: "8-12 words",
    tense: "present and simple past tenses",
    avoidStructures: "complex clauses, idioms",
    numQuestions: "4",
    questionFocus: "details and simple context",
  },
  B1: {
    themes: [
      "work",
      "education",
      "environment",
      "travel experiences",
      "daily routines",
      "health",
      "shopping for clothes",
      "city life",
      "hobbies",
      "friendship",
      "family traditions",
      "learning a new skill",
      "a weekend getaway",
      "healthy eating habits",
      "public transport",
      "volunteering",
      "cultural festivals",
      "personal goals",
      "teamwork at work",
      "saving money",
    ],
    settings: [
      "a city",
      "a workplace",
      "a school",
      "a train station",
      "a shop",
      "a park",
      "a cafe",
      "a library",
      "a gym",
      "a market",
      "a hospital",
      "a museum",
      "a shopping mall",
      "a riverbank",
      "a community hall",
      "a bicycle path",
      "a restaurant terrace",
      "a home office",
    ],
    protagonistNames: [
      "James",
      "Sophie",
      "Alex",
      "Maria",
      "David",
      "Laura",
      "Chris",
      "Nina",
    ],
    protagonistDescription: [
      "young worker",
      "ambitious beginner",
      "dedicated employee",
      "busy urbanite",
      "motivated learner",
      "outgoing colleague",
      "practical professional",
    ],
    wordCount: "200-230",
    vocabLevel: "intermediate (2000-3000 words of the Oxford 3000 list)",
    sentenceLength: "10-15 words",
    tense: "present, past, and future tenses",
    avoidStructures: "rare idioms, passive voice",
    numQuestions: "5",
    questionFocus: "details, context, and basic inference",
  },
  B2: {
    themes: [
      "technology",
      "culture",
      "education goals",
      "travel adventures",
      "environment issues",
      "career plans",
      "social media",
      "music and art",
      "health and fitness",
      "global events",
      "sustainable living",
      "digital privacy",
      "cultural exchange",
      "work-life balance",
      "climate change solutions",
      "entrepreneurship",
      "online learning",
      "international friendships",
      "innovation in daily life",
      "diversity in society",
    ],
    settings: [
      "a university",
      "a festival",
      "a city center",
      "a museum",
      "an office",
      "a concert",
      "a train",
      "a beach resort",
      "a community center",
      "a technology fair",
      "a co-working space",
      "an art gallery",
      "a sustainable farm",
      "an international airport",
      "a virtual meeting room",
      "a wellness retreat",
      "a protest site",
      "a startup incubator",
    ],
    protagonistNames: [
      "James",
      "Sophie",
      "Alex",
      "Maria",
      "David",
      "Laura",
      "Chris",
      "Nina",
      "Oliver",
      "Emma",
    ],
    protagonistDescription: [
      "young professional",
      "innovative expert",
      "global thinker",
      "balanced careerist",
      "creative leader",
      "networking enthusiast",
      "sustainable advocate",
      "tech-savvy manager",
    ],
    wordCount: "250-280",
    vocabLevel: "upper-intermediate (3000-4000 words of the Oxford 3000 list)",
    sentenceLength: "12-20 words",
    tense: "all tenses, including conditionals",
    avoidStructures: "none",
    numQuestions: "5",
    questionFocus: "inference, vocabulary, and main idea",
  },
};

// 随机选择数组中的一项
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 生成提示词的函数
function generatePrompt(level) {
  // 验证输入级别
  if (!levelConfig[level]) {
    return `Error: Invalid level. Please choose A1, A2, B1, or B2.`;
  }

  const config = levelConfig[level];

  // 随机选择 theme、setting 和 protagonist
  const theme = getRandomItem(config.themes);
  const setting = getRandomItem(config.settings);
  const protagonistName = getRandomItem(config.protagonistNames);
  const protagonistDescription = getRandomItem(config.protagonistDescription);
  const protagonist = `${protagonistName}, a ${protagonistDescription}`;

  // 构建提示词
  const prompt = `
Generate an English reading comprehension exercise for CEFR level ${level}. The passage should:
- A title in H2 MarkDown format
- Have ${config.wordCount} words.
- Be set in ${setting}.
- Feature ${protagonist} as the main character.
- Focus on the theme of ${theme}.
- Use ${config.vocabLevel}.
- Use sentences (${config.sentenceLength}) and ${config.tense}. Avoid ${config.avoidStructures}.
- Be clear, engaging, and appropriate for ${level} learners.

Include ${config.numQuestions} multiple-choice questions to test comprehension. The questions should:
- Match CEFR ${level} difficulty.
- Cover ${config.questionFocus} from the passage.
- For each question, randomly select the position of the correct answer (A, B, or C) to ensure even distribution across all options.
- Avoid any Markdown symbols in the question section.

Finally generate a short, vivid ImagePrompt suitable for AI image generation, in a vibrant cartoon style, capturing a key, fantastical scene from the story to spark visual imagination.

Format the output as follows:

[Story Title]
[Insert passage here]

Questions:
1. [Question]
A. [Option A]
B. [Option B]
C. [Option C]
Answer: [A/B/C]
2. [Question]
...

ImagePrompt: [Insert ImagePrompt here]
`;

  return {
    prompt: prompt.trim(),
  };
}

export default generatePrompt;
