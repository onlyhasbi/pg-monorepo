import React from "react";

type Props = {
  text: string;
  highlight: string;
};

export default function GradientHighlight({ text, highlight }: Props) {
  if (!text || !highlight || !text.includes(highlight)) {
    return <TextWithBr text={text || ""} />;
  }

  const parts = text.split(highlight);

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          <TextWithBr text={part} />
          {i < parts.length - 1 && (
            <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent drop-shadow-sm">
              {highlight}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

function TextWithBr({ text }: { text: string }) {
  if (!text) return null;
  const mbrParts = text.split("{mbr}");
  return (
    <>
      {mbrParts.map((mbrPart, i) => (
        <React.Fragment key={`mbr-${i}`}>
          {mbrPart.split("{br}").map((brPart, j, arr) => (
            <React.Fragment key={`br-${j}`}>
              {brPart}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
          {i < mbrParts.length - 1 && <br className="block md:hidden" />}
        </React.Fragment>
      ))}
    </>
  );
}
