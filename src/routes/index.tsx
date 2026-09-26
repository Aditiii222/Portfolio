import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Learning } from "@/components/portfolio/Learning";
import { Journey } from "@/components/portfolio/Journey";
import { Contact } from "@/components/portfolio/Contact";
import { Loader } from "@/components/portfolio/Loader";

const title = "Aditi Anand Guddeti — IT Student Exploring AI & Machine Learning";
const description =
  "Portfolio of Aditi Anand Guddeti, a third-year B.E. Information Technology student in Pune building skills in Python, machine learning and practical AI projects.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background">
      <Loader />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Learning />
        <Journey />
        <Contact />
      </main>
    </div>
  );
}
