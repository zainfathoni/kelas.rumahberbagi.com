import fs from 'fs'
import path from 'path'

export const writeFixture = async (name: string, data: object) => {
  const fixturePath = path.join(__dirname, `../e2e/fixtures/${name}.local.json`)
  await fs.promises.writeFile(fixturePath, JSON.stringify(data, null, 2))
}

export const readFixture = async (name: string) => {
  const fixturePath = path.join(
    __dirname,
    `../../e2e/fixtures/${name}.local.json`
  )
  return await fs.promises.readFile(fixturePath, 'utf8')
}
