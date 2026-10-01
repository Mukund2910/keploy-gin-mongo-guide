import type { MDXComponents } from "mdx/types";
import { Pre } from "@/components/client";

const components: MDXComponents = {
  pre: Pre,
  a: ({ href = "", ...props }) =>
    href.startsWith("http") ? <a href={href} target="_blank" rel="noreferrer" {...props} /> : <a href={href} {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
