type SingleAnswer = string | number | Array<unknown> | undefined;
export type Answers = [SingleAnswer, SingleAnswer] | [SingleAnswer] | [];
export type AnswerFunction = (
  inputs: [string, string],
  type: "real" | "test"
) => Answers | Promise<Answers>;
