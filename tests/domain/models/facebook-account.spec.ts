import { FacebookAccount } from '@/domain/models/facebook-account';

describe('FacebookAccount', () => {
  const fbData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id',
  };

  test('Should create with facebook data only', async () => {
    const sut = new FacebookAccount(fbData);

    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
  });

  test('Should update name name if its empty', async () => {
    const accountData = { id: 'any_id' };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
  });

  test('Should not update name name if its empty', async () => {
    const accountData = { id: 'any_id', name: 'any_name' };

    const sut = new FacebookAccount(fbData, accountData);

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
  });
});
