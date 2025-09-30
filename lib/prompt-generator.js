import { commonWords } from "@/lib/words";

// Unified configuration object for all data structures
const promptConfig = {
  difficulties: [
    { level: "A1", desc: "非常基础，简单词汇和句子，适合小学1-3年级" },
    { level: "A2", desc: "基础水平，常见词汇和简单句型，适合小学4-6年级" },
    { level: "B1", desc: "中级水平，更多词汇和句型，适合初中生" },
    { level: "B2", desc: "中高级水平，复杂词汇和句型，适合高中生" },
  ],
  writingStyles: [
    "descriptive and vivid",
    "adventurous and exciting",
    "humorous and light-hearted",
    "mysterious and suspenseful",
    "educational and informative",
    "emotional and heartfelt",
  ],
  narrativeDrives: [
    "friendship and teamwork",
    "discovery and exploration",
    "overcoming challenges",
    "helping others",
    "learning new things",
    "family bonds",
  ],
  tones: [
    "warm and encouraging",
    "playful and fun",
    "thoughtful and reflective",
    "energetic and dynamic",
    "gentle and caring",
    "inspirational and motivating",
  ],
  names: {
    boys: [
      "Liam",
      "Noah",
      "Oliver",
      "James",
      "Elijah",
      "William",
      "Henry",
      "Lucas",
      "Theodore",
      "Mateo",
    ],
    girls: [
      "Emma",
      "Olivia",
      "Sophia",
      "Charlotte",
      "Amelia",
      "Isabella",
      "Evelyn",
      "Ava",
      "Mia",
      "Luna",
    ],
  },
  categories: [
    "sci-fi",
    "science",
    "fairy tale",
    "mystery",
    "fantasy",
    "humor",
    "sports",
    "environmental",
    "travel",
    "school life",
    "detective",
  ],
};

export default function generatePrompt(difficulty, length) {
  // Unified random selection function
  function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate random words
  function generateRandomWords() {
    const shuffled = [...commonWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  // Generate random name
  function generateRandomName() {
    const allNames = [...promptConfig.names.boys, ...promptConfig.names.girls];
    return randomFromArray(allNames);
  }

  // Generate random category
  function generateRandomCategory() {
    return randomFromArray(promptConfig.categories);
  }

  // Generate random data internally
  const wordsArray = generateRandomWords();
  const selectedName = generateRandomName();
  const selectedCategory = generateRandomCategory();

  const difficultyObj = promptConfig.difficulties.find(
    (d) => d.level === difficulty
  );
  const difficultyDesc = difficultyObj ? difficultyObj.desc : "";

  const selectedWritingStyle = randomFromArray(promptConfig.writingStyles);
  const selectedNarrativeDrive = randomFromArray(promptConfig.narrativeDrives);
  const selectedTone = randomFromArray(promptConfig.tones);

  const prompt = `
你是一名面向中国中小学生的英语阅读教师。请根据给定的单词编写一篇约${length}词的英语短文。随后设计5道英文阅读理解单选题，并在最后生成简短的适用于图像AI生成的ImagePrompt：

文章要求：主人公名字为${selectedName}。内容语言清晰简洁，难度为CEFR ${difficulty}水平 (${difficultyDesc})，类别为${selectedCategory}。写作风格为${selectedWritingStyle}，叙事驱动为${selectedNarrativeDrive}，语气为${selectedTone}。文章标题用二号标题(##)。
出题要求：每题提供 A/B/C 三个选项；明确标注正确答案；正确答案在 A、B、C 中分布均衡，不集中在同一个选项。

单词列表：${wordsArray.join(", ")}。
输出格式如下，Questions和Answer部分每一行开始都不要有任何空格,并且单词列表中出现的单词用黑体标注（**）：
---
Story:
...（英文标题和文章）

Questions:
1. 问题文本
A. 选项A
B. 选项B
C. 选项C
Answer: A

（重复5题）

ImagePrompt:（根据文章总结的用于图像生成的提示词，标明绘制适合青少年的明快卡通图像）
`;

  return {
    prompt: prompt.trim(),
    words: wordsArray.join(", "),
    name: selectedName,
    category: selectedCategory,
    writingStyle: selectedWritingStyle,
    narrativeDrive: selectedNarrativeDrive,
    tone: selectedTone,
  };
}
