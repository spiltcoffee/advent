import { Parser, Printer, SupportLanguage, SupportOption } from "prettier";

export const languages: Partial<SupportLanguage>[] = [
  {
    name: "advent-io",
    parsers: ["advent-io"],
    extensions: [".txt"],
    vscodeLanguageIds: ["advent-io"]
  }
];

export const parsers: Record<string, Parser<string>> = {
  "advent-io": {
    astFormat: "advent-io",
    parse(text) {
      return text;
    },
    locStart() {
      return 0;
    },
    locEnd(node) {
      return node.length;
    }
  }
};

export const printers: Record<string, Printer<string>> = {
  "advent-io": {
    print(path) {
      return path.getNode().trimEnd();
    }
  }
};

export const options: Record<string, SupportOption> = {};
