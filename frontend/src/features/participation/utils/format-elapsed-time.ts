export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const minuteAndSeconds = [minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${minuteAndSeconds}`
    : minuteAndSeconds;
}
