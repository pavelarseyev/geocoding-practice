module.exports = ({gulp, sass, sourcemaps, csso, postcss, autoprefixer, config, rename, bs, plumber, notify}) => {
    gulp.task("scss", () => {

        const scss = gulp
            .src(config.styles.src)
            .pipe(sourcemaps.init())
            .pipe(sass().on("error", sass.logError))
            .pipe(postcss([autoprefixer({
                browsers: ["last 2 version"]
            })]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(config.styles.dest));

        if(config.liveReload){
            scss.pipe(bs.stream());
        }

        if(!config.isDev) {
            scss.pipe(csso())
                .pipe(rename({suffix: ".min"}))
                .pipe(sourcemaps.write("./", {addComment: false}))
                .pipe(gulp.dest(config.styles.dest))
                .pipe(bs.stream({match: "**/*.css"}));
        }
        return scss;
    });
};
