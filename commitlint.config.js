module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never'],
    // 'references-empty': [2, 'never'], // 1. uncomment this line to enforce issue prefix on the commit message
  },
  parserPreset: {
    parserOpts: {
      // issuePrefixes: ['PROJ-'], // 2. uncomment and change 'PROJ-' to whatever suits your team/project
    },
  },
};
