export default async function Filters() {
	return (
		<>
			{/* <div className="hidden lg:flex lg:items-center lg:gap-s">
				<Suspense fallback={<EmptyDropdown placeholder="Collections" />}>
					<FilterSelect
						name="collection"
						options={collection_options}
						placeholder="Collections"
					/>
				</Suspense>
				<Suspense fallback={<EmptyDropdown placeholder="Categories" />}>
					<FilterSelect
						name="category"
						options={category_options}
						placeholder="Categories"
					/>
				</Suspense>
				<ClearAllButton variant="underline" />
			</div>
			<div className="flex lg:hidden">
				<Suspense fallback={<EmptyDropdown placeholder="Filter" />}>
					<MobileFilterDropdown>
						<div className="flex flex-col gap-xs p-xs">
							<Accordion
								heading="Collections"
								name="collection"
								options={collection_options}
							/>
							<Accordion
								heading="Categories"
								name="categroy"
								options={category_options}
							/>
						</div>
					</MobileFilterDropdown>
				</Suspense>
			</div> */}
		</>
	);
}
