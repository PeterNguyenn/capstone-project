import { Request, Response } from "express";
import { SignupUser } from "../types/auth/signup-body.dto";
import User from "../models/usersModel";
import { comparePassword, hashPassword } from "../utils/hashing";
import jwt from "jsonwebtoken";
import { LoginUser } from "../types/auth/login-body.dto";

export const signup = async (req: Request, res: Response) => {
  try {
    const body: SignupUser = req.body;

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res
      .status(401)
      .json({ success: false, message: 'User already exists!' });
    }

    const hashedPassword = await hashPassword(body.password);
    const user = new User({
        name: body.name,
        email: body.email,
        password: hashedPassword,
    });

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
        role: user.role,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '8h',
			}
		);

    const result = await user.save();
    result.password = undefined;
    res.status(201).send({ message: 'User created successfully', data:{
			token, user: result }});

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

export const signin = async (req: Request, res: Response) => {
	const { email, password }: LoginUser = req.body;
	try {
		const existingUser = await User.findOne({ email }).select('+password');
		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
		const result = await comparePassword(password, existingUser.password);
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}
		const token = jwt.sign(
			{
				userId: existingUser._id,
				email: existingUser.email,
        role: existingUser.role,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '8h',
			}
		);

		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000),
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
			})
			.json({
				success: true,
				data: {
					token
				},
				message: 'logged in successfully',
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Internal server error' });
	}
};

export const logout = async (req: Request, res: Response) => {
	res.clearCookie('Authorization');
	res.status(200).json({
		success: true,
		message: 'Logged out successfully',
	});
};

interface AuthRequest extends Request {
  user?: {
    userId: string;
		email: string;
		role: string;
  };
}

export const profile = async (req: AuthRequest, res: Response) => {
	const { userId } = req.user;

	try {
		const existingUser = await User.findById(userId).select('-password');
		if (!existingUser) {
			return res
				.status(404)
				.json({ message: 'User does not exists!' });
		}

		res.json({
			success: true,
			data: {
				user: existingUser,
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Internal server error' });
	}
};

