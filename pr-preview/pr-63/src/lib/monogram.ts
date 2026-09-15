// A generated identity mark for a tool: letters and a hue, derived from the name and
// stable across visits. It stands in for a brand logo, for the reasons in REFERENCE.md.


/** `AWS EC2` reads as EC, not AE. The vendor prefix is the least distinctive part. */
const VENDOR_PREFIX = /^(AWS|Amazon|Apache|GNU)\s+/i;

/**
 * The identifying part of a tool's name: vendor prefix and parentheticals stripped.
 * `AWS Certificate Manager` is `Certificate Manager`. The grid sorts on this and the mark
 * is built from it, and the two must stay the same string.
 */
export const distinctiveName = (name: string): string =>
  name
    .replace(/\(.*?\)/g, " ")
    .replace(VENDOR_PREFIX, "")
    .trim();

export const monogram = (name: string): string => {
  const cleaned = distinctiveName(name);
  const words = cleaned.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return name.slice(0, 2).toUpperCase();

  // Several words: one letter each. `EBS CSI Driver` is ECD, `GitHub Actions` is GA.
  if (words.length >= 2) {
    return words
      .slice(0, 3)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  const word = words[0];

  // Already an acronym, so keep it: ECS, ECR, EC2, S3, EKS, RDS. Cutting these to two
  // characters is what collapsed four distinct AWS services onto `EC`.
  if (/^[A-Z0-9]+$/.test(word)) return word.slice(0, 3);

  // Internal capitals mark where the word divides: CloudFormation is CF, CloudWatch CW,
  // CloudTrail CT. Without this the whole family collapses onto `CL`.
  const humps = word.match(/[A-Z][a-z0-9]*/g);
  if (humps && humps.length >= 2) {
    return humps
      .slice(0, 3)
      .map((h) => h[0])
      .join("")
      .toUpperCase();
  }

  return word.slice(0, 3).toUpperCase();
};

/** A stable hue per tool. Hue only: saturation and lightness are fixed per theme in
 *  src/index.css, so the marks vary along one axis. */
export const hueOf = (name: string): number => {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
};
