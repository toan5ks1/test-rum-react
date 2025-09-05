import { TraceTest } from "../../components/trace-test"

export default function TraceTestPage() {
	return (
		<section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
			<div className="items-start gap-4 text-center">
				<h1 className="text-3xl font-extrabold md:text-4xl">
					Distributed Tracing Test
				</h1>
				<p className="text-lg text-muted-foreground">
					Test Datadog RUM's automatic trace header injection for end-to-end
					observability
				</p>
			</div>
			<div className="flex justify-center">
				<TraceTest />
			</div>
		</section>
	)
}
