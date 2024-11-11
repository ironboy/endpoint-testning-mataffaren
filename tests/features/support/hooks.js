import chalk from 'chalk';
import { Before, After, BeforeStep, AfterStep, AfterAll } from "@cucumber/cucumber";

// We create our own logging system using hooks!
// (Chalk is a nom module used to color text output to the terminal)
const stepTextMaxLength = 90;

// Before each scenario
Before(function (info) {
  let { name, description } = info.gherkinDocument.feature;
  let { name: scenario } = info.pickle
  console.log(chalk.greenBright('Feature:'), chalk.green(name));
  console.log(chalk.whiteBright(description.trim()));
  console.log('');
  console.log(chalk.cyanBright('Scenario:'), chalk.cyan(scenario));
});

// After each scenario
After(function () {
  console.log('');
});

// Before each step
BeforeStep(function (info) {
  this.stepText = info.pickleStep.text;
});

// After each step
let prevType = '';
AfterStep(function (info) {
  let types = {
    Context: 'Given',
    Action: ' When',
    Outcome: ' Then'
  }
  let { type, text } = info.pickleStep;

  // Replace text from feature with text set by step if there is any
  if (this.customStepText) {
    text = this.customStepText;
    delete this.customStepText;
  }

  let { status: result } = info.result;
  console.log(
    chalk.greenBright(prevType === type ? '  And' : types[type]),
    chalk.whiteBright(text.padEnd(stepTextMaxLength, ' ').slice(0, stepTextMaxLength)),
    chalk[result === 'PASSED' ? 'greenBright' : 'redBright'](result)
  );
  prevType = type;
});

AfterAll(function () {
  // process.exit(0);
});