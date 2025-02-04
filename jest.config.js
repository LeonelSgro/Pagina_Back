module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      isolatedModules: true,
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testMatch: [
    '**/spec/**/*.spec.ts',
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1', // Usa <rootDir> para referenciar la raíz del proyecto
  },
};