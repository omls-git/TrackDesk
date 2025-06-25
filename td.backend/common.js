export const formattedIST = () => {
  const date = new Date();
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // UTC + 5:30
  const formattedIST = istDate.toISOString().slice(0, 19).replace("T", " ");

  return formattedIST;
}