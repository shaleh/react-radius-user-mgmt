import { infoForUser, RADIUS_API_BASE } from './User';

test('action for disabled users', () => {
    var user = {
        disabled: true,
        name: 'alice'
    };
    expect(infoForUser(user)).toEqual({
        action: RADIUS_API_BASE + '/users/alice/reactivate',
        label: 'Disabled'
    });
});

test('action for active users', () => {
    var user = {
        disabled: false,
        name: 'bob'
    };
    expect(infoForUser(user)).toEqual({
        action: RADIUS_API_BASE + '/users/bob/disable',
        label: 'Active'
    });
});
