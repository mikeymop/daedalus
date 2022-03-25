import prompts from 'prompts';

import { run as runRemoveMultipleHardwareWallets } from './remove-multiple-hardware-wallets';
import { run as runCardanoAppAlreadyLaunched } from './cardano-app-already-launched';
import { run as runCardanoAppNotStarted } from './cardano-app-not-started';
import { run as runRemoveSingleHardwareWallet } from './remove-single-hardware-wallet';
import { run as runMultipleHardwareWallets } from './multiple-hardware-wallets';

const CARDANO_APP_ALREADY_LAUNCHED = 'CARDANO_APP_ALREADY_LAUNCHED';
const CARDANO_APP_NOT_STARTED = 'CARDANO_APP_NOT_STARTED';
const SINGLE_LEDGER_DISCONNECTED = 'SINGLE_LEDGER_DISCONNECTED';
const MULTIPLE_HARDWARE_WALLETS = 'MULTIPLE_HARDWARE_WALLETS';
const MULTIPLE_HARDWARE_WALLETS_REMOVED = 'MULTIPLE_HARDWARE_WALLETS_REMOVED';

(async () => {
  const { testType } = await prompts({
    type: 'select',
    name: 'testType',
    message: 'Ledger Hardware Wallets Channel',
    choices: [
      {
        title: 'export public key when Cardano APP is already launched',
        value: CARDANO_APP_ALREADY_LAUNCHED,
      },
      {
        title:
          'export public key when Cardano APP is launched after running HW test script',
        value: CARDANO_APP_NOT_STARTED,
      },
      {
        title: 'detect when ledger is disconnected from computer',
        value: SINGLE_LEDGER_DISCONNECTED,
      },
      {
        title: 'connect both Nano S and Nano X',
        value: MULTIPLE_HARDWARE_WALLETS,
      },
      {
        title: 'detect when multiple hardware wallets are removed',
        value: MULTIPLE_HARDWARE_WALLETS_REMOVED,
      },
      { title: 'exit', value: 'exit' },
    ],
  });

  switch (testType) {
    case CARDANO_APP_ALREADY_LAUNCHED:
      await runCardanoAppAlreadyLaunched();
      break;

    case CARDANO_APP_NOT_STARTED:
      await runCardanoAppNotStarted();
      break;

    case SINGLE_LEDGER_DISCONNECTED:
      await runRemoveSingleHardwareWallet();
      break;

    case MULTIPLE_HARDWARE_WALLETS:
      await runMultipleHardwareWallets();
      break;

    case MULTIPLE_HARDWARE_WALLETS_REMOVED:
      await runRemoveMultipleHardwareWallets();
      break;

    default:
      break;
  }

  process.exit(0);
})();
