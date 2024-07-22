export async function dataUrlToFile(
  dataUrl: string,
  fileName: string
): Promise<File> {
  const res: Response = await fetch(dataUrl, {
    credentials: 'include'
  })
  const blob: Blob = await res.blob()
  return new File([blob], fileName, { type: "image/png" })
}
