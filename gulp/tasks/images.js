module.exports = ({gulp, imagemin, config, imageminMozjpeg, newer}) => {
    gulp.task("images", () => {
        return gulp.src(config.images.src)
            .pipe(newer(config.images.dest))
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true, arithmetic: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imageminMozjpeg({
                    quality: 96,
                    progressive: true
                })
            ]))
            .pipe(gulp.dest(config.images.dest));
    });
};
