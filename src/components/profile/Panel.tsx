import React from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Optional action bar pinned to the bottom of the panel (e.g. a form's submit row). */
  footer?: React.ReactNode;
}

/**
 * The one surface used across the account area: a titled panel with an
 * optional action slot. Content inside uses rows and dividers, never nested cards.
 */
export const Panel = ({ title, description, actions, children, className, bodyClassName, footer }: PanelProps) => (
  <section className={cn("rounded-2xl border border-border bg-card", className)}>
    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
      <div className="min-w-0">
        <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
    <div className={cn("px-5 py-6 md:px-7", bodyClassName)}>{children}</div>
    {footer && (
      <div className="flex flex-col gap-3 rounded-b-2xl border-t border-border bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-7">
        {footer}
      </div>
    )}
  </section>
);
