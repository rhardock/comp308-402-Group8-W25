const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type VerifyPayload {
    valid: Boolean!
    message: String
    user: User
  }

  type Query {
    verifyToken(token: String!): VerifyPayload
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): AuthPayload
    updateUser(id: ID!, email: String, password: String): User
    deleteUser(id: ID!): Boolean
  }
`);

const root = {
// queries
  async verifyToken({ token }) {
    if (!token) {
      return { valid: false, message: "No token provided" };
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return { valid: false, message: "User not found" };
      }
      return {
        valid: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          createdAt: user.createdAt.toISOString()
        }
      };
    } catch (error) {
      return { valid: false, message: "Invalid token" };
    }
  },

  async user({ id }) {
    return await User.findById(id);
  },

  async users() {
    return await User.find();
  },

// mutations
  async register({ email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return "User created successfully";
  },

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt.toISOString()
      }
    };
  },

  async updateUser({ id, email, password }) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return user;
  },

  async deleteUser({ id }) {
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      throw new Error('User not found');
    }
    return true;
  }
  
};

module.exports = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true 
});
