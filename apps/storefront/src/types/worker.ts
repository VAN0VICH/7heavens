interface Document {
	id: string;
	title?: string;
	description?: string;
}
type SearchWorkerResponse = {
	type: "GLOBAL_SEARCH";
	payload: Document[];
};
type SearchWorkerRequest = {} & (
	| {
			type: "ADD";
			payload: {
				document: Document;
			};
	  }
	| {
			type: "UPDATE";
			payload: {
				document: Document;
			};
	  }
	| {
			type: "DELETE";
			payload: {
				key: string;
			};
	  }
	| {
			type: "GLOBAL_SEARCH";
			payload: {
				query: string;
			};
	  }
);

export type { SearchWorkerRequest, Document, SearchWorkerResponse };
