export function getURLFromKey(key: string) {
  return `${process.env.NEXT_PUBLIC_AWS_ENDPOINT}/${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}/${key}`;
}
