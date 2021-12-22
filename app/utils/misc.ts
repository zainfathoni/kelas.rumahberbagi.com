function getRequiredEnvVarFromObj(
  obj: Record<string, string | undefined>,
  key: string,
  devValue = `${key}-dev-value`
) {
  let value = devValue
  const envVal = obj[key]
  if (envVal) {
    value = envVal
  } else if (obj.RUNNING_E2E === 'true') {
    value = `${key}-e2e-value`
  } else if (obj.NODE_ENV === 'production') {
    throw new Error(`${key} is a required env variable`)
  }
  return value
}

export function getRequiredServerEnvVar(key: string, devValue?: string) {
  return getRequiredEnvVarFromObj(process.env, key, devValue)
}
