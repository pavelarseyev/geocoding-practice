module.exports = ({gulp, del, config}) => {
    gulp.task("clean-images", () => {
        config.isDev = false;
        return del([config.images.dest]);
    });
};