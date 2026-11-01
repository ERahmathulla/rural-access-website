import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { RichTextValue } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-3 list-disc space-y-3 pl-6 marker:text-amber">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-3 list-decimal space-y-3 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => <a href={value?.href}>{children}</a>,
  },
};

export function RichText({ value }: { value: RichTextValue }) {
  return <PortableText value={value} components={components} />;
}
