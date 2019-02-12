import { tryLogin } from '../auth';
import formatErrors from '../FormatErrors';
import requiresAuth from '../permissions';


export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query('select * from teams as t join members as m on t.id = m.team_id where m.user_id = ?', {
        replacements: [user.id],
        model: models.Team,
      }),
  },
  Query: {
    me: requiresAuth.createResolver((parent, args, { models, user }) => models.User.findOne({ where: { id: user.id } })),
    getAllUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(
      email, password, models, SECRET, SECRET2,
    ),
    register: async (parent, args, { models }) => {
      // hash password before creating user
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
