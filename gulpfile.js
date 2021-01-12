const path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revColletor = require('gulp-rev-collector'),
    clean = require('gulp-clean'),
    base64 = require('gulp-base64'),
    gulpSequence = require('gulp-sequence'),
    minimist = require('minimist'),
    fse = require('fs-extra'),
    chalk = require('chalk'),
    EasyFtp = require('easy-ftp'),
    fs = require('fs'),
    shell = require('gulp-shell');

let knownOptions = {
        string: 'dir'
    },
    options = minimist(process.argv.slice(2), knownOptions),
    dirname = path.join(__dirname, './public/' + (options.dir));

console.log(chalk.yellow('当前活动目录：') + chalk.red(options.dir));

/*clean dist*/
gulp.task('clean', function() {
    return gulp.src(dirname + '/dist/', { read: false })
        .pipe(clean({ force: false }));
});

/*图片复制*/
gulp.task('images', function() {
    return gulp.src([dirname + '/img/**/'])
        .pipe(gulp.dest(dirname + '/dist/img/'))
});

/*build sass*/
gulp.task('sass', function() {
    return gulp.src(dirname + '/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: [
                'Android >= 4',
                'iOS >= 6'
            ]
        }))
        .pipe(gulp.dest(dirname + '/css/'))
});

/*css 压缩*/
gulp.task('css-build', function() {
    return gulp.src(dirname + '/sass/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(base64({
            baseDir: dirname + '/sass',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude: [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 8 * 1024 // bytes
        }))
        .pipe(autoprefix({
            browsers: [
                'Android >= 4',
                'iOS >= 6'
            ]
        }))
        .pipe(rev())
        .pipe(gulp.dest(dirname + '/dist/css/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dirname + '/rev/css'))
});

/*js 打包*/
gulp.task('js-build', function() {
    return gulp.src(dirname + '/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest(dirname + '/dist/js/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(dirname + '/rev/js/'))
});

/*版本控制*/
gulp.task('rev', ['js-build', 'css-build'], function() {
    return gulp.src([dirname + '/rev/**/*.json', dirname + '/*.html'])
        .pipe(revColletor())
        .pipe(gulp.dest(dirname + '/dist/'))
});

gulp.task('min-js', function() {
    gulp.src(dirname + '/dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dirname + '/dist/js/'))
})

/* ============================================== npm script Api ============================================== */

gulp.task('create', function() {
    try {
        if (fse.ensureDirSync(dirname)) {
            fse.ensureDirSync(dirname + '/js');
            fse.ensureDirSync(dirname + '/sass');
            fse.ensureDirSync(dirname + '/img');
            fse.outputFile(dirname + '/index.html', 'hello');
        } else {
            console.log(chalk.red('错误：' + options.dir + '已经存在，请修改目录名称'));
            process.exit();
        }
    } catch (err) {
        console.error(err)
        process.exit();
    }
})

gulp.task('watch', function() {
    gulp.watch(dirname + '/sass/*.scss', ['sass']);
});

gulp.task('build', gulpSequence('clean', 'images', 'rev', 'min-js'));

gulp.task('build-w', shell.task('npm run build-w ' + options.dir))

function getChildrenList(dir, type) {
    const fileList = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(filename) {
        const filepath = path.resolve(dir, filename);
        const stat = fs.statSync(filepath);
        if (type === 'file' && stat.isFile()) {
            fileList.push(filepath);
        } else if (type === 'dir' && stat.isDirectory()) {
            fileList.push(filepath);
        }
    });
    return fileList;
}

function ftpExec(ftp, methodName, ...args) {
    return new Promise(function(resolve, reject) {
        args.push(function(err) {
            if (methodName === 'exist') {
                resolve(err);
                return;
            }
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
        ftp[methodName].apply(ftp, args);
    });
}

function fullPushTestByFtp() {
    try {
        var ftp = new EasyFtp();
        var config = {
            host: "10.10.150.101",
            port: 65522,
            username: "root",
            password: "fXmDDGpfV3ePnawmpYXjy",
            type: 'sftp'
        };
        console.log(chalk.red('正在连接 10.10.150.101...'));
        ftp.on("open", function() {
            console.log(chalk.red('连接成功'));
        });
        ftp.on("uploading", function(data) {
            if (data.transferred === data.total) {
                console.log(chalk.yellow('http://th5.zhuishushenqi.com' + data.remotePath.replace('/data/www', '')) + ' done');
            }
        });
        ftp.connect(config)
        ftp.cd("/data/www/public", function(err, path) {
            ftpExec(ftp, 'cd', '/data/www/public').then(function() {
                return ftpExec(ftp, 'exist', options.dir);
            }).then(function(exist) {
                if (!exist) {
                    return ftpExec(ftp, 'mkdir', options.dir);
                }
            }).then(function() {
                const dirList = getChildrenList(dirname + "/dist", 'dir');
                return ftpExec(ftp, 'upload', dirList, options.dir);
            }).then(function() {
                const fileList = getChildrenList(dirname + "/dist", 'file');
                return ftpExec(ftp, 'upload', fileList, options.dir);
            }).then(function() {
                console.log(chalk.red(`【${options.dir}】已发布到测试环境`));
                ftp.close();
                process.exit();
            }).catch(function(err) {
                console.log(err);
                ftp.close();
                process.exit();
            });
        })
    } catch (err) {
        console.log(err)
    }
}

function fullPushProdByFtp() {
    try {
        var ftp = new EasyFtp();
        var config = {
            host: "10.10.173.198",
            port: 65522,
            username: "root",
            password: "JTSSY7tvRSs6eq2t2MBES",
            type: 'sftp'
        };
        console.log(chalk.red('正在连接 10.10.173.198...'));
        ftp.connect(config);
        ftp.on("open", function() {
            console.log(chalk.red('连接成功'));
        });
        ftp.on("uploading", function(data) {
            if (data.transferred === data.total) {
                console.log(chalk.yellow('https://h5.zhuishushenqi.com' + data.remotePath.replace('/data/www', '')) + ' done');
            }
        });
        ftp.cd("/data/www/public", function(err, path) {
            let dirList = getChildrenList(dirname + "/dist", 'dir');
            ftpExec(ftp, 'cd', '/data/www/public').then(function() {
                return ftpExec(ftp, 'exist', options.dir);
            }).then(function(exist) {
                if (!exist) {
                    return ftpExec(ftp, 'mkdir', options.dir);
                }
            }).then(function() {
                const dirList = getChildrenList(dirname + "/dist", 'dir');
                return ftpExec(ftp, 'upload', dirList, options.dir);
            }).then(function() {
                const fileList = getChildrenList(dirname + "/dist", 'file');
                return ftpExec(ftp, 'upload', fileList, options.dir);
            }).then(function() {
                console.log(chalk.red(`【${options.dir}】已发布到线上环境`));
                ftp.close();
                process.exit();
            }).catch(function(err) {
                console.log(err);
                ftp.close();
                process.exit();
            });
        });
    } catch (err) {
        console.log(err)
    }
}

gulp.task('test', ['build'], function() {
    fullPushTestByFtp();
})

gulp.task('prodution', ['build'], function() {
    fullPushProdByFtp()
})

gulp.task('test-w', ['build-w'], function() {
    fullPushTestByFtp();
})

gulp.task('prodution-w', ['build-w'], function() {
    fullPushProdByFtp();
})