export const apiKey = 'ea71e20fa1e0a8bdb70fd37c7b2aabcf';
export const baseUrl = 'https://api.openweathermap.org/data/2.5/box/city';
export const bboxUrl = (coords, zoom = 10) => `${baseUrl}?bbox=${coords.join(',')},${zoom}&appid=${apiKey}`;
export const threshold = {
  temp: 21,
  humidity: 50
};
