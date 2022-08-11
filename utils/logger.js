const c = require('ansi-colors');

const colorMapper = {
    log: msg => msg + '',
    tip: msg => c.blue.italic(msg),
    success: msg => c.green(msg),
    warn: msg => c.yellowBright(msg),
    error: msg => c.red.bold(msg)
};

const logger = {
    label: label => console.log(c.black.bgCyan(`[${label}]`))
};

for (const key in colorMapper) {
    if (colorMapper.hasOwnProperty(key)) {
        const mapper = colorMapper[key];
        logger[key] = msg => console.log(mapper(msg));
        logger[`${key}L`] = (label, msg) => console.log(`${c.black.bgCyan(`[${label}]`)} ${mapper(msg)}`);
    }
}

module.exports = logger;
