export default function ErrorPage({
	searchParams,
}: { searchParams?: { [key: string]: string | string[] | undefined } }) {
	const errorMessage = searchParams?.error;
	return (
		<div className="w-screen h-screen flex pt-80">
			<p className="text-red-500">
				{errorMessage ?? "Упс... Что-то случилось."}
			</p>
		</div>
	);
}
