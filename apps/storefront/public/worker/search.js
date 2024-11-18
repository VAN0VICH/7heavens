import Fuse from "fuse.js";

const fuse = new Fuse([], {
	keys: ["title", "description", "handle"],
});
self.onmessage = (event) => {
	const { type, payload } = event.data;

	if (type === "ADD") {
		fuse.add(payload.document);
	}
	if (type === "UPDATE") {
		fuse.remove((item) => item.id === payload.document.id);
		fuse.add(payload.document);
	}
	if (type === "DELETE") {
		fuse.remove((item) => item.id === payload.key);
	}
	if (type === "GLOBAL_SEARCH") {
		const results = fuse.search(payload.query);
		console.log("results", results);
		console.log("type", type);
		postMessage({ type, payload: results.map((r) => r.item) });
	}
};
