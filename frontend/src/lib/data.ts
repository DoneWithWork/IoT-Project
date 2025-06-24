function returnUrl() {
    if (process.env.NODE_ENV === "development") {
        return process.env.NEXT_PUBLIC_DEV_BACKEND_URL
    } else {
        return process.env.NEXT_PUBLIC_PROD_BACKEND_URL
    }
}
export async function fetchData<T>(accessToken: string, url: string, tag: string): Promise<T> {
    console.log("Fetching data for: ", tag)
    const response = await fetch(`${returnUrl()}${url}`, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: { tags: [tag] }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch data")
    }
    const data = await response.json()
    return data[tag] as T

}
export async function postData<S>(accessToken: string, url: string, values: S) {
    const response = await fetch(`${returnUrl()}${url}`, {
        method: "POST",
        headers: {
            Authorization: 'Bearer ' + accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
    });
    return response

}