module.exports = ({gulp, config, plumber, notify, fileInclude}) => {
    gulp.task("htmlimport", () => {
        return gulp.src(config.markup.src)
            .pipe(plumber({
                errorHandler:
                    notify.onError({
                        message:  "Error: <%= error.message %>",
                    })
            }))
            .pipe(fileInclude({
                prefix: "@@",
                basepath: "assets/html/templates",
                indent: true
            }))
            .pipe(gulp.dest(config.markup.dest));
    });
};

