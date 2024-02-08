export const getCurrentTimeFormatted = () => {
  const time = new Date();
  return `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;
};
