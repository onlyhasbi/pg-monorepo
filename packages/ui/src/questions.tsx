import React from "react";
import BaseLayout from "@repo/ui/layout/base";
import SectionHeader from "./ui/section_header";
import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@repo/ui/ui/accordion";

interface FAQItem {
  category: string;
  ask: string;
  answer: string;
}

function Questions() {
  const { t } = useTranslation();

  const data = t("faq.items", { returnObjects: true }) as FAQItem[];

  // Split data into two balanced columns
  const midPoint = Math.ceil(data.length / 2);
  const leftColumn = data.slice(0, midPoint);
  const rightColumn = data.slice(midPoint);

  const FAQItemComponent = ({ item }: { item: FAQItem }) => (
    <AccordionItem
      value={item.ask}
      className="rounded-xl border-none bg-white shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <AccordionTrigger className="w-full flex justify-between items-start p-4 text-left group hover:no-underline [&>svg]:mt-1.5 [&>svg]:text-slate-400">
        <div className="flex items-start gap-3 w-full pr-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-red-50 text-slate-500 group-hover:text-red-600 flex items-center justify-center transition-colors duration-300">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 flex flex-col pt-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-red-600 transition-colors">
              {item.category}
            </span>
            <h3 className="font-semibold text-sm mt-1 text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed pr-2">
              {item.ask}
            </h3>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-1 ml-11 text-sm text-slate-500 leading-relaxed text-left">
        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <BaseLayout className="flex-col justify-between py-16">
      <SectionHeader
        title={t("faq.title")}
        highlight="Pertanyaan"
        subtitle={t("faq.desc")}
      />

      {/* Two Independent Columns */}
      <div className="w-full flex flex-col md:flex-row gap-4 mt-8 md:mt-12">
        {/* Left Column */}
        <div className="flex-1">
          <Accordion className="flex flex-col gap-4">
            {leftColumn.map((item, index) => (
              <FAQItemComponent key={`left-${index}`} item={item} />
            ))}
          </Accordion>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <Accordion className="flex flex-col gap-4">
            {rightColumn.map((item, index) => (
              <FAQItemComponent key={`right-${index}`} item={item} />
            ))}
          </Accordion>
        </div>
      </div>
    </BaseLayout>
  );
}

const QuestionsMemo = React.memo(Questions);
export default QuestionsMemo;
