import { isEmpty } from "../is-empty";

type ConvertToLocaleParams = {
	amount: number;
	currencyCode: string;
	locale?: string;
	maximumFractionDigits?: number;
	minimumFractionDigits?: number;
};

export const convertToLocale = ({
	amount,
	currencyCode,
	locale = "en-US",
	maximumFractionDigits,
	minimumFractionDigits,
}: ConvertToLocaleParams) => {
	return currencyCode && !isEmpty(currencyCode)
		? new Intl.NumberFormat(locale, {
				currency: currencyCode,
				maximumFractionDigits,
				minimumFractionDigits,
				style: "currency",
			}).format(amount)
		: amount.toString();
};
