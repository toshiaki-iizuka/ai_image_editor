export async function checkImageProcessing(url: string) {
	try {
		const response = await fetch(url);
		// console.log(`Status: ${response.status}`);
		// console.log(`Headers: ${JSON.stringify([...response.headers])}`);
		if (response.ok) return true;

		return false;
	} catch (error) {
		// console.error("Error checking image processing:", error);
		return false;
	}
}
