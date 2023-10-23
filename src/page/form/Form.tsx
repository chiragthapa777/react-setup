import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import AsyncSelect from "react-select/async";

const hobby = [
	"play",
	"code",
	"eat",
	"travel",
	"explore",
	"read",
	"design",
	"handout",
	"basketball",
	"football",
	"development",
	"engineering",
	"internet",
	"hacker",
	"gym",
	"workout",
	"walk",
];

enum Country {
	USA = "United States",
	Canada = "Canada",
	UK = "United Kingdom",
	France = "France",
	Germany = "Germany",
	Nepal = "Nepal",
}

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

function calculateAge(birthDate: string | Date) {
	const today = new Date();
	const birthDateObj = new Date(birthDate);

	let age = today.getFullYear() - birthDateObj.getFullYear();
	const monthDiff = today.getMonth() - birthDateObj.getMonth();

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDateObj.getDate())
	) {
		age--;
	}

	return age;
}

const formSchema = z
	.object({
		firstName: z
			.string({
				required_error: "First name is required",
			})
			.min(2, {
				message: "First name must be at least 2 characters",
			})
			.max(20, {
				message: "First name acnnot be at more 20 characters",
			}),
		middleName: z
			.string()
			.min(2, {
				message: "Middle name must be at least 2 characters",
			})
			.max(20, {
				message: "Middle name acnnot be at more 20 characters",
			})
			.optional(),
		lastName: z
			.string()
			.min(2, {
				message: "Last name must be at least 2 characters",
			})
			.max(20, {
				message: "Last name acnnot be at more 20 characters",
			})
			.optional(),
		age: z.coerce
			.number({
				invalid_type_error: "Age should be number",
			})
			.gte(0)
			.lte(100),
		dob: z.date(),
		address: z.object({
			city: z.string(),
			country: z.nativeEnum(Country),
		}),
		hobby: z.array(z.string()).nonempty(),
		totalIncome: z.coerce.number(),
		income: z
			.object({
				name: z
					.string({
						required_error: "income source name is required",
					})
					.min(2),
				amt: z.coerce.number().positive(),
			})
			.array()
			.min(2)
			.max(5)
			.refine(
				(array) => {
					const names = array.map((item) => item.name);
					const hasDuplicateName =
						new Set(names).size !== names.length;
					if (hasDuplicateName) {
						return false;
					}
					return true;
				},
				() => ({ message: `Source Names must be unique` })
			),
	})
	.refine(
		(data) => {
			if (data.age !== calculateAge(data.dob)) return false;
			return true;
		},
		(data) => ({ message: `age and dob does not match`, path: ["age"] })
	);

