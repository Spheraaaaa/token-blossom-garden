import React from "react";
import { Button } from "@/components/ui/button";
import { User, Home, BadgeCheck, CheckCircle2, HelpCircle, Check } from "lucide-react";
import type { UserData } from "@/types/user";
import { Panel } from "./Panel";

interface VerificationTabProps {
  userData: UserData | null;
  startKYCVerification: () => void;
  continueKYCVerification: () => void;
}

type StepState = "done" | "current" | "upcoming";

const Step = ({
  icon: Icon,
  title,
  state,
  isLast,
  children,
}: {
  icon: React.ElementType;
  title: string;
  state: StepState;
  isLast?: boolean;
  children?: React.ReactNode;
}) => (
  <li className="relative flex gap-4 pb-8 last:pb-0">
    {!isLast && (
      <span
        aria-hidden="true"
        className={`absolute left-5 top-11 h-[calc(100%-2.75rem)] w-px ${state === "done" ? "bg-accent/50" : "bg-border"}`}
      />
    )}
    <span
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${
        state === "done"
          ? "bg-accent/15 text-accent ring-accent/30"
          : state === "current"
            ? "bg-primary/15 text-primary ring-primary/40"
            : "bg-muted text-muted-foreground ring-border"
      }`}
    >
      {state === "done" ? <Check className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
    </span>
    <div className="min-w-0 flex-1 pt-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className={`font-semibold ${state === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>{title}</h3>
        {state === "current" && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Current step</span>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  </li>
);

export const VerificationTab = ({ userData, startKYCVerification, continueKYCVerification }: VerificationTabProps) => {
  const status = userData?.kyc_status;
  const verified = Boolean(userData?.verified);

  const statusText = verified
    ? "Verified"
    : status === "not_started"
      ? "Not Started"
      : status === "identity_submitted"
        ? "Identity Submitted"
        : status === "under_review"
          ? "Under Review"
          : "Not Verified";

  const identityState: StepState = status === "not_started" ? "current" : "done";
  const addressState: StepState =
    status === "identity_submitted" ? "current" : status === "under_review" || verified ? "done" : "upcoming";
  const completeState: StepState = verified ? "done" : "upcoming";

  return (
    <Panel title="KYC Verification">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${
            verified ? "bg-accent/10 ring-accent/25" : "bg-orange-500/10 ring-orange-500/25"
          }`}
        >
          {verified ? (
            <CheckCircle2 className="h-6 w-6 text-accent" aria-hidden="true" />
          ) : (
            <HelpCircle className="h-6 w-6 text-orange-400" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-foreground">
              KYC Status: <span className={verified ? "text-accent" : "text-orange-400"}>{statusText}</span>
            </p>
            {status === "under_review" && (
              <span className="text-sm font-medium tabular-nums text-orange-400">80%</span>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">
            {verified
              ? "Your account is fully verified and has access to all features"
              : status === "under_review"
                ? "Final verification check in progress"
                : "Complete verification to unlock all features"}
          </p>
          {status === "under_review" && (
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-orange-500/15">
              <div className="h-full rounded-full bg-orange-400 transition-all duration-1000" style={{ width: "80%" }} />
            </div>
          )}
        </div>
      </div>

      <ol className="mt-8 border-t border-border pt-8">
        <Step icon={User} title="Identity" state={identityState}>
          {status === "not_started" && (
            <Button onClick={startKYCVerification} className="btn-brand h-11 rounded-full px-6 font-semibold">
              Start Verification
            </Button>
          )}
        </Step>

        <Step icon={Home} title="Address" state={addressState}>
          {(status === "identity_submitted" || status === "not_started") && (
            <Button
              onClick={continueKYCVerification}
              className="btn-brand h-11 rounded-full px-6 font-semibold disabled:opacity-40"
              disabled={status === "not_started"}
            >
              Submit Address Documents
            </Button>
          )}
        </Step>

        <Step icon={BadgeCheck} title="Verification" state={completeState} isLast />
      </ol>
    </Panel>
  );
};
