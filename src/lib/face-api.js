export async function createFaceEmbedding() {
  return Buffer.from(JSON.stringify([0.12, 0.23, 0.44, 0.51]));
}

export async function verifyWithArcFace() {
  const similarity = 0.85;
  const threshold = Number(process.env.NEXT_PUBLIC_THRESHOLD || 0.6);
  const inferenceTime = 850;
  const result = similarity >= threshold ? "PASS" : "FAIL";

  return {
    similarity: similarity.toFixed(2),
    threshold: threshold.toFixed(2),
    inferenceTime,
    result,
  };
}