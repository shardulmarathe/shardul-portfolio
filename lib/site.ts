/** Update links and copy as needed. Profile: `public/profile.png`. */
export const SITE = {
  name: "Shardul Marathe",
  heroQuote: {
    lines: [
      "One day, you'll leave this world behind. So live a life you will remember."
    ],
    attribution: "Avicii",
  },
  email: "mailto:shardulm@stanford.edu",
  linkedin: "https://www.linkedin.com/in/shardulmarathe",
  github: "https://github.com/shardulmarathe",
  profileImage: "/profile.png",
  cards: {
    endGoal:
      "Build and evaluate intelligent systems that can reason, act, and collaborate with humans, with a focus on advancing reliable LLMs and agentic workflows.",
    currentProjects:
      "Developing multi-turn LLM evaluations for lexical entrainment. Mastering probabilistic modeling and statistical inference. Designing and building complex embedded systems. ",
    funFacts:
      "Researchers recently found that AI image generators have a 'favorite' color that doesn't actually exist in nature.",
  },
} as const;
