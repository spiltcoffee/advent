import { AnswerFunction } from "../../answer.ts";

function hasLegalCharacters(password: string): boolean {
  return !["i", "l", "o"].some((char) => password.includes(char));
}

function hasSequence(password: string): boolean {
  return [...password].some((char, index, array) => {
    const code = char.charCodeAt(0);
    return (
      code + 1 === array[index + 1]?.charCodeAt(0) &&
      code + 2 === array[index + 2]?.charCodeAt(0)
    );
  });
}

function hasDuplicates(password: string): boolean {
  return (
    [...password].filter(
      (char, index, array) =>
        char === array[index + 1] && char !== array[index - 1]
    ).length >= 2
  );
}

function isValidPassword(password: string): boolean {
  return (
    hasLegalCharacters(password) &&
    hasSequence(password) &&
    hasDuplicates(password)
  );
}

function nextChar(char: string): string {
  if (char === "z") {
    return "a";
  }
  char = String.fromCharCode(char.charCodeAt(0) + 1);
  return hasLegalCharacters(char) ? char : nextChar(char);
}

function nextString(str: string): string {
  return [
    ...[...str].reverse().reduce((str, char, index, array) => {
      if (!index) {
        return nextChar(char);
      } else {
        return (
          str +
          (str[index - 1] === "a" && str[index - 1] !== array[index - 1]
            ? nextChar(char)
            : char)
        );
      }
    }, "")
  ]
    .reverse()
    .join("");
}

function nextPassword(password: string): string {
  const original = password;
  while (!isValidPassword(password) || password === original) {
    if (!hasLegalCharacters(password)) {
      let advanced = false;
      password = [...password].reduce((str, char) => {
        if (advanced) {
          return str + "a";
        } else if (hasLegalCharacters(char)) {
          return str + char;
        } else {
          advanced = true;
          return nextString(str + char);
        }
      }, "");
    } else {
      password = nextString(password);
    }
  }
  return password;
}

export const answer: AnswerFunction = ([input]) => {
  const firstPassword = nextPassword(input);
  const secondPassword = nextPassword(firstPassword);
  return [firstPassword, secondPassword];
};
