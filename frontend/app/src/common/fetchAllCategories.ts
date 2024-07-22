import { map } from "lodash"

const fetchAllCategories = async () => {
  const result = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/categories`, {
    method: "GET",
    credentials: 'include'
  })
  const data = await result.json()
  if (!result.ok) {
    throw Error(data.message)
  }
  const categories = map(data, (category) => {
    return {
      label: category.name,
      value: category.id,
    }
  })
  return categories
}

export default fetchAllCategories
