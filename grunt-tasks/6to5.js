module.exports = {
    options: {
        modules: 'common'
    },
    src: {
        files: [{
            expand: true,
            cwd: 'src/',
            src: ['**/*.js', '!dev.js'],
            dest: 'dist/',
        }],
    },
    spec: {
        files: [{
            expand: true,
            cwd: 'test/spec/',
            src: ['*.js'],
            dest: 'test/common'
        }]
    }
};
