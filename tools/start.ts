const path = require('path');
const colors = require('colors');
const _prompt = require('prompt');
const { fork } = require('child_process');
const replace = require('replace-in-file');
const { rm, which, exec } = require('shelljs');
const { readFileSync, writeFileSync } = require('fs');

const rmDirs = ['.git'];
const rmFiles = ['.all-contributorsrc', '.gitattributes', 'tools/init.ts'];
const modifyFiles = ['LICENSE', 'package.json', 'tools/gh-pages-publish.ts'];

const _promptSchemaServiceName = {
  properties: {
    service: {
      description: colors.cyan('What do you want the service to be called? (use kebab-case)'),
      pattern: /^[a-z]+(-[a-z]+)*$/,
      type: 'string',
      required: true,
      message: '"kebab-case" uses lowercase letters, and hyphens for any punctuation',
    },
  },
};

const _promptSchemaServiceSuggest = {
  properties: {
    useSuggestedName: {
      description: colors.cyan(
        'Would you like it to be called "' + serviceNameSuggested() + '"? [Yes/No]',
      ),
      pattern: /^(y(es)?|n(o)?)$/i,
      type: 'string',
      required: true,
      message: 'You need to type "Yes" or "No" to continue...',
    },
  },
};

_prompt.start();
_prompt.message = '';

// Clear console
process.stdout.write('\x1B[2J\x1B[0f');

if (!which('git')) {
  console.log(colors.red('Sorry, this script requires git'));
  removeItems();
  process.exit(1);
}

// Say hi!
console.log(
  colors.cyan("Hi! You're almost ready to make the next great apollo federated micro-service."),
);

// Generate the service name and start the tasks
if (process.env.CI == null) {
  if (!serviceNameSuggestedIsDefault()) {
    serviceNameSuggestedAccept();
  } else {
    serviceNameCreate();
  }
} else {
  // This is being run in a CI environment, so don't ask any questions
  setupService(serviceNameSuggested());
}

/**
 * Asks the user for the name of the service if it has been cloned into the
 * default directory, or if they want a different name to the one suggested
 */
function serviceNameCreate() {
  _prompt.get(_promptSchemaServiceName, (err: any, res: any) => {
    if (err) {
      console.log(colors.red('Sorry, there was an error building the workspace :('));
      removeItems();
      process.exit(1);
      return;
    }

    setupService(res.service);
  });
}

/**
 * Sees if the users wants to accept the suggested service name if the project
 * has been cloned into a custom directory (i.e. it's not 'apollo-federated-service')
 */
function serviceNameSuggestedAccept() {
  _prompt.get(_promptSchemaServiceSuggest, (err: any, res: any) => {
    if (err) {
      console.log(colors.red("Sorry, you'll need to type the service name"));
      serviceNameCreate();
    }

    if (res.useSuggestedName.toLowerCase().charAt(0) === 'y') {
      setupService(serviceNameSuggested());
    } else {
      serviceNameCreate();
    }
  });
}

/**
 * The service name is suggested by looking at the directory name of the
 * tools parent directory and converting it to kebab-case
 *
 * The regex for this looks for any non-word or non-digit character, or
 * an underscore (as it's a word character), and replaces it with a dash.
 * Any leading or trailing dashes are then removed, before the string is
 * lower-cased and returned
 */
function serviceNameSuggested() {
  return path
    .basename(path.resolve(__dirname, '..'))
    .replace(/[^\w\d]|_/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Checks if the suggested service name is the default, which is 'apollo-federated-service'
 */
function serviceNameSuggestedIsDefault() {
  return serviceNameSuggested() === 'apollo-federated-service';
}

/**
 * Calls all of the functions needed to setup the service
 *
 * @param serviceName
 */
function setupService(serviceName: string) {
  console.log(
    colors.cyan('\nThanks for the info. The last few changes are being made... hang tight!\n\n'),
  );

  // Get the Git username and email before the .git directory is removed
  let username = exec('git config user.name').stdout.trim();
  let usermail = exec('git config user.email').stdout.trim();

  removeItems();

  modifyContents(serviceName, username, usermail);

  finalize();

  console.log(colors.cyan("OK, you're all set. Happy coding!! ;)\n"));
}

/**
 * Removes items from the project that aren't needed after the initial setup
 */
function removeItems() {
  console.log(colors.underline.white('Removed'));

  // The directories and files are combined here, to simplify the function,
  // as the 'rm' command checks the item type before attempting to remove it
  let rmItems = rmDirs.concat(rmFiles);
  rm(
    '-rf',
    rmItems.map((f) => path.resolve(__dirname, '..', f)),
  );
  console.log(colors.red(rmItems.join('\n')));

  console.log('\n');
}

/**
 * Updates the contents of the template files with the service name or user details
 *
 * @param serviceName
 * @param username
 * @param usermail
 */
function modifyContents(serviceName: string, username: string, usermail: string) {
  console.log(colors.underline.white('Modified'));

  let files = modifyFiles.map((f) => path.resolve(__dirname, '..', f));
  try {
    const results: Array<{ hasChanged: boolean; file: string }> = replace.sync({
      files,
      from: [/--servicename--/g, /--username--/g, /--usermail--/g],
      to: [serviceName, username, usermail],
    });

    results
      .filter((result) => result.hasChanged)
      .map((result) => result.file)
      .forEach((file) => {
        console.log(`- ${colors.yellow(file.replace(`${process.cwd()}/`, ''))}`);
      });
  } catch (error) {
    console.error('An error occurred modifying the file: ', error);
  }

  console.log('\n');
}

/**
 * Calls any external programs to finish setting up the service
 */
function finalize() {
  console.log(colors.underline.white('Finalizing'));

  // Recreate Git folder
  let gitInitOutput = exec('git init "' + path.resolve(__dirname, '..') + '"', {
    silent: true,
  }).stdout;
  console.log(colors.green(gitInitOutput.replace(/([\n\r])+/g, '')));

  // Remove post-install command
  let jsonPackage = path.resolve(__dirname, '..', 'package.json');
  const pkg = JSON.parse(readFileSync(jsonPackage) as any);

  const prev = pkg.scripts.postinstall;
  pkg.scripts.postinstall = pkg.scripts.postinstall.replace('ts-node tools/start', 'yarn generate');

  writeFileSync(jsonPackage, JSON.stringify(pkg, null, 2));
  if (pkg.scripts.postinstall !== prev) {
    console.log(colors.green('post-install script has been changed to "yarn generate"'));
  }

  // Initialize Husky
  fork(path.resolve(__dirname, '..', 'node_modules', 'husky', 'bin', 'install'), { silent: true });
  console.log(colors.green('Git hooks set up'));

  console.log('\n');
}
