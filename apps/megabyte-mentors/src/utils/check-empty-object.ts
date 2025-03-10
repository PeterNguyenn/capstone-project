export const isObjectFilledOut = (obj: Record<string, unknown>) => {
  for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          
          // Check if the value is null, undefined, or an empty string
          if (value === null || value === undefined || value === '') {
              return false; // Return false if any property is empty
          }
      }
  }
  return true; // Return true if all properties are filled out
}