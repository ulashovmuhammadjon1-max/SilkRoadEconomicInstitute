import { BriefsFeature } from "@/components/home/BriefsFeature";
import { ForumFeature } from "@/components/home/ForumFeature";
import { Follow } from "@/components/home/Follow";
import { Founder } from "@/components/home/Founder";
import { Hero } from "@/components/home/Hero";
import { Institute } from "@/components/home/Institute";
import { Intro } from "@/components/home/Intro";
import { PapersFeature } from "@/components/home/PapersFeature";
import { Participate } from "@/components/home/Participate";
import { Pillars } from "@/components/home/Pillars";
import { WhyCentralAsia } from "@/components/home/WhyCentralAsia";
import { MapDefs } from "@/components/map/MapSvg";
import { MotionProvider } from "@/components/motion/MotionProvider";

export default function HomePage() {
  return (
    <MotionProvider>
      <div className="-mb-24">
      <MapDefs />
      <Intro />
      <Hero />
      <Institute />
      <Pillars />
      <ForumFeature />
      <PapersFeature />
      <BriefsFeature />
      <WhyCentralAsia />
      <Participate />
      <Founder />
      <Follow />
      </div>
    </MotionProvider>
  );
}
