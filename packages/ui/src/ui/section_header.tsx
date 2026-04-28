import React from "react";
import GradientHighlight from "./gradient_highlight";

type Props = {
  title: string;
  highlight?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export default function SectionHeader({
  title,
  highlight,
  subtitle,
  children,
}: Props) {
  return (
    <div className="text-center mb-10">
      {children ?? (
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          <GradientHighlight text={title} highlight={highlight || ""} />
        </h2>
      )}
      {subtitle && (
        <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
