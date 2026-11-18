import React, { useState } from "react";
import { CheckCircle2, Copy, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { UserData } from "@/types/user";
import { DEPOSIT_ADDRESSES } from "@/config/wallets";
import { Panel } from "./Panel";

interface ProfileInfoProps {
  userData: UserData | null;
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-1.5 py-4 sm:grid-cols-[200px_minmax(0,1fr)] sm:items-center sm:gap-6">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="min-w-0 text-foreground">{children}</dd>
  </div>
);

const AddressValue = ({ address, network }: { address: string; network: string }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({ title: "Address Copied", description: `${network} address copied to clipboard` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 py-1.5 pl-4 pr-1.5">
      <code className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">{address}</code>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-lg hover:bg-primary/10 hover:text-primary"
              onClick={copy}
              aria-label={`Copy ${network} address`}
            >
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy address"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const ProfileInfo = ({ userData }: ProfileInfoProps) => {
  return (
    <Panel title="Profile Information" bodyClassName="py-2">
      <dl className="divide-y divide-border">
        <Row label="Email">
          <span className="break-all">{userData?.email}</span>
        </Row>

        <Row label="Country">{userData?.country}</Row>

        <Row label="Verification Status">
          {userData?.verified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/25">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Verified Account
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 ring-1 ring-inset ring-orange-500/25">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              Not Verified
            </span>
          )}
        </Row>

        <Row label="PureNFT Deposit Address — ETH (ERC-20)">
          <AddressValue address={DEPOSIT_ADDRESSES.eth} network="Ethereum ERC-20" />
        </Row>

        <Row label="PureNFT Deposit Address — USDT (TRC-20)">
          <AddressValue address={DEPOSIT_ADDRESSES.trc20} network="USDT TRC-20" />
        </Row>
      </dl>
    </Panel>
  );
};
