const checkIfNavigationIsSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
	// upload the destine site
	// using fetch for get html
	const response = await fetch(url)
	// Get only the HTML content inside the body attribute using regex for extract
	const text = await response.text()
	const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
  return data

}

export const startViewTransition = () => {
  if (!checkIfNavigationIsSupported()) return
  
  window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)

		// if it's an external website ignore it.
		if (location.origin !== toUrl.origin) return

		event.intercept({
			async handler() {
        const data = await fetchPage(toUrl.pathname)
				// use View Transition API
				document.startViewTransition(() => {
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}