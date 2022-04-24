/* eslint-disable no-console */
class Logger {
  private static log(
    consoleType: 'debug' | 'error' | 'info' | 'warn',
    data: any,
    showTime: boolean,
  ) {
    if (process.env.NODE_ENV === 'production') return;

    const time = new Date().toString();
    const loggedData = showTime ? `${time}: ${data}` : data;

    switch (consoleType) {
      case 'debug': {
        console.debug(loggedData);
        break;
      }
      case 'error': {
        console.error(loggedData);
        break;
      }
      case 'warn': {
        console.warn(loggedData);
        break;
      }
      default: {
        console.info(loggedData);
      }
    }
  }

  static debug(data: any, showTime = false) {
    this.log('debug', data, showTime);
  }

  static error(data: any, showTime = false) {
    this.log('error', data, showTime);
  }

  static info(data: any, showTime = false) {
    this.log('info', data, showTime);
  }

  static warn(data: any, showTime = false) {
    this.log('warn', data, showTime);
  }
}

export default Logger;
