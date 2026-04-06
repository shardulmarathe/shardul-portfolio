/**
 * Past Self experience pages — copy distilled from `shardulmarathe.github.io`
 * (KungFu.html, Speech.html, Robotics.html, About.html).
 */

export type PastRoleData = {
  /** Graph node id (stable key for links) */
  id: string;
  slug: string;
  title: string;
  intro: string;
  description: string;
  bullets: string[];
  lessons: string;
  image: string;
  /** Hover-card image fit mode */
  imageFit?: "cover" | "contain";
  /** 3D graph hover card */
  cardLines: [string, string];
  /** Sphere size weight in force graph */
  graphVal: number;
};

export const PAST_DATA: PastRoleData[] = [
  {
    id: "kf-master",
    slug: "kf-assistant-master",
    title: "Kung Fu Assistant Master",
    intro:
      "As an Assistant Master in Shaolin Kung Fu, I led classes of over 200 students, teaching forms, sparring techniques, and discipline as a 2nd-degree black belt. I focused on correcting form, building foundational strength, and mentoring younger students, helping them develop both physical skill and mental focus while progressing through belt levels.",
    description:
      "Last summer, I worked with my Kung Fu master and two header coaches to make a performance in China. After months of organizing kids into rehearsal groups and choreographing synchronized sword forms, we finally performed before the Shaolin Masters, including Grandmaster Shi Yongxin. When they praised our form and discipline, it wasn’t the applause that elated me. IIt was the moment I realized we had earned the respect of masters who had dedicated their lives to Kung Fu.  Our celebration? Sharing plates of Peking Duck.",
    bullets: [
      "Every student has a different learning style and pace.",
      "There is a fine balance between professionalism and personalism",
      "You need someone in your corner yelling JIAYOU",
    ],
    lessons:
      "",
    image: "/past/kf-assistant-master.jpg",
    imageFit: "cover",
    cardLines: [
      "",
      "",
    ],
    graphVal: 10,
  },
  {
    id: "kf-competitor",
    slug: "kf-international-competitor",
    title: "Kung Fu International Competitor",
    intro:
      "As an international Shaolin Kung Fu competitor, I trained extensively in forms and sparring, refining precision, power, and control to perform on a global stage. Competing against practitioners from around the world, I learned to stay composed under pressure, adapt to different styles, and push my physical and mental limits while representing my school in high-level tournaments.",
    description:
      "While walking across a complex, I came across students punching and kicking. However, when I peered into the door, I saw students doing amazing feats. Headflips. Ariels. You name it; they did it. I was mesmerized and shocked. I ended up signing up for classes through that “simple” demonstration. As I progressed through the belts, I started learning the things I had seen previously. However, I gained much more than skills and cool kicks. I gained an appreciation for the art. The rhythm of training and the sharp focus behind every movement reeled me in. It allowed me to ground myself and bring a burning passion into my life. I didn’t care about the belts; I simply cared about learning.",
    bullets: [
        "Do not rush your recovery after a workout",
        "No matter how good you get, there is always something you can learn and improve on.",
        "It's hard to see progress in the moment",
      ],
    lessons:
      "",
    image: "/past/kf-international-competitor.jpg",
    imageFit: "cover",
    cardLines: [
      "Medaled at the 2024 Golden State International Wushu Championships across three weapons forms.",
      "Performed in China alongside teammates for audiences that included Shaolin leadership—culture and craft in the same trip.",
    ],
    graphVal: 7,
  },
  {
    id: "speech-coach",
    slug: "speech-coach",
    title: "Speech Coach",
    intro:
      "As a platform speaking coach at Golden State Academy, I mentored students in crafting and delivering speeches, focusing on structure, clarity, and stage presence. I worked one-on-one to refine arguments, improve delivery techniques like pacing and tone, and build confidence, helping students transform their ideas into compelling, polished performances for competition.",
    description:
      "Before every practice, I made my students run through tongue twister drills, “red leather, yellow leather,” “unique New York,” over and over until the room dissolved into laughter. Most of them didn’t take it seriously; it felt more like a warm up game than real prep, and I’d get plenty of eye rolls when I insisted we do it again. A few weeks later, right before a competition round, I heard the same phrases echoing in the hallway. A group of them stood in a circle, running the drills on their own, faster this time, sharper. When they walked into the room, their words came out cleaner, more controlled, each sentence landing without the usual stumbles. Afterward, one of them laughed and said, “Okay, that actually worked.”",
    bullets: [
      "Learn how to tailor your speeches to your respective audience",
      "Bad writing can be covered up with good speaking skills but not the other way around.",
      "Do not use AI for research and writing a speech. It will fail you.",
    ],
    lessons:
      "",
    image: "/past/speech-coach.jpg",
    imageFit: "cover",
    cardLines: [
      "Coach platform events at Golden State Academy and lead the school Speech & Debate club.",
      "Translate competition-hardened habits into feedback others can rehearse, not just hear once.",
    ],
    graphVal: 10,
  },
  {
    id: "nsda",
    slug: "nsda-speech-competitor",
    title: "NSDA Speech Competitor",
    intro:
      "I’ve spent the past four years in Speech and Debate not just competing, but constantly refining how I communicate ideas that matter. From breaking down complex topics like quantum computing to exploring nuanced conversations around cultural appropriation and even arguing through devil’s advocacy, I’ve learned how to make abstract or controversial ideas engaging and accessible. Competing across the national circuit, I became a California State Champion and ranked among the top speakers in the country, but what mattered more was the process: testing ideas in front of live audiences, adapting in real time, and turning every round into a conversation rather than a performance. Beyond competing, I co-led and rebuilt my team, mentoring younger speakers, running practices, and creating a space where people could find their voice just like I did.",
    description:
      "The room was dead silent: a hundred people sounded like none. Everyone was exhausted; the five judges had witnessed 10 hours of speeches, the spectators had endured five grueling speech rounds, and the six other finalists were anxious for the final round.  Sitting there, I could see everyone’s struggles: their posture, their facial expression, their slightest foot movement. I felt it was my responsibility to cheer them up. I plucked up the courage. “How’s everyone doing today?” Chuckles permeated throughout the room as a range of answers flooded in. “Great” “Hungry” “Bored” “Tired”. The room started to die. I was persistent. “Wanna hear a joke?” Seeing collective nods and confused looks, I walked straight into the middle of the room, and looked at every tired, amused face. “What does one ocean say to the other ocean? Nothing, they just wave!” (*awkward chuckles) Yet, the silence evaporated into thin air and gave way to lengthy conversations. Smiles began to reappear on everyone’s faces. The silence didn’t return until the round finally started. I use my voice to create levity in tense situations. ",
    bullets: [
      "In life, there is no such thing as black or white. There is always a gray area.",
      "The way you present yourself is equally as important as the content you are presenting.",
      "When you are given a box, go outside of it to succeed.",
    ],
    lessons:
      "",
    image: "/past/nsda-speech-competitor.jpg",
    imageFit: "cover",
    cardLines: [
      "Varsity informative competitor across NIETOC, TOC, and Nationals—California state champion in the event.",
      "Season of majors, bids, and rewrites: each round treated as data for the next version of the speech.",
    ],
    graphVal: 7,
  },
  {
    id: "ftc-captain",
    slug: "ftc-team-captain",
    title: "FTC Team Captain",
    intro:
      "As Team Captain of my FIRST Tech Challenge robotics team, I led both the technical and outreach sides of our work, shaping how we built and shared our ideas. I developed computer vision models to improve our robot’s navigation and built a front end website to document our progress, while also diving into mechanical concepts like gear ratios to design custom 1 to 1 gearboxes. Along the way, I helped secure corporate sponsorships and mentored younger teams, coaching three to the FIRST Lego League World Championships.",
    description:
      "Two days before our regional robotics tournament, my garage had turned into mission control, and at 11 PM we were stuck on a bug in our autonomous program that capped us at 15 points instead of the 50 we knew was possible. After hours of frustration, exhaustion set in and conversation faded, so I forced a break by pushing a chaotic GitHub pull request filled with corny jokes, a Rick Astley script, and a ridiculous new robot name, “The Charminator,” then asked for a review. Groans quickly turned into laughter as we spent ten minutes arguing over jokes and names instead of code, and when we returned, everything clicked; we spotted a timing issue in our vision function and fixed the bug in 30 minutes, turning hours of grinding into a quick breakthrough powered by a moment of humor.",
    bullets: [
      "DEBUGGING NEVER STOPS!",
      "It's easier to shift gears quickly than ruminate on a problem endlessly",
      "Tacobell is best food for any type of team lock-in",
    ],
    lessons:
      "",
    image: "/past/ftc-team-captain.jpg",
    imageFit: "cover",
    cardLines: [
      "Led an FTC team through autonomous code, driver practice, and integration under season deadlines.",
      "Used Java with OpenCV/TensorFlow when the game demanded vision; earned Design and Connect recognition.",
    ],
    graphVal: 9,
  },
  {
    id: "robotics-founder",
    slug: "robotics-founder",
    title: "Business Owner",
    intro:
      "I taught robotics at OwnABot Academy, leading hands-on classes where students built and programmed robots using LEGO platforms and block-based coding. I guided students through concepts like sensors, loops, and mechanical design while emphasizing creativity and problem-solving, helping them progress from simple builds to competition-style robots. I also supported curriculum development and mentored students in applying robotics to real-world challenges, fostering both technical skills and confidence.",
    description:
      "The robot refused to move. A semicircle of fourth graders stared at it like it had betrayed them. “It worked yesterday,” one muttered, poking the controller. On the screen, a single block sat out of place, but no one noticed. Frustration built quickly, voices overlapping, hands hovering over the keyboard. So I stepped back and said nothing. After a moment, one student squinted at the code. “Wait… why is this here?” he asked, dragging the block into place. The robot lurched forward, then zipped across the floor, sending the group into cheers. Just minutes earlier, they were stuck; now they were chasing it, laughing as it bumped into a chair.",
    bullets: [
      "Only when you truly understand something can you truly teach it.",
      "To teach anyone, you need to teach them the way you would want to learn at that particular age.",
      "Never leave a child unattended with a computer unless you want them playing Snake game for the entire class.",
    ],
    lessons:
      "",
    image: "/past/robotics-founder.jpg",
    imageFit: "cover",
    cardLines: [
      "Founded and lead OwnABot Academy—teaching build and code basics that seed competitive FIRST teams.",
      "Scaled through after-school partners; multiple teams qualified to state- and world-level play.",
    ],
    graphVal: 10,
  },
];

export const PAST_ROLE_SLUGS = PAST_DATA.map((r) => r.slug);

export function getPastRole(slug: string): PastRoleData | undefined {
  return PAST_DATA.find((r) => r.slug === slug);
}
