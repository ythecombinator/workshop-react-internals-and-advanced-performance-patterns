//  ---------------------------------------------------------------------------
//  HELPERS
//  ---------------------------------------------------------------------------

const colors = {
  black: (text: string) => `\x1b[30m${text}\x1b[0m`,
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  blue: (text: string) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text: string) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  white: (text: string) => `\x1b[37m${text}\x1b[0m`,
  // Bright variants
  blackBright: (text: string) => `\x1b[90m${text}\x1b[0m`,
  redBright: (text: string) => `\x1b[91m${text}\x1b[0m`,
  greenBright: (text: string) => `\x1b[92m${text}\x1b[0m`,
  yellowBright: (text: string) => `\x1b[93m${text}\x1b[0m`,
  blueBright: (text: string) => `\x1b[94m${text}\x1b[0m`,
  magentaBright: (text: string) => `\x1b[95m${text}\x1b[0m`,
  cyanBright: (text: string) => `\x1b[96m${text}\x1b[0m`,
  whiteBright: (text: string) => `\x1b[97m${text}\x1b[0m`,
  // Styles
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  italic: (text: string) => `\x1b[3m${text}\x1b[0m`,
  underline: (text: string) => `\x1b[4m${text}\x1b[0m`,
  // Background colors
  bgBlack: (text: string) => `\x1b[40m${text}\x1b[0m`,
  bgRed: (text: string) => `\x1b[41m${text}\x1b[0m`,
  bgGreen: (text: string) => `\x1b[42m${text}\x1b[0m`,
  bgYellow: (text: string) => `\x1b[43m${text}\x1b[0m`,
  bgBlue: (text: string) => `\x1b[44m${text}\x1b[0m`,
  bgMagenta: (text: string) => `\x1b[45m${text}\x1b[0m`,
  bgCyan: (text: string) => `\x1b[46m${text}\x1b[0m`,
  bgWhite: (text: string) => `\x1b[47m${text}\x1b[0m`,
};

//  ---------------------------------------------------------------------------
//  CORE
//  ---------------------------------------------------------------------------

const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`${colors.blue('ℹ')} ${message}`, ...args);
  },

  success: (message: string, ...args: any[]) => {
    console.log(`${colors.green('✓')} ${message}`, ...args);
  },

  header: (title: string) => {
    const line = '='.repeat(title.length + 4);

    console.log(
      colors.cyan(line) +
        '\n' +
        colors.cyan(`${colors.bold(title)}`) +
        '\n' +
        colors.cyan(line)
    );
  },

  keyValue: (key: string, value: any) => {
    console.log(`${colors.whiteBright(key)}: ${colors.green(String(value))}`);
  },

  intro: () => {
    console.log(
      `${colors.cyan(`
   ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
   ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
   ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
   ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
   ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
    ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
  `)}${colors.yellow(`
   ╔═══════════════════════════════════════════════════════════════════════╗
   ║          React: Internals and Advanced Performance Patterns           ║
   ╚═══════════════════════════════════════════════════════════════════════╝
  `)}`
    );
  },
};

export default logger;
