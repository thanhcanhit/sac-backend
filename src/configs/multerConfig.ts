import multer from "multer";
import path from "path";

class MulterFactory {
	public static getInstance(storagePath: string) {
		const config = multer.diskStorage({
			destination: `public/${storagePath}`,
			filename: function (req, file, cb) {
				const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
				cb(
					null,
					file.fieldname.toLowerCase() +
						"_" +
						uniqueSuffix +
						path.extname(file.originalname)
				);
			},
		});

		return multer({ storage: config });
	}
}
export default MulterFactory;
