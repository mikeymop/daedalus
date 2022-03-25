import expect from 'expect';

import {
  createAndRegisterHardwareWalletChannels,
  createHardwareWalletConnectionChannel,
  initLedgerChannel,
  createTestInstructions,
  createGetPublicKeyChannel,
  ipcRenderer,
  requestLaunchingCardanoAppOnLedger,
} from './utils';

export const run = () => {
  expect.assertions(3);

  createTestInstructions([
    'Start test runner',
    'Plug Ledger Nano S to your computer',
    'Start Cardano APP on Nano S',
    'Nano S will prompt to export the public key',
    'Export the public key',
  ]);

  createAndRegisterHardwareWalletChannels();

  const publicKeyChannel = createGetPublicKeyChannel();
  const hardwareWalletConnectionChannel = createHardwareWalletConnectionChannel();

  return new Promise<void>((resolve) => {
    hardwareWalletConnectionChannel.onReceive(
      async (params: { path: string }) => {
        expect(params).toEqual({
          disconnected: expect.any(Boolean),
          deviceType: expect.any(String),
          deviceId: null,
          deviceModel: expect.any(String),
          deviceName: expect.any(String),
          path: expect.any(String),
        });

        try {
          const cardanoAppChannelResponse = await requestLaunchingCardanoAppOnLedger(
            params.path
          );

          expect(cardanoAppChannelResponse).toEqual({
            minor: expect.any(Number),
            major: expect.any(Number),
            patch: expect.any(Number),
            deviceId: expect.any(String),
          });

          const extendedPublicKey = await publicKeyChannel.request(
            {
              path: "1852'/1815'/0'",
              // Shelley 1852 ADA 1815 indicator for account '0'
              isTrezor: false,
              devicePath: params.path,
            },
            ipcRenderer,
            ipcRenderer
          );

          expect(extendedPublicKey).toEqual({
            chainCodeHex: expect.any(String),
            publicKeyHex: expect.any(String),
            deviceId: expect.any(String),
          });

          resolve();
        } catch (err) {
          return null;
        }
      }
    );

    initLedgerChannel();
  });
};
