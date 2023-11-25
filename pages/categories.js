import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function WoodSpecies({ swal }) {
	const [woodName, setWoodName] = useState("");
	const [woodSpecies, setWoodSpecies] = useState([]);
	const [uses, setUses] = useState("");
	const [usesArray, setUsesArray] = useState([]);

	useEffect(() => {
		fetchWoodSpecies();
		fetchUses();
	}, []);

	function fetchWoodSpecies() {
		axios.get("/api/woodspecies").then((result) => {
			setWoodSpecies(result.data);
		});
	}
	function fetchUses() {
		axios.get("/api/uses").then((result) => {
			setUsesArray(result.data);
		});
	}

	async function saveWoodSpecies(ev) {
		ev.preventDefault();

		const data = {
			name: woodName,
		};

		await axios.post("/api/woodspecies", data);
		setWoodName("");
		fetchWoodSpecies();
	}

	async function saveUses(ev) {
		ev.preventDefault();
		const data = {
			name: uses,
		};
		await axios.post("/api/uses", data);
		setUses("");
		fetchUses();
	}

	function deleteWoodSpecies(id) {
		swal
			.fire({
				title: "Are you sure?",
				text: `Do you want to delete`,
				showCancelButton: true,
				cancelButtonText: "Cancel",
				confirmButtonText: "Yes, Delete!",
				confirmButtonColor: "#d55",
				reverseButtons: true,
			})
			.then(async (result) => {
				if (result.isConfirmed) {
					await axios.delete("/api/woodspecies?_id=" + id);
					fetchWoodSpecies();
				}
			});
	}

	function deleteUses(id) {
		swal
			.fire({
				title: "Are you sure?",
				text: `Do you want to delete`,
				showCancelButton: true,
				cancelButtonText: "Cancel",
				confirmButtonText: "Yes, Delete!",
				confirmButtonColor: "#d55",
				reverseButtons: true,
			})
			.then(async (result) => {
				if (result.isConfirmed) {
					await axios.delete("/api/uses?_id=" + id);
					fetchUses();
				}
			});
	}
	return (
		<Layout>
			<h1>Add Wood Species</h1>
			<form onSubmit={saveWoodSpecies}>
				<div className="flex gap-1">
					<input
						type="text"
						placeholder="Wood species name"
						onChange={(ev) => setWoodName(ev.target.value)}
						value={woodName}
					/>
				</div>

				<div className="flex gap-1">
					<button type="submit" className="btn-primary py-1">
						ADD
					</button>
				</div>
			</form>

			<table className="basic mt-4">
				<thead>
					<tr>
						<td>Wood species name</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>
					{/* Display existing wood species */}
					{woodSpecies.map((species) => (
						<tr key={species._id}>
							<td>{species.name}</td>
							<td>
								<button
									onClick={() => deleteWoodSpecies(species._id)}
									className="btn-primary py-1"
								>
									DELETE
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<h1 className="mt-5">Add Uses</h1>
			<form onSubmit={saveUses}>
				<div className="flex gap-1">
					<input
						type="text"
						placeholder="use"
						onChange={(ev) => setUses(ev.target.value)}
						value={uses}
					/>
				</div>

				<div className="flex gap-1">
					<button type="submit" className="btn-primary py-1">
						ADD
					</button>
				</div>
			</form>

			<table className="basic mt-4">
				<thead>
					<tr>
						<td>Uses species name</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>
					{/* Display existing Uses species */}
					{usesArray.map((use) => (
						<tr key={use._id}>
							<td>{use.name}</td>
							<td>
								<button
									onClick={() => deleteUses(use._id)}
									className="btn-primary py-1"
								>
									DELETE
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Layout>
	);
}

export default withSwal(({ swal }, ref) => <WoodSpecies swal={swal} />);
