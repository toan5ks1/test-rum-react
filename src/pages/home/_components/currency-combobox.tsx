"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Currency } from "../data/currency"

interface CurrencyComboboxProps {
	data: Currency[]
	value?: Currency
	placeholder: string
	onChange: (value?: Currency) => void
}

export function CurrencyCombobox({
	data,
	value,
	placeholder = "Search currency...",
	onChange,
}: CurrencyComboboxProps) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between placeholder:text-muted-foreground"
				>
					<CurrencyItem
						currency={
							data.find((item) => item.currency === value?.currency)?.currency
						}
					/>
					<ChevronDown className="size-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[180px] p-0">
				<Command>
					<CommandInput placeholder={placeholder} className="h-9" />
					<CommandList>
						<CommandEmpty>No currency found.</CommandEmpty>
						<CommandGroup>
							{data.map((item) => (
								<CommandItem
									key={JSON.stringify(item)}
									value={item.currency}
									onSelect={(currentValue) => {
										onChange(
											currentValue === value?.currency ? undefined : item,
										)
										setOpen(false)
									}}
								>
									<CurrencyItem
										currency={item.currency}
										showCheckIcon={item.currency === value?.currency}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function CurrencyItem({
	currency,
	showCheckIcon,
}: {
	currency?: string
	showCheckIcon?: boolean
}) {
	return currency ? (
		<div className="flex items-center gap-2">
			<img src={`/tokens/${currency}.svg`} alt={currency} className="size-4" />
			<span>{currency}</span>
			<Check
				className={cn("ml-auto", showCheckIcon ? "opacity-100" : "opacity-0")}
			/>
		</div>
	) : (
		"Select"
	)
}
