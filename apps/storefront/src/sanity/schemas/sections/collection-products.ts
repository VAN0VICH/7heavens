import { defineField } from "sanity";

export default defineField({
	fields: [
		{
			name: "handle",
			title: "Handle",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "products",
			of: [{ to: [{ type: "product" }], type: "reference" }],
			title: "Products",
			type: "array",
		},
		{
			name: "cta",
			title: "CTA",
			type: "cta",
		},
	],
	name: "section.collection",
	preview: {
		prepare: ({ title }) => ({
			subtitle: "Collection section",
			title: title,
		}),
		select: {
			title: "title",
		},
	},
	title: "Collection section",
	type: "object",
});
