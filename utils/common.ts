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

export function parseYear(release_date: string) {
  return dayjs(release_date).format('YYYY');
}
