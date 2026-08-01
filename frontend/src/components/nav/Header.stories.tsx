import type { Meta, StoryObj } from '@storybook/tanstack-react';

import Header from './Header';
import type { AuthState, User } from '../../utils/types/users';

const meta = {
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    tanstack: {
      router: {
        route: { path: '/' }
      }
    }
  }
};

// FIXME: can't get auth context mocked to show logged in Header state
export const LoggedIn: Story = {
  parameters: {
    tanstack: {
      router: {
        route: { path: '/'},
        routeOverrides: {
          "/": { loader: async () => ({
            auth: { 
              isAuthenticated: true,
              user: { id: "0", username: "Ottawa Civic Tech"
              } as User
            } as AuthState
          })}
        }
      }
    }
  }
}