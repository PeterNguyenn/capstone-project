import Application from "../models/applicationsModel";
import Post from "../models/applicationsModel";

export const getApplications = async (req, res) => {
	const { page } = req.query;
	const itemsPerPage = 10;

	try {
		let pageNum = 0;
		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
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

export const singleApplication = async (req, res) => {
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

export const createApplication = async (req, res) => {
	const { userId } = req.user;
	try {
		const result = await Post.create({
			...req.body,
			userId,
		});
		res.status(201).json({ success: true, message: 'created', data: result });
	} catch (error) {
		console.log(error);
	}
};