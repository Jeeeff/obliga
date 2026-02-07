
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  forceExit: true,
  verbose: true,
  // Setup usually requires moduleNameMapper if paths are aliased, but backend uses relative paths mostly.
  // If aliases are used in tsconfig (like @/...), we need mapping.
  // Checking tsconfig... but index.ts uses relative imports.
};
