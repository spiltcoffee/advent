type SingleAnswer = string | number | Array | undefined;
export type Answers = [SingleAnswer, SingleAnswer];
export type AnswerFunction = (
  inputs: [string, string],
  type: "real" | "test"
) => Answers | Promise<Answers>;
