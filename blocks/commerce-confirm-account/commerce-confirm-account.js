import { SignIn } from '@dropins/storefront-auth/containers/SignIn.js';
import { SuccessNotification } from '@dropins/storefront-auth/containers/SuccessNotification.js';
import * as authApi from '@dropins/storefront-auth/api.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import { Button, provider as UI } from '@dropins/tools/components.js';
import {
  CUSTOMER_ACCOUNT_PATH,
  CUSTOMER_FORGOTPASSWORD_PATH,
  checkIsAuthenticated,
  rootLink,
} from '../../scripts/commerce.js';

// Initialize
import '../../scripts/initializers/auth.js';

export default async function decorate(block) {
  if (checkIsAuthenticated()) {
    window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
  } else {
    await authRenderer.render(SignIn, {
      enableEmailConfirmation: true,
      routeForgotPassword: () => rootLink(CUSTOMER_FORGOTPASSWORD_PATH),
      slots: {
        SuccessNotification: (ctx) => {
          const userName = ctx?.isSuccessful?.userName || '';

          const elem = document.createElement('div');

          authRenderer.render(SuccessNotification, {
            labels: {
              headingText: `Welcome ${userName}!`,
              messageText: 'You have successfully logged in.',
            },
            slots: {
              SuccessNotificationActions: (innerCtx) => {
                const primaryBtn = document.createElement('div');

                UI.render(Button, {
                  children: 'My Account',

                  onClick: () => {
                    window.location.href = rootLink(CUSTOMER_ACCOUNT_PATH);
                  },
                })(primaryBtn);

                innerCtx.appendChild(primaryBtn);

                const secondaryButton = document.createElement('div');
                secondaryButton.style.display = 'flex';
                secondaryButton.style.justifyContent = 'center';
                secondaryButton.style.marginTop = 'var(--spacing-xsmall)';

                UI.render(Button, {
                  children: 'Logout',
                  variant: 'tertiary',
                  onClick: async () => {
                    await authApi.revokeCustomerToken();
                    window.location.href = rootLink('/');
                  },
                })(secondaryButton);

                innerCtx.appendChild(secondaryButton);
              },
            },
          })(elem);

          ctx.appendChild(elem);
        },
      },
    })(block);
  }
}
