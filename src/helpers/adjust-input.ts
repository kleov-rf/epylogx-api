const minifiedISOString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export { minifiedISOString }
