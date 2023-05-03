const dateOptions: object = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function format(date?: string) {
  if (!date) {
    return null;
  }
  return new Date(date).toLocaleDateString(undefined, dateOptions);
}
