export const isEmailOrPhone = (value: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const phoneRegex = /^\(?\d{2,3}\)?[-.\s]?\d{4,5}[-.\s]?\d{4}$/; // suporta (99) 99999-9999
	return emailRegex.test(value) || phoneRegex.test(value);
};