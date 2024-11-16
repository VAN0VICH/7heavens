import { defineType } from "sanity";

export default defineType({
	__experimental_formPreviewTitle: false,
	fields: [
		{
			hidden: true,
			name: "internalTitle",
			title: "Title",
			type: "string",
		},
	],
	name: "category",
	preview: {
		select: {
			title: "internalTitle",
		},
	},
	title: "Category",
	type: "document",
});