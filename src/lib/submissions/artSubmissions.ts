import { Post } from "../posts";
import { FINAL_SUBMISSION_TEXT, SubmissionHandler } from "../slater";
import { Message } from "../../message";
import { IMG_SELECTOR } from "../../querySelectors";

const SUPPORTING_MATERIAL_TEXT = "supporting material";

interface ArtSubmission {
  hasSupportingMaterial: boolean;
  imageUrls: string[];
}

const getSubmissionBase = ({
  el,
  post: { textLines, username },
  requiredImageCount,
}: {
  el: HTMLElement;
  post: Post;
  requiredImageCount: number;
}): ArtSubmission | null => {
  const isFinalSubmission =
    textLines[0].toLowerCase() === FINAL_SUBMISSION_TEXT;
  if (!isFinalSubmission) {
    return null;
  }
  const hasSupportingMaterial = textLines.some(
    (line) => line.toLowerCase() === SUPPORTING_MATERIAL_TEXT
  );
  const imgUrls = Array.from(el.querySelectorAll(IMG_SELECTOR)).map((img) => {
    const src = img.getAttribute("src") ?? "";
    return new URL(src, location.href).href;
  });
  if (imgUrls.length < requiredImageCount) {
    console.warn(
      `${username} needs ${requiredImageCount} for a final submission but only provided ${imgUrls.length}.`
    );
    return null;
  }
  return {
    hasSupportingMaterial,
    imageUrls: imgUrls,
  };
};

const formatBbCodeBase = ({
  artSubmission: { hasSupportingMaterial, imageUrls },
  post: { url, username },
  requiredImageCount,
}: {
  artSubmission: ArtSubmission;
  post: Post;
  requiredImageCount: number;
}): string => {
  const imageBbCodes = imageUrls
    .slice(0, requiredImageCount)
    .map((url) => `[IMG]${url}[/IMG]`);
  return (
    hasSupportingMaterial
      ? [
          Message.Divider,
          `[B]${username}[/B]`,
          ...imageBbCodes,
          `[URL=${url}]Supporting Material[/URL]`,
          Message.Divider,
        ]
      : [
          Message.Divider,
          `[B]${username}[/B]`,
          ...imageBbCodes,
          Message.Divider,
        ]
  ).join("\n");
};

export const artSubmissionsHandler: SubmissionHandler<ArtSubmission> = {
  formatBbCode: (post, submission) =>
    formatBbCodeBase({
      artSubmission: submission,
      post,
      requiredImageCount: 1,
    }),
  getSubmission: (el, post) =>
    getSubmissionBase({
      el,
      post,
      requiredImageCount: 1,
    }),
};

export const twoStageArtSubmissionsHandler: SubmissionHandler<ArtSubmission> = {
  formatBbCode: (post, submission) =>
    formatBbCodeBase({
      artSubmission: submission,
      post,
      requiredImageCount: 2,
    }),
  getSubmission: (el, post) =>
    getSubmissionBase({
      el,
      post,
      requiredImageCount: 2,
    }),
};
