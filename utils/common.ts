import dayjs from 'dayjs';

export function findGender(gender: 0 | 1 | 2 | 3) {
  switch (gender) {
    case 1:
      return 'Female';
    case 2:
      return 'Male';
    default:
      return '\uD83D\uDE03';
  }
}

export function parseYear(release_date: string | null) {
  if (!release_date) return '-';

  return dayjs(release_date).format('YYYY');
}

export function birthday(date: Date | null) {
  if (!date) return null;

  const currentDate = new Date();
  const diff = currentDate.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function formatTitle(title: string, release_date: string | null) {
  return `${title} | ${parseYear(release_date)}`;
}

export function copyToClipboard(
  text: string,
  successfulCallback?: Function,
  // eslint-disable-next-line no-unused-vars
  errCallBack?: Function
) {
  navigator.clipboard.writeText(text).then(
    () => {
      if (successfulCallback) {
        successfulCallback();
      }
    },
    (err) => {
      if (errCallBack) {
        errCallBack(err);
      }
    }
  );
}
