export function formatFileSizeInMb(fileSizeInBytes: number): string {
  const sizeInMb = fileSizeInBytes / (1024 * 1024);

  return `${sizeInMb.toFixed(2)} MB`;
}
