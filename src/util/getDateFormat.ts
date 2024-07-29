const getDateFormat = (date?: string) => {
  if (!date) return '';
  return `${date.slice(0, 10)} ${date.slice(11, 19)}`;
};

export default getDateFormat;
