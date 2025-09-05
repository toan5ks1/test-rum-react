import { ConsoleTest } from "../../components/console-test"

export default function ConsoleTestPage() {
	return (
		<section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
			<div className="items-start gap-4 text-center">
				<h1 className="text-3xl font-extrabold md:text-4xl">
					Console Capture Test
				</h1>
				<p className="text-lg text-muted-foreground">
					Test which console methods are captured by Datadog RUM
				</p>
			</div>
			<div className="flex justify-center">
				<ConsoleTest />
			</div>
		</section>
	)
}


