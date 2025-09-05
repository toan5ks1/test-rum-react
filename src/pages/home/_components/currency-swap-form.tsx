import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card"
import { useEffect } from "react"
import { CurrencyCombobox } from "./currency-combobox"
import { currencyData } from "../data/currency"

// Mock data for currencies
const currencies = [
	{ currency: "BLUR", price: 0.20811525423728813 },
	{ currency: "bNEO", price: 7.1282679 },
	{ currency: "BUSD", price: 0.999183113 },
]

// Zod schema for form validation
const schema = z.object({
	fromCurrency: z
		.object({
			currency: z.string().min(1, "Please select a currency"),
			price: z.number().positive("Price must be greater than 0"),
		})
		.optional(),
	toCurrency: z
		.object({
			currency: z.string().min(1, "Please select a currency"),
			price: z.number().positive("Price must be greater than 0"),
		})
		.optional(),
	amountToSend: z.number().positive("Amount must be greater than 0"),
	amountToReceive: z.number(),
})

type FormValues = z.infer<typeof schema>

export default function CurrencySwapForm() {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
		watch,
		setValue,
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			fromCurrency: undefined,
			toCurrency: undefined,
			amountToSend: 0,
			amountToReceive: 0,
		},
	})

	const fromCurrency = watch("fromCurrency")
	const toCurrency = watch("toCurrency")
	const amountToSend = watch("amountToSend")

	// Calculate the amount to receive whenever fromCurrency, toCurrency, or amountToSend changes
	useEffect(() => {
		if (fromCurrency && toCurrency && amountToSend > 0) {
			const fromCurrencyData = currencies.find(
				(curr) => curr.currency === fromCurrency.currency,
			)
			const toCurrencyData = currencies.find(
				(curr) => curr.currency === toCurrency.currency,
			)

			if (fromCurrencyData && toCurrencyData) {
				const exchangeRate = fromCurrencyData.price / toCurrencyData.price
				const amountToReceive = amountToSend * exchangeRate
				setValue("amountToReceive", amountToReceive)
			}
		}
	}, [fromCurrency, toCurrency, amountToSend, setValue])

	const onSubmit = (data: FormValues) => {
		console.log("Form submitted:", data)
		// Add logic to handle currency swap here
	}

	return (
		<Card className="mx-auto mt-10 max-w-md">
			<CardHeader>
				<CardTitle>Currency Swap</CardTitle>
				<CardDescription>
					Swap assets from one currency to another.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="flex space-x-2">
						<div className="w-32">
							<Label htmlFor="fromCurrency">From currency</Label>
							<Controller
								name="fromCurrency"
								control={control}
								render={({ field }) => (
									<CurrencyCombobox
										data={currencyData}
										value={field.value}
										onChange={field.onChange}
										placeholder="Select currency"
									/>
								)}
							/>
							{errors.fromCurrency && (
								<p className="text-sm text-red-500">
									{errors.fromCurrency.message}
								</p>
							)}
						</div>
						<div className="flex-1">
							<Label htmlFor="amountToSend">Amount to Send</Label>
							<Input
								type="number"
								id="amountToSend"
								{...register("amountToSend", { valueAsNumber: true })}
								placeholder="Enter amount"
							/>
							{errors.amountToSend && (
								<p className="text-sm text-red-500">
									{errors.amountToSend.message}
								</p>
							)}
						</div>
					</div>

					<div className="flex space-x-2">
						<div className="w-32">
							<Label htmlFor="toCurrency">To currency</Label>
							<Controller
								name="toCurrency"
								control={control}
								render={({ field }) => (
									<CurrencyCombobox
										data={currencyData}
										value={field.value}
										onChange={field.onChange}
										placeholder="Select currency"
									/>
								)}
							/>
							{errors.toCurrency && (
								<p className="text-sm text-red-500">
									{errors.toCurrency.message}
								</p>
							)}
						</div>
						<div className="flex-1">
							<Label htmlFor="amountToReceive">Amount to Receive</Label>
							<Input
								type="number"
								id="amountToReceive"
								{...register("amountToReceive", { valueAsNumber: true })}
								placeholder="Calculated amount"
								readOnly
							/>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Swap
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
