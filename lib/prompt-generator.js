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
    ],
    protagonistNames: ["Tom", "Anna", "Sam", "Lisa", "Ben", "Emma"],
    protagonistDescription: "boy or girl",
    wordCount: "80-100",
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
    ],
    protagonistNames: ["Tom", "Anna", "Sam", "Lisa", "Ben", "Emma"],
    protagonistDescription: "student",
    wordCount: "130-150",
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
    protagonistDescription: "young worker",
    wordCount: "180-200",
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
    protagonistDescription: "young professional",
    wordCount: "250-300",
    vocabLevel: "upper-intermediate (3000-4000 words of the Oxford 3000 list)",
    sentenceLength: "12-20 words",
    tense: "all tenses, including conditionals",
    avoidStructures: "none",
    numQuestions: "5",
    questionFocus: "inference, vocabulary, and main idea",
  },
  X1: {
    themes: [
      "Friendship forged in unexpected alliances (with a humorous mix-up of identities)",
      "courage in facing silly fears (leading to a joyful surprise reunion)",
      "creativity sparking wild inventions (that backfire comically before succeeding wildly)",
      "environmental harmony through playful discovery of nature's jokes",
      "self-belief via a lighthearted challenge that flips expectations",
      "cultural exchange in a fun cultural mash-up of dances and snacks",
      "kindness rippling through a chain of goofy good deeds gone awry",
      "wonder of the unknown with a heartwarming reveal of old friends",
      "teamwork in a zany competition full of accidental high-fives",
      "perseverance turning a mishap into pure, sparkling magic",
      "discovery of hidden talents during a hilarious mix-up of roles",
      "learning that mistakes can create something beautifully unexpected",
      "bridging unlikely friendships through shared bursts of laughter",
      "adapting to strange new rules in a wacky world of what-ifs",
      "sharing imagination to solve a puzzling mystery with flair",
      "overcoming shyness by helping someone even sillier in need",
      "celebrating differences through a playful festival of swaps",
      "turning an ordinary day into an extraordinary adventure of 'oops'",
      "finding treasure that isn't gold but endless ripples of joy",
      "solving a silly problem with teamwork, giggles, and a dash of luck",
      "embracing change when a familiar path leads to a surprise shortcut",
      "unleashing curiosity that untangles a knot of fun confusions",
    ],
    settings: [
      "Urban adventure in a bustling city with hidden alleyway secrets",
      "interstellar journey through space on a quirky spaceship",
      "enchanted forest in a magical world where trees whisper riddles",
      "high-stakes sports arena during a glow-in-the-dark tournament",
      "cozy family home with a twist of hidden passageways",
      "quirky workshop of an unusual inventor filled with whirring gadgets",
      "wild animal habitat in the savanna under a rainbow sunset",
      "futuristic lab with time-travel gadgets that hiccup hilariously",
      "underwater coral reef exploration amid bubbling treasure caves",
      "dreamlike floating island drifting on candy-scented clouds",
      "a bustling carnival full of mysterious rides that swap stories",
      "a tiny village hidden inside a giant, ever-growing book",
      "a secret base at the bottom of a volcano with lava-light shows",
      "a gigantic tree with doors to different worlds of wonder",
      "a futuristic sky-train weaving through floating cities at dusk",
      "a mystical desert where sand whispers forgotten lullabies",
      "a candy-coated mountain range with odd, bouncy surprises",
      "a frozen tundra with glowing ice caves hiding playful echoes",
      "a forgotten attic that comes alive at night with dancing shadows",
      "a music festival where instruments have quirky personalities",
      "an ancient library where books sprout wings and fly away",
      "a sunny beach where waves carry messages from distant friends",
    ],
    protagonists: [
      "A curious child inventor tinkering with everyday magic",
      "a clever talking animal sidekick with a knack for puns",
      "a brave robot explorer powered by recycled dreams",
      "a whimsical dreamer with imagination powers that spark colors",
      "a young athlete discovering hidden talents in unexpected games",
      "a family pet on a secret mission to mend broken toys",
      "an eccentric chef with magical recipes that taste like adventures",
      "a time-lost historian chasing echoes of joyful yesterdays",
      "a shy marine creature blooming with underwater confidence",
      "a starry-eyed astronaut kid mapping constellations of fun",
      "a mischievous shadow who yearns for independence and light",
      "a friendly alien learning Earth customs through silly dances",
      "a robot janitor harboring secret heroic dreams of flight",
      "a pair of bickering twin detectives solving whimsical whodunits",
      "a daydreaming baker's apprentice kneading stories into dough",
      "a squirrel obsessed with building contraptions from acorns",
      "a pirate kid searching for lost laughter instead of buried gold",
      "a cloud spirit struggling to control whimsical weather moods",
      "a magical librarian's apprentice unlocking books' hidden giggles",
      "a wandering street artist whose drawings leap into real life",
    ],
    wordCount: "300-350",
    vocabLevel: "fantastical and imaginative, no vocabulary restrictions",
    sentenceLength: "flexible, engaging for young readers",
    tense: "any tenses as needed for storytelling",
    avoidStructures: "none - let imagination run wild",
    numQuestions: "5",
    questionFocus: "fun comprehension and imaginative engagement",
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
    return `Error: Invalid level. Please choose A1, A2, B1, B2, or X1.`;
  }

  const config = levelConfig[level];

  // 随机选择 theme、setting 和 protagonist
  const theme = getRandomItem(config.themes);
  const setting = getRandomItem(config.settings);
  let protagonist;
  if (level === "X1") {
    protagonist = getRandomItem(config.protagonists);
  } else {
    const protagonistName = getRandomItem(config.protagonistNames);
    protagonist = `${protagonistName}, a ${config.protagonistDescription}`;
  }

  // 构建提示词
  let prompt;
  if (level === "X1") {
    prompt = `
Generate a fantastical English reading comprehension exercise for level X1. The passage should:
- A title in H2 MarkDown format
- Have ${config.wordCount} words.
- Be set in ${setting}.
- Feature ${protagonist} as the main character.
- Focus on the theme of ${theme}.
- Use ${config.vocabLevel}.
- Use sentences (${config.sentenceLength}) and ${config.tense}. ${config.avoidStructures}.
- Be imaginative, engaging, and full of wonder for young readers.

Include ${config.numQuestions} multiple-choice questions to test comprehension. The questions should:
- Be fun and imaginative.
- Cover ${config.questionFocus} from the passage.

Finally generate a short, vivid ImagePrompt suitable for AI image generation, in a vibrant cartoon style, capturing a key, fantastical scene from the story to spark visual imagination.

Format the output as follows:

[Story Title in H2]
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
  } else {
    prompt = `
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
  }

  return {
    prompt: prompt.trim(),
  };
}

export default generatePrompt;
