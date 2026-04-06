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
      "After moving to Dragon Rhythm Shaolin Kung Fu, training stopped being only personal practice—it became something you passed on. Invited to assist after your red belt, you stepped into classes where patience and precision matter more than flair.",
    description:
      "Karate years at West Coast Martial Arts (through second-degree red belt) gave you a baseline; Kung Fu asked for new forms, flexibility, and long weekly hours. Teaching folded that discipline outward: correcting stances, pacing a line of kids, and celebrating small wins on test day.",
    bullets: [
      "Assistant Master for two years, teaching students from white belt through black belt levels.",
      "Eagle Level Assistant Master—one step from full master status at the studio.",
      "Break down traditional forms and basics so beginners feel progress, not overwhelm.",
    ],
    lessons:
      "Leadership in a dojo is repetition without condescension—the same cue, calmly, until it lands. You learned that respect flows both ways when you are accountable for someone else’s safety and confidence.",
    image: "/past/kf-assistant-master.jpg",
    imageFit: "cover",
    cardLines: [
      "Spent two years as an Assistant Master, teaching everyone from white belts to black belts at Dragon Rhythm.",
      "Eagle Level Assistant—coaching forms, discipline, and tests with the same patience you were once shown.",
    ],
    graphVal: 10,
  },
  {
    id: "kf-competitor",
    slug: "kf-international-competitor",
    title: "Kung Fu International Competitor",
    intro:
      "Competition pushed you from studio goals to judged performance—travel, pressure, and athletes who had trained longer than you’d been in the art.",
    description:
      "You earned first- and second-degree black belts with demanding tests (whipchain, staff, advanced aerial skills). When your master invited you to the Golden State International Wushu Championships, hesitation gave way to preparation—and podium finishes you still sound proud recalling.",
    bullets: [
      "2024 Golden State International Wushu Championships: 1st (Double Daggers), 2nd (Dahuan Fist), 3rd (Pudao) in a stacked age division.",
      "Second-degree test included uncommon variations—one-legged tornado kick, no-hands kip-up—and the top score in your division that day.",
      "Traveled with the school to China: performances for Olympic wushu athletes, Shaolin monks, and Abbot Shi Yongxin; absorbed culture beyond the mat.",
    ],
    lessons:
      "International rooms reward humility: you can place high beside people with twice your years in the art when preparation meets trust in coaching—and when you treat every round as information, not verdict.",
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
      "Years competing across platform events matured into mentoring—turning your own rewrites and round feedback into language other speakers could use.",
    description:
      "You gravitated toward events you could build: Declamation, Original Oratory, Informative, and Program Oral Interpretation, with Informative as a home base. Coaching at Golden State Academy and leading your school club meant less spotlight, more cycles of draft → perform → revise for someone else’s voice.",
    bullets: [
      "Platform coach at Golden State Academy—one of California’s large competitive speech hubs.",
      "President of the school Speech & Debate club; balance outreach, culture, and logistics for teammates.",
      "Help speakers tighten structure, timing, and presence without sanding away personality.",
    ],
    lessons:
      "The best notes name one concrete lever—an image, a transition, a breath—and leave confidence intact. Teaching oratory made you a better editor of your own blind spots.",
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
      "Eighth grade through senior year, the circuit became a map: locals, invitationals, state qualifiers, NIETOC, and Nationals—each stop another draft of the same stubborn love for Informative.",
    description:
      "You chased majors on the West Coast—ASU, James Logan, Berkeley—and earned bids and deep runs while juggling illness, AP weeks, and travel. The arc peaked in state and national rooms where the entry pools were unforgiving and the ballots subjective.",
    bullets: [
      "California State Champion in Informative Speaking (CHSSA); qualified out of district rounds for the National Speech & Debate Tournament.",
      "NIETOC and TOC bids across the season; strong placements at NIETOC in Informative and Original Oratory against national fields.",
      "At Nationals (Des Moines), 33rd in Informative among 262 national qualifiers—after a tight revision sprint straight from another major commitment.",
    ],
    lessons:
      "You can respect judges without outsourcing your worth to a single sheet. The season’s lesson was steadiness: revise after every tournament, sleep when you can, and treat pressure as signal—not noise.",
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
      "From LEGO leagues into FIRST Tech Challenge, you captained a team where metal, Java, and match clock all had to agree at once.",
    description:
      "Autonomous periods, driver-controlled scrambles, and awards rubrics forced a full-stack mindset: mechanical design, sensors, and readable code. You leaned on OpenCV and TensorFlow when the game randomized what the robot had to see.",
    bullets: [
      "Captain from elementary FTC-adjacent years through 11th grade; shepherded design, build, and competition rhythm.",
      "Java control stack with computer vision when missions required recognizing game pieces on the field.",
      "State tournament qualification and multiple Design and Connect awards across FLL and FTC seasons.",
    ],
    lessons:
      "Captaincy is maintenance culture—documentation, handoffs, and calm when the bot fails between matches. A trophy is loud; a repeatable checklist is what saves the next event.",
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
      "OwnABot Academy started as a bet that younger students shouldn’t have to stumble through FIRST alone—foundations could be taught with the same joy as competition.",
    description:
      "You built curriculum and partnerships with after-school programs, turning enrollment into teams that qualified for state and world championships. Revenue became a way to sustain teaching hours, not the headline.",
    bullets: [
      "Head of OwnABot Academy—robotics and programming fundamentals for students feeding into FIRST pipelines.",
      "Partnerships with programs such as Safari Kids and Gurukul Academy; sustainable monthly revenue to support instruction.",
      "Helped launch 10+ FIRST teams, with many advancing to state or world-level tournaments.",
    ],
    lessons:
      "Founding is succession: systems beat charisma. If the next cohort can run a checklist you wrote, the academy survives a busy semester when you cannot be everywhere.",
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
