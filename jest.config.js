module.exports = {
    preset: 'ts-jest',            // Tells Jest to use ts-jest preset for TypeScript
    testEnvironment: 'node',      // Jest environment for Node.js (can also be 'jsdom' for browser-like tests)
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        isolatedModules: true,     // Speeds up test compilation by not type-checking
      }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],  // Add TypeScript extensions
    testMatch: [
      '**/spec/**/*.spec.ts',    // Adjust this to your folder structure for test files
    ],
      "moduleNameMapper": {
        "/^@src\/(.*)$/": "/home/runner/work/Pagina_Back/Pagina_Back/src/$1"
    }
  };
  