import type { PageProps } from "@/types";
import type { ImageResponseOptions, NextRequest } from "next/server";

import { ImageResponse } from "next/og";

import ProductOg from "./product-og";
import { getProductByHandle } from "@/data/blazzing-app/product-and-variant";
import type { StoreProduct } from "@blazzing-app/validators";

export const runtime = "edge";

export async function GET(_: NextRequest, props: PageProps<"...info">) {
	const params = await props.params;
	const instrumentSerif = await fetch(
		new URL("../../../fonts/InstrumentSerif-Regular.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const instrumentSans = await fetch(
		new URL("../../../fonts/InstrumentSans-Medium.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	const climateCrisis = await fetch(
		new URL("../../../fonts/ClimateCrisis-Regular.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	try {
		const responseOptions: ImageResponseOptions = {
			fonts: [
				{
					data: instrumentSerif,
					name: "Instrument Serif",
					style: "normal",
					weight: 400,
				},
				{
					data: instrumentSans,
					name: "Instrument Sans",
					style: "normal",
					weight: 500,
				},
				{
					data: climateCrisis,
					name: "Climate Crisis",
					style: "normal",
					weight: 400,
				},
			],
			height: 630,
			width: 1200,
		};

		if (params.info[1] !== "products") {
			return new Response("Invalid type", { status: 400 });
		}

		const handle = params.info[2];
		console.log("handle from og", handle);

		const product = handle ? await getProductByHandle(handle) : undefined;
		if (!product) {
			console.log("No product found");
			return new Response("Product not found", { status: 404 });
		}
		return new ImageResponse(
			<ProductOg product={product as StoreProduct} />,
			responseOptions,
		);
	} catch (error) {
		console.error(error);
		return new Response("Internal server error", { status: 500 });
	}
}
