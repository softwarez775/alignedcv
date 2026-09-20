import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Banknote, CalendarDays, Briefcase, FileCheck2, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatSalary, timeAgo } from "@/lib/utils";
import type { Job } from "@/types";

export function JobHeader({
  job,
  applied,
  saved,
  onApply,
  onSave,
}: {
  job: Job;
  applied: boolean;
  saved: boolean;
  onApply: () => void;
  onSave: () => void;
}) {
  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground">
        <Link to="/app/vagas">
          <ArrowLeft className="h-4 w-4" /> Voltar para vagas
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary dark:text-primary-foreground">
            {job.logoInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <p className="mt-1 text-muted-foreground">
              {job.company} · {job.area}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {job.workModel} · {job.seniority}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> {timeAgo(job.publishedAt)}
              </span>
              {formatSalary(job.salaryMin, job.salaryMax) && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                  <Banknote className="h-4 w-4" /> {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{job.contract}</Badge>
              {job.keywords.slice(0, 4).map((k) => (
                <Badge key={k} variant="outline" className="text-muted-foreground">{k}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onSave}>
            {saved ? <BookmarkCheck className="h-4 w-4 text-success" /> : <BookmarkPlus className="h-4 w-4" />}
            {saved ? "Vaga salva" : "Salvar vaga"}
          </Button>
          {applied ? (
            <Button variant="secondary" disabled>
              <FileCheck2 className="h-4 w-4" /> Candidatura enviada
            </Button>
          ) : (
            <Button onClick={onApply}>
              <FileCheck2 className="h-4 w-4" /> Quero me candidatar
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-6" />
    </div>
  );
}
