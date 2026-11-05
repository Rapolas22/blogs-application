"use client"

import LogoIcon from "@/assets/logo-icon"
import { ArrowRight, ChevronDown } from "lucide-react"
import {
  FaGithub as Github,
  FaFigma as Figma,
  FaSlack as Slack,
  FaTwitch as Twitch,
} from "react-icons/fa6"
import { SiFramer as Framer } from "react-icons/si"
import { motion, type Variants } from "motion/react"

interface NavLink {
  label: string
  href: string
  hasDropdown?: boolean
}

interface PartnerLogo {
  name: string
  mark: "github" | "figma" | "framer" | "slack" | "twitch"
}

interface Hero14Props {
  brandName?: string
  navLinks?: NavLink[]
  badgeText?: string
  headingLine1?: string
  headingLine2?: string
  description?: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  demoLabel?: string
  demoHref?: string
  partnerEyebrow?: string
  partners?: PartnerLogo[]
  backgroundImage?: string
  onCtaClick?: () => void
}

const navLinksDefault: NavLink[] = [
  { label: "Features", href: "#", hasDropdown: true },
  { label: "Pricing", href: "#", hasDropdown: true },
  { label: "About", href: "#" },
  { label: "Resources", href: "#" },
  { label: "FAQs", href: "#" },
]

const partnerLogosDefault: PartnerLogo[] = [
  { name: "GitHub", mark: "github" },
  { name: "Figma", mark: "figma" },
  { name: "Framer", mark: "framer" },
  { name: "Slack", mark: "slack" },
  { name: "Twitch", mark: "twitch" },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.14,
    },
  },
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.25, duration: 1.2 },
  },
}

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.25, duration: 1.2 },
  },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.1, duration: 1.6 },
  },
}

function PartnerMark({ mark }: { mark: PartnerLogo["mark"] }) {
  if (mark === "github") return <Github className="size-5" />
  if (mark === "figma") return <Figma className="size-5" />
  if (mark === "framer") return <Framer className="size-5" />
  if (mark === "slack") return <Slack className="size-5" />
  if (mark === "twitch") return <Twitch className="size-5" />

  return null
}

export default function Hero14({
  onCtaClick,
  headingLine1 = "Unleash Your Imagination",
  headingLine2 = "Beyond the Horizon",
  description = "Modern blog page where you can showcase your content with style and elegance. Engage your audience with a seamless reading experience.",
  primaryCtaLabel = "Get Started",
  backgroundImage = "https://images.unsplash.com/photo-1603366615917-1fa6dad5c4fa?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
}: Hero14Props) {
  return (
    <section className="relative min-h-screen max-w-screen overflow-hidden text-white antialiased">
      <motion.div
        className="relative flex min-h-screen max-w-full items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.38 }}
        variants={containerVariants}
      >
        <motion.img
          variants={imageVariants}
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-screen w-screen object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-stone-200 dark:to-stone-950" />

        <div className="relative z-10 flex w-full max-w-[76rem] flex-col items-center px-5 text-center sm:px-8 lg:px-12 2xl:max-w-7xl">
          <motion.h1
            variants={riseVariants}
            className="max-w-4xl text-[clamp(2.7rem,4.5vw,6.6rem)] leading-[0.98] font-light tracking-normal text-balance text-white 2xl:max-w-7xl"
          >
            <span className="block">{headingLine1}</span>
            <span className="mt-1 block font-serif text-[1.12em] leading-[0.92] font-normal text-white italic">
              {headingLine2}
            </span>
          </motion.h1>

          <motion.p
            variants={riseVariants}
            className="mt-5 max-w-xl text-sm leading-6 font-medium text-pretty text-white/62 sm:text-[15px]"
          >
            {description}
          </motion.p>

          <motion.button
            type="button"
            variants={riseVariants}
            onClick={() => onCtaClick?.()}
            className="group/cta mt-6 inline-flex min-h-10 items-center justify-center gap-1 rounded-md bg-zinc-100 px-6 text-sm font-normal text-slate-800 shadow-[inset_0_2px_0_0_rgba(255,255,255,1),inset_0_-1px_0_0_rgba(0,0,0,0.2)] transition-[background-color,color,transform] duration-200 ease-out text-shadow-2xs hover:bg-zinc-200 hover:text-slate-950 active:scale-[0.96]"
          >
            {primaryCtaLabel}
            <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover/cta:translate-x-1" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
