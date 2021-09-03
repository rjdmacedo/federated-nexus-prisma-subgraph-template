import { createTestContext } from '../__helpers';

const context = createTestContext();

describe('User', () => {
  it('should fetch users', async () => {
    console.log(context);
    const users = await context.client.request(`
      query Query {
        users(first: 1) {
          firstName
          lastName
          email
          password
        }
      }
    `);
    expect(users).toEqual({
      users: [
        {
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
        },
      ],
    });
  });
});
