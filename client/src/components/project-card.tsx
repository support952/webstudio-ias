import { memo } from "react";
import { Monitor, ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Project, SupportedLanguage } from "@/data/projectsData";

interface ProjectCardProps {
  project: Project;
  showInfo?: boolean;
  device?: "desktop" | "phone";
}

export const ProjectCard = memo(function ProjectCard({
  project,
  showInfo = true,
  device = "desktop",
}: ProjectCardProps) {
  const { lang } = useI18n();

  const { title, description } =
    project.translations[lang as SupportedLanguage] ??
    project.translations.en;

  const isRtl = lang === "he";

  return (
    <div className="group flex flex-col items-center">
      {device === "desktop" ? (
        <DesktopFrame project={project} />
      ) : (
        <PhoneFrame project={project} />
      )}

      {showInfo && (
        <div className={`mt-5 w-full ${isRtl ? "text-right" : "text-center"}`}>
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
            {project.category}
          </p>
          <h3 className="mt-1.5 text-base font-bold text-foreground sm:text-lg">{title}</h3>
          <p className={`mt-1.5 text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-2 ${
            isRtl ? "" : "mx-auto max-w-[90%]"
          }`}>
            {description}
          </p>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3.5 inline-flex items-center gap-1.5 text-xs font-medium text-neon-cyan/70 transition-all duration-300 hover:gap-2.5 hover:text-neon-cyan ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            {isRtl ? "צפה בפרויקט" : "View Project"}
            {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
          </a>
        </div>
      )}
    </div>
  );
});

const IMG_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

function DesktopFrame({ project }: { project: Project }) {
  return (
    <div className="relative w-full will-change-transform transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
      <div className="relative mx-auto w-[94%] rounded-[10px] bg-gradient-to-b from-[#303032] via-[#28282a] to-[#1c1c1e] p-[5px] shadow-xl shadow-black/25">
        <div className="pointer-events-none absolute inset-x-[8%] top-[1px] h-[1px] rounded-full bg-white/[0.12]" />
        <div className="overflow-hidden rounded-[7px] border border-black/80 bg-black">
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c1d] via-[#080810] to-[#0c0c1d]" />
            {!project.imageUrl && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-white/[0.05]" />
              </div>
            )}
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt=""
                width={1280}
                height={4384}
                loading="lazy"
                decoding="async"
                sizes={IMG_SIZES}
                className="relative z-20 w-full h-auto will-change-transform translate-y-0 transition-transform duration-[3s] ease-in-out group-hover:translate-y-[calc(-100%+200px)] group-hover:duration-[40s] group-hover:ease-linear"
              />
            )}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-[94%]">
        <div className="mx-auto h-[14px] rounded-b-[6px] bg-gradient-to-b from-[#2a2a2c] to-[#1e1e20]">
          <div className="absolute bottom-[2px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-white/[0.04]" />
        </div>
      </div>

      <div className="relative mx-auto h-[28px] w-[11%]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#28282a] via-[#222224] to-[#1e1e20]" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/[0.08] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-white/[0.08] to-transparent" />
      </div>

      <div className="relative mx-auto h-[6px] w-[32%]">
        <div className="absolute inset-0 rounded-[100%] bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e]" />
        <div className="absolute inset-x-[10%] top-0 h-[1px] rounded-full bg-white/[0.07]" />
      </div>

      <div className="mx-auto mt-[2px] h-[5px] w-[38%] rounded-[100%] bg-blue-500/[0.04] blur-[4px]" />
    </div>
  );
}

function PhoneFrame({ project }: { project: Project }) {
  return (
    <div className="relative mx-auto w-full">
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] p-[3px] shadow-xl shadow-black/30">
        <div className="pointer-events-none absolute -left-[2px] top-[22%] h-[8%] w-[2px] rounded-l-full bg-[#3a3a3c]" />
        <div className="pointer-events-none absolute -left-[2px] top-[34%] h-[12%] w-[2px] rounded-l-full bg-[#3a3a3c]" />
        <div className="pointer-events-none absolute -left-[2px] top-[48%] h-[12%] w-[2px] rounded-l-full bg-[#3a3a3c]" />
        <div className="pointer-events-none absolute -right-[2px] top-[30%] h-[14%] w-[2px] rounded-r-full bg-[#3a3a3c]" />

        <div className="overflow-hidden rounded-[25px] border border-black/60 bg-black">
          <div className="relative flex justify-center pt-[6px] pb-[4px] bg-black">
            <div className="h-[10px] w-[28%] rounded-full bg-[#111]" />
          </div>

          <div className="relative aspect-[9/19.5] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c1d] via-[#080810] to-[#0c0c1d]" />
            {!project.imageUrl && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-white/[0.05]" />
              </div>
            )}
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt=""
                width={1280}
                height={4384}
                loading="lazy"
                decoding="async"
                sizes="260px"
                className="relative z-20 w-full h-auto object-top"
              />
            )}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" />
          </div>

          <div className="flex justify-center bg-black py-[5px]">
            <div className="h-[4px] w-[30%] rounded-full bg-white/[0.15]" />
          </div>
        </div>
      </div>
    </div>
  );
}