export default function FormPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			middleName: "",
			age: 0,
			dob: new Date(),
			income: [],
			address: {
				city: "",
				country: Country.Canada,
			},
		},
		mode: "all",
	});

	const {
		handleSubmit,
		clearErrors,
		control,
		formState,
		register,
		getValues,
		watch,
		reset,
		setError,
		setValue,
		setFocus,
		resetField,
		trigger,
		getFieldState,
		unregister,
	} = form;

	const {
		errors,
		isDirty,
		isLoading,
		isValid,
		dirtyFields,
		submitCount,
		defaultValues,
	} = formState;

	const useArray = useFieldArray({
		control, // control props comes from useForm (optional: if you are using FormContext)
		name: "income", // unique name for your Field Array
	});

	const { fields, append, prepend, remove, swap, move, insert } = useArray;

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(values, null, 2)}
					</code>
				</pre>
			),
		});
		console.log(values);
	}

	useEffect(() => {
		const subscription = watch((value, { name, type }) => {
			if (name?.startsWith("income") && type === "change") {
				const totalIncome = getValues("income")?.reduce(
					(acc: number, next: any) => acc + Number(next.amt),
					0
				);
				setValue("totalIncome", totalIncome, {
					shouldDirty: true,
					shouldValidate: true,
					shouldTouch: true,
				});
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	function see() {
		console.log(formState);
	}

	const filteredHobby = (inputValue: string) => {
		return hobby.filter((i) => i.includes(inputValue.toLowerCase()));
	};
	const loadOptions = (
		inputValue: string,
		callback: (options: any[]) => void
	) => {
		setTimeout(() => {
			callback(
				filteredHobby(inputValue).map((d) => {
					return { value: d, label: d };
				})
			);
		}, 1000);
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-2 flex flex-col gap-4"
				>
					<div className="grid grid-cols-3 gap-3">
						<FormField
							control={control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="col-span-3 sm:col-span-1">
									<FormLabel>FirstName*</FormLabel>
									<FormControl>
										<Input
											placeholder="chirag"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="middleName"
							render={({ field }) => (
								<FormItem className="col-span-3 sm:col-span-1">
									<FormLabel>MiddleName</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="col-span-3 sm:col-span-1">
									<FormLabel>LastName</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={control}
							name="age"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Age*</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="dob"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel className="mb-[10px]">
										Date of birth
									</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full pl-3 text-left font-normal",
														!field.value &&
															"text-muted-foreground"
													)}
												>
													{field.value ? (
														format(
															field.value,
															"PPP"
														)
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className="w-auto p-0"
											align="start"
										>
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												disabled={(date: any) =>
													date > new Date() ||
													date <
														new Date("1900-01-01")
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={control}
						name="address.city"
						render={({ field }) => (
							<FormItem>
								<FormLabel>city*</FormLabel>
								<FormControl>
									<Input placeholder="" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address.country"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Country</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a verified email to display" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="United States">
											USA
										</SelectItem>
										<SelectItem value="Canada">
											Canada
										</SelectItem>
										<SelectItem value="United Kingdom">
											UK
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<h1>Income </h1>
					<div className="border p-2 bg-slate-200">
						{fields.map((item, index) => (
							<div
								key={item.id}
								className="grid grid-cols-12 gap-4"
							>
								<FormField
									control={control}
									name={`income.${index}.name`}
									render={({ field }) => (
										<FormItem className="col-span-5">
											<FormLabel>Source</FormLabel>
											<FormControl>
												<Input
													placeholder=""
													{...field}
												/>
											</FormControl>

											<FormMessage>
												{
													errors?.income?.[index]
														?.name?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name={`income.${index}.amt`}
									render={({ field }) => (
										<FormItem className="col-span-5">
											<FormLabel>Amount</FormLabel>
											<FormControl>
												<Input
													placeholder=""
													{...field}
												/>
											</FormControl>
											<FormMessage>
												{
													errors?.income?.[index]?.amt
														?.message
												}
											</FormMessage>
										</FormItem>
									)}
								/>
								<Button
									className="col-span-2 my-auto"
									type="button"
									variant={"destructive"}
									onClick={() => remove(index)}
								>
									remove
								</Button>
							</div>
						))}
						<Button
							type="button"
							className="m-2"
							variant={"default"}
							onClick={() =>
								append({
									name: "",
									amt: 0,
								})
							}
						>
							append
						</Button>
					</div>
					<div className="grid w-full max-w-sm items-center gap-1.5">
						<Label htmlFor="email">TotalIncome</Label>
						<Input
							type="number"
							id="email"
							placeholder="Total"
							disabled
							{...register("totalIncome")}
						/>
					</div>

					<p className="text-red-600">
						{errors.income?.root?.message}
					</p>
					<Controller
						control={control}
						name="hobby"
						render={({
							field: { onChange, value, name, ref },
							formState,
						}: any) => (
							<AsyncSelect
								ref={ref}
								name={name}
								isMulti
								cacheOptions
								loadOptions={loadOptions}
								defaultOptions
								value={value}
								onChange={(e: any) =>
									e.value
										? onChange(e.value)
										: onChange(e.map((c: any) => c.value))
								}
							/>
						)}
					/>

					<div>
						<Button type="submit">Submit</Button>
					</div>
				</form>
				<button onClick={see}>check</button>
				<DevTool control={control} />
			</Form>
		</div>
	);
}
