import type { SectionList } from "./types";

import Assurance from "./assurance";
import CenteredText from "./centered-text";
import CollectionList from "./collection-list";
import { CollectionProducts } from "./collection-products";
import Hero from "./hero";
import Marquee from "./marquee";
import MediaText from "./media-text";
import ShopTheLook from "./shopTheLook";
import Testimonials from "./testimonials";

export const sectionsList: SectionList = {
	"section.assurance": Assurance,
	"section.centeredText": CenteredText,
	"section.collectionList": CollectionList,
	"section.collection": CollectionProducts,
	"section.hero": Hero,
	"section.marquee": Marquee,
	"section.mediaText": MediaText,
	"section.shopTheLook": ShopTheLook,
	"section.testimonials": Testimonials,
};
