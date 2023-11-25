import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
	_id,
	title: existingSpecies,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
	length: existingLength,
	width: existingWidth,
	thickness: existingThickness,
	cut: existingCut,
	minLength: existingMinLength,
	maxLength: existingMaxLength,
	minWidth: existingMinWidth,
	maxWidth: existingMaxWidth,
	minThickness: existingMinThickness,
	maxThickness: existingMaxThickness,
	measurement: existingMeasurement,
	use: existingUse,
}) {
	const [species, setSpecies] = useState(existingSpecies || "");
	const [description, setDescription] = useState(existingDescription || "");
	const [cut, setCut] = useState(existingCut || "");
	const [price, setPrice] = useState(existingPrice || 0);
	const [images, setImages] = useState(existingImages || []);
	const [goToProducts, setGoToProducts] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const router = useRouter();

	// ------------------------------------------------------------------
	const [length, setLength] = useState(existingLength || "");
	const [width, setWidth] = useState(existingWidth || "");
	const [thickness, setThickness] = useState(existingThickness || "");
	// -------------------------------------------------------------------
	const [maxLength, setMaxLength] = useState(existingMaxLength || 0);
	const [minLength, setMinLength] = useState(existingMinLength || 0);
	const [minWidth, setMinWidth] = useState(existingMinWidth || 0);
	const [maxWidth, setMaxWidth] = useState(existingMaxWidth || 0);
	const [maxThickness, setMaxThickness] = useState(existingMaxThickness || 0);
	const [minThickness, setMinThickness] = useState(existingMinThickness || 0);
	const [measurement, setMeasurement] = useState(existingMeasurement || 0);
	const [use, setUse] = useState(existingUse || "");

	async function saveProduct(ev) {
		ev.preventDefault();
		let data = {
			species,
			description,
			price,
			images,
			cut,
			measurement,
			use,
		};
		if (cut == "Preplanned") data = { ...data, length, width, thickness };
		else
			data = {
				...data,
				maxLength: parseInt(maxLength, 10),
				maxThickness: parseInt(maxThickness),
				maxWidth: parseInt(maxWidth, 10),
				minLength: parseInt(minLength, 10),
				minWidth: parseInt(minWidth, 10),
				minThickness: parseInt(minThickness, 10),
			};

		if (_id) {
			//update
			await axios.put("/api/products", { ...data, _id });
		} else {
			//create
			console.log(data);
			await axios.post("/api/products", data);
		}
		setGoToProducts(true);
		console.log("Success");
	}
	if (goToProducts) {
		router.push("/products");
	}
	async function uploadImages(ev) {
		const files = ev.target?.files;
		if (files?.length > 0) {
			setIsUploading(true);
			const data = new FormData();
			for (const file of files) {
				data.append("file", file);
			}
			const res = await axios.post("/api/upload", data);
			setImages((oldImages) => {
				return [...oldImages, ...res.data.links];
			});
			setIsUploading(false);
		}
	}
	function updateImagesOrder(images) {
		setImages(images);
	}
	function setProductProp(propName, value) {
		setProductProperties((prev) => {
			const newProductProps = { ...prev };
			newProductProps[propName] = value;
			return newProductProps;
		});
	}
	// ---------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------
	return (
		<form onSubmit={saveProduct}>
			<label>Species</label>
			<input
				type="text"
				placeholder="species"
				value={species}
				onChange={(ev) => setSpecies(ev.target.value)}
			/>

			<label>Photos</label>
			<div className="mb-2 flex flex-wrap gap-1">
				<ReactSortable
					list={images}
					className="flex flex-wrap gap-1"
					setList={updateImagesOrder}
				>
					{!!images?.length &&
						images.map((link) => (
							<div
								key={link}
								className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
							>
								<img src={link} alt="" className="rounded-lg" />
							</div>
						))}
				</ReactSortable>
				{isUploading && (
					<div className="h-24 flex items-center">
						<Spinner />
					</div>
				)}
				<label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
					<div>Add image</div>
					<input type="file" onChange={uploadImages} className="hidden" />
				</label>
			</div>
			<label>Description</label>
			<textarea
				placeholder="description"
				value={description}
				onChange={(ev) => setDescription(ev.target.value)}
			/>
			<label>Use</label>
			<input
				type="text"
				placeholder="use"
				value={use}
				onChange={(ev) => setUse(ev.target.value)}
			/>

			<label>Price</label>
			<input
				type="number"
				placeholder="price"
				value={price}
				onChange={(ev) => setPrice(parseFloat(ev.target.value))}
			/>

			<label>Cut</label>
			<div className="flex gap-9 m-4">
				<div>
					<label htmlFor="cutToSize">Cut to Size</label>
					<input
						type="radio"
						id="cutToSize"
						name="cut"
						value="Cut to Size"
						checked={cut === "Cut to Size"}
						onChange={() => setCut("Cut to Size")}
					/>
				</div>
				<div>
					<label htmlFor="preplanned">Preplanned</label>
					<input
						type="radio"
						id="preplanned"
						name="cut"
						value="Preplanned"
						checked={cut === "Preplanned"}
						onChange={() => setCut("Preplanned")}
					/>
				</div>
			</div>
			<label>Measurement</label>
			<div className="flex gap-24 m-10">
				<div>
					<label htmlFor="ft">ft</label>
					<input
						type="radio"
						id="ft"
						name="ft"
						value="ft"
						checked={measurement === "ft"}
						onChange={() => setMeasurement("ft")}
					/>
				</div>
				<div>
					<label htmlFor="cm">cm</label>
					<input
						type="radio"
						id="cm"
						name="cm"
						value="cm"
						checked={measurement === "cm"}
						onChange={() => setMeasurement("cm")}
					/>
				</div>
			</div>

			{!cut ? (
				<></>
			) : cut == "Preplanned" ? (
				<>
					<label>Length</label>
					<input
						type="text"
						placeholder="length,separated by commas"
						value={length}
						onChange={(ev) => setLength(ev.target.value)}
					/>

					<label>Width</label>
					<input
						type="text"
						placeholder="width,separated by commas"
						value={width}
						onChange={(ev) => setWidth(ev.target.value)}
					/>

					<label>Thickness</label>
					<input
						type="text"
						placeholder="thickness,separated by commas"
						value={thickness}
						onChange={(ev) => setThickness(ev.target.value)}
					/>
				</>
			) : (
				<>
					<label>Length</label>
					<div className="flex gap-1">
						<input
							type="number"
							placeholder={"minimum length"}
							onChange={(ev) => setMinLength(ev.target.value)}
							value={minLength}
						/>
						<input
							type="number"
							placeholder={"maximum length"}
							onChange={(ev) => setMaxLength(ev.target.value)}
							value={maxLength}
						/>
					</div>
					<label>Width</label>

					<div className="flex gap-1">
						<input
							type="number"
							placeholder={"minimum width"}
							onChange={(ev) => setMinWidth(ev.target.value)}
							value={minWidth}
						/>
						<input
							type="number"
							placeholder={"maximum width"}
							onChange={(ev) => setMaxWidth(ev.target.value)}
							value={maxWidth}
						/>
					</div>

					<label>Thickness</label>

					<div className="flex gap-1">
						<input
							type="number"
							placeholder={"minimum thickness"}
							onChange={(ev) => setMinThickness(ev.target.value)}
							value={minThickness}
						/>
						<input
							type="number"
							placeholder={"maxmum thickness"}
							onChange={(ev) => setMaxThickness(ev.target.value)}
							value={maxThickness}
						/>
					</div>
				</>
			)}
			<button type="submit" className="btn-primary">
				Save
			</button>
		</form>
	);
}
