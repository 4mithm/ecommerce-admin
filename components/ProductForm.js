import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
	_id,
	species: existingSpecies,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
	dimensions:existingDimensions,
	cut: existingCut,
	minLength: existingMinLength,
	maxLength: existingMaxLength,
	minWidth: existingMinWidth,
	maxWidth: existingMaxWidth,
	minThickness: existingMinThickness,
	maxThickness: existingMaxThickness,
	measurement: existingMeasurement,
	use: existingUse,
	type: existingType,
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
	const [length, setLength] = useState("");
	const [width, setWidth] = useState("");
	const [thickness, setThickness] = useState("");
	const [dimensions, setDimensions] = useState(existingDimensions||[]);

	
	// -------------------------------------------------------------------
	const [maxLength, setMaxLength] = useState(existingMaxLength || "");
	const [minLength, setMinLength] = useState(existingMinLength || "");
	const [minWidth, setMinWidth] = useState(existingMinWidth || "");
	const [maxWidth, setMaxWidth] = useState(existingMaxWidth || "");
	const [maxThickness, setMaxThickness] = useState(existingMaxThickness || "");
	const [minThickness, setMinThickness] = useState(existingMinThickness || "");
	const [measurement, setMeasurement] = useState(existingMeasurement || "ft");
	const [use, setUse] = useState(existingUse || "");
	const [selectSpecies, setSelectSpecies] = useState([]);
	const [selectUses, setSelectUses] = useState([]);
	const [type, setWoodType] = useState(existingType || "");

	useEffect(() => {
		axios.get("/api/species").then((result) => {
			setSelectSpecies(result.data);
		});
		axios.get("/api/uses").then((result) => {
			setSelectUses(result.data);
		});
	}, []);

	async function saveProduct(ev) {
		ev.preventDefault();
		let data = {
			species,
			type,
			description,
			price,
			images,
			cut,
			measurement,
			use,
		};
		if (cut == "Preplanned") data = { ...data, dimensions };
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

			await axios.post("/api/products", data);
		}
		setGoToProducts(true);
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

	// ---------------------------------------------------------------------------------------------------------------------------------------
	function setSpeciesAndType(name) {
		console.log(name);
		selectSpecies.find((sp) => {
			console.log(sp.species);
			if (sp.name === name) {
				console.log(sp);
				setSpecies(sp.name);
				setWoodType(sp.type);
			}
		});
	}

	// ---------------------------------------------------------------------------------------------------------------

		function addDimension(e, length, width, thickness) {
			e.preventDefault();
			const a=parseFloat(length)
			const b=parseFloat(width)
			const c=parseFloat(thickness)
			if (!dimensions.length) setDimensions([[a,b,c]]);
			else setDimensions([...dimensions, [a,b,c]]);
			console.log(dimensions);
			setLength("");
			setWidth("");
			setThickness("");
		}

		function removeDimension(e, index) {
			e.preventDefault();
			const newDimensions = [...dimensions];
			newDimensions.splice(index, 1);
			setDimensions(newDimensions);
		}

	// ------------------------------------------------------------------------------------------------------------------------
	return (
		<form>
			<label>Species</label>
			<select
				value={species}
				onChange={(e) => setSpeciesAndType(e.target.value)}
			>
				<option value="" disabled selected hidden></option>
				{selectSpecies.length > 0 &&
					selectSpecies.map((c) => (
						<option key={c._id} value={c.name}>
							{c.name}
						</option>
					))}
			</select>
			<label>Type </label>
			<input value={type} disabled />

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
			<select value={use} onChange={(ev) => setUse(ev.target.value)}>
				<option value="" disabled selected hidden></option>

				{selectUses.length > 0 &&
					selectUses.map((c) => (
						<option key={c._id} value={c.name}>
							{c.name}
						</option>
					))}
			</select>

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
				<div className="lg:w-1/2 sm:w-full">
					<div className=" ">
						{dimensions? dimensions.map((element,index) => (
							
							<div key={index} className="flex flex-row m-5  justify-between " > 
					
								<p>{element.join("/")}</p>
								<button onClick={(e) => removeDimension(e, index)} className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded">
									DELETE
								</button>
						
							</div>
						)):<></>}
					</div>
					<div className="flex flex-row m-5  justify-between">
						<div className="flex flex-col">
						<label>Length</label>
						<input
							type="number"	
							placeholder="length"
							value={length}
							className=" w-24"
							onChange={(ev) => setLength(ev.target.value)}
						/>
						</div>

						<div className="flex flex-col">

						<label>Width</label>
						<input
							type="number"
							className=" w-24"
							placeholder="width"
							value={width}
							onChange={(ev) => setWidth(ev.target.value)}
						/>
						</div>

						<div className="flex flex-col">

						<label>Thickness</label>
						<input
							type="number"
							className=" w-24"
							placeholder="thickness"
							value={thickness}
							onChange={(ev) => setThickness(ev.target.value)}
						/>
						</div>
						<div class="flex h-10 ">
						<button
							className="btn-primary  text-sm p-0"
							onClick={(e) => addDimension(e, length,width, thickness)}
						>
							ADD DIMENSION
						</button>
						</div>
						
					</div>
				</div>
			) : (
				<div className="lg:w-1/2 sm:w-full">
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
				</div>
			)}
			<button
				type="submit"
				className="btn-primary text-lg mt-10"
				onClick={saveProduct}
			>
				SAVE
			</button>
		</form>
	);
}
