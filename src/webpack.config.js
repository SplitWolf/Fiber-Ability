module.exports = {
    entry: './bot.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['ts', 'js']
    },
    output: {
       filename: 'bundle.js',
       path: path.resolve(__dirname, '../build')
    }
}