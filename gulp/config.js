module.exports = {

    default_js_file: "global.js", // root folder - assets/js/
    dist: "./dist/**",
    pages_list: "pages.json",
    isDev: true,
    liveReload: true,

    scripts: {
        src: "./assets/js/",
        dest: "./dist/js/",
        watch: "./assets/js/**/*.js"
    },

    styles: {
        src: ["./assets/css/style.scss"],
        dest: "./dist/css/",
        watch: "./assets/css/**/*.scss"
    },

    images: {
        src: ["./assets/images/**/*.+(jpg|png|gif|svg|ico)"],
        dest: "./dist/images/",
        watch: "./assets/images/**/*.+(jpg|png|gif|svg|ico)"
    },

    markup: {
        src: "./assets/html/*.html",
        templates: "./assets/html/templates/",
        dest: "./dist/html/",
        compiled: "./dist/html/*.html",
        watch: "./assets/html/**/*.html"
    },

    fonts: {
        src: "./assets/fonts/**",
        dest: "./dist/fonts/"
    }
};