import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function HomePage() {
	const [search, setSearch] = useState("");
	const [query, setQuery] = useSearchParams();
	useEffect(() => {
		console.log("Home page loaded");
		const s: string | null = query.get("s");
		if (s) {
			handleSearch(s);
		}
		return () => {
			console.log("Home page destroyed");
		};
	}, []);
	const handleSearch = (search: string) => {
    setQuery({s:search, test:"jpt"})
		console.log("i will search for :", search);
	};
	return (
		<div className="p-3">
			<h1>HomePage</h1>
			<input
				type="text"
				className="block border p-1 my-2"
				placeholder="search"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
				}}
			/>
			<button
				onClick={() => handleSearch(search)}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Search
			</button>
		</div>
	);
}
