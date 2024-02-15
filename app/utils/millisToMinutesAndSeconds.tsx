export function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = Math.floor((millis % 60000) / 1000);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
