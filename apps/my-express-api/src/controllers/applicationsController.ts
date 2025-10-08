import Application from "../models/applicationsModel";
import { Request, Response } from "express";
import { AuthRequest } from "./authController";
import { sendPushNotification } from "./notificationController";
import User from "../models/usersModel";

export const getApplications = async (req: Request, res: Response) => {
	const { page , userId } = req.query;
	const itemsPerPage = 10;
	console.log(page, userId);
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

		// Create a filter object that will be used in the find query
    const filter: { userId?: string } = {};
    
    // Add userId to filter if it exists
    if (userId && typeof userId === 'string') {
      filter.userId = userId;
    }
		const result = await Application.find(filter)
			.sort({ createdAt: -1 })
			.skip(pageNum * itemsPerPage)
			.limit(itemsPerPage)
			.populate({
				path: 'userId',
				select: 'email',
			});
		res.status(200).json({ success: true, page: page, limit: itemsPerPage,  message: 'applications', data: result });
	} catch (error) {
		console.log(error);
	}
};

export const singleApplication = async (req: Request, res: Response) => {
	const { _id } = req.params;

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

export const updateApplication = async (req: Request, res: Response) => {
    const { _id } = req.params; // Assuming the application ID is passed as a URL parameter
    const { status} = req.body; // status can be 'accepted' or 'rejected'
		console.log(req.body)
    try {
        // Find the application by ID
        const existingApplication = await Application.findOne({ _id });
				const userId = existingApplication?.userId;
				const user = await User.findOne({ _id: userId });

        if (!existingApplication) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Update the application status and admin comments
        existingApplication.status = status;
				if (status === 'accepted' && user.role !== 'mentor') {
					user.role = 'mentor';
				} else if (status === 'rejected' && user.role === 'mentor') {
					user.role = 'user';
				}	
        //existingApplication.adminComments = adminComments;
        //existingApplication.reviewedAt = new Date();
				await sendPushNotification(
					'Application Status Updated',
					`Your application status has been updated to: ${status}`,
					{},
					existingApplication.userId
				).catch((error) => {
					console.error('Error sending push notification:', error);
				});
        // Save the updated application
        await existingApplication.save();
				await user.save();

        res.status(200).json({ success: true, message: 'Application updated successfully', data: existingApplication });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error updating application', error: error.message });
    }
};