export default function E(msg: string) {
  const d = Date.now()

  return `
    Time: ${d.toString()}
    ${msg}
    `
}
