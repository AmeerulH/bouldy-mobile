const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');
const config = getDefaultConfig(__dirname);
// Frozen Next reference and generated evidence are not application modules/assets.
// Exclude them from Metro's file map, especially the source node_modules symlink
// and the reference Next dev server's generated chunks.
const escaped = __dirname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const excluded = ['reference', path.join('docs', 'evidence'), 'dist', 'dist-native'];
const previous = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(previous) ? previous : previous ? [previous] : []),
  ...excluded.map(directory => new RegExp(`^${escaped}/${directory.replaceAll(path.sep, '/')}/.*`)),
];
module.exports = config;
