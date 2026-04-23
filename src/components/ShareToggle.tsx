"use client";

type Props = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export default function ShareToggle({
  checked,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col items-start gap-1 self-start">
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        title={
          checked
            ? "Shared: other users can view this report"
            : "Private: only you can see this report"
        }
        aria-pressed={checked}
        className="inline-flex h-10 items-center rounded-xl border border-slate-300 bg-white px-1 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            !checked ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Private
        </span>

        <span
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            checked ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Shared
        </span>
      </button>

      <span className="pl-1 text-[11px] leading-none text-slate-500">
        {checked ? "Others can view" : "Only you can view"}
      </span>
    </div>
  );
}