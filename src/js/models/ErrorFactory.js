/* @flow */

import {KNOWN_ERRORS} from "./Errors"
import AppError, {type RawError} from "./AppError"

function compareKeys(a, b) {
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  return JSON.stringify(aKeys) === JSON.stringify(bKeys)
}

export default class ErrorFactory {
  static create(error: RawError): AppError {
    if (error instanceof AppError) return error

    for (let E of KNOWN_ERRORS) {
      if (E.is(error)) return new E(error)
    }

    // if raw error has same keys as AppError, then rebuild
    if (compareKeys(error, new AppError())) {
      return new AppError(error.raw, new Date(error.ts))
    }

    return new AppError(error)
  }
}
