import { Post } from "../posts";
import { SubmissionHandler } from "../slater";
import { FINAL_SUBMISSION_TEXT, Parsed } from "./submissions";

interface NameSubmission {
  name: string;
  postUrl: string;
  username: string;
}

const MAX_DESCRIPTION_LENGTH = 25;
const MAX_NAME_LENGTH = 12;
const PRONUNCIATION_TEXT = "Pronounced: ";

const isDescriptionLegal = (description: string): boolean => {
  // Is description no longer than 25 words?
  // TODO: Use a library to count words.
  // Try: https://github.com/RadLikeWhoa/Countable

  return description.split(" ").length <= MAX_DESCRIPTION_LENGTH;
};

const isNameLegal = (str: string): boolean => {
  // Names cannot be longer than 12 letters.
  if (str.length > MAX_NAME_LENGTH) {
    return false;
  }
  // Names can only contain certain characters.
  if (!str.match(/^[A-Za-z0-9 .\-':]+$/)) {
    return false;
  }
  // No more than two capital letters can be included in the name,
  // and capital letters cannot be consecutive.
  const capitals = str.match(/[A-Z]/g);
  if (capitals) {
    switch (capitals.length) {
      case 1: {
        if (!str.startsWith(capitals[0])) {
          return false;
        }
        break;
      }
      case 2: {
        if (!str.startsWith(capitals[0])) {
          return false;
        }
        const rest = str.substring(1);
        if (rest.startsWith(capitals[0])) {
          return false;
        }
        break;
      }
      default: {
        return false;
      }
    }
  } else {
    return false;
  }

  // A maximum of two non-letters can be included in the name,
  // and a maximum of one non-letter of each type can be included
  // (i.e. You can't have two numbers, or two apostrophes,
  // but you could have one number and one apostrophe).
  // NOTE: This only works because underlines are filtered out above.
  // \W is shorthand for not alphabetical + underscore.
  const nonLetters = str.match(/\W/g);
  const uniqueNonLetters = new Set(nonLetters);

  if (nonLetters !== null) {
    if (nonLetters.length > uniqueNonLetters.size) {
      return false;
    }
  }
  return true;
};

const isPronunciationLegal = (pronunciation: string): boolean => {
  return pronunciation.startsWith(PRONUNCIATION_TEXT);
};

export const parseSubmission = ({
  textLines,
  url,
  username,
}: Post): Parsed<NameSubmission> => {
  const [finalSubmissionText, , name, , description, , pronunciation] =
    textLines;
  const isFinalSubmission =
    finalSubmissionText.toLowerCase() === FINAL_SUBMISSION_TEXT;

  if (!isFinalSubmission) {
    return Parsed.issues([]);
  }

  // Doesn't have enough fields
  if (
    [finalSubmissionText, name, description, pronunciation].some(
      (s) => s === undefined
    )
  ) {
    return Parsed.issues([
      `${username}'s submission is missing required lines.`,
    ]);
  }

  const issues: string[] = [
    ...(isNameLegal(name)
      ? []
      : [
          `${username}'s submission "${name}" does not meet the name format rules.`,
        ]),
    ...(isDescriptionLegal(description)
      ? []
      : [
          `${username}'s description "${description}" longer than the maximum description length of ${MAX_DESCRIPTION_LENGTH}.`,
        ]),
    ...(isPronunciationLegal(pronunciation)
      ? []
      : [
          `${username}'s pronunciation "${pronunciation}" does not start with "${PRONUNCIATION_TEXT}".`,
        ]),
  ];
  if (issues.length > 0) {
    return Parsed.issues(issues);
  }
  return Parsed.of({
    name,
    postUrl: url,
    username,
  });
};

const formatBbCode = ({ name, postUrl }: NameSubmission): string => {
  return `[B]${name}[/B] [URL=${postUrl}]>>>[/URL]`;
};

export const nameSubmissionsHandler: SubmissionHandler<NameSubmission> = {
  formatBbCode,
  parseSubmission,
};
