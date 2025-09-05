import { SearchForm } from "../../components/search-form"

export default function SearchPage() {
	return (
		<section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
			<div className="items-start gap-4 text-center">
				<h1 className="text-3xl font-extrabold md:text-4xl">
					Error Monitoring Test
				</h1>
				<p className="text-lg text-muted-foreground">
					Test search functionality with various error scenarios for Datadog RUM
					monitoring
				</p>
			</div>
			<div className="flex justify-center">
				<SearchForm />
			</div>
		</section>
	)
}
