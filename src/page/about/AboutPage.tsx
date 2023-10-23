import React, { useEffect, useMemo, useState } from "react";

export default function AboutPage() {
	const [name, setname] = useState("");
	const [count, setcount] = useState(0);
	const [number, setnumber] = useState(100000);
	console.log("about page pppppp re-render");
	useEffect(() => {
		console.log("About page loaded");
		return () => {
			console.log("About page destroyed");
		};
	}, []);

	useEffect(() => {
		console.log("name changed");
		setcount((count) => count + 1);
	}, [name]);

	useEffect(() => {
		console.log("number changed : ", number);
	}, [number]);

	const incNumber = () => setnumber((n) => n + 100000);

	return (
		<div className="p-3">
			<h1>AboutPage</h1>
			<h1>name rerendered count : {count}</h1>
			<input
				className="border block"
				type="text"
				placeholder="name"
				value={name}
				onChange={(e) => {
					setname(e.target.value);
				}}
			/>
			<button
				onClick={incNumber}
				className="m-1 p-2 bg-slate-800 text-white"
			>
				Inc Number
			</button>
			<h1> Number : {number}</h1>
			<ChildCounter />
      <HeavyChild number={number} />
		</div>
	);
}

const ChildCounter = () => {
	const [number, setnumber] = useState(0);
	useEffect(() => {
		console.log("child number changed : ", number);
	}, [number]);
	console.log("about child cccccccccccc re-render");
	const incNumber = () => setnumber((n) => n + 1);
	return (
		<div className="m-2 border p-2">
			<h1>child</h1>
			<button
				onClick={incNumber}
				className="m-1 p-2 bg-slate-800 text-white"
			>
				Inc Number
			</button>
			<h1> Number : {number}</h1>
		</div>
	);
};

const HeavyChild = ({number}:any)=>{
  const sum = () => {
    console.log("heavyyyyyyyyyyyyyyyyy")
    let sum = 0
    for(let i = 1 ; i <= number; i++){
      sum += 1
    }
    return sum
  }

  const sumMemo = useMemo(sum,[number])
  // return <div className="m-2">Heavy sum : {sum()}</div> // without useMemo
  return <div className="m-2">Heavy sum : {sumMemo}</div> // without useMemo
}
