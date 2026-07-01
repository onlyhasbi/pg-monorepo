import { dialCodeOptions } from "@repo/constant/countries";
import { cn } from "@repo/lib/utils";
import { useMemo, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
} from "./combobox";
import { Input } from "./input";

interface PhoneInputFieldProps {
  /** Current dial code value, e.g. "62" */
  value: string;
  /** Called when user selects a new dial code */
  onDialCodeChange: (code: string) => void;
  /** Props spread onto the phone number Input (e.g. from react-hook-form register) */
  inputProps?: React.ComponentProps<typeof Input>;
  /** Placeholder text for the phone number input */
  placeholder?: string;
  /** CSS class for the outer container */
  className?: string;
}

export function PhoneInputField({
  value,
  onDialCodeChange,
  inputProps,
  placeholder = "8123456789",
  className,
}: PhoneInputFieldProps) {
  const [dialCodeSearch, setDialCodeSearch] = useState("");

  const filteredDialCodes = useMemo(() => {
    if (!dialCodeSearch) return dialCodeOptions;
    const term = dialCodeSearch.toLowerCase();
    return dialCodeOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(term) || opt.value.includes(term),
    );
  }, [dialCodeSearch]);

  return (
    <div
      className={cn(
        "flex bg-card rounded-[var(--radius-input)] overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-ring transition-all",
        className,
      )}
    >
      <div className="w-[100px] border-r border-input">
        <Combobox
          onValueChange={(val: string | null) => val && onDialCodeChange(val)}
          value={value}
          inputValue={dialCodeSearch}
          onInputValueChange={setDialCodeSearch}
        >
          <ComboboxTrigger className="border-none bg-muted rounded-none h-full focus:ring-0">
            <ComboboxValue className="truncate">
              {dialCodeOptions
                .find((opt) => opt.value === value)
                ?.label?.replace("+", "") || "62"}
            </ComboboxValue>
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput placeholder="Cari..." />
            <ComboboxEmpty>No results.</ComboboxEmpty>
            {filteredDialCodes.map((opt) => (
              <ComboboxItem key={opt.label} value={opt.value}>
                {opt.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </Combobox>
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        {...inputProps}
        className="flex-1 border-none bg-transparent focus-visible:ring-0"
      />
    </div>
  );
}
