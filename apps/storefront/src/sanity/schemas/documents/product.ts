import definePage from "@/sanity/helpers/define-page";

export default definePage({
	fields: [
		{
			group: "content",
			name: "specs",
			of: [
				{
					fields: [
						{ name: "title", title: "Title", type: "string" },
						{
							name: "content",
							rows: 3,
							title: "Content",
							type: "text",
						},
					],
					name: "spec",
					type: "object",
				},
			],
			type: "array",
		},
		{
			fields: [
				{ name: "title", title: "Title", type: "string" },
				{
					name: "products",
					of: [
						{
							type: "object",
							name: "productWithHandle",
							fields: [
								{
									name: "product",
									title: "Product",
									type: "reference",
									to: [{ type: "product" }],
								},
								{
									name: "handle",
									title: "Handle",
									type: "string",
									description:
										"A unique identifier for this product in the addons",
								},
							],
						},
					],
					title: "Addons",
					type: "array",
					validation: (Rule) => Rule.max(3),
				},
			],
			name: "addons",
			type: "object",
		},

		{
			group: "content",
			name: "sections",
			type: "sectionsBody",
		},
	],
	name: "product",
	// options: {
	// 	disableCreation: true,
	// 	hideInternalTitle: true,
	// 	hideSeo: true,
	// 	localized: false,
	// },
	preview: {
		select: {
			title: "internalTitle",
		},
	},

	title: "Product Page",
	type: "document",
});
