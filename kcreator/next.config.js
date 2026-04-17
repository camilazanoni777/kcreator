const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: process.env.NEXT_DIST_DIR || '.next',
    turbopack: {
        root: path.join(__dirname),
    },
}

module.exports = nextConfig
