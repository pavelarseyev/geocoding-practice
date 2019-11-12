module.exports = ({gulp}) => {
    gulp.task("prod", gulp.series(
        "clean",
        gulp.parallel("fonts", "htmlimport", "scss", "images", "script")
    ));
};