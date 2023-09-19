// Created by Tanhapon Tosirikul 2781155t
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "../prisma";

dotenv.config();

const saltRounds: string = bcrypt.genSaltSync(
  parseInt(process.env.saltRounds as string)
);
const bcrypt_code: string = process.env.bcrypt_code as string;

export type User = {
  id?: number;
  email: string;
  username: string;
  hashed_password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const result = await prisma.user.findMany();
      return result;
    } catch (error) {
      throw new Error(`Cannot get user ${error}`);
    }
  }
  async show(id: number): Promise<User | null> {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`);
    }
  }
  async create(user: User): Promise<User> {
    try {
      const password = bcrypt.hashSync(
        user.hashed_password + bcrypt_code,
        parseInt(saltRounds)
      );
      const result = await prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
          hashed_password: password,
        },
      });
      return result;
    } catch (err: any) {
      let errorMessage = "Could not add the new user.";
      switch (err.code) {
        case "P2002":
          if (err.meta?.target?.includes("email")) {
            errorMessage = `The email '${user.email}' is already registered. Please use a different email.`;
          }
          break;
        default:
          errorMessage += ` ${err}`;
          break;
      }

      throw new Error(errorMessage);
    }
  }
  async update(
    id: number,
    user: { email: string; username: string }
  ): Promise<User> {
    try {
      const email: string = user.email;
      const username: string = user.username;

      const emailExists = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailExists && emailExists.id !== id) {
        throw new Error(`Email ${email} already exists`);
      }

      const result = await prisma.user.update({
        where: { id: Number(id) || undefined },
        data: { email, username },
      });
      return result;
    } catch (err) {
      throw new Error(
        `Could not update user ${user.email} ${user.username}. ${err}`
      );
    }
  }
  // unused method
  async delete(id: number): Promise<User> {
    try {
      const result = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User> {
    try {
      const result = await prisma.user.findUnique({
        where: {
          email: String(email),
        },
      });

      if (result != null) {
        if (
          bcrypt.compareSync(password + bcrypt_code, result.hashed_password)
        ) {
          return result;
        }
      }
      throw new Error("User not found");
    } catch (error) {
      throw new Error("User not found");
    }
  }
  async changepassword(
    id: number,
    password: string,
    newpassword: string
  ): Promise<User> {
    // try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    const isValidPassword = await bcrypt.compare(
      password + bcrypt_code,
      user.hashed_password
    );

    if (!isValidPassword) {
      throw new Error("password is invalid");
    }

    const hashedpassword = bcrypt.hashSync(
      newpassword + bcrypt_code,
      parseInt(saltRounds)
    );

    const result = await prisma.user.update({
      where: { id: Number(id) || undefined },
      data: { hashed_password: hashedpassword },
    });

    return result;
  }
}
