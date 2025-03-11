import Application from "../models/applicationsModel";
import { Request, Response } from "express";
import { AuthRequest } from "./authController";

export const getApplications = async (req: Request, res: Response) => {
	const { page } = req.query;
	const itemsPerPage = 10;

	try {
		let pageNum = 0;
		if (typeof page === 'string') {
			const parsedPage = parseInt(page, 10);
			if (parsedPage <= 1) {
				pageNum = 0;
			} else {
				pageNum = parsedPage - 1;
			}
		}
		const result = await Application.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * itemsPerPage)
			.limit(itemsPerPage)
			.populate({
				path: 'userId',
				select: 'email',
			});
		res.status(200).json({ success: true, message: 'applications', data: result });
	} catch (error) {
		console.log(error);
	}
};

export const singleApplication = async (req: Request, res: Response) => {
	const { _id } = req.query;

	try {
		const existingApplication = await Application.findOne({ _id }).populate({
			path: 'userId',
			select: 'email',
		});
		if (!existingApplication) {
			return res
				.status(404)
				.json({ success: false, message: 'Application unavailable' });
		}
		res
			.status(200)
			.json({ success: true, message: 'single Application', data: existingApplication });
	} catch (error) {
		console.log(error);
	}
};

export const createApplication = async (req: AuthRequest, res: Response) => {
	const { userId } = req.user;
	try {
		const result = await Application.create({
			...req.body,
			userId,
		});
		res.status(201).json({ success: true, message: 'created', data: result });
	} catch (error) {
		console.log(error);
	}
};