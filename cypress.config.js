const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { beforeRunHook, afterRunHook } = require("cypress-mochawesome-reporter/lib");

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  on("before:run", async (details) => {
    await beforeRunHook(details);
  });

  on("after:run", async () => {
    await afterRunHook();
  });

  return config;
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/support/e2e.js",
    baseUrl: "https://reservas.desbravador.com.br/1111",
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 60000,
    viewportWidth: 1440,
    viewportHeight: 900,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    testIsolation: true,
    env: {
      adults: 2,
      children: 1,
      childrenAge: 5,
      nights: 3,
      roomType: "STANDARD ST1",
      cardNumber: "4000000000000044",
      cardName: "DESBRAVADOR SOFTWARE",
      cardExpiry: "12/23",
      cardCvc: "123",
    },
  },
  video: true,
  screenshotOnRunFailure: true,
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: false,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});
