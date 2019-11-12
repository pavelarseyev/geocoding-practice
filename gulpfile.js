const variables = {
        config: require("./gulp/config"),
        path: require("path"),
        fs: require("fs"),
        gulp: require("gulp"),
        sass: require("gulp-sass"),
        plumber: require("gulp-plumber"),
        notify: require("gulp-notify"),
        sourcemaps: require("gulp-sourcemaps"),
        postcss: require("gulp-postcss"),
        autoprefixer: require("autoprefixer"),
        rename: require("gulp-rename"),
        del: require("del"),
        csso: require("gulp-csso"),
        imagemin: require("gulp-imagemin"),
        imageminMozjpeg: require("imagemin-mozjpeg"),
        bs: require("browser-sync").create(),
        newer: require("gulp-newer"),
        fileInclude: require("gulp-file-include"),
        eslint: require("gulp-eslint"),
        webpack: require("webpack"),
        webpackStream: require("webpack-stream"),
        uglify: require("uglifyjs-webpack-plugin"),
        gulpif: require("gulp-if"),
        pluginError: require("plugin-error"),
        tojson: function () {
            let dir = variables.fs.readdirSync("./assets/html/"),
                nameProj = variables.path.resolve(__dirname).split("/"),
                arrHTML = dir.filter(item => item.indexOf(".html") >= 0),
                dataPages = arrHTML.map(item => {
                    return `${item.split(".html")[0]}`;
                }),
                json;

            dataPages.push(nameProj[nameProj.length - 1]);
            json = JSON.stringify(dataPages);

            variables.fs.writeFileSync(variables.config.pages_list, json);
        }
    },
    tasks = [
        "./gulp/tasks/clean",
        "./gulp/tasks/clean-images",
        "./gulp/tasks/fonts",
        "./gulp/tasks/scss",
        "./gulp/tasks/images",
        "./gulp/tasks/htmlimport",
        "./gulp/tasks/script",
        "./gulp/tasks/watch",
        "./gulp/tasks/lint",
        "./gulp/tasks/dev",
        "./gulp/tasks/prod"
    ];

tasks.forEach(function (taskPath) {
    require(taskPath)(variables);
});