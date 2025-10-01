export default function generatePrompt(difficulty, length) {
  const settings = [
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
  ];

  const protagonists = [
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
    "a daydreaming baker’s apprentice kneading stories into dough",
    "a squirrel obsessed with building contraptions from acorns",
    "a pirate kid searching for lost laughter instead of buried gold",
    "a cloud spirit struggling to control whimsical weather moods",
    "a magical librarian’s apprentice unlocking books' hidden giggles",
    "a wandering street artist whose drawings leap into real life",
  ];

  const themes = [
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
    "finding treasure that isn’t gold but endless ripples of joy",
    "solving a silly problem with teamwork, giggles, and a dash of luck",
    "embracing change when a familiar path leads to a surprise shortcut",
    "unleashing curiosity that untangles a knot of fun confusions",
  ];

  const selectedSetting = settings[Math.floor(Math.random() * settings.length)];
  const selectedProtagonist =
    protagonists[Math.floor(Math.random() * protagonists.length)];
  const selectedTheme = themes[Math.floor(Math.random() * themes.length)];

  const prompt = `
Generate a unique English story for junior readers of about ${length} words.
Audience: Junior readers at CEFR ${difficulty} level.

Then, design 5 English multiple-choice reading comprehension questions, and finally generate a short ImagePrompt suitable for image AI generation.

Use the following randomly selected elements to ensure diversity and freshness:

Setting: ${selectedSetting}
Protagonist: ${selectedProtagonist}
Theme: ${selectedTheme}

Craft the story to feel entirely original and engaging, weaving in the selected elements naturally without clichés. Keep it wholesome, adventurous, and inspiring—infuse subtle moral lessons, surprising plot twists, or playful humor in a light, non-preachy way.

Style: Simple, clear, and fun, with vocabulary that gently builds skills through context.
Tone: Always positive, never scary, violent, or repetitive—vary sentence structures and pacing for dynamism.

Question requirements: Each question should provide options A/B/C; clearly mark the correct answer; distribute correct answers evenly across A, B, and C (not concentrated in one option).

Output format:

Story:
## Story Title
Story content here...

Questions:

1. Question text here?
A. Option A
B. Option B
C. Option C
Answer: A

2. Question text here?
A. Option A
B. Option B
C. Option C
Answer: B

3. Question text here?
A. Option A
B. Option B
C. Option C
Answer: C

4. Question text here?
A. Option A
B. Option B
C. Option C
Answer: A

5. Question text here?
A. Option A
B. Option B
C. Option C
Answer: B

ImagePrompt: (a short, vivid ImagePrompt suitable for AI image generation, capturing a key, colorful scene from the story to spark visual imagination)
`;

  return {
    prompt: prompt.trim(),
  };
}
