"use client";

import { motion } from "framer-motion";
import { ContentBox } from "@/components/ContentBox";
import { SITE } from "@/lib/site";

const sections = [
  { title: "Career Goal", body: SITE.cards.endGoal },
  { title: "Current Endeavors", body: SITE.cards.currentProjects },
  { title: "Daily Fun Fact", body: SITE.cards.funFacts },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type StackedContentBoxesProps = {
  /** When true: fill parent height and space boxes with justify-between (shared desktop row). */
  stretch?: boolean;
};

export function StackedContentBoxes({ stretch = false }: StackedContentBoxesProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={
        stretch
          ? "flex min-h-0 w-full flex-1 flex-col justify-between gap-0"
          : "flex w-full flex-col gap-5"
      }
    >
      {sections.map(({ title, body }) => (
        <motion.div key={title} variants={item} className="w-full shrink-0">
          <ContentBox title={title}>
            <p>{body}</p>
          </ContentBox>
        </motion.div>
      ))}
    </motion.div>
  );
}
