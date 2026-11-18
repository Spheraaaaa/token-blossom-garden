import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Link } from "react-router-dom";

export const TransactionButtons = () => (
  <>
    <Link
      to="/deposit"
      className="btn-brand inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold"
    >
      <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
      Deposit
    </Link>
    <Link
      to="/withdraw"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
      Withdraw
    </Link>
  </>
);
