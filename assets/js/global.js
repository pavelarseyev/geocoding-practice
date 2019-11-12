import "babel-polyfill";

import {binder, fwa} from "./libs/binder";
import {initMap} from "./modules/map";


binder({
    bounds: {
        "#map": [initMap],

    },
    runTests: false
});
