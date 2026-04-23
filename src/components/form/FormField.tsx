import { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export default function FormField({ label, children }: Props) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}