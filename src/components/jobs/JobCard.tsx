import { Link } from "react-router-dom";
import { MapPin, Clock, Banknote, BookmarkPlus, BookmarkCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MatchScore } from "@/components/match/MatchScore";
import { cn } from "@/lib/utils";
import { formatSalary, timeAgo } from "@/lib/utils";
import type { Job } from "@/types";

/** Card de vaga — seções 6 e 7 do prompt */
export function JobCard({
  job,
  match,
  saved,
  onSave,
  className,
}: {
  job: Job;
  match: number;
  saved?: boolean;
  onSave?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn("group transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11 rounded-lg">
            <AvatarFallback className="rounded-lg">
              {job.logoInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Link
              to={`/app/vagas/${job.id}`}
              className="block truncate text-base font-semibold hover:text-primary"
            >
              {job.title}
            </Link>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <MatchScore score={match} size="sm" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {timeAgo(job.publishedAt)}
          </span>
          {formatSalary(job.salaryMin, job.salaryMax) && (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Banknote className="h-3.5 w-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary">{job.seniority}</Badge>
          <Badge variant="secondary">{job.workModel}</Badge>
          <Badge variant="secondary">{job.contract}</Badge>
          {job.requirements.slice(0, 3).map((r) => (
            <Badge key={r} variant="outline" className="text-muted-foreground">
              {r}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={`/app/vagas/${job.id}`}>
              Ver detalhes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onSave}
              aria-label={saved ? "Remover vaga dos salvos" : "Salvar vaga"}
            >
              {saved ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-success" />
              ) : (
                <BookmarkPlus className="h-3.5 w-3.5" />
              )}
              {saved ? "Salva" : "Salvar"}
            </Button>
            <Button size="sm" asChild>
              <Link to={`/app/curriculo/adaptar/${job.id}`}>Adaptar currículo</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
