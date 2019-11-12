module.exports = ({gulp, config, bs, fs}) => {
    gulp.task("watch", () => {

        function reload(done) {
            if(config.liveReload) {
                bs.reload();
            }
            done();
        }

        gulp.watch(config.styles.watch, gulp.series("scss"));
        gulp.watch(config.markup.watch, gulp.series("htmlimport", reload));
        gulp.watch(config.scripts.watch, gulp.series("script", reload));
        gulp.watch(config.images.watch, gulp.series("images", reload)).on("unlink", function (filePath) {
            let arrPath = filePath.split("/"),
                nameFile = "./dist/images/" + arrPath[arrPath.length - 1];
            fs.unlinkSync(nameFile);
        });
    });
};