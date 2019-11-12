module.exports = ({gulp, config}) => {
    gulp.task("fonts", () => {
        return gulp.src(config.fonts.src)
            .pipe(gulp.dest(config.fonts.dest));
    });
};
