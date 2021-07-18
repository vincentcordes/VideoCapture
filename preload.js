const _require = require;
process.once('loaded', () => {
    global.require = _require;
});