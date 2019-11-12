// v.2.2

export function binder({bounds, runTests}) {
    let t0, t1;
    if (runTests) t0 = performance.now();
    // polyfill for ".matches()" method
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector;
    }
    // gather all selectors in array
    const selectorsToFind = Object.keys(bounds);
    // find selectors in document
    const foundElements = [...document.querySelectorAll(selectorsToFind.join(","))];
    // filter bounds for not founded selectors
    let filteredBounds = {};
    for (let key in bounds) {
        if (foundElements.some(element => element.matches(key))) {
            filteredBounds[key] = bounds[key];
        } else {
            if (runTests) console.log(`- ${key} was not found`);
        }
    }
    // gather all modules in one object
    let mergedModules = {};
    for (let bound in filteredBounds) {
        let module = filteredBounds[bound];
        let nature = Object.prototype.toString.call(module);
        if (nature === "[object Array]") {
            module.forEach(script => {
                if (Object.prototype.toString.call(script) === "[object Function]") {
                    mergedModules[script.name] = script;
                    mergedModules[script.name]();
                } else {
                    mergedModules = Object.assign(mergedModules, script);
                }
            });
        } else if (nature === "[object Object]") {
            if (module.f !== undefined) {
                // call function with arguments
                mergedModules[module.f.name] = module.f;
                mergedModules[module.f.name](...module.a);
            } else {
                // or just merge object
                mergedModules = Object.assign(mergedModules, module);
            }
        } else if (nature === "[object Function]") {
            mergedModules[module.name] = module;
            mergedModules[module.name]();
        } else {
            console.log("! unsupported format: ", module);
        }
    }
    if (runTests) console.log("binderResultObject: ", mergedModules);
    if (runTests) t1 = performance.now();
    if (runTests) console.log("Binder html parsing took " + (t1 - t0) + " milliseconds.");
}

// for function with arguments
export const fwa = (...args) => ({f: args.shift(), a: args});
